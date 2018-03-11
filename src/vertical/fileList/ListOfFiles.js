import React, { Component } from 'react';
import { connect } from 'react-redux';
import router from '../../horizontal/router';
import './listOfFiles.css';
import { awsRegion, awsBucket } from '../../horizontal/api/files';


// Is this listObject *in* a "folder"?
// In s3, every entry is a file, so a folder is just a file with one or more "folder" prefixes in front of the filename
const isInFolder    = (prefix, entry) => localPath(prefix, entry).includes('/');
const isNotInFolder = (prefix, entry) => !isInFolder(prefix, entry);
// entry name at this prefix level (ie: without that parent folder)
const localPath     = (prefix, entry) => {
  const path = entry.name.slice(prefix.length);
  return path[0] === '/' ? path.slice(1) : path; // omit leading '/'
};
const folderName    = (prefix, entry) => localPath(prefix, entry).split('/')[0];

// Is this object a fake folder construct, as created by this module?
// Folders are objects with a `fileCount` property
// fileCount must be > 0, so coercion is our friend today.
const isFolder = ({ fileCount}) => Boolean(fileCount);

/*
This screen starts with:

* files -- all of them. Some indicate they are in folders by having `/` in the name.
* prefix -- may be undefined, but if it's there, we should
  1. strip that prefix from any files we're displaying
  1. group subfolders UNDER that prefix
  1. show remaining files

method ideas:
* entry => entryWithin
  // may be undefined, if this entry isn't valid in this part of the nav tree
  // remove the part of the entry's name that is already included in the prefix



 */



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
          ? <OneFolder key={f.name} folder={f} displayName={localPath(prefix, f)} />
          : <OneFile key={f.name} file={f} displayName={localPath(prefix, f)} />
      );

    const awsUrl = `http://${awsBucket}.s3-${awsRegion}.amazonaws.com`;

    return (
      <div className="listOfFiles">
        <header>
          <h2>{ prefix ? `${prefix}/` : 'Your Files'} {displaySubsetOfTotal(displayedRows, filesAndFolders)}</h2>
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

// given s3 list objects, collapse all entries that represent folders into a single 'folder' entry
function collapseFolders(prefix, listObjects) {
  const folders = {};

  listObjects.filter( o => isInFolder(prefix, o)).forEach( f => {
    const key = folderName(prefix, f);
    folders[key] = folders[key] || {};
    const folder = folders[key];
    folder.name = key;
    folder.fileCount = ~~folder.fileCount + 1; // https://stackoverflow.com/questions/18690814/javascript-object-increment-item-if-not-exist
  });

  const files = listObjects.filter( o => isNotInFolder(prefix, o));
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
      <li className="oneFile">
        <a href="#" onClick={this.onClick}>{displayName} <small>{file.charCount} chars</small></a>
      </li>
    );
  }
}

class OneFolder extends Component {

  onClick = (evt) => {
    evt.preventDefault();
    console.log('clicked on folder', this.props);
    router.go.list( this.props.folder.name );
  };

  render() {
    const { folder, displayName } = this.props;
    return (
      <li className="oneFolder">
        <a href="#" onClick={this.onClick}>&#128194; {displayName} <small>{folder.fileCount} files</small></a>
      </li>
    );
  }
}

export default connect()(ListOfFiles);
