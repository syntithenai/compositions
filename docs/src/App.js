import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import {Button, ButtonGroup} from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useState, useEffect} from 'react'
import icons from './Icons'

import files from './files.json'
import metafiles from './metafiles.json'

import PlayerModal from './PlayerModal'
import MediaPlayerModal from './MediaPlayerModal'

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


function App() {
	
	var allNames = {}
	var allSections = {}
	var [filter, setFilter] = useState('')
	
	
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
		var final = {section:section, name: name, type: type, file:  preFile + 	section + "/" + parts[parts.length - 1], date: date.trim()}
		return final
	})
	
	var meta = {}
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
	
	function loadMeta(name) {
		if (!meta[name] && metaLinks[name]) {
			fetch(metaLinks[name])
			  .then(function(response) {
				if (!response.ok) {
				  throw new Error('Failed to fetch the ABC file.');
				}
				return response.text();
			  })
			  .then(function(abcContent) {
				  	var lines = abcContent.split("\n")
					var songMeta = {}
					lines.forEach(function(line) {
						if (line.startsWith('T:')) {
							console.log("tttttt",line)
							songMeta['title'] = line
						}
					})
			
					meta[name] = songMeta
					console.log(meta)
			  })
				
		} 
	}
	
//  {JSON.stringify(collate)}
	var buttonStyle={marginBottom:'0.5em', 'border': '1px solid #0d6efd'}
	var buttonStyle={marginBottom:'0.5em', 'border': '1px solid #0d6efd'}

  return (
    <div className="App">
		<Tabs 
		  defaultActiveKey="search"
		  id="app-tabs"
		  className="mb-3"
		  
		>
		  <Tab eventKey="search" title="Search">
				<div><Button size='lg' style={{fontSize:'1.8em' ,marginBottom:'0.5em'}} >{icons.search}</Button><input autoFocus={true} type='text' value={filter} onChange={function(e) {setFilter(e.target.value)}} style={{fontSize:'1.8em', width: '90%', marginBottom:'0.5em'}} /></div>
				<Container ><Row> 
				  {Object.keys(collate).sort().map(function(name) {
						if (filter && name.indexOf(filter) === -1) {
							return null	
						} else {
							 return <Col onClick={function() {loadMeta(name)}} style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} ><h3 style={{textTransform:'capitalize'}} >{name}</h3>
								{collate[name].map(function(file) {
									
										if (file.type === 'rg') {
											return <span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={Object.assign(buttonStyle,{marginRight:'1em'})} >{icons.download} Rosegarden</Button></a></span>
										} else if (file.type === 'sng') {
											return <span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={buttonStyle} >{icons.download} JJazzLab</Button></a></span>
										} else if (file.type === 'mid' && file.section === 'rosegarden') {
											return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle}  ><Button variant="outline-primary" >Midi</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>
										} else if (file.type === 'mid' && file.section === 'JJazzLab') {
											return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >Backing Midi</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>
										} else if (file.type === 'mp3') {
											return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-success" >MP3</Button> <a target='_new' href={file.file} ><Button variant="success" >{icons.download}</Button></a><MediaPlayerModal audioFile={file.file}  /></ButtonGroup></span>
										} 
									
								})}
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
					 splits.map(function(file) {
						 
					 return <Row> <Col style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} ><h3 style={{textTransform:'capitalize'}} >{file.name}</h3> {file.date}
							{(file.type === 'rg') &&  <span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={Object.assign(buttonStyle,{marginRight:'1em'})} >{icons.download} Rosegarden</Button></a></span>}
							
							{(file.type === 'sng')  &&<span style={{float:'left'}} ><a target='_new' href={file.file} ><Button style={buttonStyle} >{icons.download} JJazzLab</Button></a></span>}
							{(file.type === 'mid' && file.section === 'rosegarden') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle}  ><Button variant="outline-primary" >Midi</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>}
							{(file.type === 'mid' && file.section === 'JJazzLab') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >Backing Midi</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>}
							{(file.type === 'mp3') && <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >MP3</Button> <a target='_new' href={file.file} ><Button>{icons.download}</Button></a><MediaPlayerModal audioFile={file.file}  /></ButtonGroup></span>}
							
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
				<Container ><Row> 
					<Col style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} >
						<h1>Music Collection</h1>
						This website includes recordings of myself and friends and resource material to help with the recording process including MIDI files.
						
						<h1>Related Software</h1>
						JJazzLab
						
						Rosegarden
						
						Other
						
						
						<h1>CopyLeft Steve Ryan 2023</h1>
						
					</Col>
				</Row></Container> 
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
