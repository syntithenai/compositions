import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect} from 'react'

import OpenSheetMusicDisplay from './OpenSheetMusicDisplay'


export default function NotationModal({notationFile}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  return (
    <>
      {!show && <>
		  <Button variant="primary"  onClick={handleShow}>{icons.music}</Button>
		 
	  </>}
	  {show && <>
		  <Button variant="danger" onClick={handleClose}>{icons.music}</Button>
		  
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose} >
		  	{notationFile && <OpenSheetMusicDisplay file={notationFile} />}
		
		  </Modal>

	   </>}
      
    </>
  );
}
	
