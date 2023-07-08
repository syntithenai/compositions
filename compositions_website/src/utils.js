
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


export  {YouTubeGetID, isYoutubeLink}
