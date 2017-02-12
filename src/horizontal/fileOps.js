import { filter } from 'lodash';
import slug from 'slug';

slug.charmap['.'] = '-';

// ([{name:String}], String) => File
function getFileBySlug(files, targetSlug) {
  const matches = filter(files, file => slug(file.name) === targetSlug );
  if (matches.length > 1) { console.warn("more than one match for `targetSlug`, that's weird", matches); }
  return matches[0];
}

const getLinesFromText = (text) => {
  return text.split(/\r?\n/); // both windows and unix newlines
};

export {
  getFileBySlug,
  getLinesFromText,
  slug as slugify
};
