import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import {Button, ButtonGroup} from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useState, useEffect, useRef} from 'react'
import icons from './Icons'

import files from './files.json'
import metafiles from './metafiles.json'

import PlayerModal from './PlayerModal'
import NotationModal from './NotationModal'
import MediaPlayerModal from './MediaPlayerModal'
import YoutubeModal from './YoutubeModal'
import LyricsModal from './LyricsModal'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import HelpContent from './HelpContent'
import {YouTubeGetID, isYoutubeLink, getBeatsPerBar, mapKeySignature} from './utils'
import HomeTile from './HomeTile'
import XMLParser from 'react-xml-parser';

function App() {
	
	var allNames = {}
	var allSections = {}
	var [filter, setFilter] = useState('')
	var [meta, setMeta] = useState({})
	var [metaHash, setMetaHash] = useState({})
	var splits = files.map(function(file) {
		var fileParts = file.split(" ./")
		var date = fileParts[0]
		var parts = fileParts[1].split("/")
		var section = parts[parts.length - 2]
		var aMarker = parts[parts.length - 3]
		var preFile =  (aMarker === 'contributions') ? './contributions/' : (aMarker === 'ardour' ? './ardour/' : './')
		allSections[section] = section
		var nameParts = parts[parts.length - 1].split(".")
		var name = nameParts.slice(0,-1).join(".").toLowerCase()
		allNames[name] = name
		var type = nameParts[nameParts.length - 1]
		var d = date.trim().split(' ')
		//console.log(d)
		// protect from junk at start of date from cut
		if (d.length > 1) {
			//console.log(d)
			date =  d[1]
		}
		var final = {section:section, name: name, type: type, file:  preFile + 	section + "/" + parts[parts.length - 1], date: date.trim()}
		return final
	})
	
	//var meta = {}
	var metaLinks = {}
	metafiles.forEach(function(file) {
		var parts = file.split("/")
		var nameParts = parts[parts.length - 1].trim().toLowerCase().split(".")
		metaLinks[nameParts[0].toLowerCase()] = './meta/'+parts[parts.length - 1]
	})
	
	var collate = {}
	splits.forEach(function(split) {
		if (!collate[split.name]) collate[split.name] = []
		collate[split.name].push(split)
	})
	
	function hasMeta(name) {
		return metaLinks.hasOwnProperty(name) ? true : false
	}
	
	function loadAllMeta() {
		//console.log("load meta",name, hasMeta(name), meta)
		fetch("meta/selected.abc")
		  .then(function(response) {
			if (!response.ok) {
			  throw new Error('Failed to fetch the ABC file.');
			}
			return response.text();
		  })
		  .then(function(abcContentAll) {
			    var meta = {}
			    abcContentAll.split("\n\n\n").map(function(abcContent) {
					var lines = abcContent.split("\n")
					var name = ''
					var songMeta = {'lyrics':[], 'links':[]}
					//console.log(lines)
					lines.forEach(function(line) {
						if (line.startsWith('T:')) {
							songMeta['title'] = line.slice(2)
							name = line.slice(2).toLowerCase().trim()
						} else if (line.startsWith('C:')) {
							songMeta['composer'] = line.slice(2)
						} else if (line.startsWith('W:')) {
							songMeta['lyrics'].push(line.slice(2))
						}  else if (line.startsWith('% abcbook-link') && !line.startsWith('% abcbook-link-title')) {
							songMeta['links'].push(line.slice(17))
						} 
						
						
					})
					if (name) meta[name] = songMeta
				})
				//console.log('LAM',meta)
				setMeta(meta)
				setMetaHash(JSON.stringify(meta).hashCode())
		  })
			
	
	}
	useEffect(function() {
		loadAllMeta()
		
	},[])
	
	
	function loadMeta(name) {
		//console.log("load meta",name, hasMeta(name), meta)
		//if (hasMeta(name) && !meta[name]) {
			//fetch(metaLinks[name])
			  //.then(function(response) {
				//if (!response.ok) {
				  //throw new Error('Failed to fetch the ABC file.');
				//}
				//return response.text();
			  //})
			  //.then(function(abcContent) {
				  
				  	//var lines = abcContent.split("\n")
					//var songMeta = {'lyrics':[], 'links':[]}
					////console.log(lines)
					//lines.forEach(function(line) {
						//if (line.startsWith('T:')) {
							//songMeta['title'] = line.slice(2)
						//} else if (line.startsWith('C:')) {
							//songMeta['composer'] = line.slice(2)
						//} else if (line.startsWith('W:')) {
							//songMeta['lyrics'].push(line.slice(2))
						//}  else if (line.startsWith('% abcbook-link') && !line.startsWith('% abcbook-link-title')) {
							//songMeta['links'].push(line.slice(17))
						//} 
						
						
					//})
					//var newMeta = meta
					//newMeta[name] = songMeta
					//setMeta(newMeta)
					//setMetaHash(JSON.stringify(newMeta).hashCode())
					////console.log("MM",newMeta)
			  //})
				
		//} 
	}
	
//  {JSON.stringify(collate)}
	var buttonStyle={marginBottom:'0.5em', 'border': '1px solid #0d6efd'}

 const [song, setSong] = useState(null)
  
	
	function loadSongStructure(songFile) {
		//console.log("LSS",name)
		fetch(songFile)
		  .then(function(response) {
			if (!response.ok) {
				setSong({})
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
			  var chordLookups = {}
			  // iterate chords
			  var chordIndex = 1
			  xml.children[6].children.map(function(a) {return a.children.map(function(c) {
				  //console.log(c)
				  // for each chord
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
						if (chord) {
							//console.log(chord)
							chordLookups[chordIndex] = chord
							var pos = ''
							if (currentSection && c.children[2] && c.children[2].name === "spPos") {
								pos = (c.children[2] && c.children[2].children && c.children[2].children[1]) ? c.children[2].children[1].value : ''
							}
							chordIndex = chordIndex + 1
							sections[currentSection].push({chord:chord, pos:pos})
							//console.log("COK",chord, chordIndex, pos)
						} else {
							//console.log(c.children[1])
							if (c.children[1].attributes.reference) {
								if (currentSection && c.children[2] && c.children[2].name === "spPos") {
									var pos = (c.children[2] && c.children[2].children && c.children[2].children[1]) ? c.children[2].children[1].value : ''
									var pa = c.children[1].attributes.reference.split('ChordSymbolImpl[')
									var pb = pa[1].split("]")
									var index = pb[0]
									//console.log('CREF', index, chordIndex, pos)
									
									sections[currentSection].push({chordRef:index, pos:pos})
									chordIndex = chordIndex + 1
									//console.log("Cref",chord)
								}
							} else {
								if (currentSection && c.children[2] && c.children[2].name === "spPos") {
									var pos = (c.children[2] && c.children[2].children && c.children[2].children[1]) ? c.children[2].children[1].value : ''
									//console.log("CBLANK")
									chordIndex = chordIndex + 1
									sections[currentSection].push({chord:'', pos:pos})
								}
							}
							
						}
						
						//if (currentSection && c.children[2] && c.children[2].name === "spPos") {
							//var pos = (c.children[2] && c.children[2].children && c.children[2].children[1]) ? c.children[2].children[1].value : ''
						//}
					}
				})})
				//console.log(chordLookups)
				//console.log(sections)		
				Object.keys(sections).forEach(function(section) {
					//console.log(section)		
					if (Array.isArray(sections[section])) {
						//console.log(sections[section])		
						sections[section] = sections[section].map(function(chordMeta) {
							//console.log(chordMeta)		
							if (chordMeta && chordMeta.chord) {
								
								return chordMeta
							} else if (chordMeta && chordMeta.chordRef) {
								
								var chord = chordMeta && chordLookups[chordMeta.chordRef] ? chordLookups[chordMeta.chordRef] : ''
								
								return {chord: chord, pos: chordMeta.pos}
							} else {
								
								return {chord: '', pos: chordMeta.pos}
							}
						})
					}
				})
				//console.log(sections)
				
			  var layout = xml.children[7].children[1].children.map(function(a) {
				return {name:a.children[5].value, bars:a.children[6].value}
			  })
			  var song = {
				title: xml.children[1].value,
				tempo : xml.children[3].value,
				sections:sections,
				sectionTimeSignatures:sectionTimeSignatures,
				sectionStarts:sectionStarts,
				layout: layout
			  }
			  //console.log('SONGSEC')
			  //console.log(sections)
			 // collate sections
			  var collated = {}
			  Object.keys(song.sections).forEach(function(sectionKey) {
				  var section = song.sections[sectionKey]
				  //console.log(section)
				  collated[sectionKey] = {}
				  section.forEach(function(chord) {
						var barNumber = parseInt(chord.pos.replace('[','').replace(']','').split(":")[0]) - song.sectionStarts[sectionKey]
						var beatNumber = parseInt(chord.pos.replace('[','').replace(']','').split(":")[1])
						var lineNumber =  parseInt(barNumber / 4)
						if (!collated[sectionKey].hasOwnProperty(lineNumber)) collated[sectionKey][lineNumber] = {}
						if (!collated[sectionKey][lineNumber].hasOwnProperty(barNumber)) {
							collated[sectionKey][lineNumber][barNumber] = {}
							var bpb = getBeatsPerBar(mapKeySignature(song.sectionTimeSignatures[sectionKey]))
							//console.log(song.sectionTimeSignatures[sectionKey], bpb)
							for (var m=0; m < bpb; m++) {
								collated[sectionKey][lineNumber][barNumber][m] = []
							}
						}
						if (!collated[sectionKey][lineNumber][barNumber].hasOwnProperty(beatNumber)) collated[sectionKey][lineNumber][barNumber][beatNumber] = []
						collated[sectionKey][lineNumber][barNumber][beatNumber].push(chord)
				  })
			  })
			  song.sections = collated
			  
			  //console.log('SONG')
			  //console.log(collated)
			  setSong(song)
		  })
	}


  return (
    <div className="App">
    <input type='hidden' value={metaHash} />
		<div style={{float:'left', border: '1px solid blue', padding:'0.5em', backgroundColor:'#afc6e8'}} ><img src="favicon.png" style={{height:'2em'}} />&nbsp;&nbsp;Music By Steve Ryan</div>
		<Tabs 
		  defaultActiveKey="search"
		  id="app-tabs"
		  className="mb-3"
		  
		>
		  <Tab eventKey="search" title="Search">
		  	<div><Button size='lg' style={{fontSize:'1.8em' ,marginBottom:'0.5em'}} >{icons.search}</Button><input autoFocus={true	} type='text' value={filter} onChange={function(e) {setFilter(e.target.value)}} style={{fontSize:'1.8em', width: '70%', marginBottom:'0.5em'}} /></div>
				<Container ><Row> 
				  {Object.keys(collate).sort().map(function(name, nk) {
						if (filter && name.indexOf(filter) === -1) {
							return null	
						} else {
							 return <HomeTile key={nk} collate={collate} name={name} meta={meta} hasMeta={hasMeta} loadMeta={loadMeta} metaLinks={metaLinks} loadSongStructure={loadSongStructure} song={song} />
						}
				})}
				</Row></Container> 

		  </Tab>
		  
		  
		 
		  <Tab eventKey="about" title="About">
				<HelpContent/> 
		 </Tab>
		  
		</Tabs>
    
    
		

    </div>
  );
}

export default App;
//{collate[name].map(function(file) {
							//if (file.type === 'rg') {
								//return <span style={{float:'left'}} ><a target='_new' href={file.file} ><Button>{icons.download} Rosegarden</Button></a></span>
							//} else if (file.type === 'sng') {
								//return <span style={{float:'left'}} ><a target='_new' href={file.file} ><Button>{icons.download} JJazzLab Song</Button></a></span>
							//} else if (file.type === 'mid' && file.section === 'rosegarden') {
								//return <span style={{float:'left'}} ><ButtonGroup><a target='_new' href={file.file} ><Button>{icons.download}  Midi</Button></a><Button><PlayerModal midiFile={file.file} icons={icons} /></Button></ButtonGroup></span>
							//} else if (file.type === 'mid' && file.section === 'JJazzLab') {
								//return <span style={{float:'left'}} ><ButtonGroup><a target='_new' href={file.file} ><Button>{icons.download}  Backing Midi</Button></a><Button><PlayerModal midiFile={file.file} icons={icons} /></Button></ButtonGroup></span>
							//} else if (file.type === 'mp3') {
								//return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >MP3</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><MediaPlayerModal midiFile={file.file}  /></ButtonGroup></span>
							//} 
						//})}
 //<Tab eventKey="recent" title="Recent">
				//<Container >
				  //{
					  ////.sort(function(a,b) {
					   ////console.log('COLLATE',a,b, collate)
					    
						////if (a.date < b.date) {
							////return -1
						////} else {
							////return 1
						////}
					 ////})
					 //splits.filter(function(file) {
						//if (file.type === 'rg' || file.type === 'sng' || file.type === 'mid' || file.type === 'mp3' || file.type === 'xml') {
							//return true
						//} else {
							//return false
						//}
					 //})
					 //.sort(function(a,b) { 
						//if (a.date < b.date) {
							//return 1
						//} else {
							//return -1
						//}
					 //})
					 //.map(function(file, fk) {
						 
					 //return <Row key={fk} > <Col style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} ><div style={{float:'right'}}> {file.date ? file.date.replace("_"," ") : ''}</div>
							//{(file.type === 'rg') &&  <span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={Object.assign(buttonStyle,{marginRight:'1em'})} >{icons.download} Rosegarden</Button></a></span>}
							
							//{(file.type === 'sng')  &&<span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={buttonStyle} >{icons.download} JJazzLab</Button></a></span>}
							//{(file.type === 'mid' && file.section === 'rosegarden') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle}  ><Button variant="outline-primary" >Midi</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>}
							//{(file.type === 'mid' && file.section === 'JJazzLab') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >Backing Midi</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>}
							//{(file.type === 'mp3') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >MP3</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><MediaPlayerModal audioFile={file.file}  /></ButtonGroup></span>}
							//{(file.type === 'xml') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >{icons.musicblue} XML</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><NotationModal notationFile={file.file}  /></ButtonGroup></span>}
							 //<h3 style={{textTransform:'capitalize'}} >{file.name}</h3>
						//</Col></Row>
				  //})}
			//</Container> 
		  //</Tab>
		
		//<Tab eventKey="audio" title="Audio">
				//<Container ><Row> 
				  //{Object.keys(collate).sort(function(a,b) {
						//if (a.date < b.date) {
							//return -1
						//} else {
							//return 1
						//}
					 //}).filter(function(a) {
						 ////console.log(collate[a])
						 //for (var b in collate[a]) {
							 //if (collate[a][b].type === 'mp3') return true
						 //}
						 //return false
						 
						 ////return ((collate[a].type === 'mp3') ? true : false)
					 //}).map(function(name, nk) {
					   //return <Col key={nk} style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} ><h3 style={{textTransform:'capitalize'}} >{name}</h3>
						//{collate[name].map(function(file, fk) {
							//if (file.type === 'mp3') {
								//return <span key={fk} style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >MP3</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><MediaPlayerModal audioFile={file.file}  /></ButtonGroup></span>
							//} 
						//})}
						//</Col>
					
				  //})}
			//</Row></Container> 
		  //</Tab>
