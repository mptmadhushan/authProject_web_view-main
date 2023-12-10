// Modal.js

import React from 'react';
import { css } from '@emotion/react';
import { PropagateLoader } from 'react-spinners';
import modal from './modal.css'

const Modal = ({ show, onCancel }) => {


  return (
    <div className={`modal ${show ? 'show' : ''}`}>
      <div className='box'>
        <p style={{color:'black'}}>Please wait for Biometric login</p>
        <PropagateLoader color="#007BFF" />
        <button onClick={onCancel} className='button'>Cancel</button>
      </div>
    </div>
  );
};

export default Modal;
