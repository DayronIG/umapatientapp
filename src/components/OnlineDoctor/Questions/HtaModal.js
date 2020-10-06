import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HTA } from './helpers';
import hypertensionSymptomsArr from '../../../config/hypertensionSymptoms.json';
import Buttons from './Buttons';

const HtaModal = ({ history, unsetModal, setResponseIA }) => {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState([]);
  const [inputValue, setInputValue] = useState({
    TAS: '',
    TAD: '',
  })
  const { TAS, TAD } = inputValue;

  const handleChange = (event, label) => {
    let helper = [...formState]
    if (event === true) {
      helper.push(label)
      if (!formState.includes(label)) return setFormState(helper)
    } else {
      helper = formState.filter(item => item !== label && item)
      return setFormState(helper)
    }
  }

  const submitSymptoms = async e => {
    e.preventDefault();

    setResponseIA(HTA(TAS, TAD ,formState));
    let answers = [];
    if(formState.length > 0) {
      answers = formState.reduce((prev, actual) => !!prev && `${prev}. `.concat(actual)).concat('. ')
    }

    dispatch({ type: 'SAVE_ANSWERS', payload: answers });
    unsetModal();
    setFormState([]);
    setInputValue({TAS: '', TAD: ''});
  }

  return (
  <form className='symptoms' onSubmit={submitSymptoms}>
    <p className="subtitulo-modal">Ingrese preferentemente un registro de las últimas 6hs</p>
    <div className="calamardoKempes">
      <div>
        <p>Sistólica</p>
        <p>(“la máxima”)</p>
        <p>mmHg</p>
      </div>
      <input
        onChange={e => {
          if(e.target.value.length > 3) e.target.value = e.target.value.slice(0, 3);
          setInputValue({...inputValue, TAS: e.target.value})
        }}
        className="input-hta" type="number" placeholder="120" value={TAS}
      />
    </div>
    <div className="calamardoKempes">
      <div>
        <p>Diastólica</p>
        <p>(“la mínima”)</p>
        <p>mmHg</p>
      </div>
      <input
        onChange={e => {
          if(e.target.value.length > 3) e.target.value = e.target.value.slice(0, 3);
          setInputValue({...inputValue, TAD: e.target.value})
        }}
        className="input-hta" type="number" placeholder="80" value={TAD}
      />
    </div>
    {
      hypertensionSymptomsArr.map((symp, index) => (
        <div className='symptoms__container' key={index}>
          <div className='symptoms__container--question'>
            {symp.front}
          </div>

          <div className='symptoms__container--buttons'>
            <Buttons handleChange={handleChange} symp={symp} />
          </div>
        </div>
      ))
    }
    <button type='submit' className='btnVolver'>
      Confirmar síntomas
    </button>
    <button type="button" className='btnVolver' onClick={() => {
      unsetModal();
      history.push('/');
    }}
    >Cancelar</button>
  </form>
)
}

export default withRouter(HtaModal)
