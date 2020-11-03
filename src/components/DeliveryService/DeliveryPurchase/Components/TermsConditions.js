import React, {useEffect} from 'react'
import { MdKeyboardArrowLeft } from "react-icons/md"

export default function TermsConditions({goBack}) {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div className="allwhite-hisopados-background">
            <div className="title-terms-frequent-container">
                <p onClick={() => goBack()} className="icon" ><MdKeyboardArrowLeft/></p>
                <p className="title">Términos y condiciones</p>
            </div>
            <div className="terms-conditions">{`Por favor, lea y acepte los TÉRMINOS Y CONDICIONES que regulan la contratación de servicios para realizar HISOPADOS MEDIANTE TESTEOS RÁPIDOS DE ANTÍGENOS. El servicio es válido para zonas del Área Metropolitana de Buenos Aires (AMBA) donde ÜMA Health tenga zona de cobertura. Los Usuarios se encontrarán sujetos a estos Términos y Condiciones, junto con todas las demás políticas que rigen a ÜMA Health y que son incorporados al presente por referencia. ESTOS TÉRMINOS Y CONDICIONES SON OBLIGATORIOS Y VINCULANTES PARA QUIENES USEN EL SERVICIO. CUALQUIER PERSONA QUE NO ACEPTE PODRÁ ELEGIR NO CONTRATAR EL SERVICIO.`}
                <br />
                {`1. DEFINICIONES:`}
                <br />
                {`⦁	“IHSA”: es el acrónimo de INTERNATIONAL HEALTH SERVICES ARGENTINA, Sociedad anónima  titular de la licencia de ÜMA Health, con CUIT 30-61029860-1, constituida bajo las leyes de la República Argentina. También refiere a compañías afiliadas y/o vinculadas. `}
                <br />
                {`⦁	“ÜMA Health”: es la plataforma tecnológica utilizada por los usuarios para acceder a los Servicios. Todo el contenido es se encuentra alcanzado por la legislación vigente en materia de propiedad intelectual e industrial. Los derechos pertenecen exclusivamente a Deksia S.A. en calidad de propietaria, y a IHSA S.A en calidad de licenciataria.`}
                <br />
                {`⦁	“Usuario”: persona física mayor de edad (o menor de edad con autorización del tutor responsable) que acceda a la plataforma, use la Aplicación y contrate el Servicio.`}
                <br />
                {`⦁	“Profesional de la Salud”: persona física mayor de edad dentro del territorio de la República Argentina, que en oportunidad de darse de alta en la plataforma acredite poseer matrícula o título habilitante expedido por autoridad que regula el ejercicio de la medicina de conformidad con la ley N° 17.132. Pueden ser contratados o desempeñarse bajo relación de dependencia de ÜMA Health. De acuerdo al caso pueden ser médicos clínicos, pediatras, enfermeros, extraccionistas, o especialistas. Cuando sean contratados para visitas a domicilio, tendrán colocado su equipo de protección personal, sea para la detección de antígenos y/o anticuerpos, aplicación de vacunas, inyecciones, o testeos de baja complejidad. `}
                <br />
                {`⦁	“Choferes o conductores”: Persona físicas que posean movilidad propia y finalicen el trámite de alta en la plataforma de ÜMA Health, a los fines de realizar viajes de traslado interurbano a profesionales de la salud, técnicos extraccionistas, o agentes que le sean asignados por IHSA. El conductor deberá tomar los destinos en un radio determinado que le sean asignados dentro de la aplicación de ÜMA Health. Cada hisopado será coordinado a partir del pedido expreso del paciente a través de la plataforma de ÜMA Health. Los choferes también podrán ser requeridos para realizar servicios de paquetería puerta a puerta. En todos los casos (pasajeros y/o paquetería y/o insumos) deberán contar con licencia de conducir argentina categoría D1 o superior.`}
                <br />
                {`2. INFORMACIÓN PARA EL USUARIO SOLICITANTE. `}
                <br />
                {`2.1 ACERCA DEL SERVICIO. ÜMA Health ofrece un servicio a domicilio que facilita el acceso de cualquier persona a un diagnóstico virológico sin necesidad de equipamiento de alta complejidad, con el objetivo de una detección precoz y rápida de antígeno contra SARS-CoV-2 por medio de HISOPADO NASOFARÍNGEO, para reducir el tiempo de espera de las personas con sospecha. El reactivo Panbio™ COVID-19 Ag Rapid Test Device es una prueba rápida de presunto diagnóstico para la detección cualitativa del antígeno (Ag) del SARS-CoV-2 en muestras de hisopado nasofaríngeos humanos, de individuos que cumplen con los criterios clínicos y/o epidemiológicos de COVID-19. Es solo para uso profesional y está destinado a ser utilizado como ayuda en el diagnóstico de la infección por SARS-CoV-2 y se puede utilizar en cualquier entorno no laboratorio que cumpla con los requisitos especificados en las Instrucciones de uso y la normativa local.`}
                <br />
                {`2.2 ¿QUIÉNES PUEDEN REALIZARSE EL TEST RÁPIDO? En personas asintomáticas: para descartar la existencia de infección por COVID-2019, 48 hs desde que han tenido contacto estrecho sin las medidas de protección personal adecuadas: 1) a menos de 2 metros distancia de un caso confirmado, 2) durante más de 15 minutos y 3) durante las 48 horas previas al inicio de los síntomas. En personas sintomáticas: de hasta 7 días de evolución desde la fecha de inicio de síntomas. Los siguientes síntomas hacen referencia los casos sospechosos de Coronavirus: Fiebre, Tos seca, Cansancio, dolor de garganta, dolor de cabeza, pérdida del sentido del olfato o del gusto, dificultad para respirar o sensación de falta de aire, dolor o presión en el pecho, incapacidad para hablar o moverse normalmente, cefalea, diarrea y/o vómitos.`}
                <br />
                {`2.3 DESCRIPCIÓN DEL TEST RÁPIDO. El kit está indicado para uso profesional y está indicado para la detección cualitativa del antígeno del SARS-CoV-2 a partir de un hisopado nasofaríngeo. La prueba utiliza la llamada tecnología de flujo lateral, similar al método que permite realizar pruebas de embarazo. Las pruebas activan una muestra líquida sobre la superficie de una almohadilla con moléculas reactivas para arrojar un resultado. Mientras que una prueba de embarazo está diseñada para detectar una hormona, el sistema busca un antígeno, una pequeña porción de la proteína del coronavirus que se toma del interior de la nariz.`}
                <br />
                {`2.4. EL SERVICIO INCLUYE: una (1) visita de un profesional de la salud (técnico/ enfermero) al domicilio indicado por el usuario, para practicarle un HISOPADO NASOFARÍNGEO. El profesional acompaña al usuario antes, durante y después de la realización del test. Luego de leer e interpretar el resultado se retira del domicilio del usuario, haciendo entrega de una constancia de atención (NO VÁLIDO PARA ABORDAR VUELOS NACIONALES E INTERNACIONALES QUE EXIJAN CERTIFICADOS PCR COMO PARTE DE SUS CONTROLES, INCLUSO EN CONEXIONES). Recomendamos al usuario revisar las restricciones de entrada de cada país y/o región y verificar en los sitios web oficiales del país las políticas de ingreso y excepciones que apliquen al viaje. La constancia de realización del reactivo Panbio™ COVID-19 Ag Rapid Test Device no es un PCR ni tiene validación de un bioquímico y/o laboratorio de microbiología. `}
                <br />
                {`2.5. EL SERVICIO NO INCLUYE. ningún tipo de certificado por COVID-2019, en especial no incluye PCR NEGATIVO ('Reacción en Cadena de la Polimerasa'). No incluye atención primaria y/o farmacológica del profesional que acude al domicilio. Tampoco incluye un diagnóstico presuntivo ni indicación tratamiento y/o reposo.`}
                <br />
                {`3. USO DE LA APLICACIÓN`}
                <br />
                {`3.1. Para contratar el servicio, el usuario puede estar o no registrado en la plataforma de ÜMA Health. El acceso a la Aplicación estará sujeto en todo caso al previo registro del Usuario, que deberá ingresar sus datos y completar el correspondiente Formulario de Registro. ÜMA Health tendrá las facultades para denegar o restringir el uso de la Aplicación a cualquier Usuario bajo su exclusivo criterio, sin que dicha denegación o restricción otorguen derecho a reclamo alguno (cualquiera fuere su naturaleza u objeto) en favor del Usuario. `}
                <br />
                {`3.2 ÜMA Health no será responsable si el Usuario no cuenta con un teléfono celular compatible con el uso de la Aplicación. El Usuario se compromete a hacer un uso adecuado y lícito. Al utilizar la Aplicación el Usuario acuerda que:`}
                <br />
                {`⦁	Utilizará la Aplicación para su uso personal y no podrá disponer de ningún modo de su Cuenta. `}
                <br />
                {`⦁	No podrá ceder ni autorizar su uso por un tercero.`}
                <br />
                {`⦁	No utilizará la Cuenta de un tercero.`}
                <br />
                {`⦁	No solicitará la Aplicación con fines ilícitos, ilegales, contrarios a lo establecido en los presentes Términos y Condiciones Generales, a la buena fe y al orden público, lesivos de los derechos e intereses de terceros incluyendo, sin limitación, el transporte de material ilegal o con fines fraudulentos.`}
                <br />
                {`⦁	No intentará acceder, utilizar y/o manipular los datos de ÜMA Health u otros Usuarios.`}
                <br />
                {`4. INFORMACIÓN PARA EL PROFESIONAL DE LA SALUD.`}
                <br />
                {`4.1. CARACTERÍSTICAS. La muestra es un HISOPADO NASOFARÍNGEO CUALITATIVO –DETECTA ANTÍGENOS- para uso estrictamente profesional. Se recomienda leer las instrucciones de uso y conservación que se encuentran en la caja de presentación. La muestra debe realizarse en un ambiente Hospitalario con saneamiento o Higiene de manos o Área de aislamiento o Manejo de residuos / desechos médicos o Limpieza ambiental. `}
                <br />
                {`4.2. HALLAZGOS. Las personas en quienes el test tenga una reacción positiva se consideran con infección aguda por SARS-CoV-2 (COVID-19) y se procederá en consecuencia, sin necesidad de otra determinación diagnóstica, salvo análisis clínicos de laboratorio que dependen del cuadro clínico del caso diagnosticado y según criterio médico. El profesional que practique el hisopado se limita a la realización de la prueba. El usuario deberá comenzar su aislamiento para proceder a la identificación de los contactos estrechos para proseguir con los protocolos de aislamiento y seguridad.`}
                <br />
                {`4.3. BIOSEGURIDAD: presentación con un hisopo que viene contenido en el tubo, de forma que minimiza la exposición del personal. El tubo bien cerrado debe ser desechado de forma segura en un contenedor de bioseguridad adecuado. El profesional tiene prohibida la entrega del reactivo al usuario paciente, independientemente del resultado. La muestra será desechada siguiendo un protocolo para eliminar residuos con riesgo biológico.  `}
                <br />
                {`4.4. UTILIDAD Y CERTEZA DE LOS TESTS DIAGNÓSTICOS (utilizando un método de referencia FDA EUA RT-PCR). Tasa de verdaderos positivos (proporción de enfermos correctamente identificados): sensibilidad de 91,4% (95% CI: 85,5-95,5%), tasa de verdaderos negativos (proporción de sanos correctamente identificados): especificidad de 99,8% (95% CI: 98,8-100%).`}
                <br />
                {`4.5. INTERPRETACIÓN DEL RESULTADO. Resultado negativo: La presencia de solo la línea de control (C) y ninguna línea de prueba (T) dentro de la ventana de resultados indica un resultado negativo. 2. Resultado positivo: La presencia de la línea de prueba (T) y la línea de control (C) dentro de la ventana de resultados, independientemente de la línea que aparezca primero, indica un resultado positivo. Precaución: La presencia de cualquier línea de prueba (T), no importa cuán débil sea, indica un resultado positivo. 3. Resultado no válido: si la línea de control (C) no es visible dentro de la ventana de resultados después de realizar la prueba, el resultado se considera no válido.`}
                <br />
                {`5. ADVERTENCIAS. EXCLUSIÓN DE RESPONSABILIDAD. `}
                <br />
                {`5.1 ALCANCE Y LIMITACIONES. El test es para una detección cualitativa. La intensidad de las líneas no está relacionada con la cantidad de anticuerpos. EL test no señala si se ha tenido el virus y ya se está recuperado, ni lo contagioso que pueda ser un paciente. LOS RESULTADOS NEGATIVOS NO EXCLUYEN LA INFECCIÓN POR SARS-COV-2 Y NO PUEDEN USARSE COMO LA ÚNICA BASE PARA EL TRATAMIENTO U OTRAS DECISIONES DE MANEJO. LOS RESULTADOS NEGATIVOS DEBEN COMBINARSE CON OBSERVACIONES CLÍNICAS, HISTORIAL DEL PACIENTE E INFORMACIÓN EPIDEMIOLÓGICA.`}
                <br />
                {`5.2. PRECAUCIONES. La prueba no está destinada a utilizarse como prueba de detección de donantes para el SARS-CoV-2. Un resultado negativo de la prueba no elimina la posibilidad de infección por SARS-CoV-2 y debería ser confirmado mediante cultivo viral o un ensayo molecular. Los resultados de la prueba deben evaluarse junto con otros datos clínicos disponibles para el médico. La lectura de resultados de la prueba antes de 15 minutos o después de 20 minutos puede dar resultados incorrectos.`}
                <br />
                {`6. AVISO PARA AFILIADOS A OBRAS SOCIALES Y MEDICINA PREPAGA.`}
                <br />
                {`6.1 El servicio de ÜMA Health se brinda al usuario (consumidor final) de manera privada. NO puede abonarse a través de Agentes del Seguro de Salud (Obras Sociales) y Entidades de Medicina Prepaga. Sugerimos consultar sobre obligaciones prestacionales y reintegros por cobertura asistencial de tratamiento frente a casos confirmados o sospechosos de COVID-19. `}
                <br />
                {`6.2. Las Resoluciones Nº 326/2020 - SALUD y 1095/2020 - SSSALUD, establecen los módulos prestacionales de atención de casos sospechosos y confirmados de COVID-19 y los valores de reintegro a que podrán acceder los Agentes del Seguro de Salud que los brindan.`}
                <br />
                {`6.3. Los usuarios que reciban el servicio serán ingresados como pacientes que reciban atención por COVID-19 en el Sistema Integrado de Información Sanitaria Argentino (SIISA).`}
                <br />
                {`7. PRECIO. PAGO. FACTURACIÓN.`}
                <br />
                {`7.1. Las tarifas cobradas no serán reembolsables. Las tarifas, sus actualizaciones, y condiciones de uso estarán disponibles en todo momento en la Aplicación y están sujetas a posibles modificaciones.`}
                <br />
                {`7.2. Cuando ÜMA Health cobre directamente al Usuario Solicitante a través de la tarjeta de crédito facilitada por el Usuario, ÜMA Health se reserva el derecho a realizar una validación del método de pago. Asimismo, cada vez que el Usuario realice la petición de un Servicio, ÜMA Health se reserva el derecho a solicitar la pre-autorización para el cobro del trayecto a la entidad de crédito vinculada a la tarjeta de crédito facilitada por el Usuario Solicitante. En ningún caso dicha pre-autorización supondrá el cobro efectivo del trayecto que vaya a realizarse, dicho cobro sólo se efectuará una vez haya finalizado el mismo.`}
                <br />
                {`7.3. El usuario que elija contratar el servicio debe ingresar los datos de su tarjeta de crédito. La transacción procede por Mercado Pago. El servicio es exigible luego de abonar la suma y registrar el pago respectivo.  `}
                <br />
                {`7.4  DESCUENTOS. Un Usuario tiene prohibido crear diferentes registros con el fin de beneficiarse indebidamente de descuentos y/o invitaciones, lo cual se considera un uso abusivo de las mismas. Las invitaciones y descuentos perderán su valor al mes de su creación o cuando el propio código determine. ÜMA Health se reserva el derecho a finalizar, modificar y/o  reducir el valor de los descuentos, invitaciones y promociones en cualquier momento. `}
                <br />
                {`8. INFORMACIÓN PARA LOS CHOFERES. `}
                <br />
                {`8.1 Los choferes que realicen los servicios de traslados renuncia y exonera a ÜMA Health de cualquier obligación, reclamo o daño por el hecho o en ocasión de prestar servicios, en función de la relación con el tercero transportista. ÜMA Health no se constituirá como parte en cualquier conflicto judicial o extrajudicial entre el chofer y terceros. Toda responsabilidad u obligación nacida en virtud de la relación entre el chofer y terceros, descansa únicamente en el chofer y los seguros que eventualmente suscriba por su actividad. El chofer entiende y acepta que (i) por el uso de la Aplicación de ÜMA Health la prestación de servicios de traslados y/o transporte, puede exponerse a un transporte potencialmente peligroso, dañino, perjudicial dados los riesgos inherentes a la propia actividad de transporte, (ii) y que dicha actividad la realiza bajo su propio riesgo y responsabilidad.`}
                <br />
                {`9. INDEMNIDAD.`}
                <br />
                {`9.1. HACIENDO CLICK EN “ACEPTO”,  el Usuario declara que mantendrá indemne frente a cualquier reclamación a ÜMA Health, su sociedad matriz, directores, socios, empleados, abogados y agentes derivada del (i) USUARIOS: incumplimiento de cualquier disposición contenida en las presentes Condiciones Generales de Uso o de cualquier ley o regulación aplicable a las mismas, (ii) CHOFERES: incumplimiento o violación de los derechos de terceros incluyendo, a título meramente enunciativo, los terceros transportistas, taxistas, otros conductores y peatones; (iii) PROFESIONALES DE LA SALUD: cualquier daño o perjuicio causado a los usuarios que solicitan el servicio para sí o en representación de terceros bajo su guarda.`}
                <br />
                {`9.2. ÜMA Health no puede garantizar en un 100%  la plena disponibilidad y continuidad del funcionamiento de la Aplicación y/o Sitio Web. En consecuencia, ÜMA Health no será en ningún caso responsable por cualesquiera daños y perjuicios que puedan derivarse de (i) la falta de disponibilidad o accesibilidad a la Aplicación; (ii) la interrupción en el funcionamiento de la Aplicación debido a fallas informáticas, desconexiones, demoras, y cualquier inconveniente causado por sobrecargas en las líneas telefónicas, internet o en otros sistemas electrónicos, incluso producidos en el curso de su funcionamiento.`}
                <br />
                {`9.3 ÜMA Health pone a disposición del Usuario Solicitante el Centro de Ayuda, en el que el Usuario Solicitante podrá comunicarse por  inconvenientes sobre el uso y/o contratación del servicio y/o valoración de la experiencia. `}
                <br />
                {`10. DATOS PERSONALES. El responsable del tratamiento de los datos personales es INTERNATIONAL HEALTH SERVICES ARGENTINA SOCIEDAD ANÓNIMA, con domicilio en Avenida Melián 2752, de la Ciudad Autónoma de Buenos Aires, República Argentina. Sin perjuicio de los derechos de acceso, rectificación, actualización y supresión que le asisten frente a la Empresa o Médico independiente” como responsable de tratamiento y del banco de datos respectivo, el usuario tiene pleno control sobre sus datos personales; podrá ejercer el derecho de revocación si ha prestado su consentimiento el tratamiento de sus datos personales; tiene derecho a retirar total o parcialmente su consentimiento, así como el derecho de acceso, rectificación, oposición, limitación del tratamiento, derecho a la portabilidad y supresión de sus datos. Podrá ejercitar estos derechos, gratuitamente, en cualquier momento, dirigiendo una comunicación a habeasdata@ihsa.com.ar, o por teléfono al 43230000. Para más información, el usuario podrá consultar en http://www.argentina.gob.ar/aaip. El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326". "La DIRECCIÓN NACIONAL DE PROTECCIÓN DE DATOS PERSONALES, Órgano de Control de la Ley Nº 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales."`}
                </div>
        </div>)
}
