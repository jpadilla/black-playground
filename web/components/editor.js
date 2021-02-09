import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

export default class Editor extends Component {
  render() {
    let name = this.props.readOnly ? 'readonly' : 'editor';
    return (
      <AceEditor
        mode="python"
        theme="tomorrow_night"
        className="w-full"
        width=""
        height=""
        name={name}
        readOnly={this.props.readOnly}
        value={this.props.value}
        onChange={this.props.onChange}
        editorProps={{ $blockScrolling: true }}
      />
    );
  }
}

Editor.propTypes = {
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func
};

Editor.defaultProps = {
  value: '',
  readOnly: false,
  onChange: null
};
