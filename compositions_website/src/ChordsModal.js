import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import {useEffect, useRef} from 'react'
import XMLParser from 'react-xml-parser';

export default function ChordsModal({songFile}) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
	  loadSongStructure()
	  setShow(true);
  }
  const [song, setSong] = useState(null)
  
	
	function loadSongStructure() {
		//console.log("LSS",name)
		fetch(songFile)
		  .then(function(response) {
			if (!response.ok) {
			  throw new Error('Failed to fetch the structure file.');
			}
			return response.text();
		  })
		  .then(function(xmlContent) {
			  var xml = new XMLParser().parseFromString(xmlContent);
			  	//console.log('RAW')
			  //console.log(xmlContent)
			  //console.log('XML')
			  //console.log(xml)
			  var currentSection = ""
			  var sections = {}
			  var sectionTimeSignatures = {}
			  var sectionStarts = {}
			  xml.children[6].children.map(function(a) {return a.children.map(function(c) {
				  if (c.children[1] && c.children[1].name === "spName" && c.children[1].value) {
						currentSection = c.children[1].value
						if (!sections.hasOwnProperty(c.children[1].value))  {
							sections[c.children[1].value] = []
							sectionTimeSignatures[c.children[1].value] = c.children[2].value
							sectionStarts[c.children[1].value] = c.children[3].value
						}
					}
					if (currentSection && c.children[1] && c.children[1].name === "spChord") {
						var chord = (c.children[1] && c.children[1].children && c.children[1].children[1]) ? c.children[1].children[1].value : ''
						var pos = ''
						if (currentSection && c.children[2] && c.children[2].name === "spPos") {
							var pos = (c.children[2] && c.children[2].children && c.children[2].children[1]) ? c.children[2].children[1].value : ''
						}
						sections[currentSection].push({chord:chord, pos:pos})
						
						if (currentSection && c.children[2] && c.children[2].name === "spPos") {
							var pos = (c.children[2] && c.children[2].children && c.children[2].children[1]) ? c.children[2].children[1].value : ''
						}
					}
				})})
			  var layout = xml.children[7].children[1].children.map(function(a) {
				return {name:a.children[5].value, bars:a.children[6].value}
			  })
				  //return a.children.map(function(c) {
				  //console.log(c)
				  //return {name:c[5], bars:c[6]}
			  //})})
				  
			  var song = {
				title: xml.children[1].value,
				tempo : xml.children[3].value,
				sections:sections,
				sectionTimeSignatures:sectionTimeSignatures,
				sectionStarts:sectionStarts,
				layout: layout
			  }
			  console.log('SONG')
			  console.log(song)
			  setSong(song)
		  })
	}
	
  return (
    <>
      {!show && <>
		  <Button variant="dark"  size="lg"   onClick={handleShow}> {icons.music} Chords</Button>
		 
	  </>}
	  {show && <>
		  <Button variant="danger"  size="lg"  onClick={handleClose}>{icons.music} Chords</Button>
		  
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose} >
		  	 <ChordsLayout song={song} />
		  </Modal>

	   </>}
      
    </>
  );
}
	
//{(notationFile && osmd.current ) && osmd.current}
