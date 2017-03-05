import React, { Component } from 'react';
import { connect } from 'react-redux';
import router from '../../horizontal/router';
import './fileDetails.css';
import files from '../../horizontal/api/files';
import { toArrayByNewlines, wordCountFromText } from '../../horizontal/fileOps';

class FileDetails extends Component {

  constructor() {
    super();
    this.state = { file: {}, formattedText: '...' };
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
        const formattedText = toArrayByNewlines(file.contents).map(
          (line, idx) => <p key={idx} title={'line ' + idx}>{line}</p>
        );
        this.setState({ file, formattedText });
      }
    );
  }

  render() {
    const { name, file, formattedText } = { ...this.props, ...this.state };
    return (
      <div className="fileDetails">
        <a href="#" className="backLink" onClick={ router.go.list }>&larr; view all</a>
        <h1>
          {name}
          <small>{wordCountFromText(file.contents)} words</small>
        </h1>
        <article>{formattedText}</article>
      </div>
    );
  }

}

FileDetails.propTypes = {
  name: React.PropTypes.string.isRequired,
  fileKey: React.PropTypes.string // `key` is a reserved word in JSX / react
};

export default connect()(FileDetails);
