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

        const date = moment().format('YYYYMMDDHHmm')
        const url = await uploadFileToFirebase(file, `/${core_id}/labs/diabetes_${date}.png`);

        let data = {
            bucket_name: "uma-v2.appspot.com",
            blob_path: url,
        };

        axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => {
            console.log(url)
            console.log(res)
        })
    };

    const innerHtmlToRender =
        <div className="picture-container">
            <div className="title">
                <h2>Encuadrate lo más derecho que puedas</h2>
            </div>
        </div>;

    return (
        <>
        {camera == 'false' ?
        <>
            <div className="testDiabetes__main">
                <h1>Test Diabetes</h1>
                <div className="testDiabetes__button">
                    <button onClick={activateCamera}>Tomar Foto</button>
                </div>
            </div>
            
        </>
            :
            <>
            <Camera 
                        facingMode="environment"
                        onTakePhoto={handleSubmit}
                        errorHandler={(e) => console.log(e)}
                        dataType="blob"
                        className="camera"
                        innerHtmlToRender={innerHtmlToRender}
                         />
            </>}
        </>
    )
}

export default TestDiabetes
