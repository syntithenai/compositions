import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect} from 'react'

import YouTube from 'react-youtube';

export default function YoutubeModal({youtubeId, meta}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const opts = {
      height: '600',
      width: '90%',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };

var m = meta ? meta  : {}
  function _onReady(event) {
    // access to player in all event handlers via event.target
    //event.target.pauseVideo();
  }

  return (
    <>
      {!show && <>
		  <Button variant="danger"  size="lg"  onClick={handleShow}>{icons.youtube}  {icons.play} YouTube</Button>
		 
	  </>}
	  {show && <>
		  <Button variant="danger"  size="lg"  onClick={handleClose}>{icons.stop}</Button>
		  
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose} >
		  <Modal.Header closeButton ><h3>{m.title}</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>{m.composer}</i></Modal.Header>
		  	<YouTube videoId={youtubeId} opts={opts} onReady={_onReady} />
		
		  </Modal>

	   </>}
      
    </>
  );
}
	
