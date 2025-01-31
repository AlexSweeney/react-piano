import React from 'react';
import VolumeControl from '../VolumeControl/VolumeControl.jsx';
import PlayButton from '../../parts/PlayButton/PlayButton.jsx';
import './PianoDisplay.scss';

export default function PianoDisplay({
	displayString, 
	showPlayButton, 
	handlePlayButtonClick,
	playButtonDown, 
}) {
	/*
		* on render
			* if showPlayButton 
				* show PlayButton
			* if !showPlayButton
				* show displayString

		* on click
			* if click playbutton => handlePlayButtonClick
	*/
	const containerId = 'piano-display-container';
	const id = 'piano-display';
	let output;

	if(showPlayButton) {
		output = <PlayButton handleClick={handlePlayButtonClick} playButtonDown={playButtonDown}/>
	}

	if(!showPlayButton) {
		output = displayString;
	}

	return (
		<div className="piano-display-container" id={id}>
			<div className="piano-display" id={id}>
				{
					output
				}
			</div> 
		</div>
	) 
}	