export default {
  accessKeyId: undefined,     // Do *not* set these keys here. If you do, your keys will get built into code.
  secretAccessKey: undefined, // ...They are included as empty keys to tell the form builder that they are required
  Bucket: undefined,          // ...Configure these via the UI
  region: 'us-east-1',
  Prefix: '',
  // Delimiter: '/',
    // This isn't supported
    // Why? If you pass a delimeter, `s3.listObjects` will *not* return "subfolders" beyond that delimiter.
    // This app works by requesting all your files, then doing all the operations on the client side.
    // Maybe later we'll support more on-demand/partial api requests like this.
  MaxKeys: 1000, // How many objects will retrive (include folders and items)
  SignedUrl_Expires: 900, //This is the default value for expires getSignedUrl
  ContentType: 'text/markdown',
  apiVersion: '2006-03-01',
};
