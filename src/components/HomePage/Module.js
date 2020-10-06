import React from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';

const Module = (props) => {
  return (
    <>
      {props.enabled ?
        <div className={'module-button ' + props.styles}>
          <Link to={`${props.link}`} className={'module-name'}>
            {props.children}
          </Link>
        </div> :
        <div className='module-button disabled-module'>
          <div className={'module-name'} onClick={() => swal('Aviso', 'No tienes acceso a este módulo.', 'warning')}>
            {props.children}
          </div>
        </div>
      }
    </>)
}

export default Module