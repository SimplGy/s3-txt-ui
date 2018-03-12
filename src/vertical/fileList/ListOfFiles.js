import React, { Component } from 'react';
import { connect } from 'react-redux';
import router from '../../horizontal/router';
import './listOfFiles.css';
import { awsRegion, awsBucket } from '../../horizontal/api/files';
import { fileNameHere, folderNameHere, isFileHere } from '../../horizontal/parsing';

// Is this object a fake folder construct, as created by this module?
// Folders are objects with a `fileCount` property
// fileCount must be > 0, so coercion is our friend today.
const isFolder = ({ fileCount}) => Boolean(fileCount);

class ListOfFiles extends Component {

  state = {
    filter: undefined // a client side filter, if you want to search for files.
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
          ? <OneFolder key={`${prefix}/${f.localName}`} entry={f} displayName={f.localName}/>
          : <OneFile key={f.name} file={f} displayName={fileNameHere(prefix)(f.name)}/>
      );

    const awsUrl = `http://${awsBucket}.s3-${awsRegion}.amazonaws.com`;

    return (
      <div className="listOfFiles">
        <header>
          <h2>{ prefix ? prefix : 'Your Files'} {displaySubsetOfTotal(displayedRows, filesAndFolders)}</h2>
          <input type="search" onChange={this.onChangeFilter} autoFocus placeholder="Search (regex)" />
        </header>
        <ul>
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
  console.log(`preapplied folder name for prefix '${prefix}'`);
  listObjects.forEach( entry => {
    const key = folderName(entry.name);
    if (key === '') return; // skip things that aren't folders
    folders[key] = folders[key] || {
      localName: key,
      fullPath: [prefix, key].join('/')
    };
    const folder = folders[key];
    folder.fileCount = ~~folder.fileCount + 1; // https://stackoverflow.com/questions/18690814/javascript-object-increment-item-if-not-exist
  });

  const files = listObjects.filter(isFileHere);

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

class OneFile extends Component {

  onClick = (evt) => {
    evt.preventDefault();
    router.go.oneFile( this.props.file.key );
  };

  render() {
    const { file, displayName } = this.props;
    return (
      <li className="oneFile" title={file.key}>
        <a href="#" onClick={this.onClick}>{displayName} <small>{file.charCount} chars</small></a>
      </li>
    );
  }
}

class OneFolder extends Component {

  onClick = (evt) => {
    evt.preventDefault();
    router.go.list( this.props.entry.fullPath );
  };

  render() {
    const { entry, displayName } = this.props;
    return (
      <li className="oneFolder" title={entry.fullPath}>
        <a href="#" onClick={this.onClick}>&#128194; {displayName} <small>{entry.fileCount} files</small></a>
      </li>
    );
  }
}

export default connect()(ListOfFiles);
