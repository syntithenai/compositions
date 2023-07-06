import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import MIDIFile from './MIDIFile'
import {useEffect} from 'react'
import useMidiPlayer from './useMidiPlayer'
var webaudiofont = require('webaudiofont');


export default function PlayerModal({midiFile}) {
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
  //var midiPlayer = useMidiPlayer()
  //console.log(midiPlayer)
  
  //useEffect(function() {
	  ////console.log('MIDIFILECHANGE',midiFile)
  //},[midiFile])

  return (
    <>
      {!show && <Button variant="primary"  onClick={handleShow}>{icons.play}</Button>}
	  {show && 
		  <Modal dialogClassName="media-modal" show={show} onHide={handleClose}>
			<Modal.Body>
			<Button variant="primary" size="lg" style={{float:'left', maxWidth: '5em'}}  onClick={handleClose}>{icons.stop}</Button> 
			<input style={{float:'left',width:'90%', marginLeft:'1em', height:'1.8em'}} type="range" min="0" max="100" value="0" step="1" value={progress} onChange={function(e) {setProgress(e.target.value); midiPlayer.seek(e.target.value) }} />
			<h4 style={{clear:'both', marginTop:'0.5em'}} >Tracks</h4>
			<div>
			{JSON.stringify(midiPlayer.getTrackInstruments())}
			{JSON.stringify(midiPlayer.getTrackDrums())}
			</div>
			<h4 style={{clear:'both', marginTop:'0.5em'}}>Drums</h4>
			</Modal.Body>
		  </Modal>}
      
      
      
    </>
  );
}
/*


		function go() {
			document.getElementById('tmr').innerHTML = 'starting...';
			try {
				startPlay(loadedsong);
				document.getElementById('tmr').innerHTML = 'playing...';
			} catch (expt) {
				document.getElementById('tmr').innerHTML = 'error ' + expt;
			}
		}
		
		function buildControls(song) {
			audioContext.resume();
			var o = document.getElementById('cntls');
			var html = '<h2 id="wrng">Refresh browser page to load another song</h2>';
			html = html + '<p id="tmr"><button onclick="go();">Play</button></p>';
			html = html + '<p><input id="position" type="range" min="0" max="100" value="0" step="1" /></p>';
			html = html + '<h3>Channels</h3>';
			for (var i = 0; i < song.tracks.length; i++) {
				var v = 100 * song.tracks[i].volume;
				html = html + '<p>' + chooserIns(song.tracks[i].id, i) + '<input id="channel' + i + '" type="range" min="0" max="100" value="' + v + '" step="1" /></p>';
			}
			html = html + '<h3>Drums</h3>';
			for (var i = 0; i < song.beats.length; i++) {
				var v = 100 * song.beats[i].volume;
				html = html + '<p>' + chooserDrum(song.beats[i].id, i) + '<input id="drum' + i + '" type="range" min="0" max="100" value="' + v + '" step="1" /></p>';
			}
			o.innerHTML = html;
			console.log('Loaded');
			var pos = document.getElementById('position');
			pos.oninput = function (e) {
				if (loadedsong) {
					player.cancelQueue(audioContext);
					var next = song.duration * pos.value / 100;
					songStart = songStart - (next - currentSongTime);
					currentSongTime = next;
				}
			};
			console.log('Tracks');
			for (var i = 0; i < song.tracks.length; i++) {
				setVolumeAction(i, song);
			}
			console.log('Drums');
			for (var i = 0; i < song.beats.length; i++) {
				setDrVolAction(i, song);
			}
			loadedsong = song;
		}
		function setVolumeAction(i, song) {
			var vlm = document.getElementById('channel' + i);
			vlm.oninput = function (e) {
				player.cancelQueue(audioContext);
				var v = vlm.value / 100;
				if (v < 0.000001) {
					v = 0.000001;
				}
				song.tracks[i].volume = v;
			};
			var sl = document.getElementById('selins' + i);
			sl.onchange = function (e) {
				var nn = sl.value;
				var info = player.loader.instrumentInfo(nn);
				player.loader.startLoad(audioContext, info.url, info.variable);
				player.loader.waitLoad(function () {
					console.log('loaded');
					song.tracks[i].info = info;
					song.tracks[i].id = nn;
				});
			};
		}
		function setDrVolAction(i, song) {
			var vlm = document.getElementById('drum' + i);
			vlm.oninput = function (e) {
				player.cancelQueue(audioContext);
				var v = vlm.value / 100;
				if (v < 0.000001) {
					v = 0.000001;
				}
				song.beats[i].volume = v;
			};
			var sl = document.getElementById('seldrm' + i);
			sl.onchange = function (e) {
				var nn = sl.value;
				var info = player.loader.drumInfo(nn);
				player.loader.startLoad(audioContext, info.url, info.variable);
				player.loader.waitLoad(function () {
					console.log('loaded');
					song.beats[i].info = info;
					song.beats[i].id = nn;
				});
			};
		}
		function chooserIns(n, track) {
			var html = '<select id="selins' + track + '">';
			for (var i = 0; i < player.loader.instrumentKeys().length; i++) {
				var sel = '';
				if (i == n) {
					sel = ' selected';
				}
				html = html + '<option value="' + i + '"' + sel + '>' + i + ': ' + player.loader.instrumentInfo(i).title + '</option>';
			}
			html = html + '</select>';
			return html;
		}
		function chooserDrum(n, beat) {
			var html = '<select id="seldrm' + beat + '">';
			for (var i = 0; i < player.loader.drumKeys().length; i++) {
				var sel = '';
				if (i == n) {
					sel = ' selected';
				}
				html = html + '<option value="' + i + '"' + sel + '>' + i + ': ' + player.loader.drumInfo(i).title + '</option>';
			}
			html = html + '</select>';
			return html;
		}
		function handleFileSelect(event) {
			console.log(event);
			var file = event.target.files[0];
			console.log(file);
			var fileReader = new FileReader();
			fileReader.onload = function (progressEvent) {
				console.log(progressEvent);
				var arrayBuffer = progressEvent.target.result;
				console.log(arrayBuffer);
				var midiFile = new MIDIFile(arrayBuffer);
				var song = midiFile.parseSong();
				startLoad(song);
			};
			fileReader.readAsArrayBuffer(file);
		}
		

*/

	//return <PlayerModal/>
