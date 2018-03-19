import defaultConfig from '../defaultConfig';
import device from './api/device';

// Metadata about config
//   advanced: Don't show them to the user, by default
//   placeholder: Input form field placeholder text
//   tip: tooltip/help text about the field
export const configMeta = {
  accessKeyId: { placeholder: `eg: AKIAIOSFODNN7EXAMPLE`, tip: `this is a shareable identifier` },
  secretAccessKey: { placeholder: `eg: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`, tip: `this is your secret`, width: 300 },
  Bucket: { placeholder: `eg: 'my-s3-bucket'` },
  region: { placeholder: `eg: 'us-east-1'` },
  MaxKeys: { placeholder: `eg: 1000`, tip: `Number of objects to get in each request.` },
  apiVersion: { advanced: true },
  Delimiter: { advanced: true },
  SignedUrl_Expires: { advanced: true },
  ContentType: { advanced: true },
  Prefix: { advanced: true },
};

export const configHints = {
  MaxKeys: 'The number of objects requested in each list request'
};

function getLocalOverrides() {
  const local = Object.keys(defaultConfig).reduce((acc, key) => {
    const val = device.get(key);
    if (val != null) {
      acc[key] = val;
    }
    return acc;
  }, {});
  return local;
}

// All keys are required (either via defaultConfig or otherwise)
// Returns undefined if there are no errors, or an array of messages if there are
export function validate(cfg) {
  const errs = [];
  for (let key in cfg) {
    if(cfg[key] == null) {
      errs.push(`Error: No value set for '${key}'`);
    }
  }
  errs.forEach(e => console.warn(e));
  return errs.length === 0 ? undefined : errs;
}

export function getConfig() {
  const local = getLocalOverrides();
  const cfg = Object.assign({}, defaultConfig, local);
  return cfg;
}
