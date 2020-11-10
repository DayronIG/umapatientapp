import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Camera from '../../GeneralComponents/Camera';
import { uploadFileToFirebase } from '../../Utils/postBlobFirebase';
import moment from 'moment';
import { Loader } from '../../GeneralComponents/Loading';
import '../../../styles/inputs/picture/PictureComponent.scss';

var files = [];
var urls = [];

const PictureCapture = ({innerText = "", quantity = 3, modal = false, finalAction}) => {

  const [count, setCounter] = useState(0);
  const [date] = useState(moment().format('YYYYMMDDHHmmss'))
  const { dni } = useSelector(state => state.queries.patient);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // const handleReset = () => {
  //   setCounter(0);
  //   setModal(false);
  //   files = [];
  // };

  const storeImage = async (photo) => {
    files.push(photo);
    setCounter(files.length);
    if (files.length >= quantity) {
      setLoading(true);
      await handleSubmit();
      setLoading(false);
      setCounter(0);
      finalAction();
    };
  };

  const handleSubmit = async () => {
    for (var i = 0; i < quantity; i++) {
      urls[i] = await uploadFileToFirebase(files[i], `/${dni}/photo/dermatology/${date}_${i}.png`);
    };

    let biomarker = {
      photos: urls,
    };
    
    dispatch({ type: 'SET_ASSESSMENT_BIOMARKER', payload: biomarker });
    dispatch({ type: 'SAVE_FILES', payload: urls });
  };

  if(innerText === ""){
    innerText = `Toma ${quantity} fotos de tu lesión...`
  }

  const innerHtmlToRender = 
  <div className="picture-container">
    <div className="title">
      <b>{innerText}</b>
      <br></br>
      { quantity > 1 ? <b>Sacaste <b className="bold"> {count} </b> fotos</b> : "" }
    </div>
  </div>;

  return (
    <>
      { 
        loading ? 
        <div className="p-5 text-center">
          <Loader /> 
        </div>
        :
        <Camera facingMode="environment"
          onTakePhoto={storeImage}
          errorHandler={(e) => console.log(e)}
          dataType="blob"
          className="camera"
          innerHtmlToRender={innerHtmlToRender}
          modal={modal} 
        />
      }
    </>
  );
};

export default PictureCapture;
