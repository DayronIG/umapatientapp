import React, {useEffect} from 'react'
import QuestionAnswer from "./QuestionAnswer"
import { MdKeyboardArrowLeft } from "react-icons/md"

export default function FrequentQuestions({goBack}) {
    const qa = [
        {
            question: "¿Me darán certificado?",
            answer: "Recibirás una constancia del resultado de tu test de hisopado, pero no tiene validez para realizar trámites oficiales. EL SERVICIO NO INCLUYE: certificados laborales para licencia por enfermedad inculpable ley 20.744 y/o enfermedad profesional ley 24.557 por COVID-2019 y/o PCR NEGATIVO, certificado de atención primaria y/o farmacológica del profesional que acude al domicilio. No incluye diagnóstico presuntivo ni indicación de tratamiento y/o reposo."
        },
        {
            question: "¿Cuáles son las ventajas de hacer un test rápido de hisopado a domicilio?",
            answer: ["Es rápido. Con resultados en 15/20 minutos.",
            "Accesible." ,
            "Portátil. No requiere instrumentación.",
            "No es necesario contar con órdenes médicas.",
            "Realizado por un profesional.", 
            "Detecta el virus en tiempo real.", 
            "Servicio de logística puerta a puerta con vehículos identificados, conductores profesionales y profesionales de la salud propios.", 
            "Resultados en el celular.",
            "Autorizado por ANMAT."]
        },
        {
            question: "¿Qué tipo de hisopado se utiliza?",
            answer: "Es una muestra nasofaríngea con hisopo para detección de antígenos contra SARS-CoV-2. Se utiliza el reactivo Panbio™ COVID-19 Ag Rapid Test Device, una prueba rápida de presunto diagnóstico para la detección cualitativa del antígeno (Ag) del SARS-CoV-2 en muestras de hisopado nasofaríngeos humanos, de individuos que cumplen con los criterios clínicos y/o epidemiológicos de COVID-19. Es solo para uso profesional. "
        },
        {
            question: "¿Quiénes pueden realizarse el test rápido?", 
            answer: ["En personas asintomáticas: para descartar la existencia de infección por COVID-2019, 48 hs desde que han tenido contacto estrecho sin las medidas de protección personal adecuadas:", 
            "1) a menos de 2 metros distancia de un caso confirmado, ",
            "2) durante más de 15 minutos y" ,
            "3) durante las 48 horas previas al inicio de los síntomas." ,
            "En personas sintomáticas: de hasta 7 días de evolución desde la fecha de inicio de síntomas."],
            notUl: true
        },
        {
            question: "¿Es un PCR?",
            answer: "No. La constancia de realización del reactivo Panbio™ COVID-19 Ag Rapid Test Device no es un PCR ('Reacción en Cadena de la Polimerasa') ni tiene validación de un bioquímico y/o laboratorio de microbiología."
        },
        {
            question: "¿Es válido para viajar?",
            answer: ["No. El test rápido de antígenos no es válido para abordar vuelos nacionales e internacionales que exijan certificados pcr como parte de sus controles, incluso en conexiones. Recomendamos al usuario revisar las restricciones de entrada de cada país y/o región y verificar en los sitios web oficiales del país las políticas de ingreso y excepciones que apliquen al viaje. Los siguientes síntomas hacen referencia los casos sospechosos de Coronavirus:",
            "Fiebre",
            "Tos seca",
            "Cansancio",
            "Molestias y dolores",
            "Dolor de garganta",
            "Dolor de cabeza",
            "Pérdida del sentido del olfato o del gusto",
            "Dificultad para respirar o sensación de falta de aire",
            "Dolor o presión en el pecho",
            "Incapacidad para hablar o moverse",
            "Cefalea",
            "Diarrea y/o vómitos"],
            firstNotUl: true
        },
        {
            question: "Ya pedí el servicio, ¿qué hago?",
            answer: "La aplicación te mantendrá informado sobre el estado del servicio. Mientras esperas, te acercamos las siguientes recomendaciones de prevención: no te automediques, recuerda colocarte el barbijo para recibir al enfermero, lávate las manos y evita el contacto con la cara. Al llegar a tu domicilio, el profesional de la salud tendrá colocado su equipo de protección personal y te guiará durante todo lo que dure el proceso. Vas a recibir una constancia de atención. Tener en cuenta que EL SERVICIO NO INCLUYE certificado por COVID-2019, en especial no incluye PCR NEGATIVO, atención primaria y/o farmacológica del profesional que acude al domicilio ni diagnóstico presuntivo ni indicación de tratamiento y/o reposo."
        },
        {
            question: "¿Puedo quedarme con el test?",
            answer: "No podrás quedarte con el reactivo, la muestra será desechada siguiendo un protocolo para eliminar residuos con riesgo biológico."
        },
        {
            question: "¿Cuáles son las limitaciones de las llamadas “Pruebas rápidas”? ¿Para qué sirven?",
            answer: "Las llamadas “pruebas rápidas” pueden ser de dos tipos: las que detectan antígenos (proteínas del virus) y las que detectan anticuerpos (IgM/IgG). Aquellas que detectan “antígenos” son útiles como criterio para confirmar la presencia del virus en el momento en que se toma la muestra. Aquellas que detectan anticuerpos, indican solamente un contacto previo con el virus, no permite demostrar ni descartar la presencia del virus en el momento en que se toma la muestra. La presencia de anticuerpos no indica ausencia de virus (dependiendo del momento de la toma de muestra) y tampoco indica necesariamente protección contra el virus."
        }
    ]

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    return (
        <div className="allwhite-hisopados-background">
            <div className="title-terms-frequent-container">
                <p onClick={() => goBack()} className="icon" ><MdKeyboardArrowLeft/></p>
                <p className="title">Preguntas frecuentes</p>
            </div>
            {qa.map((el) => {
                return <QuestionAnswer key={el.question} notUl={el.notUl} firstNotUl={el.firstNotUl} question={el.question} answer={el.answer}/>
            })}
        </div>)
}
