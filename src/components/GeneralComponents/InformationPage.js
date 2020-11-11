import React, { useEffect }  from "react";
import '../../styles/generalcomponents/InformationPage.scss';
import * as DetectRTC from 'detectrtc';



const InformationPage = ({
  callback = () => console.log('empty'),
  title = 'temporary title',
	button = 'button',
	texts = [],
  imgProps = {
    styles: {},
    img: ''
  },
  optionalText = {
    class: '',
    text: ''
  }
}) => {
    const [install, setInstall] = React.useState(true);

    useEffect(() => {
      //console.log(DetectRTC.isWebsiteHasWebcamPermissions())
      DetectRTC.load(function () {
        // console.log(DetectRTC.osName)
        if (DetectRTC.osName === "iOS") {
          setInstall(false)
        }
      });
    }, []);


  return (
    <div className="information__container">
      <section className={imgProps.img ? "welcome" : "welcome withoutImg"}>
        {imgProps.img && 
          <div className='imgContainer'>
            <img src={imgProps.img} style={imgProps.styles} className='imgContainer__image' /> 
          </div>
        }
        <div className="titleContainer">
          <h2 className="titleContainer__title mt-2">{title}</h2>
        </div>
        <div className="textContainer">
          {texts.map((text, index) => (
            <p className='textContainer__message' key={index}>
              {text}
            </p>
          ))}
          {/* <span className="textContainer__message">
        {text}
          <span onClick={() => props.showInstallPrompt()} className="link"></span> 
          </span> */}
          <br />
          <div className="textContainer__instalar mt-4">
            {install ?
              <button className="button__instalar" onClick={callback}>{button}</button>
              :
              <button className="button__instalar" onClick={callback} >Continuar</button>
            }
            <br/><br/>
            {optionalText.text &&
              <div className={optionalText.class}>
                {optionalText.text}
              </div>
            }
          </div>
        </div>
        {/* <AddToHomescreen onAddToHomescreenClick={() => handleAddToHomescreenClick()} title="Instalar UMA" icon={logo} /> */}
      </section>
    </div>
  );
};

export default InformationPage;
