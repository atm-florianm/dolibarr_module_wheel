
window.addEventListener('load', () => {
	let flare = function (pos) {
		let s = document.createElement('div');
		s.innerText = '';
		s.style.position = 'absolute';
		s.style.top =  (pos.y - 5) + 'px';
		s.style.left = (pos.x - 5) + 'px';
		s.style.display = 'block';
		s.style.background = 'rgba(244, 90, 130, 30%)';
		s.style.width = '10px';
		s.style.height = '10px';
		s.style.borderRadius = '5px';

		document.body.appendChild(s);
		setTimeout(() => {
			document.body.removeChild(s);
		}, 1000);
	};

	let rightBtnDown = false;
	let gesture = [];
	let keyState = {};

	let registeredActions = {
		'S': () => {
			let btn = document.querySelector('div.tabsAction a[href*="action=edit"]');
			document.location = btn.href;
		},
		'W': () => window.history.back(),
		'E': () => window.history.forward(),
	};

	let checkRegisteredActions = function (direction) {
		if (registeredActions[direction]) {
			registeredActions[direction]();
		}
	};

	window.addEventListener('contextmenu', e => {
		if (!keyState['Control']) {
			return;
		}
		e.preventDefault();
	});
	window.addEventListener('keydown', e => {
		keyState[e.key] = true;
	});
	window.addEventListener('keyup', e => {
		if (keyState[e.key]) keyState[e.key] = false;
	});
	window.addEventListener('mousedown', e => {
		if (!keyState['Control']) {
			return;
		}
		if (e.button === 2) {
			gesture.push({x: e.clientX, y: e.clientY});
			rightBtnDown = true;
		}
	});
	window.addEventListener('mouseup', e => {
		if (e.button === 2) {
			// efforts futiles pour essayer de réafficher le menu contextuel natif
			// (en réalité, le navigateur ne l'autorise pas).
			gesture.push({x: e.clientX, y: e.clientY});
			rightBtnDown = false;
			let direction = gestureRecognition();
			checkRegisteredActions(direction);
		}
	});
	window.addEventListener('mousemove', e => {
		if (!rightBtnDown) return;
		flare({x: e.clientX, y: e.clientY});
	});

	let gestureRecognition = function () {
		if (gesture.length !== 2) {
			while (gesture.length) gesture.pop();
			return;
		}
		let start = gesture.shift();
		let end = gesture.pop();
		let distX = end.x - start.x;
		let distY = end.y - start.y;
		let absX = Math.abs(distX);
		let absY = Math.abs(distY);
		if (!distX && !distY) {
			return '.';
		}
		if (absX >= absY * 2) {
			// mouvement horizontal
			return (distX > 0) ? 'E' : 'W';
		}
		if (absY >= absX * 2) {
			// mouvement vertical
			return (distY > 0) ? 'S' : 'N';
		}
		if (absY - absX < (0.4 * Math.max(absY, absX))) {
			// mouvement diagonal: moins de 30% de différence entre la distance X et Y
			return ((distY > 0) ? 'S' : 'N') + ((distX > 0) ? 'E' : 'W');
		}
		return undefined;
	};
});
