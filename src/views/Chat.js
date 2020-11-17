import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import { jsonChat, stepsChat, Chatbot } from '../models/Chatbot';
import { useDispatch, useSelector } from "react-redux";
import Axios from 'axios';
import { flow_tree } from '../config/endpoints';
import { GenericHeader } from '../components/GeneralComponents/Headers';
// import Query from '../components/Query/QueryContainer';
import '../styles/chat/chatPeaceOfMind.scss';
import logoUma from '../assets/icons/icon-168.png';
import { CustomUmaLoader } from '../components/global/Spinner/Loaders';
import swal from 'sweetalert';

const otherFontTheme = {
  background: '#D3EAF4', // Fondo
  botBubbleColor: '#ededed', //Burbuja ia
  userBubbleColor: '#c5daeb', //burbuja user
  botFontColor: '#000',
  userFontColor: '#000',
}
const data = {
  nombre: '',
  edad: '',
  diagnostico: '',
  antecedente: '',
  medicacion: '',
  humor: '',
  contexto: ''
}

const Chat = (props) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.userActive.token)
  const user = useSelector(state => state.queries.patient)
  let { specialty } = props.match.params;
  const [chatbotkey, ] = useState('a');
  const headers = { "Content-Type": "application/json"/* , 'Authorization': token */ }
  const [chatbot, setChatbot] = useState(false)

  useEffect(()=>{
    if (specialty !== '') {
      let payload = {
        "tags":  [
          {
            "field": "specialty",
            "value": specialty, 
            "comparator": "=="
          }, 
          {
            "field": "domain",
            "value": "onboarding", 
            "comparator": "=="
          }
        ]
      }
      //here we get the onboarding chat for the specialty
      Axios.post(flow_tree, payload, headers)
      .then(res => {
        res.data.trees.map(tree => setChatbot(new Chatbot(tree.steps, tree.data)))
      })
      .catch(() => {
        swal('Hubo un error', 'Error al buscar especialista, intente nuevamente', 'error')
        .then(() => props.history.push('/home'));
      })

    } else {
      console.log('aca podria estar el modo sandbox del chatbot, inicia la conversacion y en base a esa secuencia determina cual es el flujo a seguir')
    }
  },[])

  const saveQuery = (tags, domain) => {
    dispatch({ type: 'SAVE_ANSWERS', payload: tags })
    dispatch({ type: 'SAVE_DOMINIO', payload: domain })
    return props.history.replace(`/${user.dni}/appointmentsonline/${specialty}/calendar`)
  }

  const handleChatEnd = (val) => {
    saveQuery(chatbot.tags, chatbot.data.domain)
    // The conditions are because we can decide to redirect to calendar or not
/*     if (chatbot.complete === true && chatbot.tags !== '') {
      return saveQuery(chatbot.tags, chatbot.data.domain)
    }
    if (chatbot.complete === false  && chatbot.tags === '') {
      return props.history.replace(`/${user.dni}/`)
    } */
  }

  const chatProperties = {
    handleEnd: () => handleChatEnd(chatbot),
    className: "chatbotContainer",
    hideHeader: true,
    placeholder: "Escribe un mensaje...", 
    key: chatbotkey,
    steps: chatbot.steps,
    recognitionLang: 'es',
    botAvatar: logoUma,
    style: {
      fontWeight: 'bold',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'between',
      borderRadius: '0px',
      height: '92vh',
    },
    footerStyle: {
      width: '100%',
      position: 'absolute',
      bottom: '18px',
    }
  }

  return (
    <>
      <GenericHeader children="Chat" logo={logoUma} />
      { chatbot.done ?
        <ThemeProvider theme={otherFontTheme}>
          <div className="chatbot__container">
            <ChatBot {...chatProperties} />
          </div>
        </ThemeProvider>
        :
        <CustomUmaLoader />
      }
    </>
  )
};

export default withRouter(Chat);