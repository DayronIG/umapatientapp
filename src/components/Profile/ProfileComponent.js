import React, { useEffect, useState, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PersonalData, ProfilePic } from './ProfileForms';
import { EditButton } from './EditComponent';
import { UserProfile, UserPic } from './UserProfile';
import { SignOut } from '../User/Login';
import { setAntecedentsActive } from '../../store/actions/firebaseQueries';
import ProfileAntecedents from './ProfileAntecedents';
import BackButton from '../GeneralComponents/Backbutton';
import MobileModal from '../GeneralComponents/Modal/MobileModal';
import Version from '../GeneralComponents/Version';
import moment from 'moment-timezone';
import Analysis from '../../assets/illustrations/Analysis.png';
import '../../styles/profile/profile.scss';

const ProfileComponent = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const { beneficiaries } = useSelector(state => state.queries)
	const { section } = useSelector((state) => state.front);
	const patient = useSelector(state => state.user)
	const userHistory = useSelector(state => state.userHistory)
	const modal = useSelector((state) => state.front.openDetails)
	const [questionnaireModal, setQuestionnaireModal] = useState(false) 
	const [patientAge, setPatientAge] = useState(null)
	const [beneficiaryAge, setBeneficiaryAge] = useState(null)
	const [selected, setSelected] = useState('owner')
	const [dataBeneficiary, setDataBeneficiary] = useState('')
	const [viewData, setViewData] = useState('data')

	useEffect(() => {
		dispatch(setAntecedentsActive())
		if(!userHistory.completed) {
			setQuestionnaireModal(true)
		}
	}, [patient])

	const setAge = () => {
		let pYears = moment().diff(patient.dob, 'years')
		setPatientAge(pYears)
		let bYears = moment().diff(dataBeneficiary.dob, 'years') 
		setBeneficiaryAge(bYears)
	} 

	useEffect(() => {
		if(selected !== 'owner') {
			const beneficiaryIndex = beneficiaries.findIndex(p => p.id === selected)
			setDataBeneficiary(beneficiaries[beneficiaryIndex])
		}
		setAge()
	}, [selected, beneficiaries, patient.dob, dataBeneficiary.dob]);

	const selectBeneficiary = useCallback((active)=> {
        if (active === 'owner') {
            setSelected('owner')
        } else {
            let currentDependant = beneficiaries.find(p => p.id === active)
            setSelected(currentDependant.id)
        }
    }, [beneficiaries]);

	const EditSection = () => { 
		if (section === 'personal') {
			return <PersonalData user={selected === 'owner' ? patient : dataBeneficiary} />;
		} else if (section === 'pic') {
			return <ProfilePic user={selected === 'owner' ? patient : dataBeneficiary} />;
		} else {
			return 'Esta sección aún no se encuentra disponible';
		}
	};

	return (
		<Fragment>
			{modal && (
				<MobileModal title='Editar datos'
				callback={()=>{dispatch({type:"TOGGLE_DETAIL", payload:false})}}>
					<EditSection />
				</MobileModal>
			)}
			<BackButton/>
			{questionnaireModal && 
				<MobileModal callback={()=>setQuestionnaireModal(false)} >
					<div className='bgModal'>
						<img src={Analysis} alt='board and pencil' className='imgModal'/>
						<section className='modalText'>
							<h1>Tus antecedentes</h1>
							<p>Para personalizar nuestra atención, ¡te aconsejamos completar tus antecedentes de salud!</p>
						</section>
						<section className='modalActions'>
							<button className='getStarted' onClick={()=> history.push(`/antecedents/${patient.id}/risk`)}>Comenzar</button>
							<button onClick={()=> setQuestionnaireModal(false)}>Ahora no</button>
						</section>
					</div>
				</MobileModal>
			}
			<main className='profile-container'>
				<section className='profile-header-info'>
					{selected === 'owner' ?
							<UserPic patient={patient}/>
						:
							<UserPic patient={dataBeneficiary}/>
					}
					<select className='select-beneficiary' onChange={(p) => selectBeneficiary(p.target.value)}>
                        <option key={123} value={`owner`}> {patient.fullname} </option>
                    	{beneficiaries?.map((p, index) => {
                        	return <option key={index} value={`${p.id}`}> {p.fullname} </option>
                    })}
                    </select> 
					{selected === 'owner' ?
						patientAge && 
							<h2 className='patient-age'>
								{patientAge} años
							</h2>
						: 
						beneficiaryAge &&
							<h2 className='patient-age'>
								{beneficiaryAge} años
							</h2>				
					} 
				</section>
				{selected === 'owner' && userHistory.active &&
					<section className='personal-data'>
						<h2 
							className={viewData === 'data'? 'data-section clicked' : 'data-section'} 
							onClick={()=>setViewData('data')}>
								Mis datos
						</h2>
						<h2 
							className={viewData === 'background'? 'data-section clicked ' : 'data-section'} 
							onClick={()=> setViewData('background')}>
								Mis antecedentes
						</h2>
					</section> 
				}
				<section className='profile-info'>
					{viewData === 'data' &&
						<div>
							<div className='header-section-info'>
								<h3 className='text'>Datos personales</h3> 
								<div className='edit-info'>
									<p>Editar</p>
									<EditButton section='personal' className='btn-edit' clase='personal' />
								</div>
							</div>
							{selected === 'owner' &&
								<UserProfile patient={patient}/>
							}
							{selected !== 'owner' && 
								<UserProfile patient={dataBeneficiary}/>
							} 
						</div>
					}
					{viewData === 'background' 
						&& selected === 'owner' 
						&& <ProfileAntecedents/>}
				</section>
				<section className='logOut'>
					<button 
						onClick={async () => {
							await SignOut();
							dispatch({ type: 'RESET_USER_DATA' });
							dispatch({type: 'RESET_USER_HISTORY'});
							history.replace('/');
						}} 
						className="btn-log-out">
							Cerrar sesión
					</button>
				</section>
				<div className='umaVersion'>
					<Version />
				</div>
			</main>
		</Fragment>
	);
};
export default ProfileComponent;
