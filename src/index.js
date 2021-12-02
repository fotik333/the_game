import * as PIXI from "pixi.js";
global.PIXI = PIXI;

import Game from './Game.js';

const WIDTH = 1280;
const HEIGHT = 720;

const app = new PIXI.Application({
	width: WIDTH,
	height: HEIGHT,
	autoResize: true
});

window.addEventListener('resize', resize);

function resize() {
	app.renderer.resize(window.innerWidth, window.innerHeight);

	let scaleX = window.innerWidth / WIDTH;
	let scaleY = window.innerHeight / HEIGHT;
	let scale = Math.min(scaleX, scaleY);
	app.stage.scale.set(scale, scale);

	app.stage.position.x = (window.innerWidth - WIDTH * scale) / 2;
	app.stage.position.y = (window.innerHeight - HEIGHT * scale) / 2;
}

resize();

document.body.appendChild(app.view);

app.loader
	.add('background', 'assets/background.jpg')
	.add('assets/spritesheet.json');

function setup() {
	app.stage.mask = app.stage.addChild(new PIXI.Graphics()
		.beginFill(0xffffff)
		.drawRect(0, 0, WIDTH, HEIGHT)
		.endFill());

	app.stage.addChild(new Game);
}

app.loader.load(setup);

export { WIDTH, HEIGHT };