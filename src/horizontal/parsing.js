import slug from 'slug';
slug.charmap['.'] = '_'; // Manual override. Ask slug to replace the dot for us.

const slash = '/'; // "cute" name? Even if it's not a slash one day, it's acting as one.
const hash = '#';

// remove all leading and trailing slashes from a given string
export function trimSlash(str = '') {
  if(str[0] === slash) { return trimSlash(str.slice(1)); }
  const last = str.length - 1;
  if(str[last] === slash) { return trimSlash(str.slice(0, last)); }
  return str;
}

function trimHash(str = '') {
  if(str[0] === hash) { return trimHash(str.slice(1)); }
  return str;
}

// Slugify the individual components, but keep the `/` path delimiter
export const slugifyPathComponents = (str = '') =>
  str.split(slash)
    .map(part => slug(part)) // unfortunately, because of a babel transpilation issue (I think), .map(slug) used directly throws an error
    .join(slash);

// eg: ('a/b/bar.md') => '/a/b/bar_md'
export function urlFrom(s3Key = '') {
  let url = slugifyPathComponents(s3Key);
  if(url[0] !== slash) { url = slash + url; } // lead with a slash, if we aren't already
  return url;
}

// Given an array of string pieces,
// Join them with one (and only one) slash per part
export function joinUrl(parts = []) {
  return parts.map(trimSlash).join(slash);
}

// Given a url from our application, return an s3-friendly prefix
// eg: ('/a/b/') => 'a/b/'
export function prefixFrom(url = '') {
  url = trimHash(url);
  url = trimSlash(url);
  url = url[0] === slash ? url.slice(1) : url; // if there is a leading slash, remove it
  return url;
}

// Does this url have this file as a direct decendent?
// eg: ('a/')('a/foo.md') => true
// eg: ('a/')('a/b/foo.md') => false
export function isFileHere(prefix) {
  return function(key) {
    if (!key) {
      return console.warn(`isFileHere(${prefix}) was not sent file key.`);
    }
    // Key doesn't start with prefix? That's ok, file can't be here then.
    if (!key.startsWith(prefix)) {
      return false;
    // Key starts with the prefix... does it have a subfolder still?
    } else {
      const hasSubfolder = keyWithoutPrefix(prefix, key).includes(slash);
      return !hasSubfolder;
    }
  };
}

// Given a prefix and key, return the key without the prefix segment
// Handles some complexities with slash being or not being there
export function keyWithoutPrefix(prefix = '', key = '') {
  prefix = trimSlash(prefix);
  key = trimSlash(key);
  key = key.slice(prefix.length); // remove the prefix from the key
  return trimSlash(key); // remove the leading slash that might remain, since we've trimmed it from the prefix's length
}

// eg: ('a/')('a/b/c/bar.md') => 'b'
// eg: ('a/')('a/foo.md') => ''
export function folderNameHere(prefix) {
  return function(key = '') {
    const subPath = keyWithoutPrefix(prefix, key);
    const nextSlash = subPath.indexOf(slash);
    if (nextSlash === -1) { return ''; } // key doesn't have a folder at this level
    // console.log(`folderNameHere('${prefix}')('${key}') => '${pathWithoutPrefix.slice(0, nextSlash)}'`);
    return subPath.slice(0, nextSlash);
  };
}

// eg: ('a/')('a/foo.md') => 'foo.md'
// eg: ('a/')('a/b/c/bar.md') => ''
export function fileNameHere(prefix) {
  return function(key = '') {
    return isFileHere(prefix)(key)
    ? keyWithoutPrefix(prefix, key)
    : '';
  };
}

export function isFolder(url = '') {
  const lastChar = url[url.length - 1];
  return lastChar === '/' || !lastChar; // blank string, undefined
}
