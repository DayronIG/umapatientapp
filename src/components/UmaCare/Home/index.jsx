import React from 'react';
import iconUmaCare from '../../../assets/icons/icon-umaCare.svg';
import {useHistory} from 'react-router-dom';
import '../../../styles/home/umaCare.scss';

const UmaCareHome = () => {
    const history = useHistory()

    return (<section className="uma__container">
        <div className="title__container" onClick={() => history.push('/umacare')}>
            <img src={iconUmaCare} alt="UMA Care"/>
            <h2 className="title">UMA Care</h2>        
        </div>
{/*         <div className="content__container">
            <p className="text__nothing">Aún no tienes ningún tratamiento en curso.</p>
        </div> */}
    </section>)
};

export default UmaCareHome;