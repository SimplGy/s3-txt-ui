import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListOfFiles from './vertical/fileList/ListOfFiles';
import FileDetails from './vertical/fileList/fileDetails';
import router, { SCREENS } from './horizontal/router';
import { findInFilesBySlug } from './horizontal/fileOps';
import { pick } from 'lodash';
import files from './horizontal/api/files';


class App extends Component {

  state = {
    files: []
  };

  componentDidMount() {
    const dispatch = this.props.dispatch; // avoid closing over `this` later
    router.observeHash({ broadcastTo: dispatch });

    files.corsHealthCheck() // Make sure CORs is working, and log out details if so
      .then(this.getFiles); // get files. we need the list of files in order to map a slug back to a file key, so even an initial load of a file details screen needs the files array
  }

  getFiles = () => {
    files.get().then(
      (files) => this.setState({ files })
    );
  };

  render() {
    let screen;
    switch(this.props.screen) {
    case SCREENS.oneFile:
      // map url slug to an AWS file descriptor
      const file = findInFilesBySlug(this.state.files, this.props.itemSlug);
      screen = <FileDetails name={file.name} fileKey={file.key} />;
      break;
    default:
      screen = <ListOfFiles files={this.state.files} prefix={this.props.itemSlug} />;
    }

    // Assign a classname to the body tag for each screen (needed to override scrolling behavior)
    const body = document.getElementsByTagName('body')[0];
    if (body) { body.className = 'screen-' + this.props.screen; }

    return screen;
  }
}

App.propTypes = {
  screen: React.PropTypes.string,
  itemSlug: React.PropTypes.string
};


export default connect(
  (_) => pick(_, ['screen', 'itemSlug'])
)(App);
