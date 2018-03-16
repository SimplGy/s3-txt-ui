import React, { Component } from 'react';
import router from '../../horizontal/router';

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

export default OneFolder;
