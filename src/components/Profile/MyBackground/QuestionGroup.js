import React from 'react';
import '../../../styles/profile/antecedents.scss';

const QuestionGroup = (props) => {
    return (
        <section className='questionGroup'>
            <p className='question'>{props.question}</p>
            <div className='answers'>
                {props.children}
            </div>
        </section>
    )
}

export default QuestionGroup;
