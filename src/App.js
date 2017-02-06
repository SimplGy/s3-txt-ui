import React, { Component } from 'react';
import ListOfFiles from './vertical/fileList/ListOfFiles';
import FullScreenFile from './vertical/fileList/FullScreenFile';

class App extends Component {

  constructor() {
    super();
    this.onFileSelected = this.onFileSelected.bind(this);
    this.state = {
      selectedFile: null
    };
  }

  onFileSelected(file) {
    console.log("onFileSelected. this:", this);
    this.setState({ selectedFile: file });
  }

  componentWillUpdate(nextProps, nextState) {
    console.log("App componentWillUpdate", { nextProps, nextState })
  }

  render() {
    let currentScreen;
    const file = this.state.selectedFile;
    currentScreen = file == null
      ? <ListOfFiles selectFile={this.onFileSelected} />
      : <FullScreenFile file={file} backAction={()=>this.onFileSelected(null)} />

    return (
      <div className="App">
        { currentScreen }
      </div>
    );
  }
}

export default App;
