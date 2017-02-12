

const views = {
  list: 'ListOfFiles',
  oneFile: 'FullScreenFile'
};

// Expects a url path, like what you get from window.location.pathname
const urlToAction = (url) => {

  let view = views.list; // default
  let filename; // default

  if (url.indexOf('files/') >= 0) {
    filename = url.split('files/').pop();
    if (filename) {
      view = views.oneFile;
    } else { // Intentionally capture both blank string and undefined and treat as a failure
      console.warn(`Could not parse filename from url ${url}`);
    }

  }

  return {
    type: 'url-changed',
    payload: { view, filename }
  };
};

export { urlToAction, views };
