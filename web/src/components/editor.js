'use client';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-min-noconflict/ext-searchbox';

export default function Editor({ readOnly, marginColumn, value, onChange }) {
  const name = readOnly ? 'readonly' : 'editor';

  return (
    <AceEditor
      mode="python"
      theme="tomorrow_night"
      className="w-full"
      width=""
      height=""
      name={name}
      readOnly={readOnly}
      value={value}
      onChange={onChange}
      setOptions={{ printMarginColumn: marginColumn }}
      editorProps={{ $blockScrolling: true }}
    />
  );
}
