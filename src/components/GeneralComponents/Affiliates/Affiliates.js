import React from 'react';
import '../../../styles/affiliate.scss';
import travelAce from '../../../assets/logos/travelAce.svg';
import univAssist from '../../../assets/logos/univAssist.svg'
import PAMI from '../../../assets/logos/pami.png';

export const PamiAffiliate = (props) => {
    return (
        <section className='affiliateWelcome'>
            <div className="affiliateWelcome__container">
                <h5 className="affiliateWelcome__container--title">
                    Estas ingresando por <br />
                </h5>
            </div>
            <div className="affiliateWelcome__container">
                <div className="affiliateWelcome__container--img">
                    <img src={PAMI} alt="affiliate Assistance img" />
                </div>
{/*                 <div className="affiliateWelcome__container--img">
                    <img src={travelAce} alt="Travel ace Assistance img" />
                </div> */}
            </div>
            <div className="affiliateWelcome__container">
                <h5>
                    {props.counter}
                </h5>
            </div>
        </section>
    )
}