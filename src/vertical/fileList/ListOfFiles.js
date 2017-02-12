import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SCREENS } from '../../horizontal/routing';
import ACTIONS from '../../horizontal/ACTIONS';
import { slugify } from '../../horizontal/fileOps';
import './listOfFiles.css';
import fakeData from '../../horizontal/_fileData.js';

const OneFile = props => (
  <li className="oneFile">
    <a href="#" onClick={props.action}>{props.file.name}</a>
  </li>
);

class ListOfFiles extends Component {

  constructor() {
    super();
    this.onClickFile = this.onClickFile.bind(this);
  }

  onClickFile(e, file) {
    e.preventDefault();
    console.log('onClickFile', this.props);
    this.props.dispatch({
      type: ACTIONS.urlChanged,
      payload: { screen: SCREENS.oneFile, itemId: slugify(file.name) }
    });

    // TODO: abstract out the dispatcher (ie: action creator)

    // TODO: slugify the raw file name

    // TODO: I could either change the URL and let the app respond, or fire an action directly
    // eg: fire an action, allow that to change the location hash and set state
    // eg2: change url, allow that to fire an action and set state
  }

  render() {
    const rows = this.props.files.map(
      f => <OneFile key={f.name} file={f} action={ e => { this.onClickFile(e, f); }} />
    );
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

ListOfFiles.propTypes = {
  files: React.PropTypes.array.isRequired
};

ListOfFiles.defaultProps = {
  files: fakeData
};

export default connect()(ListOfFiles);
