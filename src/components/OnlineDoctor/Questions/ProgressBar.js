import React from 'react';

const ProgressBar = ({ max, value }) => (
    <div className="progressQuestions">
        <progress max={max} value={value} />
    </div>
);

export default ProgressBar;