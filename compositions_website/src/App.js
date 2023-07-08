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
import YoutubeModal from './MediaPlayerModal'
import LyricsModal from './LyricsModal'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import HelpContent from './HelpContent'

String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function YouTubeGetID(url){
            url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            return undefined !== url[2]?url[2].split(/[^0-9a-z_\-]/i)[0]:url[0];
    }
    function isYoutubeLink(urlToParse){
        if (urlToParse) {
            var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            if (urlToParse.match(regExp)) {
                return true;
            }
        }
        return false;
    }

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
	
	function loadMeta(name) {
		console.log("load meta",name, hasMeta(name), meta)
		if (hasMeta(name) && !meta[name]) {
			fetch(metaLinks[name])
			  .then(function(response) {
				if (!response.ok) {
				  throw new Error('Failed to fetch the ABC file.');
				}
				return response.text();
			  })
			  .then(function(abcContent) {
				  
				  	var lines = abcContent.split("\n")
					var songMeta = {'lyrics':[], 'links':[]}
					//console.log(lines)
					lines.forEach(function(line) {
						if (line.startsWith('T:')) {
							songMeta['title'] = line.slice(2)
						} else if (line.startsWith('C:')) {
							songMeta['composer'] = line.slice(2)
						} else if (line.startsWith('W:')) {
							songMeta['lyrics'].push(line.slice(2))
						}  else if (line.startsWith('% abcbook-link') && !line.startsWith('% abcbook-link-title')) {
							songMeta['links'].push(line.slice(17))
						} 
						
						
					})
					var newMeta = meta
					newMeta[name] = songMeta
					setMeta(newMeta)
					setMetaHash(JSON.stringify(newMeta).hashCode())
					console.log("MM",newMeta)
			  })
				
		} 
	}
	
//  {JSON.stringify(collate)}
	var buttonStyle={marginBottom:'0.5em', 'border': '1px solid #0d6efd'}
	var buttonStyle={marginBottom:'0.5em', 'border': '1px solid #0d6efd'}

  return (
    <div className="App">
    <input type='hidden' value={metaHash} />
		<Tabs 
		  defaultActiveKey="search"
		  id="app-tabs"
		  className="mb-3"
		  
		>
		  <Tab eventKey="search" title="Search">
		  	<div><Button size='lg' style={{fontSize:'1.8em' ,marginBottom:'0.5em'}} >{icons.search}</Button><input autoFocus={true	} type='text' value={filter} onChange={function(e) {setFilter(e.target.value)}} style={{fontSize:'1.8em', width: '70%', marginBottom:'0.5em'}} /></div>
				<Container ><Row> 
				  {Object.keys(collate).sort().map(function(name) {
						if (filter && name.indexOf(filter) === -1) {
							return null	
						} else {
							 return <Col onClick={function() {loadMeta(name)}} style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} ><h3 style={{textTransform:'capitalize'}} >{name}</h3>
								 { (meta && meta[name]) && <div style={{clear:'both'}} >{meta[name].composer}</div>}
								{collate[name].map(function(file) {
									
										if (file.type === 'rg') {
											return <span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={Object.assign(buttonStyle,{marginRight:'1em'})} >{icons.download} Rosegarden</Button></a></span>
										} else if (file.type === 'sng') {
											return <span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={buttonStyle} >{icons.download} JJazzLab</Button></a></span>
										} else if (file.type === 'mid' && file.section === 'rosegarden') {
											return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle}  ><Button variant="outline-primary" >Midi</Button> <a target='_new' href={file.file} ><Button size="lg" >{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>
										} else if (file.type === 'mid' && file.section === 'JJazzLab') {
											return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >Backing Midi</Button> <a target='_new' href={file.file} ><Button size="lg" >{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>
										} else if (file.type === 'mp3') {
											return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-success" >MP3</Button> <a target='_new' href={file.file} ><Button size="lg" variant="success" >{icons.download}</Button></a><MediaPlayerModal audioFile={file.file}  /></ButtonGroup></span>
										} else if (file.type === 'xml') {
											return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >{icons.musicblue}</Button> <a target='_new' href={file.file} ><Button variant="primary" >{icons.download}</Button></a><NotationModal notationFile={file.file}  /></ButtonGroup></span>
										} 
										
									
								})}
								{hasMeta(name) && <span style={{float:'left'}} ><LyricsModal meta={meta[name]} /></span>}
								
								{(hasMeta(name) && meta[name] && meta[name].links.length > 0) && <div>{meta[name].links.map(function(l) {
									if (isYoutubeLink(l)) {
										<YoutubeModal youtubeId={YouTubeGetID(l)} />
									} else {
										<MediaPlayerModal audioFile={l}  />
									}
								})}</div>}
							 	
								
								</Col>
						}
				})}
				</Row></Container> 

		  </Tab>
		  
		  
		  <Tab eventKey="recent" title="Recent">
				<Container >
				  {
					  //.sort(function(a,b) {
					   //console.log('COLLATE',a,b, collate)
					    
						//if (a.date < b.date) {
							//return -1
						//} else {
							//return 1
						//}
					 //})
					 splits.filter(function(file) {
						if (file.type === 'rg' || file.type === 'sng' || file.type === 'mid' || file.type === 'mp3' || file.type === 'xml') {
							return true
						} else {
							return false
						}
					 })
					 .sort(function(a,b) { 
						if (a.date < b.date) {
							return 1
						} else {
							return -1
						}
					 })
					 .map(function(file) {
						 
					 return <Row> <Col style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} ><div style={{float:'right'}}> {file.date ? file.date.replace("_"," ") : ''}</div>
							{(file.type === 'rg') &&  <span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={Object.assign(buttonStyle,{marginRight:'1em'})} >{icons.download} Rosegarden</Button></a></span>}
							
							{(file.type === 'sng')  &&<span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={buttonStyle} >{icons.download} JJazzLab</Button></a></span>}
							{(file.type === 'mid' && file.section === 'rosegarden') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle}  ><Button variant="outline-primary" >Midi</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>}
							{(file.type === 'mid' && file.section === 'JJazzLab') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >Backing Midi</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>}
							{(file.type === 'mp3') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >MP3</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><MediaPlayerModal audioFile={file.file}  /></ButtonGroup></span>}
							{(file.type === 'xml') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >{icons.musicblue} XML</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><NotationModal notationFile={file.file}  /></ButtonGroup></span>}
							 <h3 style={{textTransform:'capitalize'}} >{file.name}</h3>
						</Col></Row>
				  })}
			</Container> 
		  </Tab>
		
		<Tab eventKey="audio" title="Audio">
				<Container ><Row> 
				  {Object.keys(collate).sort(function(a,b) {
						if (a.date < b.date) {
							return -1
						} else {
							return 1
						}
					 }).filter(function(a) {
						 //console.log(collate[a])
						 for (var b in collate[a]) {
							 if (collate[a][b].type === 'mp3') return true
						 }
						 return false
						 
						 //return ((collate[a].type === 'mp3') ? true : false)
					 }).map(function(name) {
					   return <Col style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} ><h3 style={{textTransform:'capitalize'}} >{name}</h3>
						{collate[name].map(function(file) {
							if (file.type === 'mp3') {
								return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >MP3</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><MediaPlayerModal audioFile={file.file}  /></ButtonGroup></span>
							} 
						})}
						</Col>
					
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
