import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import InformationPage from '../components/GeneralComponents/InformationPage.js';
import imageFelicitaciones from '../assets/doctor-online.svg';
import "../styles/generalcomponents/install.scss";
import { GenericHeader } from '../components/GeneralComponents/Headers';

const RegisterSuccess = (props) => {
    const { ws } = useParams();
    const history = useHistory();
    
    const redirect = async () => {
        history.push(`/home`);
    }

    return (
                <div>
                    <GenericHeader profileDisabled={true}></GenericHeader>
                    <div className='information__container'>
                    <InformationPage
                        callback={redirect}
                        title='¡Felicitaciones!'                    
                        texts={[
                            'Ya eres parte de UMA. Puedes ingresar a la plataforma.'
                        ]}
                        imgProps={{
                            styles: {},
                            img: imageFelicitaciones
                        }}
                        button='Ingresar'
                    />
                    </div> 
                </div>
    )
}

export default RegisterSuccess;