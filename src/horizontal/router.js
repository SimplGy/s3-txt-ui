import { slugify } from './fileOps';

// let silent = false; // if Silent, don't dispatch actions on 'hashchange' event. avoids infinite loop problem
const SCREENS = {
  list: 'list',
  oneFile: 'oneFile'
};
const URLS = {
  list: '',
  oneFile: '/files/'
};

// The router singleton interfaces between the browser history api and the application state
// if you call `init` and send it a dispatch function, it will dispatch url actions to the application
const router = {

  // Start the router monitoring the window location
  observeHash: (options = {}) => {
    let dispatchFn = options.broadcastTo;
    window.addEventListener('hashchange', onHashChange.bind(null, dispatchFn), false); // changes in state
    onHashChange(dispatchFn); // initial state
  },

  // A method for each screen
  // Each go method takes an optional id and uses the prefix from the `URLS` hash
  go: (()=>{
    const goMethods = {};
    Object.keys(SCREENS).forEach( key => {
      goMethods[key] = (id) => window.location.hash = screenToHash(key, id);
    });
    return goMethods;
  })(),

  back: () => window.history.back()

};

// (location.hash) => reduxAction
function hashToAction (url) {
  let screen = SCREENS.list; // default
  let itemSlug;
  if (url.indexOf(URLS.oneFile) >= 0) {
    itemSlug = url.split(URLS.oneFile)[1];
    if (itemSlug) {
      screen = SCREENS.oneFile;
    } else { // capture falsey -- both blank string and undefined are failures
      console.warn(`Could not parse filename from url ${url}`);
    }
  }
  return {
    type: 'url_changed',
    payload: { screen, itemSlug }
  };
}

// (screenKey, id) => hash
// Expects a key from the SCREENS const
// Returns a location.hash candidate
function screenToHash(key, id) {
  if (typeof id === 'number') { id = String(id); }
  if (typeof id !== 'string') { id = ''; } // no "[Object object]" or "undefined" in urls
  const slug = slugify(id);
  // console.log(`screenToHash(${key},${slug}) -> "${URLS[key] + slug}"`);
  return URLS[key] + slug;
}

function onHashChange (dispatch) {
  const action = hashToAction(window.location.hash);
  console.log(`onHashChange(${window.location.hash}) -> `, action.payload);
  dispatch(action);
}


export { SCREENS, URLS };
export default router;
