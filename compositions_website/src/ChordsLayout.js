import {mapKeySignature} from './utils'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function ChordsLayout({song, fontSize}) {
	var haveRendered = {}
	var lastRenderedChord = ''
	var lastTimeSignature = ''
	return <div  >
	 {song ? song.layout.map(function(l, lk) {
				if (!haveRendered[l.name]) {
					haveRendered[l.name] = true
					//	{JSON.stringify(Object.keys(song.sections[l.name]).map(function(s) {return song.sections[l.name][s]}))}
					return <div key={lk} style={{border:'1px solid black', padding:'0.3em', fontSize:fontSize ? fontSize : '1.4em'}} >
						<div style={{marginBottom:'0.5em'}} ><span style={{fontWeight:'bold'}} >{l.name}</span><span style={{fontStyle:'italic', marginLeft:'1em'}} >{mapKeySignature(song.sectionTimeSignatures[l.name])}</span></div>
						{song.sections[l.name] && <Container	>{Object.keys(song.sections[l.name]).map(function(barChordsKey ,rk) {
							lastTimeSignature = ''
							var barChordsLine = song.sections[l.name][barChordsKey]
							var lastRowLength  = Object.keys(barChordsLine).length
							var extraCols = []
							if (lastRowLength < 4) {
								for (let i = 1; i <= (4-lastRowLength); i++) {
									extraCols.push(<Col key={'b'+i} style={{marginBottom:'0.5em',marginLeft:'0.5em',padding:'0.3em',backgroundColor:'grey', border:'1px solid black'}} ></Col>)
								}
							}
							return <Row key={rk} style={{ minHeight:'3em'}} >{Object.keys(barChordsLine).map(function(beatKey, bck) {
								var beat = barChordsLine[beatKey]
								
								return <Col key={bck} style={{marginBottom:'0.5em',marginLeft:'0.5em',padding:'0.3em',backgroundColor:'grey', border:'1px solid black'}} >{Object.keys(beat).map(function(beatKey , bk) {
									
									
									return <span key={bk} style={{marginLeft:'0.5em',border:'1px solid black', backgroundColor:'lightblue', paddingLeft:'0.3em', borderRadius:'5px'}} >{beat[beatKey].map(function(chord, ck) {
										if (!chord.chord) {
											return <span key={ck} style={{ border:'1px solid black', backgroundColor:'#45e3e3', padding:'0.3em', borderRadius:'5px', fontWeight:'bold'}} >{lastRenderedChord}</span>
										} else {
											lastRenderedChord = chord.chord
											return <span key={ck}  style={{border:'1px solid black', backgroundColor:'#45e3e3', padding:'0.3em', borderRadius:'5px', fontWeight:'bold'}} >{chord.chord}</span>
										}
									})}</span>
								})} </Col>
								
								
									//return <div>{JSON.stringify(beat)}BBB</div>
							})} 
							{extraCols}
							</Row>

							
						})}</Container>}
					</div>  
				} else {
					return <div  key={lk} style={{border:'1px solid black', padding:'1em', fontSize:fontSize ? fontSize : '1.4em'}} ><span style={{fontWeight:'bold'}} >{l.name}</span></div>
				}
	}) : ''}</div>
}
//return <div style={{border:'1px solid yellow'}} >{beat.map(function(beatChord) {
										
										//return <span style={{marginLeft:'1em', border:'1px solid black', backgroundColor:'lightblue'}} >{beatChord.chord}</span>
									//})} </div>

//return <Row key={rk} style={{ height:'2em'}} >{Object.keys(barChordsLine).map(function(beatKey, bck) {
								//var beat = barChordsLine[beatKey]
									//return <Col key={bck} style={{padding:'0.3em',backgroundColor:'grey', width:'20%', border:'1px solid black'}} >{Object.keys(beat).map(function(beatKey , bk) {
										//return <span key={bk} style={{marginLeft:'1em', border:'1px solid black', backgroundColor:'lightblue', padding:'0.3em', borderRadius:'5px'}} >{beat[beatKey].map(function(chord, ck) {
											//if (!chord.chord) {
												//return <span key={ck} style={{marginLeft:'1em', border:'1px solid black', backgroundColor:'#45e3e3', padding:'0.3em', borderRadius:'5px'}} >{lastRenderedChord}</span>
											//} else {
												//lastRenderedChord = chord.chord
												//return <span key={ck}  style={{marginLeft:'1em', border:'1px solid black', backgroundColor:'#45e3e3', padding:'0.3em', borderRadius:'5px'}} >{chord.chord}</span>
											//}
										//})}</span>
									//})} </Col>
									////return <div>{JSON.stringify(beat)}BBB</div>
							//})} </Row>
