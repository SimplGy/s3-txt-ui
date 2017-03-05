import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ListOfFiles from './vertical/fileList/ListOfFiles';
import FileDetails from './vertical/fileList/fileDetails';
import router, { SCREENS } from './horizontal/router';
import { findInFilesBySlug } from './horizontal/fileOps';
import { pick } from 'lodash';
import files from './horizontal/api/files';


class App extends Component {

  constructor(){
    super();
    this.state = {
      files: []
    };
  }

  componentDidMount() {
    const dispatch = this.props.dispatch; // avoid closing over `this` later
    router.observeHash({ broadcastTo: dispatch });
    // get files. we need the list of files in order to map a slug back to a file key, so even an initial load of a file details screen needs the files array
    this.getFiles();
  }

  getFiles() {
    files.get().then(
      (files) => this.setState({ files })
    );
  }

  render() {
    let screen;
    switch(this.props.screen) {
    case SCREENS.oneFile:
      // map url slug to an AWS file descriptor
      const file = findInFilesBySlug(this.state.files, this.props.itemSlug);
      screen = <FileDetails name={file.name} fileKey={file.key} />;
      break;
    default:
      screen = <ListOfFiles files={this.state.files} />;
    }

    return (
      <div className="app">

        { screen }

        <Rule />

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
          <Todo>support writing data as well as reading data (2-way-sync challenge)</Todo>
          <Todo>cache list and items, always refetch, and lazy-invalidate</Todo>
        </TodoList>

        <small>Nice to have:</small>
        <TodoList>
          <Todo>gui configurable s3 bucket target & key</Todo>
          <Todo>Integrate `Flow` with this project as a learning experience</Todo>
        </TodoList>

      </div>
    );
  }
}

App.propTypes = {
  screen: React.PropTypes.string,
  itemSlug: React.PropTypes.string
};

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

const Rule = styled.hr`
  height: 0;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 10px 0;
`;

export default connect(
  (_) => pick(_, ['screen', 'itemSlug'])
)(App);
