import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import './Kakao.css'
import './style.css'

const SpaceModal = ({ selectedPlace, closeModal }) => {
    const [address, setAddress] = useState('');
    const modalRef = useRef();
  
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeModal();
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalRef, closeModal]);
  
    return (
      <div className="modal">
        <div className="modal-content" ref={modalRef}>
          <div className="modal-top">
              <img 
                className="place-image" 
                src={selectedPlace.IMG}
                alt={selectedPlace.FAC_NAME} 
              />
              <h2 className="place-name">{selectedPlace.FAC_NAME}</h2>
              <p>{selectedPlace.ADDR}</p>
              <p>요금: {selectedPlace.ENTR_FEE}</p>
              <p>운영시간: {selectedPlace.OPENHOUR}</p>
              <p>휴무일: {selectedPlace.CLOSEDAY}</p>
          </div>
          <Button onClick={closeModal}>Close</Button>
          {selectedPlace.HOMEPAGE && 
            <Button 
              variant="contained"
              color="primary" 
              href={selectedPlace.HOMEPAGE}
              target="_blank"
            >
              방문하기
            </Button>
          }
        </div>
      </div>
    );
  }

  export default SpaceModal;