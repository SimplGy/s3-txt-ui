import AWS from 'aws-sdk';
import { accessKeyId, secretAccessKey, Bucket, region, MaxKeys, Prefix, Delimiter } from '../../.s3cfg';
import { charCountFromSize } from '../fileOps';

AWS.config.region = region;
AWS.config.update({ accessKeyId, secretAccessKey });
const s3 = new AWS.S3({ apiVersion: '2006-03-01', params: { Bucket } });

const toAppFileFromAwsDescriptor = (_ = {}) => ({
  key: _.Key,
  name: _.Key,
  size: _.Size,
  charCount: charCountFromSize(_.Size)
});

const toAppFileFromAwsFile = (_ = {}) => {
  const contents = String(_.Body);
  return { contents };
};

function get(id) {
  return id == null
    ? getAll()
    : getOne(id);
}

function getOne(id) {
  console.log(`getOne(${id})`);
  let willGet = new Promise(function(resolve, reject) {
    const ResponseContentType = 'text/plain';
    s3.getObject({ResponseContentType, Bucket, Key: id}, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
        return;
      }
      console.log('s3.getObject', data);
      resolve(toAppFileFromAwsFile(data));
    });
  });
  return willGet;
}

function getAll() {
  console.log(`getAll()`);
  let willGet = new Promise(function(resolve, reject) {
    s3.listObjects({ MaxKeys, Prefix, Delimiter }, function (err, data) {
      if (err) {
        console.warn(err);
        reject(err);
        return;
      }
      console.log('s3.listObjects', data);
      const fileDescriptors = data.Contents.map(toAppFileFromAwsDescriptor);
      resolve(fileDescriptors);
    });
  });
  return willGet;
}

function save() {}

export default { get, save };
