
/* jshint esversion: 6 */
$(() => {
	let down = false;
	let lastmove = Date.now();
	let mouvement = [];
	window.addEventListener('contextmenu', (e) => {
		e.preventDefault();
		down = true;
	});

	window.addEventListener('mousedown', (e) => {
		if (e.button === 2) {
			down = true;
			mouvement = [];
			e.preventDefault();
		}
	});
	window.addEventListener('mouseup', (e) => {
		if (e.button === 2) {
			down = false;
			scanMvt(mouvement);
			e.preventDefault();
		}
	});
	window.addEventListener('mousemove', (e) => {
		let interval = Date.now() - lastmove;
		if (interval < 140) return;
		lastmove = Date.now();
		mouvement.push({x: e.clientX, y: e.clientY});
	});

	let scanMvt = function (mvt) {
		let first = mvt.shift();
		let last = mvt.pop();
		let distX = Math.abs(first.x - last.x);
		let distY = Math.abs(first.y - last.y);
		while(mvt.pop());

		let ratio = distX / (distY ? distY : 0.0001);

		if (ratio < 0.2) {
			alert('ok');
		}

	};
});
