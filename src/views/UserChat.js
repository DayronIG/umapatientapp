import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import Query from '../components/Query/QueryContainer'
import '../styles/chat/chat.scss'
const otherFontTheme = {
	background: '#60778A',
	fontFamily: 'monospace',
	headerBgColor: '#173753',
	headerFontColor: '#fff',
	headerFontSize: '16px',
	botBubbleColor: '#435058',
	botFontColor: '#fff',
	userBubbleColor: '#3F5A71',
	userFontColor: '#4a4a4a',
};
const Chat = (props) => {
	const [chatbotkey, setChatbotkey] = useState('a');
	const [steps, setSteps] = useState([
		{
			id: '0',
			message: 'Estos son los profesionales que se ajustan a ti',
			trigger: 'howDoYouFeel'
		},
		{
			id: 'howDoYouFeel',
			component: <Query />,
			metadata: {
				query: {

						"style": {
							"container":{}
						},
						"outputs": {
							"style": {width: '330px'},
							"outputs": [
								{
									"type": "slidingCard",
									"content": "../../assets/mood.png",
									"options": {
										"min-length": "50",
										"style": {width: '330px', height: '300px'}
									}
								}
							]
						},
						"inputs": {
							"style": {},
							"inputs": [
								
							]
						}
				}
			}
		}
	])

	const updateJson = (data) => {
		console.log(data)
		if (steps === data.jsObject) {
			return
		} else {
			setSteps(data.jsObject)
		}
	}
	return (
		<div className="container">
			<div style={{ height: '100%' }}>
				<ThemeProvider theme={otherFontTheme}>
					<ChatBot key={chatbotkey} customStyle={{height: '300px', flexFlow: 'column', background: '#2C4963'}} style={{ height: '90vh', width: '100vw' }} contentStyle={{ height: 'calc(100% - 110px)', width: '100%' }} steps={steps} />
				</ThemeProvider>
				<button className="reset-button" onClick={e => setChatbotkey(chatbotkey + 'a')}>Reset</button>
			</div>
		</div>
	)
};

export default Chat