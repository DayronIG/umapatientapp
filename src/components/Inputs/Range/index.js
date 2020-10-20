import React from 'react';

const InputRange = ({ value, action }) => (
    <div className="form-group">
        <label>{value}</label>
        <input type="range" className="form-control-range form-control text" min="30" max="200" onChange={action} />
    </div>
);

export default InputRange;