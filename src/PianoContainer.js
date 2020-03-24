import React, {Component} from 'react';
import './piano.css';  
import ShowKey from './ShowKey.js'; 
import SelectKey from './SelectKey.js'; 

class Piano extends Component { 
	constructor(props) {
		super(props);

		this.state = {
			mode: 'showKey',
			targetKey: '',
		} 
	
		this.allKeys = ['c','c#','d','d#','e','f','f#','g','g#','a','a#','b']; 
		this.changeMode = this.changeMode.bind(this);
		this.newTargetKey = this.newTargetKey.bind(this);
	}

	changeMode(newMode) { 
		this.setState({mode: newMode});  
	}

	newTargetKey(newKey) {
		this.setState({targetKey: newKey});
	}
		
	render() {
		return (
			<div className="pianoContainer"> 
				<div className="piano">
					<div className="topPiano"> 
						<ModeSelect allKeys={this.allKeys} changeMode={this.changeMode} mode={this.state.mode} newTargetKey={this.newTargetKey}/>
						<Display/> 
					</div>
					 
					<Keys allKeys={this.allKeys} mode={this.state.mode} targetKey={this.state.targetKey}/>
				</div>
			</div>
		)
	}
}

class ModeSelect extends Component { 
	constructor(props) {
		super(props);  
	}

	clickModeChange(newMode) {   
		let oldMode = this.props.mode;
		this.props.changeMode(newMode);
		this.selectRadio('modeSelectForm', newMode);

		if(newMode === 'showKey') {
			document.getElementById('pianoDisplay').innerHTML = '';
		} else if (newMode === 'selectKey' && oldMode !== 'selectKey') {  
			let key = SelectKey.generateKey(this.props.allKeys); 
			this.props.newTargetKey(key);
			document.getElementById('pianoDisplay').innerHTML = key;
		} 
	}

	selectRadio(form, targetValue) {
		let formItems = Array.from(document[form].children); 

		formItems.forEach((item) => {
			if(item.type === 'radio') { 
				if(item.value === targetValue) {
					item.checked = true;
				} else {
					item.checked = false;
				}
			}
		});
	}

	render() {
		return (
			<form name="modeSelectForm">  
				<input type="radio" 
						name="mode"
						value="showKey" 
						onClick={() => { this.clickModeChange("showKey") }}
						defaultChecked 
				/>
				<label htmlFor="showKey"  
						onClick={() => { this.clickModeChange("showKey") }} 
				>Show Key</label><br/> 

				<input type="radio"   
						name="mode"
						value="selectKey"
						onClick={() => { this.clickModeChange("selectKey") }}
				/>
				<label htmlFor="selectKey"  
						onClick={() => { this.clickModeChange("selectKey") }}
				>Select Key</label> 
			</form>
		)
	}
}

class Display extends Component {
	render() {
		return (
			<div className="pianoDisplay" id="pianoDisplay"></div>
		)
	}
}

class Keys extends Component {
	constructor(props) {
		super(props);  
	}

	render() {
		return (
			<div className="keys"> 
				<Octave octavenumber={0} 
						allKeys={this.props.allKeys} 
						mode={this.props.mode} 
						targetKey={this.props.targetKey}/>
			</div>
		)
	}
}

class Octave extends Component { 
	constructor(props) {
		super(props); 
		this.allKeys = this.props.allKeys;
		this.returnLeft = this.returnLeft.bind(this);
		this.getWidth = this.getWidth.bind(this);
		this.makeKeys = this.makeKeys.bind(this);
		this.keys = this.makeKeys(this.allKeys);   
	}

	returnLeft(key, i) {
		let x = 3 * i;

		if (key.indexOf('#') != -1) {
			x += 2; 
		}

		return x + 'em';
	}

	makeKeys(keys) {  
		let lastKey;
		let i = 0; 
		let keyType;
		let id;

		let key; 

		return keys.map(function(key) {  
			if(lastKey && lastKey[0] != key[0]) i ++; 
			lastKey = key;
 
			if(key.indexOf('#') == -1) { 
				keyType = 'whiteKey';
				id = i + '#'; 
			} else {
				keyType = 'blackKey';
				id = i + ''; 
			}
 
			return {
				keyType: 	keyType,
				key: 		id,
				left: 		this.returnLeft(key, i), 
				keyName: 	key,
				id: 		id
			}
		}, this);  
	}

	getWidth() {
		let whiteKeys = this.allKeys.filter((key) => { return key.indexOf('#') == -1});
		return (whiteKeys.length * 3) + 'em';
	}

	render() {   
		return ( 
			<div className="octave" style={{width: this.getWidth()}}>
				{this.keys.map((key) => { 
					return <Key keyType={key.keyType} 
								left={key.left} 
								mode={this.props.mode} 
								keyName={key.keyName}
								key={key.id}
								targetKey={this.props.targetKey}
							/>
				})}
			</div>
		)
	}
}

class Key extends Component {
	constructor(props) {
		super(props); 
	}

	keyOver(key) {  
		if(this.props.mode === 'showKey') { 
			ShowKey.keyOver(key);
		}
	}

	keyOut(key) {
		if(this.props.mode === 'showKey') {
			ShowKey.keyOut(key);
		}
	}

	keyDown(key) {
		if(this.props.mode === 'selectKey') {  
			SelectKey.keyDown(key, this.props.targetKey);
		}
	}

	render() {  
		return (  
			<div className={"key " + this.props.keyType}
				style={{left: this.props.left }} 
				onMouseOver={() => this.keyOver(this.props.keyName)}
				onMouseOut={() => this.keyOut()} 
				onMouseDown={() => this.keyDown(this.props.keyName)}
			>
			</div> 
		)
	}
}

export default Piano;