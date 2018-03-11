import { slugify } from './fileOps';

// let silent = false; // if Silent, don't dispatch actions on 'hashchange' event. avoids infinite loop problem
const SCREENS = {
  list: 'list',
  oneFile: 'oneFile'
};
// const URLS = {
//   list: '/',
//   oneFile: '/files/'
// };

function setHashWith(str = '', trailing = '') {
  const segments = str.split('/').filter(s => s !== '');
  window.location.hash = '/' + segments.map(slugify).join('/') + trailing;
}

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
  go: {
    [SCREENS.list]: path => setHashWith(path, '/'), // the trailing '/' is our secret way to say "I'm a folder"
    [SCREENS.oneFile]: setHashWith,
  },

  back: () => window.history.back()

};

// (location.hash) => reduxAction
// How do we tell from only a string path whether this is a folder or a file, as far as s3 is concerned?
// Internal convention: if it ends in a '/', it's a folder
function hashToAction (url) {
  const screen = urlRepresentsFolder(url) ? SCREENS.list : SCREENS.oneFile;
  let itemSlug = slugify(url);

  // if (!itemSlug) { // both blank string and undefined are failures
  //   console.warn(`Could not parse filename from url ${url}`);
  // }

  return {
    type: 'url_changed',
    payload: { screen, itemSlug }
  };
}

function urlRepresentsFolder(url = '') {
  const lastChar = url[url.length - 1];
  return lastChar === '/' || !lastChar; // blank string, undefined
}

// (screenKey, id) => hash
// key: something from the SCREENS const
// id: file or folder name
// Returns a location.hash candidate
// function screenToHash(key, id) {
//   if (typeof id === 'number') { id = String(id); }
//   if (typeof id !== 'string') { id = ''; } // no "[Object object]" or "undefined" in urls
//   const slug = slugify(id);
//   return slug;
// }

function onHashChange (dispatch) {
  const action = hashToAction(window.location.hash);
  console.log(`onHashChange(${window.location.hash}). action.payload:`, action.payload);
  dispatch(action);
}


export { SCREENS };
export default router;
