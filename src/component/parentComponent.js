// parentComponent.js
import React, { useState } from 'react';
import KeyboardLogger from './keyboardLogger';

function parentComponent() {
  const [input, setInput] = useState('');

  return (
    <div>
      <KeyboardLogger setInput={setInput} />
      {/* Other components */}
    </div>
  );
}

export default parentComponent;
