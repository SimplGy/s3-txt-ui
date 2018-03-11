This is a demo app for getting to know react.

It displays a list of text files, each of which you can tap to view.

Later maybe I will support some file parsing to detect patterns like todo lists

Then maybe tap to complete/uncomplete tasks

Maybe later support text editing

## Set Up

1. Create an AWS S3 bucket to use as a source of text files. For it to work with this application, you'll have to [configure permissions](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html#getting-started-browser-iam-role) and [enable CORS](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html#getting-started-browser-create-bucket). If you've never used S3 this project might be a bit difficult to set up, but I believe you can do it.
2. Configure the application to point to an s3 bucket that hosts your text files. to do this, create a file `src/.s3cfg.js`. You can use `src/.s3cfg-EXAMPLE.js` as a starting point.

## Start Developing

    npm start

## Todo list

- [x] Add some simple markdown syntax highlighting (that doesn't change char positions) -- tried codemirror via react-md-editor and ace and didn't like either
- [x] First let's grab the url in componentDidMount -> window.location.pathname
- [x] Then we'll turn it in to a meaningful action with urlToAction
- [x] Include Redux
- [x] send redux the url changed action
- [x] turn the action into a useful state
- [x] handle a filename that isn't found
- [x] observe the back/forward buttons and react appropriately
- [x] support reading data from an s3 bucket
- [x] get file details from s3 bucket
- [x] turn `size` into a char count (assuming plain text), and count words
- [x] Show the bucket name you're connected to
- [x] Make the text appear editable and scroll nicely
- [x] If props.file.content != editableText, show a save button. Enable cmd+s for the button
- [x] Have the save button actually persist to the server
- [x] override cmd+s to save on chrome (got ctrl+s to work, but having trouble blocking browser behavior with cmd) -- use `keydown` instead of `keypress`
- [x] Quickly build a functional way to sync a system folder with the s3 bucket (command line npm module?)
- [ ] Try on mobile, fix any layout problems
- [ ] Have clear error messages for missing bucket/key/secret
- [x] CORS must be enabled on the bucket/resource. Have a clear warning on the front end when we detect that this is the problem

## Nice to Have

- [ ] Live refresh the text, mixing in the current user's edits intelligently (2-way-sync challenge)
- [ ] cache file list and file contents on device; if old, greedy-invalidate. if not fresh, lazy-invalidate
- [ ] gui configurable s3 bucket target & key









---

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
