import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@mui/material';
import './Kakao.css'
import './style.css'


const ContentModal = ({ selectedPlace, closeModal }) => {
    const [address, setAddress] = useState('');
    const modalRef = useRef();
  
    // Click outside to close the modal
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
                alt={selectedPlace.TITLE} 
              />
              <h2 className="place-name">{selectedPlace.TITLE}</h2>
              <p>기간: {selectedPlace.STARTDATE + ' - ' + selectedPlace.END_DATE}</p>
              <p>대상: {selectedPlace.USE_TRGT}</p>
              <p>비용: {selectedPlace.USE_FEE}</p>
              <p>주소: {selectedPlace.ADDRESS}</p>
              <p>코드명: {selectedPlace.CODENAME}</p>
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

  export default ContentModal;