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
  const contents = String(_.Body); // Incredibly, this converts a UInt8Array of chars into a String... TODO: reliable? correct?
  return { contents };
};

function get(id) {
  return id == null
    ? getAll()
    : getOne(id);
}

function getOne(id) {
  let willGet = new Promise(function(resolve, reject) {
    const ResponseContentType = 'text/plain';
    s3.getObject({ResponseContentType, Bucket, Key: id}, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err);
        return;
      }
      // console.log('s3.getObject', data);
      resolve(toAppFileFromAwsFile(data));
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

function save() {}


export { Bucket as awsBucket };
export { region as awsRegion };
export default { get, save };
