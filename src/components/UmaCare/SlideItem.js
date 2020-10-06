import React from 'react';

const SlideItem = ({ slide }) => {

  const { image, description } = slide;

  return (
    <div className="slide-item">
      <div className="image">
        <img src={image} alt="Tips" />
      </div>
      <div className="description">{description}</div>
    </div>
  )
}

export default SlideItem
