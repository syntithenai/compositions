import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import MIDIFile from './MIDIFile'
import {useEffect, useRef, useState} from 'react'


import {WebAudioFontPlayer} from './WebAudioFontPlayer'

//console.log(WebAudioFontPlayer)

export default function useMidiPlayer(props) {
		//console.log('start');
		var audioContext = useRef()
		useEffect(function() {
			var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
			audioContext.current = new AudioContextFunc();
		},[])
		var player = useRef();
		var reverberator = null;
		var equalizer = null;
		var songStart = useRef();
		var input = null;
		var currentSongTime = 0;
		var nextStepTime = 0;
		var nextPositionTime = 0;
		var loadedsong = null;
		var started = false
		var isPlaying = useRef()
		var song = useRef()
		var stepDuration = 44 / 1000;
				
		var [instrumentVolumes, setInstrumentVolumes] = useState({})
		var [drumVolumes, setDrumVolumes] = useState({})
		var [midiPath, setMidiPath] = useState('')
		
		//useEffect(function() {
			
		//},[props.midiFile])
		
		/** 
		 * Pause playback
		 **/
		function pause() {
			if (player.current) player.current.cancelQueue(audioContext.current)
			isPlaying.current = false
		}
		
		/** 
		 * Stop playback and reset progress
		 **/
		function stop() {
			if (player.current) player.current.cancelQueue(audioContext.current)
			isPlaying.current = false
			//audioContext.current.currentTime = 0
		}
		
		/** 
		 * Seek playback from current position
		 **/
		function seek(percent) {
			console.log(['seek',songStart.current, song.current.duration, percent,player.current,song.current])
			if (player.current && song.current) {
				//player.current.cancelQueue(audioContext.current);
				var next = song.current.duration * percent / 100;
				//songStart.current = songStart.current - (next - currentSongTime);
				//currentSongTime = next;
				console.log(['seeked',songStart.current, next])
			}
		}
		
		/** 
		 * Start playback 
		 **/
		function start() {
			console.log('start', audioContext.current)
			//currentSongTime = 0;
			if (audioContext.current) {
				songStart.current = audioContext.current.currentTime;
				nextStepTime = audioContext.current.currentTime;
				isPlaying.current = true
				tick();
			}
		}
		
		
		/** 
		 * Allocate and send notes for this tick
		 **/
		function tick() {
			//console.log(['tick',audioContext.current])
			if (song.current && audioContext.current && isPlaying.current && audioContext.current.currentTime > nextStepTime - stepDuration) {
				sendNotes(songStart.current, currentSongTime, currentSongTime + stepDuration, input, player);
				currentSongTime = currentSongTime + stepDuration;
				nextStepTime = nextStepTime + stepDuration;
				
				if (currentSongTime > song.current.duration) {
					currentSongTime = currentSongTime - song.current.duration;
					sendNotes( songStart.current, 0, currentSongTime, input, player);
					songStart = songStart.current + song.current.duration;
				}
				if (props.onProgress) props.onProgress(currentSongTime/song.current.duration * 100)
			}
			//if (nextPositionTime < audioContext.current.currentTime) {
				////var o = document.getElementById('position');
				////o.value = 100 * currentSongTime / song.duration;
				//nextPositionTime = audioContext.current.currentTime + 3;
			//}
			window.requestAnimationFrame(function (t) {
				if (isPlaying.current) tick();
			});
		}
		
		/** 
		 * Send notes to synth
		 **/
		function sendNotes( songStart, start, end, input, player) {
			if (song.current) {
				for (var t = 0; t < song.current.tracks.length; t++) {
					var track = song.current.tracks[t];
					for (var i = 0; i < track.notes.length; i++) {
						if (track.notes[i].when >= start && track.notes[i].when < end) {
							var when = songStart + track.notes[i].when;
							var duration = track.notes[i].duration;
							if (duration > 3) {
								duration = 3;
							}
							var instr = track.info.variable;
							var v = track.volume / 7;
							try {
								player.current.queueWaveTable(audioContext.current, input, window[instr], when, track.notes[i].pitch, duration, v, track.notes[i].slides);
							} catch (e) {console.log(e)}
						}
					}
				}
				for (var b = 0; b < song.current.beats.length; b++) {
					var beat = song.current.beats[b];
					for (var i = 0; i < beat.notes.length; i++) {
						if (beat.notes[i].when >= start && beat.notes[i].when < end) {
							var when = songStart + beat.notes[i].when;
							var duration = 1.5;
							var instr = beat.info.variable;
							var v = beat.volume / 2;
							try {
								player.current.queueWaveTable(audioContext.current, input, window[instr], when, beat.n, duration, v);
							} catch (e) {console.log(e)}
						}
					}
				}
			}
		}
		
		/** 
		 * Load and parse a midi file
		 **/
		function loadMidi(path) {
			setMidiPath(path)
			console.log("LOAD MIDI",path);
			var xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open("GET", path, true);
			xmlHttpRequest.responseType = "arraybuffer";
			xmlHttpRequest.onload = function (e) {
				var arrayBuffer = xmlHttpRequest.response;
				var midiFile = new MIDIFile(arrayBuffer);
				console.log(midiFile)
				song.current = midiFile.parseSong();
				console.log(song.current)
				
				// restore volumes from localStorage if available
				var v = localStorage.getItem('instrumentVolumes-' + path)
				var j = null
				try {
					j = JSON.parse(v)
				} catch (e) {}
				console.log('getval', v, j)
			
				if (j) {
					setInstrumentVolumes(j)
					// and player
					if (song.current.tracks.length == j.length)  {
						j.forEach(function(volume, trackKey) {
							console.log('sv',trackKey, volume)
							setVolume(trackKey, volume * 100)
						})
					}
				}
			
				var v = localStorage.getItem('drumVolumes-' + path)
				var j = null
				try {
					j = JSON.parse(v)
				} catch (e) {}
				if (j) {
					setDrumVolumes(j)
					// and player
					if (song.current.beats.length == j.length)  {
						j.forEach(function(volume, trackKey) {
							console.log('svd',trackKey, volume)
							setDrumVolume(trackKey, volume * 100)
						})
					}
				}
				
				
		 
				
				startLoad(song.current	);
			};
			xmlHttpRequest.send(null);
		}
		
		/** 
		 * Load instruments for this song
		 **/
		function startLoad(song) {
			//console.log("STL",song, player.current);
			player.current = new WebAudioFontPlayer();
			equalizer = player.current.createChannel(audioContext.current);
			reverberator = player.current.createReverberator(audioContext.current);
			//input = reverberator.input;
			input = equalizer.input;
			equalizer.output.connect(reverberator.input);
			reverberator.output.connect(audioContext.current.destination);

			for (var i = 0; i < song.tracks.length; i++) {
				var nn = player.current.loader.findInstrument(song.tracks[i].program);
				var info = player.current.loader.instrumentInfo(nn);
				song.tracks[i].info = info;
				song.tracks[i].id = nn;
				player.current.loader.startLoad(audioContext.current, info.url, info.variable);
			}
			for (var i = 0; i < song.beats.length; i++) {
				var nn = player.current.loader.findDrum(song.beats[i].n);
				var info = player.current.loader.drumInfo(nn);
				song.beats[i].info = info;
				song.beats[i].id = nn;
				player.current.loader.startLoad(audioContext.current, info.url, info.variable);
			}
			player.current.loader.waitLoad(function () {
				console.log('buildControls', song);
				// load volumes from localStorage
				
				//buildControls(song);
				start(song)
				resetEqualizer();
			});
		}
		
		function getInstrumentOptions() {
			var options = {}
			if (player.current) {
				for (var i = 0; i < player.current.loader.instrumentKeys().length; i++) {
					options[i] = player.current.loader.instrumentInfo(i).title;
				}
			}
			return options
		}
		
		function getDrumOptions() {
			var options = {}
			if (player.current) {
				for (var i = 0; i < player.current.loader.drumKeys().length; i++) {
					options[i] = player.current.loader.drumInfo(i).title;
				}
			}
			return options
		}
		
		function getTrackInstruments() {
			return song.current && Array.isArray(song.current.tracks) ? song.current.tracks.map(function(t) {return t && t.info ? t.info.title : ''}) : []
		}
		
		function getTrackDrums() {
			//if (song.current) console.log("DDD",song.current.beats)
			return song.current  && Array.isArray(song.current.beats)  ? song.current.beats.map(function(t) {return t && t.info ? t.info.title : ''}) : []
		}
		
		function getTrackInstrument(track) {
			return song.current ? song.current.tracks[track].id : ''
		}
		
		function getTrackDrum(track) {
			return song.current ? song.current.beats[track].id : ''
		}
		
		function getTrackVolume(track) {
			//console.log(song.current,track)
			return song.current ? song.current.tracks[track].volume * 100 : 100
		}
		
		function getTrackVolumes(track) {
			return song.current ? song.current.tracks[track].volume * 100 : 100
		}
		
		function getTrackDrumVolume(track) {
			return song.current ? song.current.beats[track].volume * 100 : 100
		}
		
		function setVolume(trackNumber, volume) {
			if (player.current) player.current.cancelQueue(audioContext.current);
			var v = volume / 100;
			if (v < 0.000001) {
				v = 0.000001;
			}
			song.current.tracks[trackNumber].volume = v;
			if (midiPath && song.current && Array.isArray(song.current.tracks)) {
				localStorage.setItem('instrumentVolumes-' + midiPath, JSON.stringify(song.current.tracks.map(function(t) {return t.volume})))
			}
		}
		
		function setDrumVolume(trackNumber, volume) {
			if (player.current) player.current.cancelQueue(audioContext.current);
			var v = volume / 100;
			if (v < 0.000001) {
				v = 0.000001;
			}
			song.current.beats[trackNumber].volume = v;
			if (midiPath && song.current && Array.isArray(song.current.beats)) {
				localStorage.setItem('drumVolumes-' + midiPath, JSON.stringify(song.current.beats.map(function(t) {return t.volume})))
			}
		}
		
		function setInstrument(trackNumber, instrument) {
			if (player.current)  {
				var info = player.current.loader.instrumentInfo(instrument);
				player.current.loader.startLoad(audioContext.current, info.url, info.variable);
				player.current.loader.waitLoad(function () {
					console.log('loaded');
					song.current.tracks[trackNumber].info = info;
					song.current.tracks[trackNumber].id = instrument;
				});
			}
		}
		
		function setDrum(trackNumber, instrument) {
			if (player.current) {
				var info = player.current.loader.drumInfo(instrument);
				player.current.loader.startLoad(audioContext.current, info.url, info.variable);
				player.current.loader.waitLoad(function () {
					console.log('loaded');
					song.current.tracks[trackNumber].info = info;
					song.current.tracks[trackNumber].id = instrument;
				});
			}
		}
		
		/** 
		 * Reset EQ
		 **/
		function resetEqualizer(){
			equalizer.band32.gain.setTargetAtTime(2,0,0.0001);
			equalizer.band64.gain.setTargetAtTime(2,0,0.0001);
			equalizer.band128.gain.setTargetAtTime(1,0,0.0001);
			equalizer.band256.gain.setTargetAtTime(0,0,0.0001);
			equalizer.band512.gain.setTargetAtTime(-1,0,0.0001);
			equalizer.band1k.gain.setTargetAtTime(5,0,0.0001);
			equalizer.band2k.gain.setTargetAtTime(4,0,0.0001);
			equalizer.band4k.gain.setTargetAtTime(3,0,0.0001);
			equalizer.band8k.gain.setTargetAtTime(-2,0,0.0001);
			equalizer.band16k.gain.setTargetAtTime(2,0,0.0001);
		}
		
	return {start, stop, pause, loadMidi, seek, setVolume, setDrumVolume, setInstrument ,setDrum, getInstrumentOptions, getDrumOptions, getTrackInstrument, getTrackDrum, getTrackInstruments, getTrackDrums, getTrackVolume, getTrackDrumVolume}
	
}
