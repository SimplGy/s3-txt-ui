import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import router from '../../horizontal/router';
import './listOfFiles.css';
import { awsRegion, awsBucket } from '../../horizontal/api/files';

const OneFile = _ => (
  <li className="oneFile">
    <a href="#" onClick={_.action}>{_.file.name} <small>{_.file.charCount} b</small></a>
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



const Todo = styled.li`
  &:before {
    content: ${props => props.done ? '"✔"' : '"☐"'};
    margin-left: -1em;
    margin-right: .100em;
  }
  color: ${props => props.done ? '#5b4' : 'inherit' };
`;

const TodoList = styled.ul`
  padding-left: 20px;
  text-indent: 2px;
  list-style: none;
  list-style-position: outside;
  font-size: 75%;
`;

export default connect()(ListOfFiles);
