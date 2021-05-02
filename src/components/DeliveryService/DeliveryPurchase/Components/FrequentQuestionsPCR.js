import React, {useEffect} from 'react'
import QuestionAnswer from "./QuestionAnswer"
import { MdKeyboardArrowLeft } from "react-icons/md"

export default function FrequentQuestions({goBack}) {
    const qa = [
        {
            question: "¿Es un PCR?",
            answer: "Es una prueba diagnóstica molecular rápida in vitro que utiliza una tecnología de amplificación isotérmica de ácidos nucleicos destinada a la detección cualitativa de ácido nucleico del ARN viral de SARS-CoV-2 con la misma fiabilidad que un PCR."
        },
        {
            question: "¿Cuáles son las ventajas del PCR Express?",
            answer: ["Es rapido, con resultados en 15/20 minutos.",
            "Alto nivel de fiabilidad.." ,
            "No es necesario contar con órdenes médicas.",
            "Realizado por un profesional.",
            "Detecta el virus en tiempo real a nivel molecular.", 
            "Resultados en el celular."]
        },
        {
            question: "¿Me darán certificado?",
            answer: "Sí, recibirás una constancia del resultado de tu hisopado. EL SERVICIO NO INCLUYE: certificados laborales para licencia por enfermedad inculpable ley 20.744 y/o enfermedad profesional ley 24.557 por COVID-2019 y/o PCR NEGATIVO, certificado de atención primaria y/o farmacológica del profesional que realiza el hisopado. No incluye diagnóstico presuntivo ni indicación de tratamiento y/o reposo. "
        },
        {
            question: "¿Es válido para viajar?",
            answer: "Sí, el certificado se encuentra respaldado por un bioquímico que acredita la veracidad del resultado.",
        },
        {
            question: "Ya pedí el servicio ¿qué hago?",
            answer: "Debes dirigirte de manera particular a cualquiera de nuestros centros de testeos para que uno de nuestros profesionales pueda realizarte el hisopado. Recuerda respetar en todo momento las medidas de bioseguridad, acudir con barbijo, mantener las manos higienizadas y evitar el contacto con la cara."
        },
        {
            question: "¿Qué tipo de hisopado se utiliza?",
            answer: "Hisopos directos nasales, nasofaríngeos o faríngeos de individuos con presunta infección por COVID-19 procesados con tecnología de amplificación isotérmica de ácidos nucleicos destinada a la detección cualitativa de ácido nucleico del ARN viral de SARS-CoV-2.",
        },
        {
            question: "¿Quiénes pueden realizarse el hisopado express?",
            answer: ["En personas asintomáticas: para descartar la existencia de infección por COVID-2019, 48 hs desde que han tenido contacto estrecho sin las medidas de protección personal adecuadas(Estar a menos de 2 metros distancia de un caso confirmado durante más de 15 minutos y durante las 48 horas previas al inicio de los síntomas)",
            "En personas sintomáticas: de hasta 7 días de evolución desde la fecha de inicio de síntomas."]
        },
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
