import React from 'react';
import './TutorialPage.css';
import tutorialData from './data.json';

export default function TutorialPage() {
  return (
    <div className="tutorial-container">
      <div className="shapes-container">
        {tutorialData.shapes.map((shapeClass, index) => (
          <div key={index} className={`shape ${shapeClass}`}></div>
        ))}
      </div>
      <h1 className="tutorial-brand">{tutorialData.brandName}</h1>
      <button className="begin-btn">{tutorialData.buttonText}</button>
    </div>
  );
}
