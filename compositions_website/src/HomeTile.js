import {Button, ButtonGroup} from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useState, useEffect, useRef} from 'react'
import icons from './Icons'

import PlayerModal from './PlayerModal'
import NotationModal from './NotationModal'
import MediaPlayerModal from './MediaPlayerModal'
import YoutubeModal from './YoutubeModal'
import LyricsModal from './LyricsModal'
import {YouTubeGetID, isYoutubeLink} from './utils'
import LinksModal from './LinksModal'

export default function HomeTile({collate, meta, name, loadMeta, hasMeta}) {
	var buttonStyle={marginBottom:'0.5em', 'border': '1px solid #0d6efd'}
	
	var downloads=[]
	var buttons = []
	var notation = null
	var lyrics = null
	collate[name].forEach(function(file) {
			if (file.type === 'rg') {
				downloads.push(<a target='_new' href={file.file} ><Button  size="lg"  style={Object.assign(buttonStyle,{marginRight:'1em'})} >{icons.download} Rosegarden</Button></a>)
			} else if (file.type === 'sng') {
				downloads.push(<a target='_new' href={file.file} ><Button size="lg"  style={buttonStyle} >{icons.download} JJazzLab</Button></a>)
			} else if (file.type === 'mid' && file.section === 'rosegarden') {
				downloads.push(<a target='_new' href={file.file} ><Button size="lg" >{icons.download} Midi</Button></a>)
				buttons.push(<PlayerModal midiFile={file.file}  />)
				//return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle}  ><Button variant="outline-primary" >Midi</Button> <a target='_new' href={file.file} ><Button size="lg" >{icons.download}</Button></a></ButtonGroup></span>
			} else if (file.type === 'mid' && file.section === 'JJazzLab') {
				downloads.push(<a target='_new' href={file.file} ><Button size="lg"  >{icons.download} Backing Midi</Button></a>)
				//buttons.push(<PlayerModal midiFile={file.file}  />)
				//return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >Backing Midi</Button> <a target='_new' href={file.file} ><Button size="lg" >{icons.download}</Button></a><PlayerModal midiFile={file.file}  /></ButtonGroup></span>
			} else if (file.type === 'mp3') {
				downloads.push(<a target='_new' href={file.file} ><Button size="lg" variant="success" >{icons.download} MP3</Button></a>)
				buttons.push(<MediaPlayerModal audioFile={file.file}  />)
				//return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-success" >MP3</Button> <a target='_new' href={file.file} ><Button size="lg" variant="success" >{icons.download}</Button></a><MediaPlayerModal audioFile={file.file}  /></ButtonGroup></span>
			} else if (file.type === 'xml') {
				downloads.push(<a target='_new' href={file.file} ><Button size="lg" variant="primary" >{icons.music} MusicXML</Button></a> )
				notation = <NotationModal notationFile={file.file}  />
				//return <span style={{float:'left'}} ><ButtonGroup  style={buttonStyle} ><Button variant="outline-primary" >{icons.musicblue}</Button> <a target='_new' href={file.file} ><Button variant="primary" >{icons.download}</Button></a><NotationModal notationFile={file.file}  /></ButtonGroup></span>
			} 
			
		
	})
	
	return <Col onClick={function() {loadMeta(name)}} style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} ><h3 style={{textTransform:'capitalize'}} >{name}</h3>
		 { (meta && meta[name]) && <div style={{clear:'both'}} >{meta[name].composer}</div>}
		 {(hasMeta(name) && meta[name] && meta[name].links.length > 0) && <div >{meta[name].links.map(function(l) {
			
			if (isYoutubeLink(l)) {
				return <span style={{float:'left', marginRight:'0.3em', marginTop:'0.3em'}} ><YoutubeModal youtubeId={YouTubeGetID(l)} /></span>
			}
			 //else {
				//return <><b>{l} |||  {YouTubeGetID(l)} |||| {isYoutubeLink(l) ? 'TTT' : 'FFF'} </b><MediaPlayerModal audioFile={l}  /></>
			//}
			//return <b>{l} |||  {YouTubeGetID(l)} |||| {isYoutubeLink(l) ? 'TTT' : 'FFF'} </b>
		})}</div>}
		 {buttons.map(function(button) {
			 return <span style={{float:'left', marginRight:'0.3em', marginTop:'0.3em'}} >{button}</span>
		})}
		<span style={{float:'left',marginRight:'0.3em', marginTop:'0.3em'}} ><LinksModal links={downloads} meta={meta} /></span>
		<div style={{float:'left',clear:'both', marginRight:'0.3em', marginTop:'1em'}} > 
		 <span style={{marginRight:'0.3em', marginTop:'1em'}} >{notation}</span>
		{hasMeta(name) && <span style={{marginRight:'0.3em', marginTop:'0.3em'}} ><LyricsModal meta={meta[name]} /></span>}
		</div>
		
		</Col>
		
}
