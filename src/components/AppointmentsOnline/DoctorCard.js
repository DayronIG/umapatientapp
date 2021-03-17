import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { getDoctor } from '../../store/actions/firebaseQueries';
import Loading from '../GeneralComponents/Loading';
import '../../styles/onlinedoctor/DoctorCard.scss';

const DoctorCard = (props) => {
    const [firstOption, setFirstOption] = useState()


    useEffect(() => {
        getDoctor(props.doctor.cuil).then(res => {
            setFirstOption(res)
        })
    }, [props.doctor])

    return (
        <>
            {!!firstOption ?
                <div className="doctorCard-container disable-selection">
                    <div className="doctorCard-firstRow"> 
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
                </div>
                :
                <Loading />
            }
        </>
    )
}

export default withRouter(DoctorCard)