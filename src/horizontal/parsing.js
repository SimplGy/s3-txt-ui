import { slugifyPathComponents } from './fileOps';

const slash = '/'; // "cute" name? Even if it's not a slash one day, it's acting as one.

// eg: ('a/b/bar.md') => '/a/b/bar_md'
export function urlFrom(s3Key = '') {
  return slash + slugifyPathComponents(s3Key);
}

// eg: ('a/b/') => '/a/b/' // TODO: do I need this method or is it obvious?
// export function urlFromPrefix(prefix) {}

// eg: ('#/a/b/bar_md') => 'a/b/bar.md'
// TODO: this function isn't possible to implement safely,
// since many things are converted to `_`, by slug, and I can't assume they all should be converted back to `.`
// export function s3KeyFrom(url) {
//   url = url[0] === slash ? url.slice(1) : url; // if there is a leading slash, remove it
//   return url;
// }

// Given a url from our application, return an s3-friendly prefix
// eg: ('/a/b/') => 'a/b/'
export function prefixFrom(url = '') {
  url = url[0] === slash ? url.slice(1) : url; // if there is a leading slash, remove it
  return url;
}

// Does this url have this file as a direct decendent?
// eg: ('a/')('a/foo.md') => true
// eg: ('a/')('a/b/foo.md') => false
export function isFileHere(prefix) {
  return function(key = '') {
    const pathWithoutPrefix = key.slice(prefix.length);
    return key.startsWith(prefix)
      ? !pathWithoutPrefix.includes(slash) // If the path still has a slash in it, there's still a subfolder
      : false;
  };
}


// eg: ('a/')('a/b/c/bar.md') => 'b'
// eg: ('a/')('a/foo.md') => ''
export function folderNameHere(prefix) {
  return function(key = '') {
    const pathWithoutPrefix = prefixFrom(
      key.slice(prefix.length)
    );
    const nextSlash = pathWithoutPrefix.indexOf(slash);
    if (nextSlash === -1) { return ''; } // key doesn't have a folder at this level
    return pathWithoutPrefix.slice(0, nextSlash);
  };
}

// eg: ('a/')('a/foo.md') => 'foo.md'
// eg: ('a/')('a/b/c/bar.md') => ''
export function fileNameHere(prefix) {
  return function(key = '') {
    const pathWithoutPrefix = key.slice(prefix.length);
    return isFileHere(prefix)(key)
    ? pathWithoutPrefix
    : '';
  };
}
