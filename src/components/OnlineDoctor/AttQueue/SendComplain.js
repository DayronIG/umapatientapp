import React, { useState } from 'react';
import swalReact from '@sweetalert/with-react';

const SendComplain = ({ sendComplain }) => {
  const [claim, setClaim] = useState('');

  const onSubmitButton = () => {
    if (!claim.trim()) {
      swalReact(
        <div className="text-center">
          <h5>No puede enviar un reclamo vacío</h5>   
        </div>
      )
      return;
    }
    sendComplain(claim);
  }

  return (
    <div className='detail-modal-content'>
      <textarea placeholder='Escriba aquí el motivo de su reclamo' onChange={(e) => setClaim(e.target.value)}></textarea>
      <button className='btn btn-blue-lg' onClick={onSubmitButton}>Enviar reclamo</button>
    </div>
  )
}

export default SendComplain;