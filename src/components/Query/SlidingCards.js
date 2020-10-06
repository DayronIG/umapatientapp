import React, { useState, useEffect } from 'react';
import { CardSlide } from 'react-card-slide/dist';
import '../../../../styles/query/slidingCard.scss'



const SlidingCards = (props) => {
  return (
    <div className="scrolling-wrapper">
    <div className="card">
      <h5>profesional #1</h5>
      <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" /></a>
    </div>
    <div className="card">
      <h5>profesional #2</h5>
      <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" /></a>
    </div>
    <div className="card">
      <h5>profesional #3</h5>
      <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" /></a>
    </div>
    <div className="card">
      <h5>profesional #4</h5>
      <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" /></a>
    </div>
    <div className="card">
      <h5>profesional #5</h5>
      <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" /></a>
    </div>
    <div className="card">
      <h5>profesional #6</h5>
      <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" /></a>
    </div>
    <div className="card">
      <h5>profesional #7</h5>
      <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" /></a>
    </div>
    <div className="card">
      <h5>profesional #8</h5>
      <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" /></a>
    </div>
    <div className="card">
      <h5>profesional #9</h5>
      <a href="https://placeholder.com"><img src="https://via.placeholder.com/200" /></a>
    </div>
  </div>
  )
}


export default SlidingCards;