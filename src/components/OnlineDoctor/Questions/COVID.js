import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { COVID } from './helpers';
import { GenericHeader } from '../../GeneralComponents/Headers';
import Modal from '../../GeneralComponents/Modal/MobileModal';
import swal from 'sweetalert';
import swalReact from '@sweetalert/with-react'
import covidSymptoms from '../../../config/covidSymptoms.json';
import Buttons from './Buttons';

const Covid = ({ history }) => {
  const [formState, setFormState] = useState([]);

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
    if (res === true) {
      let objeto = COVID(formState);
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
    }
  }

  return (
    <>
      <GenericHeader children='Preguntas' />
      <div className='text-center'>
        <Modal title='COVID-19' hideCloseButton>
          <form className='symptoms' onSubmit={submitSymptoms}>
            <p className="subtitulo-modal">Complete el siguiente cuestionario</p>
            {
              covidSymptoms.map((symp, index) => (
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
            <button type="button" className='btnVolver' onClick={() => history.push('/home')}>Cancelar</button>
          </form>
        </Modal>
      </div>
    </>
  )
}

export default withRouter(Covid)
