import React, { Component } from 'react';
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
  }

  componentWillMount() {
    this.load(this.props.fileKey);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('fileDetails #componentDidUpdate. this.props.fileKey', this.props.fileKey);
    if(prevProps.fileKey !== this.props.fileKey) {
      this.load(this.props.fileKey);
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

  render() {
    const { name, file, editableText } = { ...this.props, ...this.state };
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
      </div>
    );
  }

}

FileDetails.propTypes = {
  name: React.PropTypes.string.isRequired,
  fileKey: React.PropTypes.string // `key` is a reserved word in JSX / react
};

export default connect()(FileDetails);
