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

        <br/><br/><br/>

        <small>TODO</small>
        <TodoList>
          <Todo done>First let's grab the url in componentDidMount -> window.location.pathname</Todo>
          <Todo done>Then we'll turn it in to a meaningful action with urlToAction</Todo>
          <Todo done>Include Redux</Todo>
          <Todo done>send redux the url changed action</Todo>
          <Todo done>turn the action into a useful state</Todo>
          <Todo done>handle a filename that isn't found</Todo>
          <Todo done>observe the back/forward buttons and react appropriately</Todo>
          <Todo done>support reading data from an s3 bucket</Todo>
          <Todo done>get file details from s3 bucket</Todo>
          <Todo done>turn `size` into a char count (assuming plain text), and count words</Todo>
          <Todo done>Show the bucket name you're connected to</Todo>
          <Todo done>Make the text appear editable and scroll nicely</Todo>
          <Todo done>Add some simple markdown syntax highlighting (that doesn't change char positions) -- tried codemirror via react-md-editor and ace and didn't like either</Todo>
          <Todo>If props.file.content != editableText, show a save button. Enable cmd+s for the button</Todo>
          <Todo>Have the save button actually persist to the server</Todo>
          <Todo>cache file list and file contents on device; if old, greedy-invalidate. if not fresh, lazy-invalidate</Todo>
        </TodoList>

        <small>Nice to have:</small>
        <TodoList>
          <Todo>Live refresh the text, mixing in the current user's edits intelligently (2-way-sync challenge)</Todo>
          <Todo>gui configurable s3 bucket target & key</Todo>
          <Todo>Integrate `Flow` with this project as a learning experience</Todo>
        </TodoList>

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
