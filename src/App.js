import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListOfFiles from './vertical/fileList/ListOfFiles';
import FullScreenFile from './vertical/fileList/FullScreenFile';
import { SCREENS, urlToAction } from './horizontal/routing';
import { pick } from 'lodash';



class App extends Component {

  componentDidMount() {
    const dispatch = this.props.dispatch; // `this` binding avoidance
    dispatch(urlToAction(window.location.hash));

    // (caused an infinite loop, since we later want to silently set a hash as a side effect to match app state
    //   this could be avoided with a "silent" or similar, but the feature of manually typing a url isn't needed for now.
    //   Cut-and-paste and refresh still work, just not a manual hash change)
    // Whenever the window hash changes, dispatch an action.
    // window.addEventListener('hashchange', dispatchCurHashAsAction, false);
    // dispatchCurHashAsAction();
  }

  render() {
    let screen;
    switch(this.props.screen) {
    case SCREENS.oneFile:
      screen = <FullScreenFile fileSlug={this.props.itemId} />;
      break;
    default:
      screen = <ListOfFiles />;
    }

    return (
      <div className="App">
        <ul className="todoList">
          <li className="done">First let's grab the url in componentDidMount -> window.location.pathname</li>
          <li className="done">Then we'll turn it in to a meaningful action with urlToAction</li>
          <li className="done">Include Redux</li>
          <li className="done">send redux the url changed action</li>
          <li className="done">turn the action into a useful state</li>
          <li>observe the back/forward buttons and react appropriately</li>
          <li>Use mapActionsToDispatch in the FullScreenFile.js and see if I can avoid constructor and bind that way</li>
        </ul>
        { screen }
      </div>
    );
  }
}

export default connect(
  (_) => pick(_, ['screen', 'itemId'])
)(App);
