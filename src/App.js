import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ListOfFiles from './vertical/fileList/ListOfFiles';
import FileDetails from './vertical/fileList/fileDetails';
import router, { SCREENS } from './horizontal/router';
import { findFileByUrl } from './horizontal/fileOps';
import { pick } from 'lodash';
import files from './horizontal/api/files';
import {urlFrom} from './horizontal/parsing';
import Configure from './vertical/configure/configure';

const alertShowTime = 7000;

class App extends Component {

  state = {
    files: [],
    alerts: [],
  };

  handleError = ({ code, message }) => {
    this.showAlert(`AWS error: ${message}`);
    switch(code) {
    case 'CredentialsError': // Credentials haven't been provided
      // router.go.configure();
      break;
    case 'InvalidAccessKeyId': // that access key (user) actually doesn't exist
      // router.go.configure();
      break;
    case 'SignatureDoesNotMatch': // the key and secret don't match
      break;
    default:
      console.warn(`Unhandled error code '${code}'`);
    }
    throw new Error('Handled Error');
  };

  showAlert = (msg) => {
    this.setState({ alerts: [...this.state.alerts, msg]});
    setTimeout(() => {
      this.setState({ alerts: this.state.alerts.slice(1) });
    }, alertShowTime);
  };

  componentDidMount() {
    const dispatch = this.props.dispatch; // avoid closing over `this` later
    router.observeHash({ broadcastTo: dispatch });
    // Start by getting a list of files, no matter what screen we're on.
    // We need the list of files in order to map a slug back to a file key, so even an initial load of a file details screen needs the files array
    this.refresh()
        .catch(()=>{}); // Intentionally ignore. I *want* to allow the api to handle errors transparently.
  }

  refresh = () =>
    files.init()
      .then(this.getFiles)
      .catch(this.handleError);

  getFiles = () =>
    files.get()
      .then(files => this.setState({files}))
      .catch(this.handleError);

  render() {
    const { screen, prefix } = this.props;
    let html;
    switch(screen) {
    case SCREENS.configure:
      html = <Configure refresh={this.refresh} />;
      break;
    case SCREENS.oneFile:
      const file = findFileByUrl(this.state.files, urlFrom(prefix));
      html = <FileDetails name={file.name} fileKey={file.key} />;
      break;
    case SCREENS.list:
      html = <ListOfFiles files={this.state.files} prefix={prefix} />;
      break;
    default:
      html = <p className="error">Error: Unknown screen '{screen}'.</p>;
    }

    // Set classname to the body tag based on screen (needed to override scrolling behavior)
    const body = document.getElementsByTagName('body')[0];
    if (body) { body.className = 'screen-' + this.props.screen; }

    return (
      <div>
        { html }
        { this.state.alerts.length > 0 &&
          <footer className="alerts">
            { this.state.alerts.map((msg, idx) => <p key={idx}>{msg}</p>) }
          </footer>
        }
      </div>
    );
  }
}

App.propTypes = {
  screen: PropTypes.string,
  data: PropTypes.object
};

export default connect(
  (_) => pick(_, ['screen', 'prefix'])
)(App);
