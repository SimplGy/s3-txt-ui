import AWS from 'aws-sdk';
import { getConfig } from '../config';
import { charCountFromSize } from '../fileOps';

let s3;

function init() {
  const { region, apiVersion, Bucket, accessKeyId, secretAccessKey } = getConfig();
  AWS.config.region = region;
  AWS.config.update({ accessKeyId, secretAccessKey });
  s3 = new AWS.S3({ apiVersion, params: { Bucket } });

  // as an init step, we check on the cors status.
  return new Promise(function(resolve, reject) {
    s3.getBucketCors({Bucket}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.info('AWS Bucket CORS configuration:', data);
        resolve(data);
      }
    });
  });
}

const toAppFileFromAwsDescriptor = ({ Key, Size } = {}) => ({
  key: Key,
  name: Key,
  size: Size,
  charCount: charCountFromSize(Size)
});

const get = id =>
  id == null
    ? getAll()
    : getFileContents(id);

function getFileContents(id) {
  const { Bucket } = getConfig();
  return new Promise(function(resolve, reject) {
    const ResponseContentType = 'text/plain';
    const params = {
      ResponseContentType,
      Bucket, // needed?
      Key: id,
      IfModifiedSince: Date.now(), // don't allow caching. TODO: more complex strategy that knows when our client last modified it? ETags?
    };
    s3.getObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
        return;
      }
      const fileContents = String(data.Body);
      resolve(fileContents);
    });
  });
}

function getAll() {
  const { MaxKeys, Prefix, Delimiter } = getConfig();
  return new Promise(function(resolve, reject) {
    s3.listObjects({ MaxKeys, Prefix, Delimiter }, function (err, data) {
      if (err) {
        console.warn(err);
        reject(err);
        return;
      }
      const fileDescriptors = data.Contents.map(toAppFileFromAwsDescriptor);
      console.log('s3.listObjects', {data, fileDescriptors});
      resolve(fileDescriptors);
    });
  });
}

// Given a file object, persist to server.
// Return a promise. Resolve with updated file from server.
function save(id, contents) {
  const { Bucket, ContentType } = getConfig();
  return new Promise(function(resolve, reject) {
    if (contents == null) { return reject("You can't save without `contents`"); }
    s3.putObject({
      Bucket, // TODO: needed?
      ContentType, Key: id, Body: contents
    }, function(err, data) {
      if (err) {
        console.warn(err);
        reject(err);
        return;
      }
      resolve(contents); // data from AWS is an empty object, so just return the originally saved contents. AWS only succeeds if the save was complete
    });
  });
}


export default { init, get, save };
