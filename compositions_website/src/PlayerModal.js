import { useEffect, useState , useRef} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import MIDIFile from './MIDIFile'
import useMidiPlayer from './useMidiPlayer'
import WindowFocusHandler from './WindowFocusHandler'
import ChordsLayout from './ChordsLayout'
import {nameFromPath} from './utils'
var webaudiofont = require('webaudiofont');

export default function PlayerModal({midiFile, meta, loadSongStructure , song, name}) {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  var instrumentOptions = useRef([])
  var [drumVolume, setDrumVolume] = useState(100)
  var iopts = useRef([])
  var allDrumOptions = useRef([])
  var dopts = useRef([])
  
  function onLoaded() {
	if (instrumentOptions.current.length > 0) {
		  
	  } else {
		instrumentOptions.current = midiPlayer.getInstrumentOptions()
		iopts.current = Object.keys(instrumentOptions.current).map(function(o,ok) {
			var name = instrumentOptions.current[o]
			return <option key={ok} value={ok} >{name}</option>
		})
		allDrumOptions.current = midiPlayer.getDrumOptions()
		dopts.current = Object.keys(allDrumOptions.current).map(function(o,ok) {
			var name = allDrumOptions.current[o]
			return <option key={ok} value={ok} >{name}</option>
		})
		
		//console.log(allDrumOptions.current, instrumentOptions.current)
	  }  
  }
  
  const midiPlayer = useMidiPlayer({onProgress: setProgress, onLoaded: onLoaded})
  //useEffect(function() {
	  
	
  //},[midiFile])
  
  function handleClose() {
	  midiPlayer.pause()
	  setProgress(0)
	  setShow(false);
   }
  
  function handleShow() {
	  loadSongStructure('./JJazzLab/'+name+".sng")
	  setProgress(0)
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
  //var instrumentOptions = [] //Object.values(midiPlayer.getInstrumentOptions())
  //console.log('OPT',trackOptions)
  
  var m = meta ? meta  : {}
  
  return (
    <>
      {!show && <Button variant="primary" size="lg"  onClick={handleShow}><span >{icons.midi} {icons.play}</span> MIDI</Button>}
	  {show && 
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose}>
			<WindowFocusHandler onFocus={onFocus} onBlur={onBlur} />
			<Modal.Header closeButton ><h3>{m.title}</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>{m.composer}</i></Modal.Header>
			<Modal.Body>
			<Button variant="danger" size="lg" style={{float:'left', maxWidth: '5em', marginBottom:'1em'}}  onClick={handleClose}>{icons.stop}</Button> 
			<input style={{float:'left',width:'90%', marginLeft:'1em', height:'1.8em'}} type="range" min="0" max="100" value="0" step="1" value={progress} onInput={function(e) { midiPlayer.seek(e.target.value); setProgress(e.target.value);}} />
			<h4 style={{clear:'both', marginTop:'2em'}} >Tracks</h4>
			<div>
			{trackOptions.map(function(instrument, instrumentKey) {
				midiPlayer.getTrackInstrument(instrumentKey)
				return <div key={instrumentKey} style={{clear:'both', height:'2em'}} >
					<div style={{float:'left', width: '20em', fontWeight:'bold'}}>
						<select value={midiPlayer.getTrackInstrument(instrumentKey)} onChange={function(e) {
							console.log('SET',instrumentKey, e.target.value)
							midiPlayer.setInstrument(instrumentKey, e.target.value)
						}} >{iopts.current}</select>
					</div> 
					<input type="range" value={midiPlayer.getTrackVolume(instrumentKey)} onChange={function(e) {midiPlayer.setVolume(instrumentKey, e.target.value)} } style={{float:'left', width:'50%'}} /></div>
			})}
			</div>
			<hr/>
			{drumOptions.length > 0 && <div>
				<h4 style={{float:'left', marginTop:'0.5em', width: '14em'}}>Drums</h4> &nbsp;&nbsp;&nbsp;
				<input type="range" value={drumVolume} onChange={function(e) {
					setDrumVolume(e.target.value)
					drumOptions.forEach(function(instrument, instrumentKey) {
						midiPlayer.setDrumVolume(instrumentKey, e.target.value)
					})
				} }  style={{float:'left', width:'50%'}} /></div>}
			<div>
			{drumOptions.map(function(instrument, instrumentKey) {
				return <div key={instrumentKey} style={{clear:'both', height:'2em'}} >
					<div style={{float:'left', width: '20em', fontWeight:'bold'}}>
						{instrument}
					</div> 
					 <input type="range" value={midiPlayer.getTrackDrumVolume(instrumentKey)} onChange={function(e) {midiPlayer.setDrumVolume(instrumentKey, e.target.value)} }  style={{float:'left', width:'50%'}} /></div>
			})}
			</div>
			{drumOptions.length > 0 && <hr/>}
			<div style={{float:'right', border:'1px solid black', padding:'0.5em'}} >
		  	 <ChordsLayout song={song} />
		  	 </div>
			{(meta && meta.lyrics) && <div style={{margin:'1em', fontSize:'1.7em'}} >{meta.lyrics.map(function(l, lk) {
				return (l.trim().length > 0) ?  <div key={lk}  >{l}</div> : <div  key={lk} ><br/></div>
			})}</div>}
			</Modal.Body>
		  </Modal>}
      
      
      
    </>
  );
}
//<select value={midiPlayer.getTrackDrum(instrumentKey)} onChange={function(e) {
							//console.log('SET',instrumentKey, e.target.value)
							//midiPlayer.setDrum(instrumentKey, e.target.value)
						//}} >{dopts.current}</select>
