import React, { useEffect, useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from '../../../GeneralComponents/Dropdown';
import { QuestionGroup } from '../QuestionGroup';

const Allergy = () => {
    const patient = useSelector(state => state.user)
    const history = useHistory()
    const dispatch = useDispatch()
    const userHistory = useSelector(state => state.userHistory)
    const [otherAllergy, setOtherAllergy] = useState('');
    const [activeButton, setActiveButton] = useState(false)
    const [personalQuestions, setPersonalQuestions] = useState({
        allergy: null,
        allergyType: [],
    })

    const nextPage = () => {
        window.scroll(0, 0);
        if(activeButton) {
            const previousData = JSON.parse(localStorage.getItem('userHistory'));
            let data = {
                ...previousData,
                allergy: userHistory.allergy,
                allergyType: userHistory.allergyType
            }
            localStorage.setItem('userHistory', JSON.stringify(data));
            history.push(`/antecedents/${patient.id}/operations`)
        }
    }

    const alergies = [
        {
			id: 1,
			value: 'Yodo'
		},
        {
			id: 2,
			value: 'Penicilina'
		},
        {
			id: 3,
			value: 'Aspirina'
		},
        {
			id: 4,
			value: 'Mariscos'
		},
		{
			id: 5,
			value: 'Abejas'
		},
		{
			id: 6,
			value: 'Ácaros'
		}, 
		{
			id: 7,
			value: 'Animales'
		}, 
		{
			id: 8,
			value: 'Avispas'
		},
		{
			id: 9,
			value: 'Frutos secos'
		},
		{
			id: 10,
			value: 'Huevos'
		},
		{
			id: 11,
            value: 'Maní'
		},
		{
			id: 12,
            value: 'Nueces'
		},
		{
			id: 13,
            value: 'Polen'
		},
        {
			id: 14,
            value: 'Leche'
		},
        {
			id: 15,
            value: 'Insectos'
		},
	]

    useEffect(() => {
        if(personalQuestions.allergy !== null) {
            dispatch({type:'USER_HISTORY_ALLERGY', payload: personalQuestions.allergy})
            dispatch({type:'USER_HISTORY_ALLERGY_TYPE', payload: personalQuestions.allergyType})
            setActiveButton(true)
        }
    }, [personalQuestions])

    const handleData =(selection) => {
        let itemValues = []
        selection.length > 0 && selection.map(item=> {
            item && itemValues.push(item.value)
        })
        setPersonalQuestions({...personalQuestions, allergyType: itemValues})
    }

    const deleteAllergy = (item) => {
        let allergyTypeRemove = personalQuestions.allergyType;
        let newArr = []
        newArr = allergyTypeRemove.filter(
          current => current !== item
        );
        dispatch({type:'USER_HISTORY_ALLERGY_TYPE', payload: newArr})
        setPersonalQuestions({...personalQuestions, allergyType: newArr});
    }

    const addAllergy = () => { 
        setPersonalQuestions({...personalQuestions, allergyType: [...personalQuestions.allergyType, otherAllergy]})
    }

    return(
        <section className='contentQuestionnaire'>
            <h3>Antecedentes personales</h3>
            <QuestionGroup question='¿Eres alérgico/a?'>
                    <button
                        className={personalQuestions.allergy === true ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=>setPersonalQuestions({...personalQuestions, allergy: true})}>
                            Sí
                    </button>
                    <button 
                        className={personalQuestions.allergy === false ? 'buttonAnswer focused' : 'buttonAnswer'}
                        onClick={()=>setPersonalQuestions({...personalQuestions, allergy: false})}>
                            No
                    </button>
            </QuestionGroup>
            {personalQuestions.allergy === true && 
            <Fragment>
                <div className='allergies__list'>
                    {personalQuestions.allergyType && personalQuestions.allergyType.map(item=> (
                        <div className='showAllergies'>
                            <p className='allergy__name'>{item}</p>
                            <button className='allergy__delete' onClick={()=> deleteAllergy(item)}>x</button>
                        </div>
                    ))}
                </div>
                <QuestionGroup question='¿A qué?'>
                    <Dropdown title='Seleccionar alergia' items={alergies} multiSelect action={(selection)=> handleData(selection)}/>
                </QuestionGroup>
                 <QuestionGroup question='Añadir otra alergia:'>
                        <input className='other__allergy' id='otro' type='text' onChange={(e)=> setOtherAllergy(e.target.value)}/>
                        <button className='other__allergy__btn' onClick={addAllergy}>Añadir</button>
                </QuestionGroup>
            </Fragment>
            }
            <section className='action__buttons'>
                <button className='btnBackwards'
                    onClick={() => history.goBack()}
                >
                    Anterior
                </button>
                <button 
                    onClick={nextPage} 
                    className={activeButton ? 'btnNext foward' : 'btnNext'}
                >
                    Siguiente
                </button>
            </section>
        </section>
    )
}

export default Allergy;
