//takes in an array of objects describing inputs, returns the rendered component
import React, { useState, useEffect } from 'react';
import '../../styles/query/queryCard.scss'

const QueryCard = (props) => {
  const selectQuery = () => {

  }
  return (
    <article className="c-card c-card--center">
    
    <header className="c-card__header">
      <img src="https://static.vecteezy.com/system/resources/previews/000/450/909/non_2x/man-meditating-in-nature-and-leaves-concept-illustration-for-yoga-meditation-relax-recreation-healthy-lifestyle-vector-illustration-in-flat-cartoon-style.jpg" className="c-card__image" alt="Card Image" />
    </header>

    <div className="c-card__body">
      <h2 className="c-card__title">
        Respirar
      </h2>
      <p className="c-card__subtitle">
        duracion: 10min
      </p>
      
      <p className="c-card__intro">
        Este es un ejercicio de respiracion que ayuda a relajar la mente y el cuerpo. 
      </p>
    </div>

    <footer className="c-card__footer">
    <button  onClick={props.onClick} className="card-button">
      Ejercitar
    </button>
    </footer>


  </article>
  )
}


export default QueryCard;