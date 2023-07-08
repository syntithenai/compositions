import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect} from 'react'


export default function LyricsModal({meta}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  return (
    <>
      {(!show || !meta) && <>
		  <Button variant="primary"  onClick={handleShow}>Lyrics</Button>
		 
	  </>}
	  {(show && meta) && <>
		  <Button variant="danger" onClick={handleClose}>Lyrics</Button>
		  
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose} >
			<Modal.Header closeButton ><h3>{meta.title}</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>{meta.composer}</i></Modal.Header>
			<Modal.Body >
		  	{(meta && meta.lyrics) && <div style={{margin:'1em', fontSize:'1.7em'}} >{meta.lyrics.map(function(l) {
				return (l.trim().length > 0) ?  <div>{l}</div> : <div><br/></div>
			})}</div>}
			</Modal.Body >
		  </Modal>

	   </>}
      
    </>
  );
}
	
