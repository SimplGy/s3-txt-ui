const {
  findFileByUrl,
  toArrayByNewlines,
  charCountFromSize,
  wordCountFromText,
  slugify,
} = require('./fileOps');



describe('findFileByUrl(files, url)', () => {

  const files = [
    { name: 'foo.md' },
    { name: 'a/b/c/bar.txt' }
  ];

  let originalWarn = console.warn;
  beforeEach(() => { console.warn = ()=>{}; });
  afterEach(()  => { console.warn = originalWarn; });

  test(`finds files in the list`, () => {
    const result = findFileByUrl(files, '/foo_md');
    expect(result.name).toBe('foo.md');
  });
  test(`requires an absolute path`, () => {
    const result = findFileByUrl(files, 'foo_md'); // no leading `/`
    expect(result.name).toBe('Not Found');
  });
  test(`finds files with nested paths`, () => {
    const result = findFileByUrl(files, '/a/b/c/bar_txt');
    expect(result.name).toBe('a/b/c/bar.txt');
  });
  test(`if it doesn't find a file, it still returns a file-shaped object`, () => {
    const result = findFileByUrl(files, 'nonexistent-file');
    expect(result.name).toBe('Not Found');
  });
  test(`if you search for a folder that exists, it does *not* return the file in it.`, () => {
    const result = findFileByUrl(files, 'a/b/c');
    expect(result.name).toBe('Not Found');
  });

});
