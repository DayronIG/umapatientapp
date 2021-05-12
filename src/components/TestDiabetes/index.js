import React, {useState} from 'react'
import Camera from '../../components/GeneralComponents/Camera'
import { useSelector, useDispatch } from 'react-redux';
import { Loader } from '../GeneralComponents/Loading';
import '../../styles/inputs/picture/PictureComponent.scss';
import { uploadFileToFirebase } from '../Utils/postBlobFirebase';
import './diabetes.scss'
import moment from 'moment'
import axios from "axios"


const TestDiabetes = () => {
    const [camera, setCamera] = useState('false')
    const { core_id } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState('');
    const [probability, setProbability] = useState('');
    const dispatch = useDispatch();
    

    const activateCamera = () => {
        if(camera === 'false'){
            setCamera('true')
        }
        else{
            setCamera('false')
        }
    }



    const handleSubmit = async (file) => {

        setLoading(true)

        const date = moment().format('YYYYMMDDHHmm')
        const url = await uploadFileToFirebase(file, `/${core_id}/labs/diabetes_${date}.png`);
        const modelURL = 'https://computer-vision-dot-uma-v2.uc.r.appspot.com/diabetes_predictor'

        let data = {
            bucket_name: "uma-v2.appspot.com",
            blob_path: `${core_id}/labs/diabetes_${date}.png`,
        };

        axios.post(modelURL, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            console.log(res.data)

            if(res.data.prediction === 'non_diabetic'){
                setPrediction('NEGATIVO')
                setProbability((res.data.probability * 100).toFixed())
            }
            else{
                setPrediction('POSITIVO')
                setProbability((res.data.probability * 100).toFixed())
            }
        })
        setCamera('false')
        setLoading(false)
    };

    const innerHtmlToRender =
        <div className="picture-container">
            <div className="title">
                <h2>Encuadrate lo más derecho que puedas</h2>
            </div>
        </div>;

    return (
        <>
        {loading ? 
        <>
        <Loader/>
        </>
        :

                camera == 'false' && !prediction ?
        <>
            <div className="testDiabetes__main">
                <h1>Test Diabetes</h1>
                <div className="testDiabetes__button">
                    <button onClick={activateCamera}>Tomar Foto</button>
                </div>
            </div>
            
        </>
            :

            camera === 'true'  ? 
            <>
            <Camera 
                        facingMode="environment"
                        onTakePhoto={handleSubmit}
                        errorHandler={(e) => console.log(e)}
                        dataType="blob"
                        className="camera"
                        innerHtmlToRender={innerHtmlToRender}
                        style={{height:'70%'}}
                         />
            </>
            :
            <>
                <h1 style={{color:'red'}}>Tu test dio {prediction} con un {probability}% de probabilidad</h1>
            </>}
        </>
    )
}

export default TestDiabetes
