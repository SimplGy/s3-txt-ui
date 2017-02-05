import React, { Component } from 'react';
import './fullScreenFile.css';

class FullScreenFile extends Component {

  render() {
    const file = this.props.file;
    return (
      <div className="fullScreenFile">
        <a href="#" onClick={this.props.backAction}>&lt; Back</a>
        <h1>{file.name}</h1>
        <article>
          {file.contents}
        </article>
      </div>
    );
  }

}

FullScreenFile.propTypes = {
  backAction: React.PropTypes.func.isRequired,
  file: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    contents: React.PropTypes.string.isRequired
  }).isRequired
};

export default FullScreenFile;
