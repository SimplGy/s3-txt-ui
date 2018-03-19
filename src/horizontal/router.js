import {isFolder, prefixFrom, urlFrom, trimHash, trimSlash} from './parsing';

const SCREENS = {
  list: 'list',
  oneFile: 'oneFile',
  configure: 'configure',
};

// Dumb, but this secret path will open the config screen :)
export const magicConfigureHash = `_${SCREENS.configure}_`;

function setHashWith(str, trailing = '') {
  window.location.hash = urlFrom(str) + trailing;
}

// The router singleton interfaces between the browser history api and the application state
// if you call `init` and send it a dispatch function, it will dispatch url actions to the application
const router = {

  // Start the router monitoring the window location
  observeHash: ({ broadcastTo } = {}) => {
    window.addEventListener('hashchange', onHashChange.bind(null, broadcastTo), false); // changes in state
    onHashChange(broadcastTo); // initial state
  },

  // A method for each screen
  go: {
    [SCREENS.configure]:  ()   => setHashWith(magicConfigureHash),
    [SCREENS.list]:       path => setHashWith(path, '/'), // trailing '/' says "I'm a folder"
    [SCREENS.oneFile]:    path => setHashWith(path),
  },

  back: () => window.history.back()

};

// Given a url
function shouldConfigure(hash) {
  if (trimSlash(trimHash(hash)) === magicConfigureHash) {
    return true;
  }
  // TODO: close, but doesn't work because of timing issues, I think.
  // const cfg = getConfig();
  // const errs = validate(cfg);
  // return Boolean(errs); // if there are missing values, we need to configure
  return false;
}

// (location.hash) => reduxAction
// How do we tell from only a string path whether this is a folder or a file, as far as s3 is concerned?
// Internal convention: if it ends in a '/', it's a folder
function hashToAction(hash) {
  let payload;

  // Configuration time
  if (shouldConfigure(hash)) {
    payload = {
      screen: SCREENS.configure
    };

  // File related actions
  } else {
    payload = {
      prefix: prefixFrom(hash),
      screen: isFolder(hash) ? SCREENS.list : SCREENS.oneFile
    };
  }

  return { type: 'url_changed', payload };
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
  console.log(`onHashChange('${window.location.hash}'). action.payload:`, action.payload);
  dispatch(action);
}


export { SCREENS };
export default router;
