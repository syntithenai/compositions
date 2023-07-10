import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect, useRef} from 'react'

import OpenSheetMusicDisplay from './OpenSheetMusicDisplay'


export default function NotationModal({notationFile, meta}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  
  //var osmd = useRef()
  //useEffect(function() {
	  //try {
		//if (notationFile) osmd.current = 
	  //} catch (e) {
		  //console.log("OSDM ",e)
	  //}
  //},[])
var m = meta ? meta  : {}
  return (
    <>
      {!show && <>
		  <Button variant="dark"  size="lg"   onClick={handleShow}>{icons.music} Notation</Button>
		 
	  </>}
	  {show && <>
		  <Button variant="danger"  size="lg"  onClick={handleClose}>{icons.music}</Button>
		  
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose} >
		  	<Modal.Header closeButton ><h3>{m.title}</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>{m.composer}</i></Modal.Header>
		  	
		<OpenSheetMusicDisplay file={notationFile} />
		  </Modal>

	   </>}
      
    </>
  );
}
	
//{(notationFile && osmd.current ) && osmd.current}
