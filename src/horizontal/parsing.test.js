
const {
  urlFrom,
  prefixFrom,
  isFileHere,
  fileNameHere,
  folderNameHere,
} = require('./parsing');



describe('urlFrom(s3Key)', () => {
  test(`builds urls for s3Keys at different levels of nesting`, () => {
    expect(urlFrom('foo.md')).toBe('/foo_md');
    expect(urlFrom('a/bar.md')).toBe('/a/bar_md');
    expect(urlFrom('a/b/c/baz.txt')).toBe('/a/b/c/baz_txt');
    expect(urlFrom('a/pickle.md.txt')).toBe('/a/pickle_md_txt');
  });
  test(`given junk input, it returns a slash '/' for the root path`, () => {
    expect(urlFrom(undefined)).toBe('/');
    expect(urlFrom('')).toBe('/');
    expect(urlFrom('   ')).toBe('/');
  });
});



describe('prefixFrom(url)', () => {
  test(`selects a prefix from the given url`, () => {
    expect(prefixFrom('a/')).toBe('a/');
    expect(prefixFrom('a/b/c/')).toBe('a/b/c/');
  });
  test('removes one (and only one) leading `/` slash', () => {
    expect(prefixFrom('/asdf/')).toBe('asdf/');
    expect(prefixFrom('///')).toBe('//');
  });
});



describe('isFileHere(prefix)(key)', () => {
  test('returns true if the file key is a direct child of the prefix', () => {
    expect(isFileHere('/')('/foo.md')).toBe(true);
    expect(isFileHere('a/')('a/foo.md')).toBe(true);
    expect(isFileHere('/a/b/c/bar.txt')('/a/b/c/bar.txt')).toBe(true);
  });
  test(`returns false if the file isn't related`, () => {
    expect(isFileHere('a/')('b/foo.md')).toBe(false);
  });
  test('returns false if the file key is in a deeper subfolder', () => {
    expect(isFileHere('a/')('a/b/foo.md')).toBe(false);
    expect(isFileHere('a/')('a/b/c/bar.md')).toBe(false);
  });
  // TODO: ok to rely on the caller to exclude this?
  // test('ignores the leading slash', () => {
  //   expect(isFileHere('/')('foo.md')).toBe(true);
  // });
});



describe('folderNameHere(prefix)(key)', () => {
  test(`returns top-level folders when there's no prefix`, () => {
    expect(folderNameHere('')('a/foo.md')).toBe('a');
    expect(folderNameHere('')('a/b/c/foo.md')).toBe('a');
  });
  test(`returns a folder when there's a short prefix`, () => {
    expect(folderNameHere('a')('a/b/foo.md')).toBe('b'); // it's ok if you drop the trailing slash
    expect(folderNameHere('a/')('a/b/foo.md')).toBe('b');
  });
  test(`returns a folder when there's a long prefix`, () => {
    expect(folderNameHere('a/b/c/')('a/b/c/d/foo.md')).toBe('d');
  });
  test(`returns an empty string if there isn't a folder`, () => {
    expect(folderNameHere('')('foo.md')).toBe('');

  });
  test(`handles some kinds of junk input, also by returning an empty string`, () => {
    expect(folderNameHere('a')(undefined)).toBe('');
    expect(folderNameHere('')('   ')).toBe('');
  });
});



describe('fileNameHere(prefix)(key)', () => {
  test(`returns the file's name`, () => {
    expect(fileNameHere('')('foo.md')).toBe('foo.md');
    expect(fileNameHere('a/')('a/bar.md')).toBe('bar.md');
    expect(fileNameHere('a/b/c/')('a/b/c/baz.md')).toBe('baz.md');
  });
  test(`returns a blank string if that file isn't here`, () => {
    expect(fileNameHere('')('a/foo.md')).toBe('');
    expect(fileNameHere('a/')('b/bar.md')).toBe('');
    expect(fileNameHere('a/b/c/')('b/bar.md')).toBe('');
    expect(fileNameHere('a/b/')('a/foo.md')).toBe('');
  });
});
