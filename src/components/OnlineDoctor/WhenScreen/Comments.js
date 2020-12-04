import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import StarRatings from 'react-star-ratings';

const Comments = () => {
    const [nocomments, setNocomments] = useState(false);
	const { feedback } = useSelector((state) => state.queries);

    useEffect(() => {
		let haveComments = feedback.find((each) => each.notes !== '');
		if (!haveComments) {
			setNocomments(true);
		} else {
			setNocomments(false);
		}
    }, [feedback]);
    
    return (
        <div className='feedback-container'>
            {nocomments && (
                <small className='feedback-no-comments'>Este médico aún no ha recibido comentarios</small>
            )}
            {feedback?.map(
                (comment) =>
                    comment.notes !== '' && (
                        <div className='feedback-comment' key={comment.dt}>
                            <div className='feedback-stars'>
                                {comment.doc_eval &&
                                    comment.doc_eval !== '' &&
                                    comment.doc_eval !== '0' && (
                                        <StarRatings
                                            rating={parseFloat(comment.doc_eval, 2)}
                                            starRatedColor='blue'
                                            numberOfStars={5}
                                            name='rating'
                                            starSpacing='1px'
                                            starDimension='15px'
                                        />
                                    )}
                            </div>
                            {comment.notes}
                            <div className='feedback-date'>
                                {moment(comment.dt).format('DD/MM/YY hh:mm')}
                            </div>
                        </div>
                    )
            )}
        </div>
    )
}

export default Comments