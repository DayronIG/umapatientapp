import React, { useState } from 'react'
import { GenericHeader } from '../GeneralComponents/Headers'
import { FaArrowLeft } from 'react-icons/fa';
import './payComponent.scss';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'

const PayComponent = () => {
  const [state, setState] = useState({
    number: '',
    name: '',
    cvc: '',
    expiry: '',
    focus: ''
  })
  const { number, name, cvc, expiry, focus } = state;

  const handleFocus = e => {
    setState({ ...state, focus: e.target.name });
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

  const submitPayment = () => {
    console.log(name)
    console.log(number)
    console.log(expiry)
    console.log(cvc)
  }

  const properties = {
    placeholders: { name: 'Tu nombre aquí' },
    locale: { valid: 'valido hasta' }
  }

  return (
    <>
      <GenericHeader children="Contratar Servicio" />
      <FaArrowLeft className="flecha-pay" />

      <div className="tarjeta-credito">
        <p className="titulo-card">Servicio a Pagar</p>
        <Cards
          cvc={cvc}
          expiry={expiry}
          focused={focus}
          name={name}
          number={number}
          {...properties}
        />
      </div>
      <form className="formulario-credito">
        <div className="formulario-item">
          <small>Número de la tarjeta</small>
          <input
            type="text"
            name="number"
            maxLength="16"
            placeholder="Número de tarjeta"
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </div>
        
        <div className="formulario-item">
          <small>Nombre</small>
          <input
            type="text"
            name="name"
            maxLength="30"
            placeholder="Nombre"
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </div>

        <div className="formulario-vencimiento">
          <div>
            <small>Vencimiento</small>
            <input
              type="text"
              className=""
              name="expiry"
              maxLength="4"
              placeholder="Expiración"
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </div>
          <div>
            <small>CVC</small>
            <input
              type="text"
              className=""
              name="cvc"
              maxLength="4"
              placeholder="CVC"
              onChange={handleChange}
              onFocus={handleFocus}
            />
          </div>
        </div>

        <button onClick={submitPayment} type="button">Pagar</button>
      </form>
    </>
  )
}

export default PayComponent

/* 
646
44
53
34
35
36
*/