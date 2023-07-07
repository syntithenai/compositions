import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect} from 'react'

import AudioPlayer from 'react-modern-audio-player';



export default function PlayerModal({audioFile}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  return (
    <>
      {!show && <>
		  <Button variant="success" size="lg" onClick={handleShow}>{icons.play}</Button>
		 
	  </>}
	  {show && <>
		  <Button variant="danger" size="lg"  onClick={handleClose}>{icons.stop}</Button>
		  
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose} >
		  	<audio style={{padding:'1em', width:'90%'}} src={audioFile} controls={true} autoPlay={true} />
		
		  </Modal>

	   </>}
      
    </>
  );
}
	//
			//<AudioPlayer playList={[
			  //{
				//name: 'name',
				//writer: 'writer',
				//img: 'image.jpg',
				//src: 'ardour/'+audioFile,
				//id: 1,
			  //},
			//]} 
			
			//audioInitialState={{
          //muted: false,
          //isPlaying: true,
          //volume: 1,
          //curPlayId: 1,
        //}}
        //placement={{
          //interface: {
            //templateArea: {
              //trackTimeDuration: "row1-5",
              //progress: "row1-4",
              //playButton: "row1-6",
              //repeatType: "row1-7",
              //volume: "row1-8",
            //},
          //},
          //player: "bottom-left",
        //}}
        //activeUI={{
          //all: true,
          //progress: "waveform",
        //}}
        
			///>
