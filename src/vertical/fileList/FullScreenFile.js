import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SCREENS } from '../../horizontal/routing';
import ACTIONS from '../../horizontal/ACTIONS';
import './fullScreenFile.css';
import { getFileBySlug, getLinesFromText } from '../../horizontal/fileOps';
import fakeData from '../../horizontal/_fileData.js';

class FullScreenFile extends Component {

  // TODO: does mapActionsToDispatch remove the need for this boilerplate with the constructor and `this` binding?
  constructor() {
    super();
    this.onClickBack = this.onClickBack.bind(this);
  }
  onClickBack() {
    this.props.dispatch({ type: ACTIONS.urlChanged, payload: { screen: SCREENS.list } });
  }

  componentWillMount() {
    console.log("componentWillMount", this.props);
    const file = getFileBySlug(fakeData, this.props.fileSlug);
    // TODO: is precomputing props into local state a sensible, valid, scalabe way to do expensive computation against a redux store's value?
    this.state = {
      file,
      prettyText: getLinesFromText(file.contents).map(
        (line, idx) => <p key={idx} title={'line ' + idx}>{line}</p>
      )
    };
  }

  render() {
    return (
      <div className="fullScreenFile">
        <a href="#" className="backLink" onClick={ this.onClickBack }>&larr; back</a>
        <h1>{this.state.file.name}</h1>
        <article>{this.state.prettyText}</article>
      </div>
    );
  }

}

FullScreenFile.propTypes = {
  fileSlug: React.PropTypes.string.isRequired
};

export default connect()(FullScreenFile);
