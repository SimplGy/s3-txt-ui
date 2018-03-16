import React, { Component } from 'react';
import { connect } from 'react-redux';
import './listOfFiles.css';
import { awsRegion, awsBucket } from '../../horizontal/api/files';
import {fileNameHere, folderNameHere, isFileHere, joinUrl} from '../../horizontal/parsing';
import OneFile from './oneFile';
import OneFolder from './oneFolder';
import FileHeader from './fileHeader';

// Is this object a fake folder construct, as created by this module?
// Folders are objects with a `fileCount` property
// fileCount must be > 0, so coercion is our friend today.
const isFolder = ({ fileCount}) => Boolean(fileCount);

class ListOfFiles extends Component {

  state = {
    filter: undefined // a client side file search filter. undefined === no filter.
  };

  onChangeFilter = (evt = {}) => {
    let val = evt.target.value || '';
    const filter = val.trim();
    console.log(`onChangeFilter: '${filter}'`);
    this.setState({filter});
  };

  // return true if the entry is inside the current prefix
  entryWithinPrefix = ({name} = {}) =>
    name.startsWith(this.props.prefix);

  // return true if the given file matches the current filter
  applyCurrentFilter = ({name} = {}) => {
    name = name || '';
    let match = this.state.filter || '';
    return name.toLowerCase().search(match) > -1;
  };

  render() {
    const { files, prefix } = this.props;
    const localEntries = files.filter(this.entryWithinPrefix);
    const filesAndFolders = collapseFolders(prefix, localEntries);
    const displayedRows = filesAndFolders
      .filter(this.applyCurrentFilter)
      .map(f =>
        isFolder(f)
          ? <OneFolder key={joinUrl([prefix, f.localName])} entry={f} displayName={f.localName}/>
          : <OneFile key={f.name} file={f} displayName={fileNameHere(prefix)(f.name)}/>
      );

    const awsUrl = `http://${awsBucket}.s3-${awsRegion}.amazonaws.com`;

    return (
      <div className="listOfFiles">
        <FileHeader
          name={prefix}
          muted={displaySubsetOfTotal(displayedRows, filesAndFolders)}
        >
          <input type="search" onChange={this.onChangeFilter} autoFocus placeholder="Search" />
        </FileHeader>



        <ul className="files">
          {filesAndFolders.length === 0 ? '...' : displayedRows}
        </ul>

        <br/>

        <small className="muted">Connected to: {awsUrl}</small>
      </div>
    );
  }

}

ListOfFiles.defaultProps = {
  prefix: ''
};

// given s3 list objects, collapse all entries that represent folders into a single 'folder' entry
function collapseFolders(prefix = '', listObjects) {
  const folders = {};

  const folderName = folderNameHere(prefix);
  // console.log(`preapplied folder name for prefix '${prefix}'`);
  listObjects.forEach( entry => {
    const key = folderName(entry.name);
    if (key === '') return; // skip things that aren't folders
    folders[key] = folders[key] || {
      localName: key,
      fullPath: joinUrl([prefix, key])
    };
    const folder = folders[key];
    folder.fileCount = ~~folder.fileCount + 1; // https://stackoverflow.com/questions/18690814/javascript-object-increment-item-if-not-exist
  });

  // Get a list of: immediate children of this folder that are files
  const isFile = isFileHere(prefix);
  const files = listObjects.filter(o => isFile(o.key));

  // const fromTo = `${listObjects.length} => ${files.length}`;
  // console.log({prefix, folders: Object.values(folders), files, fromTo});

  return [...Object.values(folders), ...files];
}



// given two arrays, return a string showing how many are in the subset
function displaySubsetOfTotal(subset = [], total = []) {
  subset = subset.length;
  total = total.length;
  if (total === 0) return '';
  return total === subset
    ? `(${total})`
    : `(${subset} of ${total})`;
}

export default connect()(ListOfFiles);
