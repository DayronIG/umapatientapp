import React from 'react'

const SlideItem = ({ slide, setModalOpen, setComponenteJuego }) => {

  const { image, title, description, link, juego } = slide;

  return (
    <div className="slide-body">
      <div className="slide-img">
        <img src={image} alt="slider"/>
      </div>
      <h3 className="slide-title">{title}</h3>
      <p className="slide-description">{description}</p>
      {
        link !== '' && 
        <a href={link} target="_blank" rel="noopener noreferrer" className="slide-link">Seguir enlace</a>
      }
      {
        juego &&
        <button onClick={() => {
          setModalOpen(true);
          setComponenteJuego(juego);
        }} className="slide-link">Jugar</button>
      }
    </div>
  )
}

export default SlideItem
