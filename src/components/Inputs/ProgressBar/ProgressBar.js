import React from 'react';
import "./progress.scss";

const ProgressBar = ({ max, value }) => (
    <div className="progressQuestions">
        <progress max={max} value={value} />
    </div>
);

export default ProgressBar;