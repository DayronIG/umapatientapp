import React from 'react';

const InputFloat = ({ submit }) => (
    <form onSubmit={submit}>
        <input type='number' className='form-control text' step="0.1" id='inputValue' name='inputValue' />
        <button type='submit' className='btn btn-blue-lg mt-1 p-2'>Enviar</button>
    </form>
);

export default InputFloat;