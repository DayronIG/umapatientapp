import React from 'react';
import "./progress.scss";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressBar = ({ max, value }) => (
    <div className="progressQuestions">
        {/* <progress max={max} value={value} /> */}
        <CircularProgressbar value={value * 5} text={`${value}`} />
    </div>
);

export default ProgressBar;