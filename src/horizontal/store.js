import { createStore } from 'redux';
import ACTIONS from './ACTIONS';
import { SCREENS } from './routing';


function reducer(state, action = {}) {
  switch (action.type) {
  case ACTIONS.urlChanged:
    // Side effect. Doesn't go here. doesn't go anywhere. Not planned for in Redux :/
    // https://github.com/reactjs/redux/issues/1528
    // https://medium.com/javascript-and-opinions/redux-side-effects-and-you-66f2e0842fc3#.6npgu8hf9
    if (action.payload.screen === SCREENS.oneFile) {
      window.location.hash = `/files/${action.payload.itemId}`;
    } else {
      window.location.hash = `/`;
    }
    return Object.assign({}, state, action.payload);
  default: return state;
  }
}

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
