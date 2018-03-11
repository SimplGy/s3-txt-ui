import React, { Component } from 'react';
import { connect } from 'react-redux';
import router from '../../horizontal/router';
import './listOfFiles.css';
import { awsRegion, awsBucket } from '../../horizontal/api/files';

const OneFile = ({action, file}) => (
  <li className="oneFile">
    <a href="#" onClick={action}>{file.name} <small>{file.charCount} b</small></a>
  </li>
);

class ListOfFiles extends Component {

  onClickFile = (e, file) => {
    e.preventDefault();
    router.go.oneFile( file.key );
  };

  render() {
    let rows = this.props.files.map(
      f => <OneFile key={f.name} file={f} action={ e => { this.onClickFile(e, f); }} />
    );
    if (rows.length === 0) { rows = '...'; }

    const awsUrl = `http://${awsBucket}.s3-${awsRegion}.amazonaws.com`;

    return (
      <div className="listOfFiles">
        <h2>Your Files</h2>
        <ul>
          {rows}
        </ul>
        <br/>
        <small className="muted">Connected to: {awsUrl}</small>
      </div>
    );
  }

}

export default connect()(ListOfFiles);
