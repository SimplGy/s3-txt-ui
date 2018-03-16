import React, { Component } from 'react';
import router from '../../horizontal/router';

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

export default OneFile;
