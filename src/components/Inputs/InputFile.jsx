import React from 'react';
import { faFolderOpen, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/inputs/inputFile.scss';

function InputFile({
	title = '',
	value = '',
	inputProps = {},
}) {
	return (
		<div className='inputFile'>
			<div className='inputFile__container'>
				<h6 className='inputFile__container--title'>{title}</h6>
				{value ? '' : <span className='inputFile__container--warning'>&nbsp;*</span>}
			</div>
			<label htmlFor={inputProps.id} className='inputFile__label'>
				<div className='inputFile__label--preview'>
					{value ?
						<img src={value} alt='DNI' />
						:
						<FontAwesomeIcon className='folder' icon={faFolderOpen} />
					}
				</div>
				<span className='inputFile__label--addDoc'>
					<FontAwesomeIcon icon={faPlusCircle} />
				</span>
			</label>
			<input
				type='file'
				className='inputFile__input'
				{...inputProps}
			/>
		</div>
	)
}

export default InputFile;