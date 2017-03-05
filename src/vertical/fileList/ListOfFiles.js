import React, { Component } from 'react';
import { connect } from 'react-redux';
import router from '../../horizontal/router';
import './listOfFiles.css';

const OneFile = _ => (
  <li className="oneFile">
    <a href="#" onClick={_.action}>{_.file.name} <small>{_.file.charCount} chars</small></a>
  </li>
);

class ListOfFiles extends Component {

  constructor() {
    super();
    this.onClickFile = this.onClickFile.bind(this);
  }

  onClickFile(e, file) {
    e.preventDefault();
    router.go.oneFile( file.key );
  }

  render() {
    let rows = this.props.files.map(
      f => <OneFile key={f.name} file={f} action={ e => { this.onClickFile(e, f); }} />
    );
    if (rows.length === 0) { rows = '...'; }

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

export default connect()(ListOfFiles);
