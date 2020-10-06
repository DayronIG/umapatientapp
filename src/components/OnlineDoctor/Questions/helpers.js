export function COVID(lista_paciente) {
    let label_list = ['tos', 'fiebre', 'odinofagia', 'anosmia/disgeusia', 'disnea', 'cefalea', 'diarrea y/o vómitos', 'contacto estrecho', 'personal de salud', 'signos de riesgo'];

    const lista_covid = lista_paciente.filter(item => label_list.includes(item))

    let objeto = {};

    let caracteristicasCovid = ['signos de riesgo', 'contacto estrecho', 'personal esencial', 'barrio popular'];

    let real_covid_symptoms = lista_covid.filter(el => !caracteristicasCovid.includes(el))
    let real_covid_old_symptoms = real_covid_symptoms.filter(el => !['cefalea', 'diarrea y/o vómitos'].includes(el))

    // eslint-disable-next-line no-useless-escape
    let epicrisis = JSON.stringify(lista_paciente).replace(/[\'\]\[]/g, ' ')

    if (real_covid_symptoms.length > 0) {
        if (lista_covid.includes('signos de riesgo')) {
            objeto.diagnostico = 'INESP   Sospecha COVID19';
            objeto.destino_final = 'Evaluación en rojo';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}`;
        } else {
            objeto.diagnostico = 'INESP   Sospecha COVID19';
            objeto.destino_final = 'Traslado protocolo pandemia';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}`;
        }
    }
    if (lista_covid.includes('contacto estrecho') && real_covid_old_symptoms.length > 0) {
        if (lista_covid.includes('signos de riesgo')) {
            objeto.diagnostico = 'INESP   Sospecha COVID19';
            objeto.destino_final = 'Evaluación en rojo';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}`;
        } else {
            objeto.diagnostico = 'INESP   Sospecha COVID19';
            objeto.destino_final = 'Traslado protocolo pandemia';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}`;
        }
    } else if (lista_covid.includes('contacto estrecho') && real_covid_old_symptoms.length > 0) {
        objeto.diagnostico = 'INESP   Contacto estrecho COVID19';
        objeto.destino_final = 'En domicilio con instrucciones';
        objeto.epicrisis = `Paciente consulta por ${epicrisis}. Asintomático al momento de la consulta para COVID-19. Se indica aislamiento preventivo obligatorio por 14 días desde último contacto y pautas de alarma (Consultar ante la aparición de: Tos, fiebre, falta de aire, dolor de garganta o pérdida de olfato o el gusto)`;
    } else if (lista_covid.includes('personal de salud') && (real_covid_old_symptoms.length > 0)) {
        if (lista_paciente.includes('signos de riesgo')) {
            objeto.diagnostico = 'INESP   Sospecha COVID19';
            objeto.destino_final = 'Evaluación en rojo';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}`;
        } else {
            objeto.diagnostico = 'INESP   Sospecha COVID19';
            objeto.destino_final = 'Traslado protocolo pandemia';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}`;
        }
    } else if (real_covid_symptoms.length > 1) {
        if (lista_covid.includes('signos de riesgo')) {
            objeto.diagnostico = 'INESP   Sospecha COVID19';
            objeto.destino_final = 'Evaluación en rojo';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}.`;
        } else {
            objeto.diagnostico = 'INESP   Sospecha COVID19';
            objeto.destino_final = 'Traslado protocolo pandemia';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}.`;
        }
    } else {
        if (lista_covid.includes('signos de riesgo')) {
            objeto.diagnostico = '';
            objeto.destino_final = 'Evaluación en rojo';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}.`;
        } else {
            objeto.diagnostico = '';
            objeto.destino_final = '';
            objeto.epicrisis = `Paciente consulta por ${epicrisis}.`;
        }
    }

    return objeto;
}

export function HTA(TAS, TAD, lista) {
    const objeto = {};
    const lista_riesgo = ['sospecha de ACV', 'probable compromiso cardíaco', 'probable encefalopatía'];
    const sintomas_riesgo = lista.filter(x => lista_riesgo.includes(x) && x);

    if (TAS === '' && TAD === '') {
        if (sintomas_riesgo.length > 0) {
            objeto.diagnostico = '';
            objeto.destino_final = 'Evaluación en rojo';
            objeto.epicrisis = `Paciente refiere ${JSON.stringify(sintomas_riesgo).replace(/[\'\]\[]/g, ' ')}`;
        } else {
            objeto.diagnostico = '';
            objeto.destino_final = 'En domicilio con instrucciones';
            objeto.epicrisis = 'Paciente que consulta por sospecha de HTA. Actualmente sin registro de los valores. No refiere síntomas compatible con daño de órgano blanco. Aclaro que es necesario tener un registro actualizado de la presión arterial para poder evaluar la conducta a seguir. Indico que vuelva a contactarse con el control de TA';
        }
    } else if (parseInt(TAS) > 179 || parseInt(TAD) > 120) {
        if (sintomas_riesgo.length > 0) {
            objeto.diagnostico = 'CARV   Elevación de la presión arterial   (329)';
            objeto.destino_final = 'Evaluación en rojo';
            objeto.epicrisis = `Paciente consulta por emergencia hipertensiva. Refiere valores de ${TAS} mmHg de TAS y ${TAD} mmHg de TAD, asociado con síntomas compatibles con ${JSON.stringify(sintomas_riesgo).replace(/[\'\]\[]/g, ' ')}`;
        } else {
            if (!lista.includes('antecedente de HTA')) {
                if (parseInt(TAS) < 200) {
                    objeto.diagnostico = 'CARV   Elevación de la presión arterial   (329)';
                    objeto.destino_final = 'En domicilio con instrucciones';
                    objeto.epicrisis = `Paciente sin antecedentes de hipertensión consulta por registro de ${TAS} mmHg de TAS y ${TAD} mmHg de TAD. Al momento de la consulta no refiere sí­ntomas compatibles con daño de organo blanco. Con el fin de descartar una pseudocrisis hipertensiva, indico volver a controlarse a los 30 minutos un vez corregido los factores que podrí­an estar ocasionado la hipertensión reactiva. La toma correcta de la tensión arterial debe realizarse en reposo, sin haber tomado mate te o cafe en los últimos 30 minutos, así­ como en la menor situación de stress ansiedad posible (Permanecer en su habituación con luz tenue en silencio o escuchando música tranquila puede serle de utildad). En caso de que el nuevo registro está por debajo de 180 mmHgTAS no deberá volver a contactarse, pero es importante que registre diariamente sus valores para que cardiálogo o su médico clÃínico evaluen si es necesario medicarlo`;
                } else {
                    objeto.diagnostico = 'CARV   Elevación de la presión arterial   (329)';
                    objeto.destino_final = 'En domicilio con instrucciones';
                    objeto.epicrisis = `Paciente sin antecedentes de hipertensión consulta por registro de ${TAS} mmHg de TAS y ${TAD} mmHg de TAD. Al momento de la consulta no refiere sí­ntomas compatibles con daño de organo blanco. Dado los altos valores, indico amlodipida 10 mg y nuevo control a los 4hs de administrada la misma. Así­ mismo recordar que La toma correcta de la tensión arterial debe realizarse en reposo, sin haber tomado mate te o cafe en los últimos 30 minutos, así como en la menor situación de stress ansiedad posible (Permanecer en su habituación con luz tenue en silencio o escuchando música tranquila puede serle de utildad). En caso de que el nuevo registro está por debajo de 180 mmHgTAS no deberá volver a contactarse, pero es importante que registre diariamente sus valores para que cardiólogo o su médico clínico evaluen si es necesario continuar con la medicación`;
                }
            } else {
                if (parseInt(TAS) < 200) {
                    objeto.diagnostico = 'CARV   Elevación de la presión arterial   (329)';
                    objeto.destino_final = 'En domicilio con instrucciones';
                    objeto.epicrisis = `Paciente sin antecedentes de hipertensión consulta por registro de ${TAS} mmHg de TAS y ${TAD} mmHg de TAD. Al momento de la consulta no refiere sí­ntomas compatibles con daño de organo blanco. Indico tomar un refuerzo de su medicación antihipertensiva de base y realizar un control de la tensión arterial a las 4hs de administrada la misma. La toma correcta de la tensión arterial debe realizarse en reposo, sin haber tomado mate te o cafe en los últimos 30 minutos, así mismo en la menor situación de stress-ansiedad posible (Permanecer en su habituación con luz tenue en silencio o escuchando música tranquila puede serle de utildad). En caso de que el nuevo registro está por debajo de 180 mmHgTAS no deberá volver a contactarse, pero es importante que registre diariamente sus valores para que su cardiólogo evalue si es necesario ajustar su medicación de base`;
                } else {
                    objeto.diagnostico = 'CARV   Elevación de la presión arterial   (329)';
                    objeto.destino_final = 'En domicilio con instrucciones';
                    objeto.epicrisis = `Paciente sin antecedentes de hipertensión consulta por registro de ${TAS} mmHg de TAS y ${TAD} mmHg de TAD. Al momento de la consulta no refiere sí­ntomas compatibles con daño de organo blanco. Dado los altos valores, indico amlodipida 10 mg y nuevo control a los 4hs de administrada la misma. Así mismo recordar que la toma correcta de la tensión arterial debe realizarse en reposo, sin haber tomado mate te o cafe en los últimos 30 minutos, así­ como en la menor situación de stress ansiedad posible (Permanecer en su habituación con luz tenue en silencio o escuchando música tranquila puede serle de utildad). En caso de que el nuevo registro está por debajo de 180 mmHgTAS no deberá volver a contactarse, pero es importante que registre diariamente sus valores para que un cardiólogo evalue si es necesario ajustar su medicación antihipertensiva`;
                }
            }
        }
    } else if (parseInt(TAS) > 140 || parseInt(TAD) > 90) {
        if (sintomas_riesgo.length > 0) {
            objeto.diagnostico = '';
            objeto.destino_final = 'Evaluación en rojo';
            objeto.epicrisis = `Paciente refiere ${JSON.stringify(sintomas_riesgo).replace(/[\'\]\[]/g, ' ')}. TAS ${TAS} mmHg y TAD ${TAD} mmHg`;
        } else {
            objeto.diagnostico = 'CARV   Elevación de la presión arterial   (329)';
            objeto.destino_final = 'En domicilio con instrucciones';
            objeto.epicrisis = `Paciente que consulta por registro de ${TAS} mmHg de TAS y ${TAD} mmHg de TAD. Indico que si bien el valor es elevado, este no implica una situación de riesgo o urgencia.  Recomiendo que registre diariamente sus valores para que en una próxima consulta un cardiólogo evalue si es necesario iniciar o ajustar medicación antihipertensiva`;
        }
    } else {
        if (sintomas_riesgo.length > 0) {
            objeto.diagnostico = '';
            objeto.destino_final = 'Evaluación en rojo';
            objeto.epicrisis = `Paciente refiere ${JSON.stringify(sintomas_riesgo).replace(/[\'\]\[]/g, ' ')}. TAS ${TAS} mmHg y TAD ${TAD} mmHg`;
        } else {
            objeto.diagnostico = '';
            objeto.destino_final = 'En domicilio con instrucciones';
            objeto.epicrisis = `Paciente que consulta por sospecha de HTA. Al momento de la consulta reporta valores de ${TAS} mmHg de TAS y ${TAD} mmHg de TAD. Indico que esto valores no reflejan hipertensión y doy pautas de alarma.`;
        }
    }
    return objeto;
}
