// This file represents the main UI screen for editing S3 Configuration

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './configure.css';
import defaultConfig from '../../defaultConfig';
import {getConfig, configMeta} from '../../horizontal/config';
import device from '../../horizontal/api/device';
import router from '../../horizontal/router';

const EditableField = ({key, val}) => {
  const meta = configMeta[key] || {};
  return (
    <p key={key}>
      <label htmlFor={key} title={meta.tip}>
        {key}
      </label>
      <input type="text"
             id={key} ref={key}
             defaultValue={val}
             title={meta.tip}
             placeholder={meta.placeholder}
             style={meta.width ? {width: `${meta.width}px`} : {}} />
    </p>
  );
};



class Configure extends Component {

  state = {
    notifs: []
  };

  handleSubmit = () => {
    const refs = this.refs;
    let saved = [];
    Object.keys(refs).forEach(key => {
      const val = refs[key].value;
      const did = device.save({key, val}, defaultConfig);
      if (did) saved.push(key);
    });
    if (saved.length > 0) {
      this.setState({notifs: [...this.state.notifs, `saved: ${saved.join(', ')}`]});
      setTimeout(() => {
        this.setState({notifs: this.state.notifs.slice(1)});
      }, 3000);
    }
    // Refresh the data connection and go to the list screen if everything is ok
    this.props.refresh().then(()=>{
      console.log('did refresh successfuly');
      router.go.list();
    }).catch(()=>{}); // intentionally ignore. api handles errors suitably.
  };

  render() {
    const cfg = getConfig();
    const fields = Object.keys(cfg)
      .filter(key => !(configMeta[key] || {}).advanced)
      .map(key => ({key, val: cfg[key]}))
      .map(EditableField);

    return (
      <div>
        <header>
          <h1 className="col2">Configuration</h1>
          <p className="col2 muted sm">
            All fields are required.<br/>
            You can find <code>accessKeyId</code> and <code>secretAccessKey</code> in your AWS console.<br/>
            For your security, this information is only saved to your device. It's never sent to our servers.
          </p>
        </header>

        <form onSubmit={this.handleSubmit}>
          <fieldset>
            { fields }
          </fieldset>
          <input className="col2 saveBtn" type="submit" value="Save" />
        </form>

        { this.state.notifs.map( (str, idx) =>
          <p className="col2 muted sm" key={idx}>{str}</p>
        )}

      </div>
    );
  }
}


Configure.propTypes = {
  refresh: PropTypes.func.isRequired // Learned: the isRequired is a bit silly in combination with defaultProps, since the warning never gets sent. But it does express intent.
};

Configure.defaultProps = {
  refresh: ()=>{}
};

export default Configure;
