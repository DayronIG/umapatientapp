import React from 'react'
import Query from '../components/Query/QueryContainer'
import Message from '../components/Query/Message'
import { SlidingCards } from '../components/Query/Outputs/components/Index';

export class Chatbot {
    constructor(steps, data = {}) {
        this.components = { Message, Query, SlidingCards };
        this.complete = false
        this.data = data
        this.done = false
        this.tags = ''
        this.saveQuery = (val, id, nextStep) => {
            this.complete = true
            this.tags = `${this.data.domain}`
            return nextStep
        }

        this.triggerSaveData = (val, id, nextStep) => {
            this.data[id] = val.value
            return nextStep
        }

        this.setTags = (tag) => {
            if (data['tags']) data['tags'] = data['tags'] + '. ' + tag
            else data['tags'] = tag
        }

        this.ageParams = (val) => {
            if (isNaN(val)) {
                return 'En numeros por favor';
            } else if (val < 0) {
                return 'El valor tiene que ser positivo';
            } else if (val > 120) {
                return `${val}?! Dale, enserio?!?!`;
            }

            return true;
        }

        this.heightValidator = (val) => {
            if (isNaN(val)) {
                return 'En numeros por favor';
            } else if (val < 0) {
                return 'El valor tiene que ser positivo';
            }

            return true;
        }

        this.weightValidator = (val) => {
            if (isNaN(val)) {
                return 'En numeros por favor';
            } else if (val < 0) {
                return 'El valor tiene que ser positivo';
            }

            return true;
        }

        this.steps = steps.map((step, index) => {
            if (index == steps.length - 1) {
                this.done = true
            }
            if (step.options && step.options instanceof Array) {
                step.options = step.options.map(option => {
                    if (option.trigger && option.trigger.method) {
                        let method = option.trigger.method
                        let params = option.trigger.params
                        let nextStep = option.trigger.nextStep
                        let value = option.trigger.value || null
                        option['trigger'] = (val) => {
                            if (value !== null) val = value
                            return this[method](val, params, nextStep)
                        }
                    }
                    return option
                })
                return step
            }
            if (step.validator && typeof (step.validator) === 'string') {
                let method = step['validator']
                console.log(method)
                step['validator'] = (val) => this[method](val)
            }
            if (step.metadata) {
                if (step['metadata'].query) {
                    step.metadata = step.metadata
                } else {
                    let key = step['metadata']
                    step['metadata'] = this[key]
                }
            }
            if (step.component && typeof (step.component) === 'string') {
                //console.log(step)
                if (step.component.indexOf('@') > -1) {
                    let component = step['component'].substring(
                        step['component'].lastIndexOf("@"),
                        step['component'].lastIndexOf("#") + 1
                    )
                    let params = step['component'].split('@')[1]
                    const ChatComponent = this.components[component]
                    //console.log(ChatComponent)
                    step['component'] = <ChatComponent params={params} data={this.data}></ChatComponent>
                }
                else {
                    const ChatComponent = this.components[step['component']]
                    //console.log(ChatComponent)
                    step['component'] = <ChatComponent data={this.data}></ChatComponent>
                }
            }
            if (step.trigger && step.trigger.method) {
                let method = step.trigger.method
                let params = step.trigger.params
                let nextStep = step.trigger.nextStep
                let value = step.trigger.value || null
                step['trigger'] = (val) => {
                    if (value !== null) val = value
                    return this[method](val, params, nextStep)
                }
            }
            return step
        });
    }
}

export const jsonChat = [
    {
        "id": "0",
        "message": "Hola, soy ÜMA! ¿Cómo te sientes hoy?",
        "trigger": "estado"
    },
    {
        "id": "estado",
        "options": [
            {
                "value": "me siento bien",
                "label": "me siento bien",
                "trigger": "1"
            },
            {
                "value": "no tan bien",
                "label": "no tan bien",
                "trigger": "2"
            },
            {
                "value": "mal",
                "label": "mal",
                "trigger": "3"
            }
        ]
    },
    {
        "id": "1",
        "message": "Que genial que te sientas bien, de igual manera mi objetivo es ayudarte a encontrar el profesional más adecuado para ti, para que pueda trabajar contigo y ayudarte a superar aquello que te preocupa",
        "trigger": "optionsgenial"
    },
    {
        "id": "optionsgenial",
        "options": [
            {
                "value": "genial",
                "label": "Genial, gracias UMA quiero mas informacion de cómo vas a ayudarme",
                "trigger": "informacion"
            }
        ]
    },
    {
        "id": "2",
        "message": "Mi objetivo es ayudarte a sentirte mejor con un profesional que sea el mas adecuado para ti, para que pueda trabajar contigo y ayudarte a  superar aquello que te preocupa",
        "trigger": "optionsdeacuerdo"
    },
    {
        "id": "optionsdeacuerdo",
        "options": [
            {
                "value": "deacuerdo",
                "label": "De acuerdo, gracias UMA quiero mas informacion de cómo vas a ayudarme",
                "trigger": "informacion"
            }
        ]
    },
    {
        "id": "3",
        "message": "Puedes contar conmigo... Mi objetivo es ayudarte a encontrar el profesional más adecuado para ti, para que pueda trabajar contigo y ayudarte a superar aquello que te preocupa",
        "trigger": "optionsgracias"
    },
    {
        "id": "optionsgracias",
        "options": [
            {
                "value": "gracias",
                "label": "gracias UMA quiero mas informacion de cómo vas a ayudarme",
                "trigger": "informacion"
            }
        ]
    },
    {
        "id": "informacion",
        "message": "Es un placer para mi poder ayudarte, te explicaré cómo funciona ÜMA y  en caso de que te interese unirte al servicio, te haré una serie de preguntas que me permitirán asignarte al especialista más adecuado para ti.",
        "trigger": "optionssi"
    },
    {
        "id": "optionssi",
        "options": [
            {
                "value": "si",
                "label": "Si. ¡Adelante!",
                "trigger": "asknombre"
            }
        ]
    },
    {
        "id": "asknombre",
        "message": "Como te llamas?",
        "trigger": "nombre"
    },
    {
        "id": "nombre",
        "user": true,
        "trigger": {
            method: "triggerSaveData",
            params: "nombre",
            nextStep: "lindo"
        }
    },
    {
        "id": "lindo",
        "message": "Que lindo nombre {previousValue}!",
        "trigger": "optionsnombre"
    },
    {
        "id": "optionsnombre",
        "options": [
            {
                "value": "gracias",
                "label": "Gracias!",
                "trigger": "genero"
            }
        ],
    },
    {
        "id": "genero",
        "message": "¿Puedes contarnos con qué  género te sientes más identificado?",
        "trigger": "optionsgenero"
    },
    {
        "id": "optionsgenero",
        "options": [
            {
                "value": "mujer",
                "label": "Mujer",
                "trigger": {
                    method: "triggerSaveData",
                    params: "genero",
                    value: "F",
                    nextStep: "askedad"
                }
            },
            {
                "value": "hombre",
                "label": "Hombre",
                "trigger": {
                    method: "triggerSaveData",
                    params: "genero",
                    value: "M",
                    nextStep: "askedad"
                }
            },
            {
                "value": "otro",
                "label": "Otro",
                "trigger": {
                    method: "triggerSaveData",
                    params: "genero",
                    value: "OTHER",
                    nextStep: "askedad"
                }
            }
        ]
    },
    {
        "id": "askedad",
        "message": "Cuantos años tienes?",
        "trigger": "edad"
    },
    {
        "id": "edad",
        "user": true,
        "trigger": {
            method: "triggerSaveData",
            params: "edad",
            nextStep: "tipoproblema"
        }
    },
    {
        "id": "tipoproblema",
        "message": "Para poder ayudarte quisiera que me indiques qué área te gustaría que trabajemos",
        "trigger": "t1"
    },
    {
        "id": "t1",
        "message": "Por favor selecciona una de las siguientes opciones",
        "trigger": "t1optiones"
    },
    {
        id: 't1',
        message: 'Por favor selecciona una de las siguientes opciones',
        trigger: 't1optiones'
    },
    {
        id: 't1optiones',
        options: [{
            value: 'pareja',
            label: 'Pareja',
            trigger: 'parejaid'
        },
        {
            value: 'sexualidad',
            label: 'Sexualidad',
            trigger: 'Sexualidadid'
        },
        {
            value: 'social/familiar',
            label: 'Social / Familiar',
            trigger: 'social/familiarid'
        },
        {
            value: 'desarrollolaboral/profesional/academico',
            label: 'Desarrollo laboral / Profesional / Académico',
            trigger: 'dpaid'
        },
        {
            value: 'autoestima/desarrollopersonal',
            label: 'Autoestima / Desarrollo Personal',
            trigger: 'adid'
        },
        {
            value: 'depresion/duelo',
            label: 'Depresion / Duelo',
            trigger: 'ddid'
        },
        {
            value: 'ansiedad/estres/ataquedepanico',
            label: 'Ansiedad / Estrés / Ataque de pánico',
            trigger: 'aeaid'
        },
        {
            value: 'adicciones',
            label: 'Adicciones',
            trigger: 'adiccionesid'
        },
        {
            value: 'coaching',
            label: 'Coaching',
            trigger: 'coachingid'
        }
        ]
    },
    {
        "id": "parejaid",
        "delay": 1500,
        "asMessage": true,
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Esta bien ${nombre}. Es posible que estés aquí porque tu relación está atravesando una crisis, se ha roto o te resulta muy difícil encontrar una pareja. En cualquier caso, podemos acompañarte para que puedas enfocar bien tus objetivos. En ÜMA podemos ayudarte gracias a profesionales expertos en temas de pareja, podrás trabajar sobre lo que te preocupa y sentirte mejor",
        "trigger": "p1"
    },
    {
        "id": "p1",
        "message": "Antes de seguir. ¿Acudirás sólo o en pareja?",
        "trigger": "p1options"
    },
    {
        "id": "p1options",
        "options": [
            {
                "value": "pareja",
                "label": "pareja",
                "trigger": {
                    method: "triggerSaveData",
                    params: "domain",
                    value: "coaching",
                    nextStep: "p2"
                }
            },
            {
                "value": "solo",
                "label": "solo",
                "trigger": {
                    method: "triggerSaveData",
                    params: "domain",
                    value: "coaching",
                    nextStep: "p2"
                }
            }
        ]
    },
    {
        "id": "p2",
        "message": "Con cuáles de estas situaciones te sientes más identificado ? Dificultades en: ",
        "trigger": "p2options"
    },
    {
        "id": "p2options",
        "hideInput": true,
        "replace": true,
        "component": 'Query',
        "waitAction": true,
        "metadata": {
            "query": {
                "style": {
                },
                "outputs": {
                    "style": {},
                    "outputs": [
                    ]
                },
                "inputs": {
                    "style": "col-6",
                    "inputs": [
                        {
                            "type": "search",
                            "style": {},
                            "options": {
                                "items": ["Comunicación", "Infidelidad", "Sexualidad", "Convivencia"],
                                "option_id": "firebase id for this option",
                                "styles": {}
                            }
                        }
                    ]
                }
            }
        },
        "trigger": {
            method: 'triggerSaveData',
            params: 'domain',
            nextStep: 'p3'
        }
    },
    {
        "id": "p3",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre}, ¿Te gustaría que te cuente cómo funcionamos?",
        "trigger": "p3options"
    },
    {
        "id": "p3options",
        "options": [
            {
                "value": "claro!",
                "label": "claro!",
                "trigger": "final"
            }
        ]
    },
    {
        "id": "Sexualidadid",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Esta bien, ${nombre} los problemas de tipo sexual son mucho más comunes de lo que crees, pero en ocasiones se siente demasiado pudor, para dar el paso y pedir ayuda con las estrategias adecuadas, podrás disfrutar de la sexualidad plenamente.",
        "trigger": "s1"
    },
    {
        "id": "s1",
        "message": "En UMA, gracias a profesionales expertos en sexología, podrás trabajar sobre lo que te preocupa y sentirte mejor",
        "trigger": "s2"
    },
    {
        "id": "s2",
        "message": "Cuales de estas situaciones te sientes más identificado ? Dificultades en: ",
        "trigger": "s2optiones"
    },
    {
        "id": "s2optiones",
        "hideInput": true,
        "replace": true,
        "component": 'Query',
        "waitAction": true,
        "metadata": {
            "query": {
                "style": {
                },
                "outputs": {
                    "style": {},
                    "outputs": [
                    ]
                },
                "inputs": {
                    "style": "col-6",
                    "inputs": [
                        {
                            "type": "search",
                            "style": {},
                            "options": {
                                "items": ["Impotencia", "Falta del deseo sexual", "Dificultad Orgásmica", "Otro"],
                                "option_id": "firebase id for this option",
                                "styles": {}
                            }
                        }
                    ]
                }
            }
        },
        "trigger": {
            method: 'triggerSaveData',
            params: 'domain',
            nextStep: 'f3'
        }
    },
    {
        "id": "s3",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre}, ¿Quieres que te cuente cómo funcionamos?",
        "trigger": "s3options"
    },
    {
        "id": "s3options",
        "options": [
            {
                "value": "claro",
                "label": "Claro",
                "trigger": "final"
            }
        ]
    },
    {
        "id": "social/familiarid",
        "message": "Esta bien, ${nombre} Suelen surgir conflictos con nuestros amigos y familiares.",
        "trigger": "f1"
    },
    {
        "id": "f1",
        "message": "En UMA, gracias a profesionales expertos en temas socio-familiares, podrás trabajar sobre lo que te preocupa y sentirte mejor.",
        "trigger": "f2"
    },
    {
        "id": "f2",
        "message": "Cuales de estas situaciones te sientes más identificado ? Dificultades con: ",
        "trigger": "f2options"
    },
    {
        "id": "f2options",
        "hideInput": true,
        "replace": true,
        "component": 'Query',
        "waitAction": true,
        "metadata": {
            "query": {

                "style": {
                },
                "outputs": {
                    "style": {},
                    "outputs": [
                    ]
                },
                "inputs": {
                    "style": "col-6",
                    "inputs": [
                        {
                            "type": "search",
                            "style": {},
                            "options": {
                                "items": ["Familia", "Amigos", "Entorno", "Otro"],
                                "option_id": "firebase id for this option",
                                "styles": {}
                            }
                        }
                    ]
                }
            }
        },
        "trigger": {
            method: 'triggerSaveData',
            params: 'domain',
            nextStep: 'f3'
        }
    },
    {
        "id": "f3",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre}, ¿ Quieres que te cuento cómo funcionamos?",
        "trigger": "f3options"
    },
    {
        "id": "f3options",
        "options": [
            {
                "value": "claro",
                "label": "Claro",
                "trigger": "final"
            }
        ]
    },
    {
        "id": "dpaid",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Es normal, ${nombre} que en ocasiones el ritmo de trabajo, la falta de él, las relaciones con los compañeros o la sensación no saber cuál es tu camino, generen desmotivación o ansiedad",
        "trigger": "dp1"
    },
    {
        "id": "dp1",
        "message": "En UMA, gracias a profesionales expertos en temas laborales y académicos, podrás trabajar sobre lo que te preocupa y sentirte mejor",
        "trigger": "dp2"
    },
    {
        "id": "dp2",
        "message": "Cuales de estas situaciones te sientes más identificado ? Dificultades con: ",
        "trigger": "dp2options"
    },
    {
        "id": "dp2options",
        "hideInput": true,
        "replace": true,
        "component": 'Query',
        "waitAction": true,
        "metadata": {
            "query": {

                "style": {
                },
                "outputs": {
                    "style": {},
                    "outputs": [
                    ]
                },
                "inputs": {
                    "style": "col-6",
                    "inputs": [
                        {
                            "type": "search",
                            "style": {},
                            "options": {
                                "items": ["Orientación vocacional", "Psicotécnico", "Reinserción laboral", "Coaching", "Acoso laboral", "Estrés laboral", "otro"],
                                "option_id": "firebase id for this option",
                                "styles": {}
                            }
                        }
                    ]
                }
            }
        },
        "trigger": {
            method: 'triggerSaveData',
            params: 'domain',
            nextStep: 'dp3'
        }
    },
    {
        "id": "dp3",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre}, ¿ Quieres que te cuento cómo funcionamos?",
        "trigger": "dp3options"
    },
    {
        "id": "dp3options",
        "options": [
            {
                "value": "claro",
                "label": "Claro",
                "trigger": "final"
            }
        ]
    },
    {
        "id": "adid",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Esta bien, ${nombre} El paso principal para alcanzar tu mejor versión es conocerte y aceptarte. Potenciar tus fortalezas y trabajar tus defectos, te hará ganar en seguridad y en bienestar",
        "trigger": "ad1"
    },
    {
        "id": "ad1",
        "message": "En UMA, gracias a profesionales expertos en desarrollo personal, podrás trabajar sobre lo que te preocupa y sentirte mejor.",
        "trigger": "ad2"
    },
    {
        "id": "ad2",
        "message": "Qué te gustaría trabajar de tí mismo ?",
        "trigger": "ad2options",
    },
    {
        "id": "ad2options",
        "hideInput": true,
        "replace": true,
        "component": 'Query',
        "waitAction": true,
        "metadata": {
            "query": {

                "style": {
                },
                "outputs": {
                    "style": {},
                    "outputs": [
                    ]
                },
                "inputs": {
                    "style": "col-6",
                    "inputs": [
                        {
                            "type": "search",
                            "style": {},
                            "options": {
                                "items": ["Habilidades Sociales", "Inteligencia Emocional", "Autoestima", "Liderazgo", "Otro"],
                                "option_id": "firebase id for this option",
                                "styles": {}
                            }
                        }
                    ]
                }
            }
        },
        "trigger": {
            method: 'triggerSaveData',
            params: 'domain',
            nextStep: 'ad3'
        }
    },
    {
        "id": "ad3",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre}, ¿ Quieres que te cuento cómo funcionamos?",
        "trigger": "ad3options"
    },
    {
        "id": "ad3options",
        "options": [
            {
                "value": "claro",
                "label": "Claro",
                "trigger": "final"
            }
        ]
    },
    {
        "id": "ddid",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Lo siento mucho, ${nombre} toda pérdida o dificultad que se nos presenta implica un gran cambio en nosotros. Adaptarse a la nueva situación y gestionar los sentimientos que aparecen no es sencillo",
        "trigger": "dd1"
    },
    {
        "id": "dd1",
        "message": "En UMA, gracias a profesionales expertos en procesos de duelo y depresión, podrás trabajar sobre lo que te preocupa y sentirte mejor.",
        "trigger": "dd2"
    },
    {
        "id": "dd2",
        "message": "Con cuál de estas sensaciones te sientes más identificado ?",
        "trigger": "dd2options"
    },
    {
        "id": "dd2options",
        "hideInput": true,
        "replace": true,
        "component": 'Query',
        "waitAction": true,
        "metadata": {
            "query": {

                "style": {
                },
                "outputs": {
                    "style": {},
                    "outputs": [
                    ]
                },
                "inputs": {
                    "style": "col-6",
                    "inputs": [
                        {
                            "type": "search",
                            "style": {},
                            "options": {
                                "items": ["Pérdida", "Tristeza", "Miedo", "Sensación de duelo", "Depresión", "Otro"],
                                "option_id": "firebase id for this option",
                                "styles": {}
                            }
                        }
                    ]
                }
            }
        },
        "trigger": {
            method: 'triggerSaveData',
            params: 'domain',
            nextStep: 'dd3'
        }
    },
    {
        "id": "dd3",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre}, ¿ Quieres que te cuento cómo funcionamos?",
        "trigger": "dd3options"
    },
    {
        "id": "dd3options",
        "options": [
            {
                "value": "claro",
                "label": "Claro",
                "trigger": "final"
            }
        ]
    },
    {
        "id": "aeaid",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Te entiendo, ${nombre} La ansiedad y el estrés lleva consigo una serie de síntomas que generan miedo y mucho malestar, pero debes saber que conociendo las herramientas adecuadas podrás conseguir mantener el control",
        "trigger": "ae1"
    },
    {
        "id": "ae1",
        "message": "En ÜMA, gracias a profesionales expertos en ansiedad, podrás trabajar sobre lo que te preocupa y sentirte mejor",
        "trigger": "ae2"
    },
    {
        "id": "ae2",
        "message": "Con cuál de estas sensaciones te sientes más identificado ?",
        "trigger": "ae2options"
    },
    {
        "id": "ae2options",
        "hideInput": true,
        "replace": true,
        "component": 'Query',
        "waitAction": true,
        "metadata": {
            "query": {

                "style": {
                },
                "outputs": {
                    "style": {},
                    "outputs": [
                    ]
                },
                "inputs": {
                    "style": "col-6",
                    "inputs": [
                        {
                            "type": "search",
                            "style": {},
                            "options": {
                                "items": ["Nerviosismo, agitación o tensión", "Peligro inminente, pánico o catástrofe", "Aumento del ritmo cardíaco", "Respiración acelerada (hiperventilación)", "Sudaración", "Temblores", "Sensación de debilidad o cansancio", "Otro"],
                                "option_id": "firebase id for this option",
                                "styles": {}
                            }
                        }
                    ]
                }
            }
        },
        "trigger": {
            method: 'triggerSaveData',
            params: 'domain',
            nextStep: 'ae3'
        }
    },
    {
        "id": "ae3",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre}, ¿ Quieres que te cuento cómo funcionamos?",
        "trigger": "ae3options"
    },
    {
        "id": "ae3options",
        "options": [
            {
                "value": "claro",
                "label": "Claro",
                "trigger": "final"
            }
        ]
    },
    {
        "id": "final",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre},  Te cuento como seguiremos : Te brindaremos una lista de profesionales para que puedas pedir un turno con nuestros profesionales",
        "trigger": "finalQ"
    },
    {
        "id": "finalQ",
        "options": [
            {
                "value": "meparecebien",
                "label": "Me parece bien",
                "trigger": {
                    method: 'saveQuery',
                    params: 'data',
                    nextStep: 'end'
                },

            },
            {
                "value": "loseguirepensando",
                "label": "Lo seguiré pensando",
                "trigger": "end"
            }
        ]
    },
    {
        "id": "end",
        "message": "genial!",
        "end": true,
    },
    {
        "id": "adiccionesid",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Te entiendo, ${nombre}. Las adicciones son difíciles de atravesar sin un apoyo de un profesional.",
        "trigger": "adi1"
    },
    {
        "id": "adi1",
        "message": "En ÜMA, gracias a profesionales expertos en adicciones, podrás trabajar sobre lo que te preocupa y sentirte mejor",
        "trigger": "adi2"
    },
    {
        "id": "adi2",
        "message": "¿Qué tipo de adicción te gustaría tratar con el especialista? ",
        "trigger": "adi2options"
    },
    {
        "id": "adi2options",
        "hideInput": true,
        "replace": true,
        "component": 'Query',
        "waitAction": true,
        "metadata": {
            "query": {

                "style": {
                },
                "outputs": {
                    "style": {},
                    "outputs": [
                    ]
                },
                "inputs": {
                    "style": "col-6",
                    "inputs": [
                        {
                            "type": "search",
                            "style": {},
                            "options": {
                                "items": ['Ciberadicción', 'Alcoholismo', 'Adicción', 'Drogadicción', 'Tabaquismo', 'Ludopatía', 'Otro'],
                                "option_id": "firebase id for this option",
                                "styles": {}
                            }
                        }
                    ]
                }
            }
        },
        "trigger": {
            method: 'triggerSaveData',
            params: 'domain',
            nextStep: 'adi3'
        }
    },
    {
        "id": "adi3",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre}, ¿ Quieres que te cuento cómo funcionamos?",
        "trigger": "adi3options"
    },
    {
        "id": "adi3options",
        "options": [
            {
                "value": "claro",
                "label": "Claro",
                "trigger": "final"
            }
        ]
    },
    {
        "id": "coachingid",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@${nombre}. quiero contarte primero qué es el Coaching . La palabra Coaching  procede del verbo inglés to coach «entrenar», es un método que consiste en acompañar, instruir o entrenar a una persona o a un grupo de ellas, con el objetivo de conseguir cumplir metas o desarrollar habilidades específicas.",
        "trigger": "coa1"
    },
    {
        "id": "coa1",
        "message": "En ÜMA, gracias a profesionales expertos en Coaching, podrás trabajar sobre lo que te preocupa y sentirte mejor",
        "trigger": "coa2"
    },
    {
        "id": "coa2",
        "message": "Descubriendo los beneficios del Coaching: ¿Qué aspectos de tu vida crees que te gustaría trabajar?",
        "trigger": "coa2options"
    },
    {
        "id": "coa2options",
        "hideInput": true,
        "replace": true,
        "component": 'Query',
        "waitAction": true,
        "metadata": {
            "query": {

                "style": {
                },
                "outputs": {
                    "style": {},
                    "outputs": [
                    ]
                },
                "inputs": {
                    "style": "col-6",
                    "inputs": [
                        {
                            "type": "search",
                            "style": {},
                            "options": {
                                "items": ["Ayudar a definir objetivos", "Más creatividad", "Mayor flexibilidad y adaptabilidad al cambio", "Mejora de las relaciones", "Empoderamiento", "Reducir el estrés y ayuda para gestionar el tiempo", "Motivación", "Bienestar", "Otro"],
                                "option_id": "firebase id for this option",
                                "styles": {}
                            }
                        }
                    ]
                }
            }
        },
        "trigger": {
            method: 'triggerSaveData',
            params: 'domain',
            nextStep: 'coa3'
        }
    },
    {
        "id": "coa3",
        "delay": 1500,
        "asMessage": true,
        "component": "#Message@Gracias ${nombre}, ¿ Quieres que te cuento cómo funcionamos?",
        "trigger": "coa3options"
    },
    {
        "id": "coa3options",
        "options": [
            {
                "value": "claro",
                "label": "Claro",
                "trigger": "final"
            }
        ]
    }
]

// este es el flujo de nutricion
export const jsonChatNutri = [{
  "id": "0",
  "message": "Hola, soy ÜMA! tu asistente nutricional!",
  "trigger": "holaUma"
},
{
  "id": "holaUma",
  "options": [
    {
      "value": "Hola ÜMA!",
      "label": "Hola ÜMA!",
      "trigger": "start"
    }
  ]
},
{
  "id": "start",
  "message": "El primer paso en nuestro viaje es encontrar el profesional adecuado para ti.",
  "trigger": "start_1"
},
{
  "id": "start_1",
  "delay": 1500,
  "message": "Para ello voy a hacerte unas preguntas, solo tomara unos minutos",
  "trigger": "start_accept"
},
{
  "id": "start_accept",
  "options": [
    {
      "value": "Ok!",
      "label": "Ok!",
      "trigger": "ask_height"
    },
    {
      "value": "Adelante!",
      "label": "Adelante!",
      "trigger": "ask_height"
    }
  ]
},
{
  "id": "ask_height",
  "delay": 2000,
  "message": "Cuál es tu estatura?",
  "trigger": "ask_height_response"
},
{
  "id": "ask_height_response",
  "user": true,
  "validator": "heightValidator",
  "placeholder": 'en centimetros por favor!',
  "trigger": {
    method: 'triggerSaveData',
    params: 'height',
    nextStep: 'ask_weight'
  }
},
{
  "id": "ask_weight",
  "delay": 1500,
  "message": "Cuál es tu peso?",
  "trigger": "ask_weight_response"
},
{
  "id": "ask_weight_response",
  "user": true,
  "placeholder": 'en kilos por favor!',
  "validator": "weightValidator",
  "trigger": {
    method: 'triggerSaveData',
    params: 'weight',
    nextStep: 'question_1'
  }
},
{
  "id": "question_1",
  "delay": 2500,
  "message": "Cómo describirias tu nivel de actividad fisica?",
  "trigger": "question_1_options"
},
{
  "id": "question_1_options",
  "options": [
    {
      "value": "Sedentario",
      "label": "Sedentario",
      "trigger": {
        method: 'triggerSaveData',
        params: 'actividadNivel',
        value: true,
        nextStep: 'question_2'
      }
    },
    {
      "value": "Moderado",
      "label": "Moderado",
      "trigger": {
        method: 'triggerSaveData',
        params: 'actividadNivel',
        value: true,
        nextStep: 'question_2'
      }
    },
    {
      "value": "Activo",
      "label": "Activo",
      "trigger": {
        method: 'triggerSaveData',
        params: 'actividadNivel',
        value: true,
        nextStep: 'question_2'
      }
    },
    {
      "value": "Atleta",
      "label": "Atleta",
      "trigger": {
        method: 'triggerSaveData',
        params: 'actividadNivel',
        value: true,
        nextStep: 'question_2'
      }
    }
  ]
},
{
  "id": "question_2",
  "delay": 1500,
  "message": "Cuál es tu objetivo?",
  "trigger": "question_2_options"
},
{
  "id": "question_2_options",
  "options": [
    {
      "value": "Quemar grasa",
      "label": "Quemar grasa",
      "trigger": {
        method: 'triggerSaveData',
        params: 'objetivo',
        value: 'Quemar grasa',
        nextStep: 'question_3'
      }
    },
    {
      "value": "Mantener peso",
      "label": "Mantener peso",
      "trigger": {
        method: 'triggerSaveData',
        params: 'objetivo',
        value: 'Mantener peso',
        nextStep: 'question_3'
      }
    },
    {
      "value": "Ganar músculo",
      "label": "Ganar músculo",
      "trigger": {
        method: 'triggerSaveData',
        params: 'objetivo',
        value: 'Ganar músculo',
        nextStep: 'question_3'
      }
    },
    {
      "value": "Cambiar mi dieta",
      "label": "Cambiar mi dieta",
      "trigger": {
        method: 'triggerSaveData',
        params: 'objetivo',
        value: 'Cambiar mi dieta',
        nextStep: 'question_3'
      }
    }
  ]
},
{
  "id": "question_3",
  "delay": 1500,
  "message": "Tienes algún diagnostico previo?",
  "trigger": "question_3_options"
},
{
  "id": "question_3_options",
  "options": [
    {
      "value": "si",
      "label": "si",
      "trigger": "question_3_which_condition"
    },
    {
      "value": "no",
      "label": "no",
      "trigger": {
        method: 'triggerSaveData',
        params: 'antecedente',
        value: false,
        nextStep: 'question_4'
      }
    }
  ]
},
{
    "id": "question_3_which_condition",
    "hideInput": true,
    "replace": true,
    "waitAction": true,
    "delay": 2500,
    "hideInput": true,
    "component": "Query",
    "metadata": {
      "query": {
        "style": {
        },
        "outputs": {
          "style": {},
          "outputs": [
            {
              "type": "text",
              "style": {},
              "options": {
                "text": "Cual?",
                "option_id": "firebase id for this option",
                "styles": {}
              }
            }
          ]
        },
        "inputs": {
          "style": "col-6",
          "inputs": [
            {
              "type": "search",
              "style": {},
              "options": {
                "items": ['diabetes', 'hipertension', 'celiaquia', 'gastritis', 'enfermedad inflamatoria intestinal'],
                "option_id": "firebase id for this option",
                "style": {
                  background: '#b0e4f1',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  color: '#fff',
                  fontFamily: 'helvetica',
                  textTransform: 'capitalize',
                  fontSize: '0.8rem'
                }
              }
            }
          ]
        }
      }
    },
    "trigger": {
      method: 'triggerSaveData',
      params: 'diagnostico',
      nextStep: 'question_3_another'
    }
  },
  {
    "id": "question_3_another",
    "delay": 1500,
    "message": "Tienes algún otro diagnostico previo?",
    "trigger": "question_3_another_options"
  },
  {
    "id": "question_3_another_options",
    "options": [
      {
        "value": "si",
        "label": "si",
        "trigger": "question_3_which_condition"
      },
      {
        "value": "no",
        "label": "no",
        "trigger": 'question_4'
      }
    ]
  },
  {
      "id": "question_4",
      "delay": 1500,
      "message": "Sigues alguna dieta?",
      "trigger": "question_4_options"
    },
    {
      "id": "question_4_options",
      "options": [
        {
          "value": "si",
          "label": "si",
          "trigger": "question_4_which_diet_input"
        },
        {
          "value": "no",
          "label": "no",
          "trigger": {
            method: 'triggerSaveData',
            params: 'diet',
            value: false,
            nextStep: 'question_5'
          }
        }
      ]
    },
    {
      "id": "question_4_which_diet_input",
      "hideInput": true,
      "replace": true,
      "component": 'Query',
      "waitAction": true,
      "metadata": {
        "query": {
    
          "style": {
          },
          "outputs": {
            "style": {},
            "outputs": [
            ]
          },
          "inputs": {
            "style": "col-6",
            "inputs": [
              {
                "type": "search",
                "style": {},
                "options": {
                  "items": ['vegano', 'vegetariano', 'paleolitica', 'gerentologia', 'otro plan de dieta'],
                  "option_id": "firebase id for this option",
                  "styles": {}
                }
              }
            ]
          }
        }
      },
      "trigger": {
        method: 'triggerSaveData',
        params: 'medicacion',
        nextStep: 'fin'
      }
    },
    {
      "id": "fin",
      "delay": 1500,
      "message": "Gracias por responder mis preguntas!",
      "trigger": "fin2"
    },
    {
      "id": "fin2",
      "delay": 1500,
      "message": "a continuacion, te dirigire a nuestro listado de especialistas",
      "trigger": "fin2options"
    },
    {
      "id": "fin2options",
      "options": [
        {
          "value": "Gracias ÜMA!",
          "label": "Gracias ÜMA!",
          "trigger": "question_3_which_condition"
        }
      ]
    },
]

export const jsonChatPSICOGABI = [{
  "id": "0",
  "message": "Hola, soy ÜMA!",
  "trigger": "holaUma"
},
{
  "id": "holaUma",
  "options": [
    {
      "value": "Hola ÜMA",
      "label": "Hola ÜMA",
      "trigger": "nombreUser"
    }
  ]
},
{
  "id": "nombreUser",
  "message": "Como te llamas?",
  "trigger": "nombre"
},
{
  "id": "nombre",
  "user": true,
  "trigger": {
    method: 'triggerSaveData',
    params: 'nombre',
    nextStep: 'lindo'
  }
},
{
  "id": "lindo",
  "message": "{previousValue}! Que lindo nombre!",
  "trigger": "edadUser"
},
{
  "id": "edadUser",
  "message": "Cuantos años tienes?",
  "trigger": "edad"
},
{
  "id": "edad",
  "user": true,
  validator: "ageParams",
  "trigger": {
    method: 'triggerSaveData',
    params: 'edad',
    nextStep: 'presentacion'
  },
  "metadata": 'data'
},
{
  "id": "presentacion",
  "asMessage": true,
  "component": "#Message@Entonces ${nombre}, Soy UMA tu asistente emocional. Periodicamente te preguntare sobre tu estado de animo, y claro esta,siempre que me necesites, estoy a un click de distancia!",
  "trigger": "aceptarPresentacion"
},
{
  "id": "presentacionBot",
  "delay": 2000,
  "message": "No soy un humano, pero de alguna forma si lo soy!",
  "trigger": "presentacionProf"
},
{
  "id": "aceptarPresentacion",
  "options": [
    {
      "value": "Ok...",
      "label": "Ok...",
      "trigger": "presentacionBot"
    },
    {
      "value": "Genial",
      "label": "Genial",
      "trigger": "presentacionBot"
    }
  ]
},
{
  "id": "presentacionProf",
  "delay": 4000,
  "message": "El primer paso en nuestro viaje es encontrar el profesional mas adecuado para ti",
  "trigger": "aceptarViaje"
},
{
  "id": "aceptarViaje",
  "options": [
    {
      "value": "Ok!",
      "label": "Ok!",
      "trigger": "presentacionPreguntas"
    }
  ]
},
{
  "id": "presentacionPreguntas",
  "delay": 2000,
  "message": "Pero ahora bien, Hablemos de ti. te voy a hacer unas preguntas solo tomara 3 minutos.",
  "trigger": "question_1"
},
{
  "id": "question_1",
  "delay": 2500,
  "message": "actualmente estas haciendo terapia con un profesional?",
  "trigger": "question_1_options"
},
{
  "id": "question_1_options",
  "options": [
    {
      "value": "si",
      "label": "si",
      "trigger": {
        method: 'triggerSaveData',
        params: 'terapia',
        value: true,
        nextStep: 'question_2'
      }
    },
    {
      "value": "no",
      "label": "no",
      "trigger": {
        method: 'triggerSaveData',
        params: 'terapia',
        value: false,
        nextStep: 'question_2'
      }
    }
  ]
},
{
  "id": "question_2",
  "delay": 1500,
  "message": "actualmente tienes alguna condicion mental diagnosticada por un profesional?",
  "trigger": "question_2_options"
},
{
  "id": "question_2_options",
  "options": [
    {
      "value": "si",
      "label": "si",
      "trigger": "question_2_which_condition"
    },
    {
      "value": "no",
      "label": "no",
      "trigger": {
        method: 'triggerSaveData',
        params: 'terapia',
        value: false,
        nextStep: 'question_3'
      }
    }
  ]
},
{
  "id": "question_2_which_condition",
  "hideInput": true,
  "replace": true,
  "waitAction": true,
  "delay": 2500,
  "hideInput": true,
  "component": "Query",
  "metadata": {
    "query": {
      "style": {
      },
      "outputs": {
        "style": {},
        "outputs": [
          {
            "type": "text",
            "style": {},
            "options": {
              "text": "Cual?",
              "option_id": "firebase id for this option",
              "styles": {}
            }
          }
        ]
      },
      "inputs": {
        "style": "col-6",
        "inputs": [
          {
            "type": "search",
            "style": {},
            "options": {
              "items": ['depresion', 'ansiedad', 'agorafobia', 'psicosis', 'adiccion'],
              "option_id": "firebase id for this option",
              "styles": {}
            }
          }
        ]
      }
    }
  },
  "trigger": {
    method: 'triggerSaveData',
    params: 'diagnostico',
    nextStep: 'question_3'
  }
},
{
  "id": "question_3",
  "delay": 1500,
  "asMessage": true,
  "component": "#Message@Alguna vez fuiste diagnosticado con una condicion mental por un profesional?",
  "trigger": "question_3_options"
},
{
  "id": "question_3_options",
  "options": [
    {
      "value": "si",
      "label": "si",
      "trigger": "question_3_which_condition"
    },
    {
      "value": "no",
      "label": "no",
      "trigger": {
        method: 'triggerSaveData',
        params: 'antecedente',
        value: 'false',
        nextStep: 'question_4'
      }
    }
  ]
},
{
  "id": "question_3_which_condition",
  "delay": 1500,
  "message": "Cual?",
  "trigger": "question_3_which_condition_input"
},
{
  "id": "question_3_which_condition_input",
  "hideInput": true,
  "replace": true,
  "component": 'Query',
  "waitAction": true,
  "metadata": {
    "query": {

      "style": {
      },
      "outputs": {
        "style": {},
        "outputs": [
        ]
      },
      "inputs": {
        "style": "col-6",
        "inputs": [
          {
            "type": "search",
            "style": {},
            "options": {
              "items": ['depresion', 'ansiedad', 'agorafobia', 'psicosis', 'adiccion'],
              "option_id": "firebase id for this option",
              "styles": {}
            }
          }
        ]
      }
    }
  },
  "trigger": {
    method: 'triggerSaveData',
    params: 'antecedente',
    nextStep: 'question_4'
  }
},
{
  "id": "question_4",
  "delay": 1500,
  "asMessage": true,
  "component": "#Message@Estas tomando algun tipo de medicacion para una condicion mental?",
  "trigger": "question_4_options"
},
{
  "id": "question_4_options",
  "options": [
    {
      "value": "si",
      "label": "si",
      "trigger": "question_4_which_medication_input"
    },
    {
      "value": "no",
      "label": "no",
      "trigger": {
        method: 'triggerSaveData',
        params: 'medicacion',
        nextStep: 'question_5'
      }
    }
  ]
},
{
  "id": "question_4_which_medication_input",
  "hideInput": true,
  "replace": true,
  "component": 'Query',
  "waitAction": true,
  "metadata": {
    "query": {

      "style": {
      },
      "outputs": {
        "style": {},
        "outputs": [
        ]
      },
      "inputs": {
        "style": "col-6",
        "inputs": [
          {
            "type": "search",
            "style": {},
            "options": {
              "items": ['clonazepam', 'rivotril', 'prozac', 'lexapro'],
              "option_id": "firebase id for this option",
              "styles": {}
            }
          }
        ]
      }
    }
  },
  "trigger": {
    method: 'triggerSaveData',
    params: 'medicacion',
    nextStep: 'question_5'
  }
},
{
  "id": "question_5",
  "delay": 1500,
  "message": "Como caracterizarias tu humor estas ultimas 2 semanas?",
  "trigger": "question_5_query"
},
{
  "id": "question_5_query",
  "hideInput": true,
  "replace": true,
  "component": 'Query',
  "waitAction": true,
  "metadata": {
    "query": {

      "style": {
      },
      "outputs": {
        "style": {},
        "outputs": [
        ]
      },
      "inputs": {
        "style": "col-6",
        "inputs": [
          {
            "type": "search",
            "style": {},
            "options": {
              "items": ['alegre', 'contento', 'conforme', 'calmo', 'frustrado', 'enojado', 'ansioso', 'depresivo'],
              "option_id": "firebase id for this option",
              "styles": {}
            }
          }
        ]
      }
    }
  },
  "trigger": {
    method: 'triggerSaveData',
    params: 'humor',
    nextStep: 'question_6'
  }
},
{
  "id": "question_6",
  "delay": 1500,
  "message": "Cual dirias que es la causa de este sentimiento?",
  "trigger": "question_6_query"
},
{
  "id": "question_6_query",
  "hideInput": true,
  "replace": true,
  "component": 'Query',
  "waitAction": true,
  "metadata": {
    "query": {

      "style": {
      },
      "outputs": {
        "style": {},
        "outputs": [
          {
            "type": "text",
            "style": {},
            "options": {
              "text": "selecciona cuantas opciones quieras",
              "option_id": "firebase id for this option",
              "styles": {}
            }
          }
        ]
      },
      "inputs": {
        "style": "col-6",
        "inputs": [
          {
            "type": "search",
            "style": {},
            "options": {
              "items": ['trabajo', 'estudio', 'pareja', 'social', 'familia', 'autoestima', 'duelo', 'adiccion', 'LGBT',],
              "option_id": "firebase id for this option",
              "styles": {}
            }
          }
        ]
      }
    }
  },
  "trigger": {
    method: 'triggerSaveData',
    params: 'domain',
    nextStep: 'interlude_1'
  }
},
{
  "id": "interlude_1",
  "delay": 1000,
  "message": "Gracias por responder mis preguntas, se que puede ser dificil. Pero ya diste el primer paso y quizas el mas importante en un camino que transitaremos juntos.",
  "trigger": "interlude_2"
},
{
  "id": "interlude_2",
  "delay": 3000,
  "message": " Estos son los profesionales que creo que pueden ayudarnos.",
  "trigger": {
    method: 'saveQuery',
    params: 'data',
    nextStep: 'choose_professional'
  } 
},
{
  "id": "choose_professional",
  "hideInput": true,
  "delay": 2000,
  "replace": true,
  "component": 'SlidingCards',
  "waitAction": true,
  "metadata": {
    "query": {
      "style": {
      },
      "outputs": {
        "style": {},
        "outputs": [
          {
            "type": "slidingCard",
            "style": {},
            "options": {
              "text": 'asdsadfdsa',
              "option_id": "firebase id for this option",
              "styles": {}
            }
          }
        ]
      },
      "inputs": {
        "style": "col-6",
        "inputs": [

        ]
      }
    }
  },
  "trigger": ""
}
]

export const jsonChatPOL = [{
  "id": "0",
  "component": "Query",
  "metadata": {
    "query": {
      "style": {
      },
      "outputs": {
        "style": {},
        "outputs": [
          {
            "type": "text",
            "style": {},
            "options": {
              "text": "Cual?",
              "option_id": "firebase id for this option",
              "styles": {}
            }
          }
        ]
      },
      "inputs": {
        "style": "col-6",
        "inputs": [
          {
            "type": "camera",
            "style": {},
            "options": {
            }
          }
        ]
      }
    }
  },
  "trigger": {
    method: 'triggerSaveData',
    params: 'diagnostico',
    nextStep: ''
  }
}]


// export const jsonChat = [{
//   "id": "0",
//   "message": "Hola, soy ÜMA!",
//   "trigger": "holaUma"
// },
// {
//   "id": "holaUma",
//   "options": [
//     {
//       "value": "Hola ÜMA",
//       "label": "Hola ÜMA",
//       "trigger": "nombreUser"
//     }
//   ]
// },
// {
//   "id": "nombreUser",
//   "message": "Como te llamas?",
//   "trigger": "nombre"
// },
// {
//   "id": "nombre",
//   "user": true,
//   "trigger": {
//     method: 'triggerSaveData',
//     params: 'nombre',
//     nextStep: 'lindo'
//   }
// },
// {
//   "id": "lindo",
//   "message": "{previousValue}! Que lindo nombre!",
//   "trigger": "edadUser"
// },
// {
//   "id": "edadUser",
//   "message": "Cuantos años tienes?",
//   "trigger": "edad"
// },
// {
//   "id": "edad",
//   "user": true,
//   validator: "ageParams",
//   "trigger": {
//     method: 'triggerSaveData',
//     params: 'edad',
//     nextStep: 'presentacion'
//   },
//   "metadata": 'data'
// },
// {
//   "id": "presentacion",
//   "asMessage": true,
//   "component": "#Message@Entonces ${nombre}, Soy UMA tu asistente emocional. Periodicamente te preguntare sobre tu estado de animo, y claro esta,siempre que me necesites, estoy a un click de distancia!",
//   "trigger": "aceptarPresentacion"
// },
// {
//   "id": "presentacionBot",
//   "delay": 2000,
//   "message": "No soy un humano, pero de alguna forma si lo soy!",
//   "trigger": "presentacionProf"
// },
// {
//   "id": "aceptarPresentacion",
//   "options": [
//     {
//       "value": "Ok...",
//       "label": "Ok...",
//       "trigger": "presentacionBot"
//     },
//     {
//       "value": "Genial",
//       "label": "Genial",
//       "trigger": "presentacionBot"
//     }
//   ]
// },
// {
//   "id": "presentacionProf",
//   "delay": 4000,
//   "message": "El primer paso en nuestro viaje es encontrar el profesional mas adecuado para ti",
//   "trigger": "aceptarViaje"
// },
// {
//   "id": "aceptarViaje",
//   "options": [
//     {
//       "value": "Ok!",
//       "label": "Ok!",
//       "trigger": "presentacionPreguntas"
//     }
//   ]
// },
// {
//   "id": "presentacionPreguntas",
//   "delay": 2000,
//   "message": "Pero ahora bien, Hablemos de ti. te voy a hacer unas preguntas solo tomara 3 minutos.",
//   "trigger": "question_1"
// },
// {
//   "id": "question_1",
//   "delay": 2500,
//   "message": "actualmente estas haciendo terapia con un profesional?",
//   "trigger": "question_1_options"
// },
// {
//   "id": "question_1_options",
//   "options": [
//     {
//       "value": "si",
//       "label": "si",
//       "trigger": {
//         method: 'triggerSaveData',
//         params: 'terapia',
//         value: true,
//         nextStep: 'question_2'
//       }
//     },
//     {
//       "value": "no",
//       "label": "no",
//       "trigger": {
//         method: 'triggerSaveData',
//         params: 'terapia',
//         value: false,
//         nextStep: 'question_2'
//       }
//     }
//   ]
// },
// {
//   "id": "question_2",
//   "delay": 1500,
//   "message": "actualmente tienes alguna condicion mental diagnosticada por un profesional?",
//   "trigger": "question_2_options"
// },
// {
//   "id": "question_2_options",
//   "options": [
//     {
//       "value": "si",
//       "label": "si",
//       "trigger": "question_2_which_condition"
//     },
//     {
//       "value": "no",
//       "label": "no",
//       "trigger": {
//         method: 'triggerSaveData',
//         params: 'terapia',
//         value: false,
//         nextStep: 'question_3'
//       }
//     }
//   ]
// },
// {
//   "id": "question_2_which_condition",
//   "hideInput": true,
//   "replace": true,
//   "waitAction": true,
//   "delay": 2500,
//   "hideInput": true,
//   "component": "Query",
//   "metadata": {
//     "query": {
//       "style": {
//       },
//       "outputs": {
//         "style": {},
//         "outputs": [
//           {
//             "type": "text",
//             "style": {},
//             "options": {
//               "text": "Cual?",
//               "option_id": "firebase id for this option",
//               "styles": {}
//             }
//           }
//         ]
//       },
//       "inputs": {
//         "style": "col-6",
//         "inputs": [
//           {
//             "type": "search",
//             "style": {},
//             "options": {
//               "items": ['depresion', 'ansiedad', 'agorafobia', 'psicosis', 'adiccion'],
//               "option_id": "firebase id for this option",
//               "styles": {}
//             }
//           }
//         ]
//       }
//     }
//   },
//   "trigger": {
//     method: 'triggerSaveData',
//     params: 'diagnostico',
//     nextStep: 'question_3'
//   }
// },
// {
//   "id": "question_3",
//   "delay": 1500,
//   "asMessage": true,
//   "component": "#Message@Alguna vez fuiste diagnosticado con una condicion mental por un profesional?",
//   "trigger": "question_3_options"
// },
// {
//   "id": "question_3_options",
//   "options": [
//     {
//       "value": "si",
//       "label": "si",
//       "trigger": "question_3_which_condition"
//     },
//     {
//       "value": "no",
//       "label": "no",
//       "trigger": {
//         method: 'triggerSaveData',
//         params: 'antecedente',
//         value: 'false',
//         nextStep: 'question_4'
//       }
//     }
//   ]
// },
// {
//   "id": "question_3_which_condition",
//   "delay": 1500,
//   "message": "Cual?",
//   "trigger": "question_3_which_condition_input"
// },
// {
//   "id": "question_3_which_condition_input",
//   "hideInput": true,
//   "replace": true,
//   "component": 'Query',
//   "waitAction": true,
//   "metadata": {
//     "query": {

//       "style": {
//       },
//       "outputs": {
//         "style": {},
//         "outputs": [
//         ]
//       },
//       "inputs": {
//         "style": "col-6",
//         "inputs": [
//           {
//             "type": "search",
//             "style": {},
//             "options": {
//               "items": ['depresion', 'ansiedad', 'agorafobia', 'psicosis', 'adiccion'],
//               "option_id": "firebase id for this option",
//               "styles": {}
//             }
//           }
//         ]
//       }
//     }
//   },
//   "trigger": {
//     method: 'triggerSaveData',
//     params: 'antecedente',
//     nextStep: 'question_4'
//   }
// },
// {
//   "id": "question_4",
//   "delay": 1500,
//   "asMessage": true,
//   "component": "#Message@Estas tomando algun tipo de medicacion para una condicion mental?",
//   "trigger": "question_4_options"
// },
// {
//   "id": "question_4_options",
//   "options": [
//     {
//       "value": "si",
//       "label": "si",
//       "trigger": "question_4_which_medication_input"
//     },
//     {
//       "value": "no",
//       "label": "no",
//       "trigger": {
//         method: 'triggerSaveData',
//         params: 'medicacion',
//         nextStep: 'question_5'
//       }
//     }
//   ]
// },
// {
//   "id": "question_4_which_medication_input",
//   "hideInput": true,
//   "replace": true,
//   "component": 'Query',
//   "waitAction": true,
//   "metadata": {
//     "query": {

//       "style": {
//       },
//       "outputs": {
//         "style": {},
//         "outputs": [
//         ]
//       },
//       "inputs": {
//         "style": "col-6",
//         "inputs": [
//           {
//             "type": "search",
//             "style": {},
//             "options": {
//               "items": ['clonazepam', 'rivotril', 'prozac', 'lexapro'],
//               "option_id": "firebase id for this option",
//               "styles": {}
//             }
//           }
//         ]
//       }
//     }
//   },
//   "trigger": {
//     method: 'triggerSaveData',
//     params: 'medicacion',
//     nextStep: 'question_5'
//   }
// },
// {
//   "id": "question_5",
//   "delay": 1500,
//   "message": "Como caracterizarias tu humor estas ultimas 2 semanas?",
//   "trigger": "question_5_query"
// },
// {
//   "id": "question_5_query",
//   "hideInput": true,
//   "replace": true,
//   "component": 'Query',
//   "waitAction": true,
//   "metadata": {
//     "query": {

//       "style": {
//       },
//       "outputs": {
//         "style": {},
//         "outputs": [
//         ]
//       },
//       "inputs": {
//         "style": "col-6",
//         "inputs": [
//           {
//             "type": "search",
//             "style": {},
//             "options": {
//               "items": ['alegre', 'contento', 'conforme', 'calmo', 'frustrado', 'enojado', 'ansioso', 'depresivo'],
//               "option_id": "firebase id for this option",
//               "styles": {}
//             }
//           }
//         ]
//       }
//     }
//   },
//   "trigger": {
//     method: 'triggerSaveData',
//     params: 'humor',
//     nextStep: 'question_6'
//   }
// },
// {
//   "id": "question_6",
//   "delay": 1500,
//   "message": "Cual dirias que es la causa de este sentimiento?",
//   "trigger": "question_6_query"
// },
// {
//   "id": "question_6_query",
//   "hideInput": true,
//   "replace": true,
//   "component": 'Query',
//   "waitAction": true,
//   "metadata": {
//     "query": {

//       "style": {
//       },
//       "outputs": {
//         "style": {},
//         "outputs": [
//           {
//             "type": "text",
//             "style": {},
//             "options": {
//               "text": "selecciona cuantas opciones quieras",
//               "option_id": "firebase id for this option",
//               "styles": {}
//             }
//           }
//         ]
//       },
//       "inputs": {
//         "style": "col-6",
//         "inputs": [
//           {
//             "type": "search",
//             "style": {},
//             "options": {
//               "items": ['trabajo', 'estudio', 'pareja', 'social', 'familia', 'autoestima', 'duelo', 'adiccion', 'LGBT',],
//               "option_id": "firebase id for this option",
//               "styles": {}
//             }
//           }
//         ]
//       }
//     }
//   },
//   "trigger": {
//     method: 'triggerSaveData',
//     params: 'domain',
//     nextStep: 'interlude_1'
//   }
// },
// {
//   "id": "interlude_1",
//   "delay": 1000,
//   "message": "Gracias por responder mis preguntas, se que puede ser dificil. Pero ya diste el primer paso y quizas el mas importante en un camino que transitaremos juntos.",
//   "trigger": "interlude_2"
// },
// {
//   "id": "interlude_2",
//   "delay": 3000,
//   "message": " Estos son los profesionales que creo que pueden ayudarnos.",
//   "trigger": {
//     method: 'saveQuery',
//     params: 'data',
//     nextStep: 'choose_professional'
//   } 
// },
// {
//   "id": "choose_professional",
//   "hideInput": true,
//   "delay": 2000,
//   "replace": true,
//   "component": 'SlidingCards',
//   "waitAction": true,
//   "metadata": {
//     "query": {
//       "style": {
//       },
//       "outputs": {
//         "style": {},
//         "outputs": [
//           {
//             "type": "slidingCard",
//             "style": {},
//             "options": {
//               "text": 'asdsadfdsa',
//               "option_id": "firebase id for this option",
//               "styles": {}
//             }
//           }
//         ]
//       },
//       "inputs": {
//         "style": "col-6",
//         "inputs": [

//         ]
//       }
//     }
//   },
//   "trigger": ""
// }
// ]