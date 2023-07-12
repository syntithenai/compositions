import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect} from 'react'

import AudioPlayer from 'react-modern-audio-player';

import ChordsLayout from './ChordsLayout'

import {nameFromPath} from './utils'

export default function PlayerModal({audioFile, meta, name, song, loadSongStructure}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
	  setShow(true);
	  loadSongStructure('./JJazzLab/'+name+".sng")
	   
	}
	var m = meta ? meta  : {}
  return (
    <>
      {!show && <>
		  <Button variant="success" size="lg" onClick={handleShow}>{icons.headphones} {icons.play} {nameFromPath(audioFile)}</Button>
		 
	  </>}
	  {show && <>
		  <Button variant="danger" size="lg"  onClick={handleClose}>{icons.stop}</Button>
		  
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose} >
			<Modal.Header closeButton ><h3>{m.title}</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>{m.composer}</i></Modal.Header>
		    <Modal.Body>
		  	<audio style={{padding:'1em', width:'90%'}} src={audioFile} controls={true} autoPlay={true} />
		    
		    <div  className="optional-chords" style={{width:'30%', float:'right', border:'1px solid black', padding:'0.5em'}} >
		  	 <ChordsLayout song={song} />
		  	 </div>
		  	 
		    {(meta && meta.lyrics) && <div style={{margin:'1em', fontSize:'1.7em'}} >{meta.lyrics.map(function(l) {
				return (l.trim().length > 0) ?  <div>{l}</div> : <div><br/></div>
			})}</div>}
			</Modal.Body>
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
