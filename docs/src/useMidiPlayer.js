import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import icons from './Icons'
import MIDIFile from './MIDIFile'
import {useEffect, useRef} from 'react'


import {WebAudioFontPlayer} from './WebAudioFontPlayer'

//console.log(WebAudioFontPlayer)

export default function useMidiPlayer(props) {
		//console.log('start');
		var audioContext = null;
		var player = useRef();
		var reverberator = null;
		var equalizer = null;
		var songStart = 0;
		var input = null;
		var currentSongTime = 0;
		var nextStepTime = 0;
		var nextPositionTime = 0;
		var loadedsong = null;
		var started = false
		var isPlaying = useRef()
		var song = useRef()
		/** 
		 * Pause playback
		 **/
		function pause() {
			//if (player.current) player.current.cancelQueue(audioContext)
			isPlaying.current = false
		}
		
		/** 
		 * Stop playback and reset progress
		 **/
		function stop() {
			//if (player.current) player.current.cancelQueue(audioContext)
			isPlaying.current = false
			audioContext.currentTime = 0
		}
		
		/** 
		 * Seek playback from current position
		 **/
		function seek(percent) {
			console.log(['seek',percent,player.current,song.current])
			if (player.current && song.current) {
				//player.current.cancelQueue(audioContext);
				var next = song.current.duration * percent / 100;
				songStart = songStart - (next - currentSongTime);
				currentSongTime = next;
			}
		}
		
		function setVolume(trackNumber, volume) {
			player.current.cancelQueue(audioContext);
			var v = volume / 100;
			if (v < 0.000001) {
				v = 0.000001;
			}
			song.current.tracks[trackNumber].volume = v;
		}
		
		function setInstrument(trackNumber, instrument) {
			var info = player.current.loader.instrumentInfo(instrument);
			player.current.loader.startLoad(audioContext, info.url, info.variable);
			player.current.loader.waitLoad(function () {
				console.log('loaded');
				song.current.tracks[trackNumber].info = info;
				song.current.tracks[trackNumber].id = instrument;
			});
		}
		
		function setDrum(trackNumber, instrument) {
			var info = player.current.loader.drumInfo(instrument);
			player.current.loader.startLoad(audioContext, info.url, info.variable);
			player.current.loader.waitLoad(function () {
				console.log('loaded');
				song.current.tracks[trackNumber].info = info;
				song.current.tracks[trackNumber].id = instrument;
			});
		}
		
		/** 
		 * Start playback from current position
		 **/
		function start(song) {
			currentSongTime = 0;
			songStart = audioContext.currentTime;
			nextStepTime = audioContext.currentTime;
			var stepDuration = 44 / 1000;
			isPlaying.current = true
			tick(song, stepDuration);
		}
		
		
		/** 
		 * Allocate and send notes for this tick
		 **/
		function tick(song, stepDuration) {
			if (isPlaying.current && audioContext.currentTime > nextStepTime - stepDuration) {
				sendNotes(song, songStart, currentSongTime, currentSongTime + stepDuration, audioContext, input, player);
				currentSongTime = currentSongTime + stepDuration;
				nextStepTime = nextStepTime + stepDuration;
				
				if (currentSongTime > song.duration) {
					currentSongTime = currentSongTime - song.duration;
					sendNotes(song, songStart, 0, currentSongTime, audioContext, input, player);
					songStart = songStart + song.duration;
				}
				if (props.onProgress) props.onProgress(currentSongTime/song.duration * 100)
			}
			//if (nextPositionTime < audioContext.currentTime) {
				//var o = document.getElementById('position');
				//o.value = 100 * currentSongTime / song.duration;
				//document.getElementById('tmr').innerHTML = '' + Math.round(100 * currentSongTime / song.duration) + '%';
				//nextPositionTime = audioContext.currentTime + 3;
			//}
			window.requestAnimationFrame(function (t) {
				if (isPlaying.current) tick(song, stepDuration);
			});
		}
		
		/** 
		 * Send notes to synth
		 **/
		function sendNotes(song, songStart, start, end, audioContext, input, player) {
			for (var t = 0; t < song.tracks.length; t++) {
				var track = song.tracks[t];
				for (var i = 0; i < track.notes.length; i++) {
					if (track.notes[i].when >= start && track.notes[i].when < end) {
						var when = songStart + track.notes[i].when;
						var duration = track.notes[i].duration;
						if (duration > 3) {
							duration = 3;
						}
						var instr = track.info.variable;
						var v = track.volume / 7;
						player.current.queueWaveTable(audioContext, input, window[instr], when, track.notes[i].pitch, duration, v, track.notes[i].slides);
					}
				}
			}
			for (var b = 0; b < song.beats.length; b++) {
				var beat = song.beats[b];
				for (var i = 0; i < beat.notes.length; i++) {
					if (beat.notes[i].when >= start && beat.notes[i].when < end) {
						var when = songStart + beat.notes[i].when;
						var duration = 1.5;
						var instr = beat.info.variable;
						var v = beat.volume / 2;
						player.current.queueWaveTable(audioContext, input, window[instr], when, beat.n, duration, v);
					}
				}
			}
		}
		
		/** 
		 * Load and parse a midi file
		 **/
		function loadMidi(path) {
			console.log("LOAD MIDI",path);
			var xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open("GET", path, true);
			xmlHttpRequest.responseType = "arraybuffer";
			xmlHttpRequest.onload = function (e) {
				var arrayBuffer = xmlHttpRequest.response;
				var midiFile = new MIDIFile(arrayBuffer);
				song.current = midiFile.parseSong();
				startLoad(song.current	);
			};
			xmlHttpRequest.send(null);
		}
		
		/** 
		 * Load instruments for this song
		 **/
		function startLoad(song) {
			console.log("STL",song, player.current);
			var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
			audioContext = new AudioContextFunc();
			player.current = new WebAudioFontPlayer();
			equalizer = player.current.createChannel(audioContext);
			reverberator = player.current.createReverberator(audioContext);
			//input = reverberator.input;
			input = equalizer.input;
			equalizer.output.connect(reverberator.input);
			reverberator.output.connect(audioContext.destination);

			for (var i = 0; i < song.tracks.length; i++) {
				var nn = player.current.loader.findInstrument(song.tracks[i].program);
				var info = player.current.loader.instrumentInfo(nn);
				song.tracks[i].info = info;
				song.tracks[i].id = nn;
				player.current.loader.startLoad(audioContext, info.url, info.variable);
			}
			for (var i = 0; i < song.beats.length; i++) {
				var nn = player.current.loader.findDrum(song.beats[i].n);
				var info = player.current.loader.drumInfo(nn);
				song.beats[i].info = info;
				song.beats[i].id = nn;
				player.current.loader.startLoad(audioContext, info.url, info.variable);
			}
			player.current.loader.waitLoad(function () {
				console.log('buildControls', song);
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
			return song.current ? song.current.tracks : []
		}
		
		function getTrackDrums() {
			return song.current ? song.current.beats : []
		}
		
		function getTrackInstrument(track) {
			return song.current ? song.current.tracks[track].id : ''
		}
		
		function getTrackDrum(track) {
			return song.current ? song.current.beats[track].id : ''
		}
		
		function getTrackVolume(track) {
			return song.current ? song.current.tracks[track].volume * 100 : 100
		}
		
		function getTrackDrumVolume(track) {
			return song.current ? song.current.beats[track].volume * 100 : 100
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
		
	return {start, stop, pause, loadMidi, seek, setVolume, setInstrument ,setDrum, getInstrumentOptions, getDrumOptions, getTrackInstrument, getTrackDrum, getTrackInstruments, getTrackDrums, getTrackVolume, getTrackDrumVolume}
	
}
