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


function corsHealthCheck() {
  let will = new Promise(function(resolve, reject) {
    s3.getBucketCors({Bucket}, (err, data) => {
      if (err) {
        console.warn("Error with `s3.getBucketCors()`. Please ensure that CORS enabled for this bucket. See this page for help:\nhttps://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html#how-do-i-enable-cors", err);
        reject(err);
      } else {
        console.info('AWS Bucket CORS configuration:', data);
        resolve(data);
      }
    });
  });
  return will;
}

const get = (id) =>
  id == null
    ? getAll()
    : getFileContents(id);

function getFileContents(id) {
  console.log(`files getFileContents(${id})`);
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
      const fileContents = String(data.Body);
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
export default { get, save, corsHealthCheck };
