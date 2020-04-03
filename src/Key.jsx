import React from 'react';

import ShowKey from './ShowKey.jsx';
import SelectKey from './SelectKey.jsx';
import SelectByEar from './SelectByEar.jsx';
 
const Key = ({keyType, left, keyName, mode, targetKey, newTargetKey}) => { 
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

	// Keyboard Listener
	function handleKeyBoardDown(e) { 
		if(keyName === keyMap[e.key]) {
			keyDown(keyName);
		}
	}
	
	React.useEffect(() => { 
		document.addEventListener('keydown', handleKeyBoardDown);

		return () => {
			document.removeEventListener('keydown', handleKeyBoardDown);
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

export default Key;

/*const Key = ({mode, keyName, keyType, keyMap, left, targetKey, newTargetKey}) => {
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
}*/