import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import MIDIFile from './MIDIFile'
import {useEffect} from 'react'
import useMidiPlayer from './useMidiPlayer'
import WindowFocusHandler from './WindowFocusHandler'
var webaudiofont = require('webaudiofont');



export default function PlayerModal({midiFile, meta}) {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const midiPlayer = useMidiPlayer({onProgress: setProgress})
  
  function handleClose() {
	  midiPlayer.pause()
	  setShow(false);
   }
  
  function handleShow() {
	  setShow(true);
	  midiPlayer.loadMidi(midiFile)
  }  
  
  	// User has switched back to the tab
	const onFocus = () => {
		//console.log("Tab is in focus");
		//midiPlayer.start()
	};

	// User has switched away from the tab (AKA tab is hidden)
	const onBlur = () => {
		handleClose()
	};

  //var midiPlayer = useMidiPlayer()
  //console.log(midiPlayer)
  
  //useEffect(function() {
	  ////console.log('MIDIFILECHANGE',midiFile)
  //},[midiFile])
  var trackOptions = Object.values(midiPlayer.getTrackInstruments())
  var drumOptions = Object.values(midiPlayer.getTrackDrums())
  
  //console.log('OPT',trackOptions)
  
  
  return (
    <>
      {!show && <Button variant="success" size="lg"  onClick={handleShow}>{icons.play} Midi</Button>}
	  {show && 
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose}>
			<WindowFocusHandler onFocus={onFocus} onBlur={onBlur} />
			<Modal.Body>
			<Button variant="danger" size="lg" style={{float:'left', maxWidth: '5em', marginBottom:'1em'}}  onClick={handleClose}>{icons.stop}</Button> 
			<input style={{float:'left',width:'90%', marginLeft:'1em', height:'1.8em'}} type="range" min="0" max="100" value="0" step="1" value={progress} onInput={function(e) { midiPlayer.seek(e.target.value); setProgress(e.target.value);}} />
			<h4 style={{clear:'both', marginTop:'2em'}} >Tracks</h4>
			<div>
			{trackOptions.map(function(instrument, instrumentKey) {
				return <div style={{clear:'both', height:'2em'}} ><div style={{float:'left', width: '13em', fontWeight:'bold'}}>{instrument}</div> <input type="range" value={midiPlayer.getTrackVolume(instrumentKey)} onChange={function(e) {midiPlayer.setVolume(instrumentKey, e.target.value)} } style={{float:'left', width:'50%'}} /></div>
			})}
			</div>
			<hr/>
			<h4 style={{clear:'both', marginTop:'0.5em'}}>Drums</h4>
			<div>
			{drumOptions.map(function(instrument, instrumentKey) {
				return <div style={{clear:'both', height:'2em'}} ><div style={{float:'left', width: '13em', fontWeight:'bold'}}>{instrument}</div> <input type="range" value={midiPlayer.getTrackDrumVolume(instrumentKey)} onChange={function(e) {midiPlayer.setDrumVolume(instrumentKey, e.target.value)} }  style={{float:'left', width:'50%'}} /></div>
			})}
			</div>
			{(meta && meta.lyrics) && <div style={{margin:'1em', fontSize:'1.7em'}} >{meta.lyrics.map(function(l) {
				return (l.trim().length > 0) ?  <div>{l}</div> : <div><br/></div>
			})}</div>}
			</Modal.Body>
		  </Modal>}
      
      
      
    </>
  );
}
