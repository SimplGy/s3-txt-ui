import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import router from '../../horizontal/router';
import './fileDetails.css';
import files from '../../horizontal/api/files';
import { wordCountFromText } from '../../horizontal/fileOps';

class FileDetails extends Component {

  constructor() {
    super();
    this.state = {
      file: {},
      editableText: '...',
    };
    this.onChangeText = this.onChangeText.bind(this);
    this.saveFile = this.saveFile.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentWillMount() {
    this.load(this.props.fileKey);
  }

  componentDidMount() {
    this.stopListening = ReactDOM.findDOMNode(this).addEventListener('keypress', this.onKeyPress, false);
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).removeEventListener('keypress', this.onKeyPress);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.fileKey !== this.props.fileKey) {
      this.load(this.props.fileKey);
    }
  }

  onKeyPress(evt) {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === 's') {
      evt.preventDefault();
      evt.stopPropagation();
      this.saveFile();
      return false;
    } else {
      return true;
    }
  }

  load(fileKey) {
    if (fileKey == null) { return; } // no key, so we haven't loaded the set of file names yet
    files.get(fileKey).then(
      file => {
        const editableText = file.contents;
        this.setState({ file, editableText });
      }
    );
  }

  onChangeText(evt) {
    const editableText = evt.target.value;
    this.setState({ editableText });
  }

  saveFile(){
    console.log('saveFile()');
  }

  render() {
    const { name, file, editableText } = { ...this.props, ...this.state };
    const saveButton = editableText !== file.contents
      ? <button className="saveBtn" onClick={this.saveFile}>save</button>
      : null;

    return (
      <div className="fileDetails">

        <header>
          <a href="#" className="backLink" onClick={ router.go.list }>&larr; files</a>
          <small className="muted">{wordCountFromText(file.contents)} words</small>
          <h1>{name}</h1>
        </header>

        {/* <article className="editable" onChange={this.onChangeText} contentEditable suppressContentEditableWarning={true}>
          {editableText}
        </article> */}

        <div className="textWrapper">
          <textarea value={editableText} onChange={this.onChangeText} placeholder="This file is empty." />
        </div>

        {saveButton}

      </div>
    );
  }

}

FileDetails.propTypes = {
  name: React.PropTypes.string.isRequired,
  fileKey: React.PropTypes.string // `key` is a reserved word in JSX / react
};

export default connect()(FileDetails);
