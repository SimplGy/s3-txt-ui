import React, { Component } from 'react';
import { connect } from 'react-redux';
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

        <hr/>

        <small>TODO</small>
        <ul className="todoList">
          <li className="done">First let's grab the url in componentDidMount -> window.location.pathname</li>
          <li className="done">Then we'll turn it in to a meaningful action with urlToAction</li>
          <li className="done">Include Redux</li>
          <li className="done">send redux the url changed action</li>
          <li className="done">turn the action into a useful state</li>
          <li className="done">handle a filename that isn't found</li>
          <li className="done">observe the back/forward buttons and react appropriately</li>
          <li className="done">support reading data from an s3 bucket</li>
          <li className="done">get file details from s3 bucket</li>
          <li className="done">turn `size` into a char count (assuming plain text), and count words</li>
          <li className="">support writing data as well as reading data (2-way-sync challenge)</li>
          <li className="">cache list and items, always refetch, and lazy-invalidate</li>
        </ul>

        <small>Nice to have:</small>
        <ul className="todoList">
          <li className="">gui configurable s3 bucket target & key</li>
          <li className="">Integrate `Flow` with this project as a learning experience</li>
        </ul>

      </div>
    );
  }
}

App.propTypes = {
  screen: React.PropTypes.string,
  itemSlug: React.PropTypes.string
};

export default connect(
  (_) => pick(_, ['screen', 'itemSlug'])
)(App);
