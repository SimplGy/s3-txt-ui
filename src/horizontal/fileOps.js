import { filter } from 'lodash';
import slug from 'slug';

slug.charmap['.'] = '_';

const msgAsFile = (name, contents) => ({ name, contents });

// ([{name:String}], String) => File
function findInFilesBySlug(files, targetSlug) {
  if (files.length === 0) { return msgAsFile('...', 'Loading files...'); }
  const matches = filter(files, file => slug(file.name) === targetSlug );
  if (matches.length === 0) {
    console.warn("No file found matching slug `"+ targetSlug +"`");
    return msgAsFile('Not Found', `No file found with name "${targetSlug}"`);
  }
  if (matches.length > 1) { console.warn("more than one match for `targetSlug`, that's weird. Whelp, returning the first one.", matches); }
  return matches[0];
}

// Given who knows what, always return at least a blank string
const strFromAny = (any) => typeof any === 'string' ? any : '';
const toArrayByNewlines = (text) => strFromAny(text).split(/\r?\n/); // both windows and unix newlines
const charCountFromSize = (size) => Math.ceil(size);
const wordCountFromText = (text) => strFromAny(text).split(/\s/).filter(_=>_ !== '').length;

export {
  findInFilesBySlug,
  toArrayByNewlines,
  charCountFromSize,
  wordCountFromText,
  slug as slugify
};
