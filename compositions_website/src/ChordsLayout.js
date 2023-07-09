function ChordsLayout() {
	return <div>ChordsLayout
	 {song ? song.layout.map(function(l) {
				return <div>{l.name}</div>  
			  }) : ''}</div>
}
