import {Button, ButtonGroup} from 'react-bootstrap'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {useState, useEffect} from 'react'
import icons from './Icons'


export default function HelpContent() {

		return <Container ><Row> 
					<Col style={{border: '2px solid black', padding:'1em', minWidth:'20em'}} >
						<h1>Music Collection</h1>
						This website includes recordings of myself and friends and resource material to help with the recording process including MIDI files.
						<br/><br/>
						The musical source material is automatically committed from my laptop every day so there is some WIP stuff in there.
						
						<br/><br/><br/><br/>
						
						<h1>Related Software</h1>
						
						Using Ubuntu Linux 23.04, I use <br/><br/>
						<a href='https://jjazzlab.gitbook.io/user-guide/' target='_new' >JJazzLab</a> to quickly setup song layouts.
						<br/><br/>
						<a href='https://jjazzlab.gitbook.io/user-guide/' target='_new' >Rosegarden</a> to record midi from my keyboard and refine it for clean notation. 
						<br/><br/>and <a href='https://ardour.org/' target='_new' >Ardour</a> for audio recording and editing.
						<br/><br/>
						JJazzLab and Ardour are available on Mac, Windows and Linux.<br/><br/>
						Rosegarden is Linux only but comparable commercial alternatives include Sibelius, Finale. <br/><br/>
						Musescore is a useful alternative for notation editing but Rosegarden has better features for recording from a midi keyboard and tidying up the resulting notation.
						
						And of course <a href='https://tunebook.net' >my tunebook</a> for lyrics and chords and trad abc resources.
						<br/><br/><br/><br/>
						
						<div style={{color:'grey', float:'right'}} >Steve Ryan(syntithenai@gmail.com) 2023</div>
						<h1>CopyLeft </h1>
						Please use the resources on this website any way you like for commercial or any other purpose.
						No need to let me know but acknowledgement is always nice...
						
					</Col>
				</Row></Container>
}
