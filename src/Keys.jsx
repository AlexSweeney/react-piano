import React from './react.jsx';

const Keys = (props) => { 
	return(
		<div className="keys"> 
			<Octave octaveNumber={0} 
				{...props}/>	
		</div>
	)
};

export default React;