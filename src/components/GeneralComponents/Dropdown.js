import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/generalcomponents/dropdown.scss';

const Dropdown =({ title, items = [], multiSelect = false, action = () => {} }) => {
  const [open, setOpen] = useState(false)
  const [selection, setSelection] = useState([])
  let menuRef = useRef(null);
  
  useEffect(() => {
    action(selection)
  }, [selection])
    
  let handleClickOutside = (e) => {
      if(menuRef.current === null) return
      if(menuRef && !menuRef.current.contains(e.target)) setOpen(false)
  }

  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside, true);
    return () => {
      document.body.addEventListener('click', handleClickOutside, true);
    }
  }, [menuRef])

  function handleOnClick(item) {
    if (!selection.some(current => current.id === item.id)) {
      if (!multiSelect) {
        setSelection([item]);
      } else if (multiSelect) {
        setSelection([...selection, item]);
      }
    }else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        current => current.id !== item.id
      );
      setSelection([...selectionAfterRemoval]);
    }
  }
  
    function isItemInSelection(item) {
      if (selection.find(current => current.id === item.id)) {
        return true;
      }
      return false;
    }

  return (
    <div className='wrapper__select'>
        <div className='dropdown__btn' role='button' tabIndex={0} onClick={()=> setOpen(!open)}>
            <div className="select__title">
              <p className="select__title__bold">{title}</p>
            </div>
            <div className='select__action'>
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
        </div>
        <div ref={menuRef}>
            {open && (
                <ul className='select__list'>
                    {items.map(item => (
                        <li className='list__item' key={item.id}>
                            <button onClick={()=> handleOnClick(item)}>
                              <span className={isItemInSelection(item) ? 'value Selected' : 'value'}>{item.value}</span>
                              {isItemInSelection(item) && <FontAwesomeIcon icon={faTimes}/>}
                            </button>
                            <div className='lineDrop'></div>
                        </li>
                        )
                    )}
                </ul>
            )}
        </div>
    </div>
  )
}

export default Dropdown;
