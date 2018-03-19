import {numberify} from '../parsing';

const get = key => {
  return numberify(localStorage.getItem(key));
};


const device = {

  // Given a string key and string val, save to localStorage
  // Does some basic validation
  // Does **not** save it if it matches a default
  // Does **not** save it if it matches what's already in storage
  save: ({key, val = ''}, defaults = {}) => {
    val = val.trim();
    // if (val === '') return;
    val = numberify(val);
    if (val === defaults[key]) return;
    if (val === get(key)) return;
    console.log('saveToLocalStorage is saving', {key, val});
    localStorage.setItem(key, val);
    return true;
  },

  get,

};

export default device;
