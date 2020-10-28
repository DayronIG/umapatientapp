import React from 'react';

const OptionButton = ({ action, text }) => (
    <div className='btn btn-blue-lg mt-1 p-2' onClick={action}>
        {text}
    </div>
);

export default OptionButton;