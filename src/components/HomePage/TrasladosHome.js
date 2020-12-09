import React from 'react';
import {useSelector} from 'react-redux';
import iconTraslados from '../../assets/icons/icon-traslados.svg';
import {useHistory} from 'react-router-dom';
import '../../styles/home/umaCare.scss';

const TrasladosHome = () => {
    const history = useHistory()
	const user = useSelector((state) => state.user);

    return (<section className="uma__container">
        <div className="title__container" onClick={() => history.push(`/${user.ws}/transport`)}>
            <img src={iconTraslados} alt="UMA Care"/>
            <h2 className="title">Traslados</h2>        
        </div>
{/*         <div className="content__container">
            <p className="text__nothing">Aún no tienes ningún tratamiento en curso.</p>
        </div> */}
    </section>)
};

export default TrasladosHome;