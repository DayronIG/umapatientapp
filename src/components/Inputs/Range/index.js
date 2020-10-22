import React from 'react';

const InputRange = ({ value, action, min, max, unit }) => (
    <div className="form-group">
        <label>{value} {unit}</label>
        <input type="range" className="form-control-range form-control text" min={min} max={max} onChange={action} />
    </div>
);

export default InputRange;