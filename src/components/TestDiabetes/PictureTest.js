import React, {useState, useEffect} from 'react'
import Camera from '../../components/GeneralComponents/Camera'
import { useSelector, useDispatch } from 'react-redux';
import { Loader } from '../GeneralComponents/Loading';
import labsicon from '../../assets/labsicon.png'
import '../../styles/inputs/picture/PictureComponent.scss';
import { uploadFileToFirebase } from '../Utils/postBlobFirebase';
import './diabetes.scss'
import moment from 'moment'
import axios from "axios"
import { CustomUmaLoader } from '../global/Spinner/Loaders';
import { useHistory } from 'react-router'
import Test from './Test'

const IndexDiabetes = ({step, setStep}) => {
    const [camera, setCamera] = useState('true')
    const { core_id } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState('');
    const dispatch = useDispatch();
    const history = useHistory()

    const user_test_data = useSelector(state => state.user.diabetic_test)
    const user_test_results = useSelector(state => state.user.diabetic_score)

        useEffect(() => {
        if(user_test_results.probability){
            scoreCalculator()
        }
    }, [user_test_results.probability])
    

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


    const scoreCalculator = () => {
        let calculatedScore = 0
        if (user_test_data.age >= 60 && user_test_data.age < 70) { calculatedScore += 2 }
        if (user_test_data.age >= 70) { calculatedScore += 3 }
        if (user_test_data.sex === "Masculino") { calculatedScore += 2 }
        if (user_test_data.smoker === 'si') { calculatedScore += 2 }
        if (user_test_data.diabetic === 'si') { calculatedScore += 3 }
        if (user_test_data.hypertensive === 'si') { calculatedScore += 2 }
        if (user_test_data.medical_records === 'si') { calculatedScore += 1 }
        if (prediction === 'non_diabetic') { calculatedScore += 0 }
        if (prediction === 'diabetic' &&
            user_test_results.probability > 0.5 &&
            user_test_results.probability < 0.75) { calculatedScore += 2 }
        if (user_test_results.prediction === 'diabetic' &&
            user_test_results.probability >= 0.75) { calculatedScore += 3 }

        dispatch({ type: 'DIABETIC_TEST_SCORE_FILL', payload: {probability:user_test_results.probability, score: calculatedScore}  })

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
            // console.log(res.data)
            if(res.data.prediction === 'non_diabetic'){
                setPrediction('NEGATIVO')
                dispatch({ type: "DIABETIC_TEST_SCORE_FILL", payload: { probability: (res.data.probability * 100).toFixed(), score: user_test_results.score}})

            }
            else{
                setPrediction('POSITIVO')
                dispatch({ type: "DIABETIC_TEST_SCORE_FILL", payload: { probability: (1 - res.data.probability * 100).toFixed(), score: user_test_results.score} })

            }})
        scoreCalculator()
        setCamera('false')
		setTimeout(() => setLoading(false), 5000);
    };

    const innerHtmlToRender = <h2 style={{fontSize:'1.6rem', marginBottom:'5%'}}>Encuadrate lo más derecho que puedas</h2>



    return (
        <>
        {loading ? 
        <>
        <CustomUmaLoader/>
        </>
        :
            camera === 'true'  ? 
            <>
            {/* <Camera 
                        facingMode="user"
                        onTakePhoto={handleSubmit}
                        errorHandler={(e) => console.log(e)}
                        dataType="blob"
                        className="camera"
                        innerHtmlToRender={innerHtmlToRender}
                        style={{height:'70%'}}
                         />
            </> */}
            <Test handleSubmit={handleSubmit}/>
            </>
            :
            user_test_results.probability < 0 || user_test_results.probability === '' ?
            <>
            <div className="testDiabetes__main" >
                <img src={labsicon}></img>
                <div style={{marginTop:'15%'}}>
                                    <h1>No pudimos procesar correctamente tu imagen!</h1>
                                    <h1>Probamos de nuevo?</h1>
                </div>
                <div className="testDiabetes__button">
                    <button onClick={activateCamera}>Repetir Test</button>
                    <button onClick={() => history.go(0)}>Volver Al Inicio</button>
                </div>
            </div>
            </>
            :
            <>
            <div className="testDiabetes__main">
                <div className="testDiabetes__summary">
                    <img src={labsicon}></img>
                    {user_test_results.score <= 5 ? 
                    <h1>Su riesgo cardiovascular es BAJO</h1>
                    :
                    <h1>Su riesgo cardiovascular es ALTO</h1>}
                        <div className="testDiabetes__result">
                            <h2>Su test de diabetes dió {prediction} con una probabilidad de {user_test_results.probability}%</h2>
                            <div className='testDiabetes__range'>
                                0%<input type="range" min="0" max="100" step="5" value={user_test_results.probability} list='tickmarks' />100%
                            </div>
                            <p>Recuerda que la medición no es exacta y puede contener errores.</p>
                        </div>



                </div>
                <div>
                    <h2 style={{ marginTop: '10%' }}>Le sugerimos igualmente completar los chequeos con un médico clínico  y seguir recomendaciones saludables:</h2>
                </div>
                {/* <div className='testDiabetes__resultCard'>
                    <div className="resultCard__firstCol">
                        <h1>Resultado</h1>
                        <div className="circle">
                            <span>{prediction}</span>
                        </div>
                        <span>score: {user_test_results.score}</span>

                    </div>
                    <div className="resultCard__secondCol">
                        <h1>Probabilidad</h1>
                        <div className="circle">
                            <span>{user_test_results.probability}%</span>
                        </div>
                    </div>
                </div> */}



                <div className="resultCard__comments">
                    <ul>
                        <li>No fumar</li>
                        <li>Reducir el consumo de carnes, grasas, embutidos e incoporar una dieta basada en legumbres, granos y vegetales</li>
                        <li>No agregar sal o azúcar a sus comidas y evitar los productos ultraprocesados</li>
                        <li>Mantener actividad física regular al menos 3 veces x semana.</li>
                    </ul>

                </div>

                <div className="testDiabetes__button">
                    <button onClick={() => history.go(0)}>Volver Al Inicio</button>
                    <button className='button1' onClick={activateCamera}>Tomar Otra Foto</button>
                </div>
            </div>
            </>}
        </>
    )
}

export default IndexDiabetes
