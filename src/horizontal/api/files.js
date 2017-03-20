import AWS from 'aws-sdk';
import { accessKeyId, secretAccessKey, Bucket, region, MaxKeys, Prefix, Delimiter } from '../../.s3cfg';
import { charCountFromSize } from '../fileOps';

AWS.config.region = region;
AWS.config.update({ accessKeyId, secretAccessKey });
const s3 = new AWS.S3({ apiVersion: '2006-03-01', params: { Bucket } });
const ContentType = 'text/markdown';

const toAppFileFromAwsDescriptor = (_ = {}) => ({
  key: _.Key,
  name: _.Key,
  size: _.Size,
  charCount: charCountFromSize(_.Size)
});

function getAWSInfo() {
  // s3.getBucketAcl({Bucket}, function(err, data) {
  //   if (err) console.warn(err, err.stack); // an error occurred
  //   else     console.info('getBucketAcl', data);           // successful response
  // });
  s3.getBucketCors({Bucket}, function(err, data) {
    if (err) console.warn(err, err.stack); // an error occurred
    else     console.info('AWS Bucket CORS configuration:', data);
  });
}
getAWSInfo();

function get(id) {
  return id == null
    ? getAll()
    : getFileContents(id);
}

function getFileContents(id) {
  let willGet = new Promise(function(resolve, reject) {
    const ResponseContentType = 'text/plain';
    const params = {
      ResponseContentType, Bucket,
      Key: id,
      IfModifiedSince: Date.now(), // don't allow caching. TODO: more complex strategy that knows when our client last modified it? ETags?
    };
    s3.getObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
        return;
      }
      const fileContents = String(data.Body); // Incredibly, this converts a UInt8Array of chars into a String... TODO: reliable? correct?
      resolve(fileContents);
    });
  });
  return willGet;
}

function getAll() {
  let willGet = new Promise(function(resolve, reject) {
    s3.listObjects({ MaxKeys, Prefix, Delimiter }, function (err, data) {
      if (err) {
        console.warn(err);
        reject(err);
        return;
      }
      // console.log('s3.listObjects', data);
      const fileDescriptors = data.Contents.map(toAppFileFromAwsDescriptor);
      resolve(fileDescriptors);
    });
  });
  return willGet;
}

// Given a file object, persist to server.
// Return a promise. Resolve with updated file from server.
function save(id, contents) {
  let willSave = new Promise(function(resolve, reject) {
    if (contents == null) { return reject("You can't save without `contents`"); }
    s3.putObject({ Bucket, ContentType, Key: id, Body: contents }, function(err, data) {
      if (err) {
        console.warn(err);
        reject(err);
        return;
      }
      resolve(contents); // data from AWS is an empty object, so just return the originally saved contents. AWS only succeeds if the save was complete
    });

  });
  return willSave;
}


export { Bucket as awsBucket };
export { region as awsRegion };
export default { get, save };
