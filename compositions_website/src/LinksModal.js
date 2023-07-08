import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect, useRef} from 'react'


export default function LinksModal({links, meta}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  return (
    <>
      {!show && <>
		  <Button variant="primary"  size="lg"   onClick={handleShow}>{icons.download} Download</Button>
		 
	  </>}
	  {show && <>
		  <Button variant="danger"  size="lg"  onClick={handleClose}>{icons.music}</Button>
		  
		  <Modal dialogClassName="media-modalsmall" show={show} onHide={handleClose} closeButton >
		  	<Modal.Header closeButton ><h3>{meta.title}</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>{meta.composer}</i></Modal.Header>
		  	<div style={{padding:'1em'}}>{links.map(function(link) {
				return <div style={{marginTop:'0.5em'}} >{link}</div>
			})}</div>
		  </Modal>

	   </>}
      
    </>
  );
}
	
