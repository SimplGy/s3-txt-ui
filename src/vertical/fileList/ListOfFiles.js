import React, { Component } from 'react';
import './listOfFiles.css';
import fakeData from '../../horizontal/_fileData.js';

const OneFile = props => (
  <li className="oneFile">
    <a href="#" onClick={props.action}>{props.file.name}</a>
  </li>
);

class ListOfFiles extends Component {

  constructor() {
    super();
    this.onClickFile = this.onClickFile.bind(this);
  }

  onClickFile(e, file) {
    this.props.selectFile(file);
  }

  render() {
    const rows = this.props.files.map(
      f => <OneFile key={f.name} file={f} action={ e => this.onClickFile(e, f) } />
    );
    return (
      <div className="listOfFiles">
        <h2>Your Files</h2>
        <ul>
          {rows}
        </ul>
      </div>
    );
  }

}

ListOfFiles.propTypes = {
  files: React.PropTypes.array.isRequired
};

ListOfFiles.defaultProps = {
  files: fakeData
};

export default ListOfFiles;
