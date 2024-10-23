import React from 'react';
import { Spin } from 'antd';

function Spinners() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', height:"100vh" }}>
      <Spin />
    </div>
  );
}

export default Spinners;
