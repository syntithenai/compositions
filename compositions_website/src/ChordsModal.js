import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect, useRef} from 'react'
import XMLParser from 'react-xml-parser';
import ChordsLayout from './ChordsLayout'

export default function ChordsModal({songFile, loadSongStructure ,song, meta}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
	  loadSongStructure(songFile)
	  setShow(true);
  }
 
	var m = meta ? meta : {}
  return (
    <>
      {!show && <>
		  <Button variant="dark"  size="lg"   onClick={handleShow}> {icons.music} Chords</Button>
		 
	  </>}
	  {show && <>
		  <Button variant="danger"  size="lg"   onClick={handleClose}>{icons.music} Chords</Button>
		  
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose} >
			<Modal.Header closeButton ><h3>{m.title}</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>{m.composer}</i></Modal.Header>
			<Modal.Body>
			 <ChordsLayout song={song} fontSize="1.2em" />
		  	</Modal.Body>
		  </Modal>

	   </>}
      
    </>
  );
}
	
//{(notationFile && osmd.current ) && osmd.current}
