/*global tau */
(function () {
	var sensors = [{
		'name': 'Bedroom',
		'url': 'http://192.168.1.44'
	}, {
		'name': 'Pork',
		'url': 'http://192.168.1.45'
	}, {
		'name': 'Livingroom',
		'url': 'http://192.168.1.46'
	}];

	var states = [{
		'name': 'Off',
		'value': 0
	}, {
		'name': 'Sleep',
		'value': 16
	}, {
		'name': 'Night',
		'value': 64
	}, {
		'name': 'Half',
		'value': 512
	}, {
		'name': 'On',
		'value': 1023
	}];

	var selectedSensor = null;

	// ------------------------------------------------------------------------
	// Create views
	// ------------------------------------------------------------------------

	function createMain(list) {
		for (var i = 0; i < sensors.length; i++) {
			console.log('process sensor #' + i);

			var span = document.createElement('span');
			span.className = 'ui-li-sub-text li-text-sub';
			span.innerHTML = '?';

			var li = document.createElement('li');
			li.className = 'li-has-2line';
			li.addEventListener('click', showDetail.bind(this, i), false);
			li.innerText = sensors[i].name;
			li.appendChild(span);

			list.appendChild(li);

			// Get current data
			console.log(sensors[i].url);
			var client = new XMLHttpRequest();
			client.onreadystatechange = parseResponse.bind(this, client, span);
			client.open('GET', sensors[i].url, true);
			client.send();
		}
	}

	function createDetail(list) {
		document.getElementById('title').innerHTML = selectedSensor.name;

		for (var i = 0; i < states.length; i++) {
			var url = selectedSensor.url + '?duty=' + states[i].value;
			console.log('process state #' + i);

			var input = document.createElement('input');
			input.type = 'radio';
			input.name = 'duty';
			input.addEventListener('click', requestDuty.bind(this, url), false);

			var label = document.createElement('label');
			label.innerHTML = states[i].name;
			label.appendChild(input);

			var li = document.createElement('li');
			li.className = 'li-has-radio';
			li.appendChild(label);

			list.appendChild(li);
		}
	}

	// ------------------------------------------------------------------------
	// Utils
	// ------------------------------------------------------------------------

	function showDetail(i) {
		console.log('-- showDetail(' + i + ') --');
		selectedSensor = sensors[i];
		tau.changePage('detail');
	}

	function parseResponse(client, span) {
		console.log('-- parseResponse(' + client + ',' + span + ') --');
		if (client.readyState === 4 && client.status === 200) {
			console.log(client.statusText + ' ' + client.status + ' ' + client.response);

			var root = new DOMParser().parseFromString(client.response, 'text/html').body;
			span.innerHTML = root.getElementsByTagName('h2')[0].innerHTML;
		}

		/*for (var i in client) {
			console.log('- ' + i + ' = ' + client[i]);
		}*/
	}

	function requestDuty(url) {
		console.log('-- requestDuty(' + url + ') --');

		var client = new XMLHttpRequest();
		client.onreadystatechange = showToast.bind(this, client);
		client.onerror = showToastError.bind(this, client);
		client.open('GET', url, true);
		client.send();
	}

	function showToast(client) {
		console.log('-- showToast(' + client.readyState + ',' + client.status + ') --');
		if (client.readyState === 4 && client.status === 200) {
			tau.openPopup('popupSuccess');
		}
	}

	function showToastError(client) {
		if (client.readyState === 4 && client.status === 0) {
			tau.openPopup('popupFailure');
		}
	}

	// ------------------------------------------------------------------------
	// Listeners
	// ------------------------------------------------------------------------

	document.addEventListener('pagecreate', function (event) {
		var page = event.target;
		console.log('-- pagecreate(' + page.id + ') --');

		var list = page.querySelector('.ui-listview');
		if (!list) {
			return;
		}

		// Clear list
		list.innerHTML = '';

		if (page.id === 'main') {
			createMain(list);
		} else

		if (page.id === 'detail') {
			createDetail(list);
		}
	});

	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageid = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageid = page ? page.id : "";

			if (pageid === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
}());