/* refactor - split into seperate components */

/* add listen and click mode */

/* style */

/* trim audio in ableton, -> sync start */

/* midi keyboard */

import React, {Component, useState} from 'react';

// styles
import './piano.css';  

// components
import AudioElements from './AudioElements.jsx';

// Modes
import Util from './Util.jsx';
import ShowKey from './ShowKey.jsx'; 
import SelectKey from './SelectKey.jsx'; 
import SelectByEar from './SelectByEar.jsx';

// Sounds
import correctSound from './audio/correctSound.mp3';
import incorrectSound from './audio/incorrectSound.mp3'; 

// Keys
import C3 from './audio/piano/mf/3/C3.mp3';
import Db3 from './audio/piano/mf/3/Db3.mp3';
import D3 from './audio/piano/mf/3/D3.mp3';
import Eb3 from './audio/piano/mf/3/Eb3.mp3';
import E3 from './audio/piano/mf/3/E3.mp3';
import F3 from './audio/piano/mf/3/F3.mp3';
import Gb3 from './audio/piano/mf/3/Gb3.mp3';
import G3 from './audio/piano/mf/3/G3.mp3';
import Ab3 from './audio/piano/mf/3/Ab3.mp3';
import A3 from './audio/piano/mf/3/A3.mp3';
import Bb3 from './audio/piano/mf/3/Bb3.mp3';
import B3 from './audio/piano/mf/3/B3.mp3';

const Piano = () => {
	const allKeys = ['C3','Db3','D3','Eb3','E3','F3','Gb3','G3','Ab3','A3','Bb3','B3']; 

	const [mode, changeMode] = useState('showKey');
	const [targetKey, changeTargetKey] = useState(Util.generateKey(allKeys));
	const newTargetKey = (show = false) => {  
		let newKey = Util.generateKey(allKeys, targetKey);
		changeTargetKey(newKey);
		if(show) Util.displayKey(newKey);
		return newKey;
	} 

	const audio = {correctSound, incorrectSound};
	const pianoNotes = {C3, Db3, D3, Eb3, E3, F3, Gb3, G3, Ab3, A3, Bb3, B3};
	const [volume, changeVolume] = useState(50);
	
	const keyMap = {'a': 'C3', 
					'w': 'Db3', 
					's': 'D3',
					'e': 'Eb3', 
					'd': 'E3',
					'f': 'F3',
					't': 'Gb3',
					'g': 'G3',
					'y': 'Ab3',
					'h': 'A3',
					'u': 'Bb3',
					'j': 'B3'
					};
	
	let props = {allKeys, keyMap, mode, changeMode, targetKey, newTargetKey}; 
	// let volumeProps = {audioElements, volume, changeVolume};  

	return (
			<div className="pianoContainer" id="pianoContainer"> 
				<AudioElements audio={[audio, pianoNotes]}/>
				{/*<div className="piano"> 
					<div className="topPiano"> 
						<ModeSelect {...props}/>				
						<Display/>
						<VolumeControl {...volumeProps}/> 
					</div>
					 
					<Keys {...props}/>
				</div>*/}
			</div>
		)
}; 

const ModeSelect = ({mode, changeMode, targetKey, newTargetKey}) => {   
	let modes = ['showKey', 'selectKey', 'selectByEar'];
	let inputs = null;

	function displayKey(key) {
		document.getElementById('pianoDisplay').innerHTML = key;
	}

	function initShowKey() {
		displayKey('');
	}

	function initSelectKey() { 
		displayKey(targetKey);
	}

	function initSelectByEar() {
		newTargetKey();
		displayKey('');
		Util.playAudio(targetKey);
	}

	function initMode(newMode) {
		if(newMode === 'showKey') {
			initShowKey();
		} else if (newMode === 'selectKey') {   
			initSelectKey();
		} else if (newMode === 'selectByEar') {
			initSelectByEar();
		}
	}

	function clickModeChange(newMode) {   
		if(newMode !== mode) {
			changeMode(newMode); 
			selectRadio(newMode);
			initMode(newMode);
		}  
	}

	function selectRadio(newMode) { 
		if(!inputs) {
			inputs = modes.map((mode) => {
				return document.getElementById(mode+"Input");
			}); 
		}

		inputs.forEach((input) => {
			if(input.value === newMode) {
				input.checked = true;
			} else {
				input.checked = false;
			}
		}); 
	}
 	
 	function returnInput(mode) { 
 		return (
 			<div key={mode}>
				<input type="radio" 
						name="mode"
						value={mode}
						id={mode+"Input"}
						onClick={() => { clickModeChange(mode) }}
						defaultChecked={mode === "showKey"}
				/>
				<label htmlFor={mode}  
						onClick={() => { clickModeChange(mode) }} 
				>{mode}</label>
				<br/> 
			</div>
 		)
 	} 
	
	return (
		<form name="modeSelectForm">    
			{modes.map((mode) => { 
				return returnInput(mode);
			})}
		</form>
	) 
};

const Display = () => {
	return (
		<div className="pianoDisplay" id="pianoDisplay">
		</div>
	)
};

class VolumeControl extends React.Component {
	constructor(props) {
		super(props);
		this.volumeChange = this.volumeChange.bind(this);
	}
	
	volumeChange(newVolume) {  
		this.props.changeVolume(newVolume);
		Util.setVolume(this.props.audioElements, newVolume / 100);
	}  

	componentDidMount() { 
		this.volumeChange(this.props.volume);
	}

	render() {
		return( 
			<div className="volumeContainer">
				<div className="slidecontainer">
				  <input type="range" min="0" max="100" id="volumeSlider" value={this.props.volume} onChange={(e) => {this.volumeChange(e.target.value)}}/>
				</div>
				<p>Volume: {this.props.volume}</p> 
			</div>
		)
	}
}

const Keys = (props) => { 
	return(
		<div className="keys"> 
			<Octave octaveNumber={0} 
				{...props}/>	
		</div>
	)
};

const Octave = (props) => {
	const whiteKeyWidth = 3;
	const blackKeyWidth = 2;
	const whiteKeys = props.allKeys.filter((key) => { return key.indexOf('b') == -1});
	const keyArray = makeKeyArray(props.allKeys);
	const keyElements = makeKeyElements(keyArray);    

	function returnLeft(key) { 
		let whiteKey = key.replace('b', ''); 
		let offset = whiteKeys.indexOf(whiteKey) * whiteKeyWidth;

		if(key.indexOf('b') !== -1) {
			offset -= blackKeyWidth / 2;
		}
		
		return offset + 'em'; 
	}

	function makeKeyArray(keys) { 
		return keys.map((key) => { 
			return {
				id: key,
				key: key, 
				keyName: key,
				keyType: key.includes('b') ? 'blackKey' : 'whiteKey',
				left: returnLeft(key)				
			}
		})
	}

	function makeKeyElements(keys) {
		return keys.map((key) => { 
			return <Key keyType={key.keyType} 
				left={key.left} 
				keyName={key.keyName}
				key={key.id}
				{ ...props}
			/>
		});	
	}

	function getWidth() { 
		return (whiteKeys.length * whiteKeyWidth) + 'em';
	} 
 
	return ( 
		<div className="octave" style={{width: getWidth()}}>  
			{keyElements}
		</div>
	)
};

const Key = ({mode, keyName, keyType, keyMap, left, targetKey, newTargetKey}) => {
	function keyOver(key) {   
		if(mode === 'showKey') { 
			ShowKey.keyOver(key);
		}
	}

	function keyOut(key) {
		if(mode === 'showKey') {
			ShowKey.keyOut(key);
		}
	}

	function keyDown(key) {
		if(mode === 'showKey') {
			ShowKey.keyDown(key);
		} else if(mode === 'selectKey') {    
			SelectKey.keyDown(key, targetKey, newTargetKey);
		} else if(mode === 'selectByEar') {
			SelectByEar.keyDown(key, targetKey);
		}
	}

	function keyUp(key) {
		if(mode === 'showKey') {
			ShowKey.keyUp(key);
		}
	} 

	function handleKeyDown(e) { 
		if(keyName === keyMap[e.key]) {
			keyDown(keyName);
		}
	}

	React.useEffect(() => { 
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		}
	})

	return (  
		<div className={"key " + keyType}
			style={{left}} 
			onMouseOver={() => keyOver(keyName)}
			onMouseOut={() => keyOut()} 
			onMouseDown={() => keyDown(keyName)}
			onMouseUp={() => keyUp(keyName)}
			id={keyName}
		>
		</div> 
	)
}

export default Piano;