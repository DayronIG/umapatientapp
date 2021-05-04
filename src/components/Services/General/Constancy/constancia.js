import "./constancia.scss"
import {texts} from './texts'
import QRCode from 'qrcode.react';

const Constancy = (props) => {
        const { 
            patientData = [],
            result = '',
            id = '',
            logo = [],
            lang = ['es'],
            studieType = 'PCR Express',
            method = '', 
            validator = '' 
        } = props;

        return (
            <div className="constancyContainer">
                {logo?.length > 0 && (
                    <div className="logosContainer">
                        {logo?.map((el, i) => (
                            <img id='logo' key={i} className="logos" src={el} alt="logo" />
                        ))}
                    </div>                
                )}
                {lang.map((lng) => (
                    <div className='dataContainer'>
                        <div className="patient-data">
                        {patientData[lng].map((row) => (
                            <p>
                                <b>
                                    {row.label}: {row.value}
                                </b>
                            </p>
                        ))}
                        </div>
                        <br/>
                        <div className="constancy-div">
                            <b>
                                {texts[studieType].description.title[lng]}
                            </b>
                        </div>
                        <br/>
                        <div className="constancy-div">
                            <b className="constancy-subtitle">
                                {texts[studieType].description.method[lng]}
                                {method[lng]}
                            </b> <b></b>
                        </div>
                        <br/>
                        <div className="constancy-div">
                            <b>{texts[studieType].description.task[lng]}</b>
                        </div>
                        <br/>
                        <div className="constancy-div">
                            <b className="constancy-subtitle">
                                {texts[studieType].resultData.result[lng]}
                            </b>
                            <b>{result[lng]}</b>
                        </div>
                        <br/>
                        <div className="validation-div">
                            <p>{texts[studieType].resultData.validation[lng]}</p>
                            <span>{validator}</span>
                        </div>
                    </div>                
                ))}
                {/* {id && (
                    <div className="constancy-qr">
                        <QRCode value={`http://uma-health.com/delivery/${id}`} />                        
                    </div>
                )} */}
            </div>
        )
}

export default Constancy;
