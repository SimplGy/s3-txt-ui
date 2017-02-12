

const SCREENS = {
  list: 'ListOfFiles',
  oneFile: 'FullScreenFile'
};

// Expects a url path, like what you get from window.location.pathname
const urlToAction = (url) => {

  // default
  let screen = SCREENS.list;
  let itemId;

  if (url.indexOf('/files/') >= 0) {
    itemId = url.split('/files/')[1];
    if (itemId) {
      screen = SCREENS.oneFile;
    } else { // capture falsey -- both blank string and undefined are failures
      console.warn(`Could not parse filename from url ${url}`);
    }
  }

  return {
    type: 'url_changed',
    payload: { screen, itemId }
  };
};



export { SCREENS, urlToAction };
