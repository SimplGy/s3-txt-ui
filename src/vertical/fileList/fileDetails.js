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
      isSaving: false,
      originalText: null,
      editableText: '...',
    };
    this.onChangeText = this.onChangeText.bind(this);
    this.saveFileContents = this.saveFileContents.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.gotText = this.gotText.bind(this);
  }

  componentWillMount() {
    this.load(this.props.fileKey);
  }

  componentDidMount() {
    this.stopListening = ReactDOM.findDOMNode(this).addEventListener('keydown', this.onKeyPress);
  }

  componentWillUnmount() {
    ReactDOM.findDOMNode(this).removeEventListener('keydown', this.onKeyPress);
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
      this.saveFileContents();
      return false;
    } else {
      return true;
    }
  }

  load(fileKey) {
    if (fileKey == null) { return; } // no key, so we haven't loaded the set of file names yet
    files.get(fileKey).then(this.gotText);
  }

  onChangeText(evt) {
    const editableText = evt.target.value;
    this.setState({ editableText });
  }

  saveFileContents() {
    this.setState({ isSaving: true });
    files.save(this.props.fileKey, this.state.editableText)
      .then(this.gotText)
      .catch(console.warn)
      .then( _ => this.setState({ isSaving: false }) );
  }

  // When we get text from the server, either as the result of a fetch or save
  gotText(text) {
    const originalText = text;
    const editableText = text; // copy out string "value"
    this.setState({ originalText, editableText });
  }

  render() {
    const { isSaving, name, originalText, editableText } = { ...this.props, ...this.state };
    const saveButton = isSaving || editableText !== originalText
      ? <button className={isSaving ? 'saveBtn saving' : 'saveBtn'}
          disabled={isSaving}
          onClick={()=>this.saveFileContents(editableText)} title="Save: [Ctrl+S]">{isSaving ? "..." : "save"}</button>
      : null;

    return (
      <div className="fileDetails">

        <header>
          <a href="#" className="backLink" onClick={ router.go.list }>&larr; files</a>
          <small className="muted">{wordCountFromText(editableText)} words</small>
          <h1>{name}</h1>
        </header>

        {/* <article className="editable" onChange={this.onChangeText} contentEditable suppressContentEditableWarning={true}>
          {editableText}
        </article> */}

        <div className="textWrapper">
          <textarea autoFocus value={editableText} onChange={this.onChangeText} placeholder="This file is empty." />
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
