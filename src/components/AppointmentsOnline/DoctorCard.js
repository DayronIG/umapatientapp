import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import StarRatings from 'react-star-ratings';
import { getDoctor, getFeedback } from '../../store/actions/firebaseQueries';
import Loading from '../GeneralComponents/Loading';
import '../../styles/onlinedoctor/DoctorCard.scss';

const DoctorCard = (props) => {
    const dispatch = useDispatch()
    const [firstOption, setFirstOption] = useState()
    var timeDelay = classnames('timeDelay', {
        'verygood': firstOption && firstOption.metrics && firstOption.metrics.punctuality <= 0.5,
        'good': firstOption && firstOption.metrics && firstOption.metrics.punctuality > 0.5 && firstOption.metrics.punctuality < 1.5,
        'regular': firstOption && firstOption.metrics && firstOption.metrics.punctuality >= 1.5
    })

    useEffect(() => {
        getDoctor(props.doctor.cuil).then(res => {
            setFirstOption(res)
        })
    }, [props.doctor])

    function viewComments(doc) {
        getFeedback(doc)
            .then(res => {
                dispatch({ type: 'SET_FEEDBACK', payload: res })
                dispatch({ type: 'TOGGLE_DETAIL' })
            })
    }

    return (
        <>
            {!!firstOption ?
                <div className="doctorCard-container disable-selection">
                    <div className="doctorCard-firstRow" > 
                        <div className="doctorCard-photoContainer">
                            <img src={firstOption?.path_profile_pic} alt="Doctor" className="doctorImage" />
                        </div>
                        <div className="doctorCard-doctorInfo">
                            <div className="doctorName"><b>{firstOption.fullname}</b></div>
                            {firstOption.metrics &&
                                <>
                                    <div className="doctorStars">
                                        <StarRatings
                                            rating={(firstOption.metrics && firstOption.metrics.stars && parseFloat(firstOption.metrics.stars)) || 5}
                                            starRatedColor="blue"
                                            numberOfStars={5}
                                            name='rating'
                                            starSpacing='1px'
                                            starDimension='15px'
                                        />
                                    </div>
                                    <div className="doctorAtts">
                                        ({firstOption.metrics ?
                                            firstOption.metrics.n_att :
                                            '0'} atenciones)
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className="doctorCard-secondRow">
                        {firstOption.metrics &&
                            <div className={timeDelay}>
                                Puntualidad:  &nbsp;
                                {firstOption.metrics && firstOption.metrics.punctuality <= 0.5 && "Muy buena"}
                                {firstOption.metrics && firstOption.metrics.punctuality > 0.5 && firstOption.metrics.punctuality < 1.5 && "Buena"}
                                {firstOption.metrics && firstOption.metrics.punctuality >= 1.5 && "Regular"}
                            </div>
                        }
                        <div className="doctorCard-comments" onClick={() => viewComments(props.doctor.cuil)}>
                            Ver comentarios
                        </div>
                    </div>
                </div>
                :
                <Loading />
            }
        </>
    )
}

export default withRouter(DoctorCard)