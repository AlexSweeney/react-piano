import React, {useState, useEffect} from 'react';
import {getNewRandomArrayElement} from '../utils/utils.js';
import AudioElements from '../components/AudioElements/AudioElements.jsx'; 
import ModeSelect from '../components/ModeSelect/ModeSelect.jsx';
import PianoDisplay from '../components/PianoDisplay/PianoDisplay.jsx';
import VolumeControl from '../components/VolumeControl/VolumeControl.jsx';
import Keys from '../components/Keys/Keys.jsx';
import {getElement} from '../utils/utils.js'; 

import './PianoApp.scss';  
 
export default function Piano() {
	/*
		- on render
			- show mode selector
			- show feedback window
			- show volume slider
			- show piano keys
		
		- on load audio error
			- show overlay with error infomation

		- on show key mode 
			- on key hover
				- show key name in display
			- on key press 
				- play note

		- on select key mode
			- on turn start
				- show targe key in display
			- on key press
				- on wrong answer
					- play incorrect sound
					- flash key red
				- on correct answer 
					- play correct sound
					- flash key green
					- start new turn
				
		- on select key by ear mode
			- on turn start
				- play key sound
				- show play button in display
			- on play button click
				- play target sound
			- on key press
				- on wrong answer
					- play incorrect sound
					- flash key red

				- on correct answer 
					- play correct sound
					- flash key green
					- start new turn

		- on resize
			- keep proportions
	*/

	/*	
		load audio 
			audio element object => use to play = don't have to search everytime play
			to do -> give root directory -> auto load all audio from folder?
	*/

	// ================================== Constants =========================== //
	const id = 'piano-app';

	// =================== Keys
	const allKeys = ['C3','Db3','D3','Eb3','E3','F3','Gb3','G3','Ab3','A3','Bb3','B3']; 
	const [targetKey, setTargetKey] = useState('');
	
	// =================== Mode Select
	const modes = ['show-key', 'select-key', 'select-key-by-ear'];
	const defaultMode = modes[0];
	const [mode, setMode] = useState(defaultMode); 

	// =================== Display
	const [displayString, setDisplayString] = useState('');

	// =================== Audio 
	const fileType = '.mp3';
	const audioIds = [ ...allKeys, 'correctSound', 'incorrectSound'];

	const audioObjects = audioIds.map((id) => { 
		return {
			fileName: id,
			fileType: fileType,
			id: `${id}-audio`,
		}
	});

	const [audioElements, setAudioElements] = useState({});  
 
	// =================== Play Button
	const [showPlayButton, setShowPlayButton] = useState(false); 
	const [playButtonIsDown, setPlayButtonIsDown] = useState(false);

	// =================== Delays
	const feedbackSoundDelay = 750;	
	const colorHightLightTime = 1000;

	// ===================  Volume Control
	const [volume, setVolume] = useState(30); 

	// =================== Keys
	const [incorrectKey, setIncorrectKey] = useState(null);
	const [correctKey, setCorrectKey] = useState(null);

	// ================================== Event Handlers =========================== //
	// ======================== Audio
	function onLoadAudio(audio) { 
		getAudioElements(audio) 
	} 

	function onLoadAudioError() {

	}

	// ======================== Volume
	function onChangeVolume(newVolume) {  
		setVolume(newVolume)
		audioIds.forEach(id => audioElements[id].volume = newVolume / 100)
	}

	// ======================== Keys
	// ============= key over
	function onKeyOver(keyName) {  
		if(mode === 'show-key') {
			setDisplayString(keyName)
		} 
	}

	// ============= key out 
	function onKeyOut(keyName) {
		if(mode === 'show-key') {
			setDisplayString('')
		}
	}

	// ============= key down
	function onKeyDown(keyName) {
		if(mode === 'show-key') {
			playSound(keyName)
		}

		if(mode === 'select-key') {  
			const correct = keyName === targetKey;

			if(correct) onPressCorrect(keyName)
			if(!correct) onPressIncorrect(keyName)
		}

		if(mode === 'select-key-by-ear') {
			selectKeyByEar(keyName)
		}
	} 

	// ============= press correct
	function onPressCorrect(keyName) {  
		// play key name
		playSound(keyName) 

		// show key color
		setCorrectKey(keyName)
		
		// remove key color
		setTimeout(() => {
			setCorrectKey('')
		}, colorHightLightTime)

		// play correct sound
		setTimeout(() => {
			playSound('correctSound')
		}, feedbackSoundDelay) 

		// next turn
		setTimeout(() => {
			startSelectKeyMode() 
		}, 2000) 
	}

	// ============= press incorrect
	function onPressIncorrect(keyName) {  
		playSound(keyName) 

		// show key color
		setIncorrectKey(keyName)
		
		// remove key color
		setTimeout(() => {
			setIncorrectKey('')
		}, colorHightLightTime)
		
		setTimeout(() => {
			playSound('incorrectSound')
		}, feedbackSoundDelay) 
	} 

	// ======================== Play Button
	// ============= play button
	function onPlayButtonClick() {
		playSound(targetKey)
	}

	// ======================== Mode
	// ============= mode radio 
	function onClickRadio(value) {
		setMode(value)
	} 

	// ============= mode change
	function onChangeMode() {
		setDisplayString('')

		if(mode === 'select-key') {
			startSelectKeyMode()
		}

		if(mode === 'select-key-by-ear') {
			startSelectByEar()
		}

		if(mode === 'select-key-by-ear') {
			setShowPlayButton(true)
		} else {
			setShowPlayButton(false)
		}
	}

	// ================================== Helper fns =========================== //
	function playSound(id) {  
		const sound = audioElements[id]; 
		if(!sound) console.error(`sound ${id} not found`)

		if(sound.currentTime !== 0) {
			sound.pause();
			sound.currentTime = 0;
		}
		
		sound.play()
	} 

	function getAudioElements(audio) {
		let obj = {};

		audio.forEach(({fileName}) => {
			obj[fileName] = getElement(fileName + '-audio')
		})

		setAudioElements(obj)
	}

	function generateTargetKey() {
		return getNewRandomArrayElement(allKeys, targetKey);   
	} 

	function flashPlayButtonColor() {
		setPlayButtonIsDown(true)

		setTimeout(() => {
			setPlayButtonIsDown(false)
		}, colorHightLightTime)
	}

	// ================================== Mode fns =========================== //
	// ====================== Select Key Mode
	function startSelectKeyMode() {  
		const newTargetKey = generateTargetKey();
		setTargetKey(newTargetKey)   
		setDisplayString(newTargetKey)
	}

	// ====================== Select By Ear Mode
	function startSelectByEar() {
		const newTargetKey = generateTargetKey();
		
		setTargetKey(newTargetKey)  
		playSound(newTargetKey) 
		flashPlayButtonColor()

		setDisplayString('')
	}

	function selectKeyByEar(keyName) {
		const correct = keyName === targetKey;

		if(correct) {
			setShowPlayButton(false)
			onPressCorrect(keyName)
			setDisplayString(keyName)
			
			setTimeout(() => {
				setShowPlayButton(true)
			}, 2000)

			setTimeout(() => {
				startSelectByEar()
			}, 3000)
		}

		if(!correct) onPressIncorrect(keyName)
	}
 
	// ================================== Listen / Trigger =========================== //
	useEffect(() => {
		onChangeMode()
	}, [mode])  

	// ================================== Output =========================== //
	return (
		<div className="piano" id={id}> 
			<AudioElements 
				audioObjects={audioObjects}
				handleLoad={onLoadAudio}
				handleLoadingError={onLoadAudioError}/>
			
			<div className="piano-controls">
				<div className="left-piano-controls">
					<ModeSelect modes={modes} defaultMode={defaultMode} handleClick={onClickRadio}/>
				</div>
				<div className="right-piano-controls">
					<PianoDisplay
						displayString={displayString}
						showPlayButton={showPlayButton} 
						handlePlayButtonClick={onPlayButtonClick}
						playButtonDown={playButtonIsDown}
					/>
					<VolumeControl
						audioIDs={audioIds}
						volume={volume}
						handleVolumeChange={onChangeVolume}
						setVolume={setVolume}
					/>   
				</div>  
			</div>

			<div className="keys-container">
				<Keys 
					keyNames={allKeys} 
					correctKey={correctKey}
					incorrectKey={incorrectKey}
					handleOver={onKeyOver}
					handleOut={onKeyOut}
					handleDown={onKeyDown}
				/>
			</div> 
		</div>
	)
}; 