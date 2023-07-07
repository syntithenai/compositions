import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect} from 'react'

import YouTube from 'react-youtube';

export default function YoutubeModal({youtubeId}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const opts = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    };


  function _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  return (
    <>
      {!show && <>
		  <Button variant="primary"  onClick={handleShow}>{icons.play}</Button>
		 
	  </>}
	  {show && <>
		  <Button variant="danger" onClick={handleClose}>{icons.stop}</Button>
		  
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose} >
		  	return <YouTube videoId="{youtubeId}" opts={opts} onReady={this._onReady} />;
		
		  </Modal>

	   </>}
      
    </>
  );
}
	
