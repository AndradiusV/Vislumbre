(function() {
	'use strict';

	var translations = {
		'en': {
			'nav.home': 'Home',
			'nav.about': 'About us',
			'nav.comments': 'Developer comments',
			'nav.contact': 'Contact',
			'intro.description': 'Vislumbre is a screen-sharing program that lets you draw on the screen of the person sharing. It works over local area networks (LANs).',
			'intro.download': 'Vislumbre is distributed as a .zip file. Simply extract it and run Vislumbre.exe.',
			'intro.downloadButton': 'Download Vislumbre',
			'intro.source': 'If you would like to make changes, the Unity and AudioCatcher projects are available below as .zip files. Both are free to use. Feel free to use and modify them.',
			'intro.unity': 'Unity project',
			'intro.audioCatcher': 'AudioCatcher',
			'about.flarique': 'I am primarily responsible for developing this project. I also have a YouTube channel; feel free to check it out.',
			'about.fallen': 'L. Fallen is a great friend. Although he is not exactly an artist, he always accepts my requests to create illustrations. I have never paid him, but I show my gratitude with lots of affection. — L. Fallen: “I am not an artist; I am crazy.”',
			'comments.heading': 'Developer comments',
			'comments.intro': 'Although I was the main developer, I thought it would be worthwhile to share comments from people who tested the program with me.',
			'comments.flarique': 'Developing this program was quite a challenge, but completing a project of my own was a great achievement. It was fun testing it and playing tactical games with my friends.',
			'comments.toBeAdded': 'Comment coming soon.',
			'comments.production': 'During development, I planned to include some features that did not make it into the first public release. One of them was image and video sharing. I know how to implement it, but have not yet found the motivation to do so.',
			'comments.placeholderHeading1': 'Future improvements',
			'comments.placeholder1': 'More information about the project will be added here.',
			'comments.placeholderHeading2': 'Community feedback',
			'comments.placeholder2': 'This section is reserved for future community feedback.',
			'comments.placeholderHeading3': 'Development notes',
			'comments.placeholder3': 'Additional development notes will be shared here.',
			'contact.heading': 'Contact',
			'contact.description': 'To get in touch, send a message using the form or follow my work on social media.',
			'contact.message': 'Send a message',
			'contact.social': 'Social media'
		}
	};

	var toggle = document.getElementById('language-toggle');
	var manualChoice = false;
	var selectedLanguage = 'pt';
	var originalTexts = {};
	var originalTextsCaptured = false;

	function applyLanguage(language) {
		selectedLanguage = language;
		document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR';

		var strings = translations[language];
		var elements = document.querySelectorAll('[data-i18n]');

		if (!originalTextsCaptured) {
			for (var j = 0; j < elements.length; j++) {
				var originalKey = elements[j].getAttribute('data-i18n');
				originalTexts[originalKey] = elements[j].textContent;
			}

			originalTextsCaptured = true;
		}

		for (var i = 0; i < elements.length; i++) {
			var key = elements[i].getAttribute('data-i18n');

			if (language === 'en' && strings[key])
				elements[i].textContent = strings[key];
			else if (language === 'pt')
				elements[i].textContent = originalTexts[key];
		}

		toggle.textContent = language === 'en' ? 'Português' : 'English';
		toggle.setAttribute(
			'aria-label',
			language === 'en' ? 'Switch language to Portuguese' : 'Mudar idioma para inglês'
		);
	}

	function browserLanguage() {
		return navigator.language && navigator.language.toLowerCase() === 'pt-br' ? 'pt' : 'en';
	}

	try {
		var savedLanguage = window.localStorage.getItem('vislumbre-language');

		if (savedLanguage === 'en' || savedLanguage === 'pt') {
			manualChoice = true;
			applyLanguage(savedLanguage);
		}
	}
	catch (error) {
		console.warn('Could not read the saved language preference.', error);
	}

	toggle.addEventListener('click', function() {
		manualChoice = true;
		applyLanguage(selectedLanguage === 'en' ? 'pt' : 'en');

		try {
			window.localStorage.setItem('vislumbre-language', selectedLanguage);
		}
		catch (error) {
			console.warn('Could not save the language preference.', error);
		}
	});

	if (!manualChoice) {
		var controller = new AbortController();
		var timeout = window.setTimeout(function() {
			controller.abort();
		}, 5000);

		window.fetch('https://ipapi.co/json/', { signal: controller.signal })
			.then(function(response) {
				if (!response.ok)
					throw new Error('Country lookup returned HTTP ' + response.status + '.');

				return response.json();
			})
			.then(function(data) {
				if (typeof data.country_code !== 'string')
					throw new Error('Country lookup did not return a country code.');

				if (!manualChoice)
					applyLanguage(data.country_code.toUpperCase() === 'BR' ? 'pt' : 'en');
			})
			.catch(function(error) {
				console.warn('Could not detect the visitor country; using the browser language.', error);

				if (!manualChoice)
					applyLanguage(browserLanguage());
			})
			.then(function() {
				window.clearTimeout(timeout);
			});
	}
})();
