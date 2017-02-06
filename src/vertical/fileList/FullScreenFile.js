import React, { Component } from 'react';
import './fullScreenFile.css';

class FullScreenFile extends Component {

  render() {
    const file = this.props.file;
    return (
      <div className="fullScreenFile">
        <a href="#" className="backLink" onClick={this.props.backAction}>&larr; back</a>
        <h1>{file.name}</h1>
        <article>
          {
          // TODO: learn what lifecycle method to do props parsing in so that this doesn't parse N lines every render
          getLinesFromText(file.contents).map(
            (line, idx) => <p key={idx} title={"line " + idx}>{line}</p>
          )}
        </article>
      </div>
    );
  }

}

const getLinesFromText = (text) => {
  return text.split(/\r?\n/); // both windows and unix newlines
}


FullScreenFile.propTypes = {
  backAction: React.PropTypes.func.isRequired,
  file: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    contents: React.PropTypes.string.isRequired
  }).isRequired
};

export default FullScreenFile;
