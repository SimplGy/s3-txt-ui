import { filter } from 'lodash';
import slug from 'slug';

slug.charmap['.'] = '_'; // Manual override. Ask slug to replace the dot for us.
const slash = '/';

// Slugify the individual components, but keep the `/` path delimiter
const slugifyPathComponents = (str = '') =>
  str.split(slash).map(part => slug(part)).join(slash);

// Given an array of files (objects with a name property) and a string url to find,
// return the file that's the best match
function findFileByUrl(files, url) {
  if (files.length === 0) { return msgAsFile('...', 'Loading files...'); }
  const matches = filter(files, file => slugifyPathComponents(file.name) === url );
  if (matches.length === 0) {
    console.warn("No file found matching `"+ url +"`");
    return msgAsFile('Not Found', `No file found with name "${url}"`);
  }
  if (matches.length > 1) { console.warn("more than one match for `targetSlug`, that's weird. Whelp, returning the first one.", matches); }
  return matches[0];
}

// TODO: just like above, since slug isn't reversible,
// we need to seek in files for the best fit "folder" prefix for the given url.
//function findFolderByUrl(files, url) {}

// Given who knows what, always return at least a blank string
const strFromAny = (any) => typeof any === 'string' ? any : '';
const msgAsFile = (name, contents) => ({ name, contents });
const toArrayByNewlines = (text) => strFromAny(text).split(/\r?\n/); // both windows and unix newlines
const charCountFromSize = (size) => Math.ceil(size);
const wordCountFromText = (text) => strFromAny(text).split(/\s/).filter(_=>_ !== '').length;

export {
  slugifyPathComponents,
  findFileByUrl,
  toArrayByNewlines,
  charCountFromSize,
  wordCountFromText,
  slug as slugify
};
