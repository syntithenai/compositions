import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect} from 'react'
import ChordsLayout from './ChordsLayout'
 

export default function LyricsModal({meta, loadSongStructure ,song, name}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
	  loadSongStructure('./JJazzLab/'+name+".sng")
	  setShow(true);
	 }
  
var m = meta ? meta  : {}
  return (
    <>
      {(!show || !meta) && <>
		  <Button variant="dark"  size="lg"  onClick={handleShow}>{icons.quill} Lyrics</Button>
		 
	  </>}
	  {(show && meta) && <>
		  <Button variant="danger"  size="lg"  onClick={handleClose}></Button>
		  
		  <Modal dialogClassName="media-modal-full" show={show} onHide={handleClose} >
			<Modal.Header closeButton ><h3>{m.title}</h3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>{m.composer}</i></Modal.Header>
			<Modal.Body >
			 <div className="optional-chords" style={{float:'right', border:'1px solid black', padding:'0.5em'}} >
		  	 <ChordsLayout song={song} />
		  	 </div>
		  	{(meta && meta.lyrics) && <div style={{margin:'1em', fontSize:'1.7em'}} >{meta.lyrics.map(function(l,lk) {
				return (l.trim().length > 0) ?  <div key={lk} >{l}</div> : <div key={lk} ><br/></div>
			})}</div>}
			</Modal.Body >
		  </Modal>

	   </>}
      
    </>
  );
}
	
