import React, { Component } from 'react';
import { connect } from 'react-redux';
import router from '../../horizontal/router';
import './listOfFiles.css';
import { awsRegion, awsBucket } from '../../horizontal/api/files';

class ListOfFiles extends Component {

  state = {
    filter: undefined // a client side filter, if you want to search for files.
  };

  onClickFile = (e, file) => {
    e.preventDefault();
    router.go.oneFile( file.key );
  };

  onChangeFilter = (evt = {}) => {
    let val = evt.target.value || '';
    const filter = val.trim();
    console.log(`onChangeFilter: '${filter}'`);
    this.setState({filter});
  };

  // return true if the given file matches the current filter
  applyCurrentFilter = ({name}) => {
    let match = this.state.filter || '';
    return name.toLowerCase().search(match) > -1;
  };

  render() {
    let rows = this.props.files
      .filter(this.applyCurrentFilter)
      .map(f =>
        <OneFile key={f.name} file={f} />
      );
    if (rows.length === 0) { rows = '...'; }

    const awsUrl = `http://${awsBucket}.s3-${awsRegion}.amazonaws.com`;

    return (
      <div className="listOfFiles">
        <header>
          <h2>Your Files</h2>
          <input type="search" onChange={this.onChangeFilter} autoFocus placeholder="Search (regex)" />
        </header>
        <ul>
          {rows}
        </ul>
        <br/>
        <small className="muted">Connected to: {awsUrl}</small>
      </div>
    );
  }

}

class OneFile extends Component {

  onClick = (evt) => {
    evt.preventDefault();
    router.go.oneFile( this.props.file.key );
  }

  render() {
    const { file } = this.props;
    return (
      <li className="oneFile">
        <a href="#" onClick={this.onClick}>{file.name} <small>{file.charCount} chars</small></a>
      </li>
    );
  }
}

export default connect()(ListOfFiles);
