
String.prototype.hashCode = function() {
  var hash = 0,
    i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function YouTubeGetID(url){
		url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		return undefined !== url[2]?url[2].split(/[^0-9a-z_\-]/i)[0]:url[0];
}
function isYoutubeLink(urlToParse){
	if (urlToParse) {
		var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		if (urlToParse.match(regExp)) {
			return true;
		}
	}
	return false;
}

function mapKeySignature(text) {
	switch (text) {
		case 'TWO_FOUR':
			return '2/4'
		case 'THREE_FOUR':
			return '3/4'
		case 'FOUR_FOUR':
			return '4/4'
		case 'SIX_EIGHT':
			return '6/8'
		case 'NINE_EIGHT':
			return '9/8'
		case 'TWELVE_EIGHT':
			return '12/8'
	}
}

function getBeatsPerBar(text) {
	switch (text) {
		case '2/4':
			return 2
		case '3/4':
			return 3
		case '4/4':
			return 4
		case '6/8':
			return 2
		case '9/8':
			return 3
		case '12/8':
			return 4
	}
}

function nameFromPath(path) {
	var parts = path.split("/")
	var nameParts = parts[parts.length - 1].split(".")
	return nameParts.slice(0,-1).join(".")
}


export  {YouTubeGetID, isYoutubeLink, mapKeySignature, getBeatsPerBar, nameFromPath}
