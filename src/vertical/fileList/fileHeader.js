import React, { Component } from 'react';
import './fileHeader.css';
import {joinUrl, trimSlash} from '../../horizontal/parsing';

const FileHeader = ({name, muted, children}) => {
  return (
    <header className="fileHeader">
      <h1>
        <a href="#/" className="icon">&#128194;</a>
        { !name ? <span className="muted"> Your Files</span> : pathLinksFrom(name)}
      </h1>
      <aside>
        { muted && <small className="muted">{muted}</small> }
        { children && children }
      </aside>
    </header>
  );
};

// TODO: test heck out of
function pathLinksFrom(filename) {
  filename = trimSlash(filename);
  // collect paths from 'aaa/b/foo.md'. eg: ['/','aaa/','aaa/b/']
  let curPath = '';
  const paths = [];
  const parts = filename.split('/');
  const curLocation = parts.pop(); // mutating on purpose
  parts.forEach( part => {
    const path = joinUrl([curPath, part]) + '/';
    paths.push({ part, path });
    curPath = path;
  });
  const pathMarkup = paths.map( ({path, part}) =>
    <span key={path}>
        {' / '}
      <a href={'#' + path}>{part}</a>
    </span>
  );
  return [
    ...pathMarkup,
    <span>{` / ${curLocation}`}</span>
  ];
}

export default FileHeader;
