import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListOfFiles from './vertical/fileList/ListOfFiles';
import FileDetails from './vertical/fileList/fileDetails';
import router, { SCREENS } from './horizontal/router';
import { findFileByUrl } from './horizontal/fileOps';
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
    files.get().then(files =>
      this.setState({ files })
    );
  };

  render() {
    const { screen, prefix } = this.props;
    console.log(`App render() ${this.state.files.length} files`, this.props);
    let html;
    switch(screen) {
    case SCREENS.oneFile:
      const file = findFileByUrl(this.state.files, prefix);
      html = <FileDetails name={file.name} fileKey={file.key} />;
      break;
    default:
      html = <ListOfFiles files={this.state.files} prefix={prefix} />;
    }

    // Set classname to the body tag based on screen (needed to override scrolling behavior)
    const body = document.getElementsByTagName('body')[0];
    if (body) { body.className = 'screen-' + this.props.screen; }

    return html;
  }
}

App.propTypes = {
  screen: React.PropTypes.string,
  data: React.PropTypes.object
};

export default connect(
  (_) => pick(_, ['screen', 'prefix'])
)(App);
