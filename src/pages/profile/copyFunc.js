const copy = {
		discord: () => {
			const element = document.getElementById('discord');
			element.select();
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
		},
		twitch: () => {
			const element = document.getElementById('twitch');
			element.select();
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
		},
		steam: () => {
			const element = document.getElementById('steam');
			element.select();
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
		},
		origin: () => {
			const element = document.getElementById('origin');
			element.select();
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
		},
		psn: () => {
			const element = document.getElementById('psn');
			element.select();
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
		},
		xbox: () => {
			const element = document.getElementById('xbox');
			element.select();
			document.execCommand('copy');
			window.getSelection().removeAllRanges();
		},
	}

export default copy;