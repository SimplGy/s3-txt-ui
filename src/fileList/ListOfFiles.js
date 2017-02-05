import React, { Component } from 'react';
import './listOfFiles.css';


const OneFile = props => (
  <li className="oneFile">
    <a href="#" onClick={props.action}>{props.file.name}</a>
  </li>
);

class ListOfFiles extends Component {

  constructor() {
    super();
    this.onClickFile = this.onClickFile.bind(this);
  }

  onClickFile(e, file) {
    this.props.selectFile(file);
  }

  render() {
    const rows = this.props.files.map(
      f => <OneFile key={f.name} file={f} action={ e => this.onClickFile(e, f) } />
    );
    return (
      <div className="listOfFiles">
        <h2>Your Files</h2>
        <ul>
          {rows}
        </ul>
      </div>
    );
  }

}

ListOfFiles.propTypes = {
  files: React.PropTypes.array.isRequired
};

ListOfFiles.defaultProps = {
  files: [
    { name: "RV Dweller Blogs.md", contents: "asdf" },
    { name: "recipes.md", contents: "asdf" },
    { name: "Regex Patterns.md", contents: "asdf" },
    { name: "RV Tips.md", contents: "asdf" },
    { name: "RV Upgrades.md", contents: "asdf" },
    { name: "Studying CS and JS Fundamentals.md", contents: "asdf" },
    { name: "To TJ on his mother's artifacts.md", contents: "asdf" },
    { name: "Things I can do offline.md", contents: "asdf" },
    { name: "_To Do.md", contents: `
x Setting Up a Productive React Development Environment
	x add Emmet to atom -- https://gist.github.com/mxstbr/361ddb22057f0a01762240be209321f0
	get emmet and language-babel packages
	add to keymap:
	'atom-text-editor[data-grammar~="jsx"]:not([mini])':
	  'tab': 'emmet:expand-abbreviation-with-tab'
	x get sass going
		npm install -g node-sass
		get the atom plugin
	o add eslint to atom
---
o Continue Abramov's redux course on https://egghead.io

x Make a react app that displays a list of selectable files, show detail when you select
	x List of fake data files
	x interactive file names
	x when a file is clicked, provide that object to a parent component
	x Show file details on click and have a back link
    `
    }
  ]
};

export default ListOfFiles;
