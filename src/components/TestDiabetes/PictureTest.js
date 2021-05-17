import React, {useState} from 'react'
import Camera from '../../components/GeneralComponents/Camera'
import { useSelector, useDispatch } from 'react-redux';
import { Loader } from '../GeneralComponents/Loading';
import logo from '../../assets/icons/icon.png';
import '../../styles/inputs/picture/PictureComponent.scss';
import { uploadFileToFirebase } from '../Utils/postBlobFirebase';
import './diabetes.scss'
import moment from 'moment'
import axios from "axios"
import { CustomUmaLoader } from '../global/Spinner/Loaders';



const IndexDiabetes = ({step, setStep}) => {
    const [camera, setCamera] = useState('true')
    const { core_id } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState('');
    const [probability, setProbability] = useState('');
    const dispatch = useDispatch();
    

    const activateCamera = () => {
        if(camera === 'false' && prediction === ''){
            setCamera('true')
        }
        else if (camera === 'true' && prediction === ''){
            setCamera('false')
        }
        else if(camera === 'false' && prediction !== '' ){
            setCamera('true')
            setPrediction('')
        }
        else{
            console.log('error')
        }}

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
            // console.log(res.data)
            if(res.data.prediction === 'non_diabetic'){
                setPrediction('NEGATIVO')
                setProbability((res.data.probability * 100).toFixed())
            }
            else{
                setPrediction('POSITIVO')
                setProbability((1 - res.data.probability * 100).toFixed())
            }})
        setCamera('false')
		setTimeout(() => setLoading(false), 2000);
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
        <CustomUmaLoader/>
        </>
        :
            camera === 'true'  ? 
            <>
            <Camera 
                        facingMode="user"
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
            <div className="testDiabetes__main">
                <img src={logo}></img>
                <h1>Tu test dio <span>{prediction}</span></h1>
                <h1>Con un <span>{probability}%</span> de probabilidad</h1>
                <div className="testDiabetes__button">
                    <button onClick={activateCamera}>Repetir Test</button>
                </div>
            </div>
            </>}
        </>
    )
}

export default IndexDiabetes
