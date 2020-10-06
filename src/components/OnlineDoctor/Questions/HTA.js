import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import Modal from '../../GeneralComponents/Modal/MobileModal';
import { HTA } from './helpers';
import { GenericHeader } from '../../GeneralComponents/Headers';
import swal from 'sweetalert';
import swalReact from '@sweetalert/with-react'
import hypertensionSymptomsArr from '../../../config/hypertensionSymptoms.json';
import Buttons from './Buttons';

const Hta = ({ history }) => {

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
    e.preventDefault()
    const res = await swal({
      title: 'Confimación',
      text: 'Por favor, confirme que haya respondido todas las preguntas correctamente.',
      icon: 'warning',
      buttons: { cancel: 'Cancelar', catch: { text: 'Confirmar', value: true } },
    })

    if(res === true) {
      let objeto = HTA(TAS, TAD ,formState);
      await swalReact(
        <div className="text-center">
          <h6 className="font-weight-bold text-primary">Diagnóstico</h6>
          <p>{objeto.diagnostico}</p>

          <h6 className="font-weight-bold text-primary">Destino Final</h6>
          <p>{objeto.destino_final}</p>

          <h6 className="font-weight-bold text-primary">Epicrisis</h6>
          <p>{objeto.epicrisis}</p>
        </div>
      )
      setFormState([]);
      setInputValue({TAS: '', TAD: ''});
    }
  }

  return (

    <>
      <GenericHeader children='Preguntas' />
      <div className='text-center'>
        <Modal title='Hipertensión' hideCloseButton>
          <form className='symptoms' onSubmit={submitSymptoms}>
            <p className="subtitulo-modal">Ingrese preferentemente un registro de las últimas 6hs</p>
            <div className="calamardoKempes">
              <div>
                <p>Sistólica <br />(“la máxima”)<br /> mmHg</p>
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
                <p>Diastólica<br />(“la mínima”)<br />mmHg</p>
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

            <button type='submit' className='btnVolver'>Confirmar síntomas</button>
            <button type="button" className='btnVolver' onClick={() => history.push('/')}>Cancelar</button>
          </form>
        </Modal>
      </div>
    </>
  )
}

export default withRouter(Hta)
