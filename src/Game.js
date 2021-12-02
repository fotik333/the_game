import { InputManager } from "./ui";
import { Sprite, Container } from 'pixi.js';
import StarsBackground from "./StarsBackground";
import Screen from './core/Screen';
import { layoutConfig } from './config/layout';
import gameConfig from './config/gameConfig.json';
import CustomGameSession from './game/CustomGameSession';

class Game extends Container {
	constructor() {
		super();

		this.addChild(Sprite.from('background'));

        this.starsBackground = this.addChild(new StarsBackground());

		this.menuScreen = this.addChild(new Screen(layoutConfig.menuScreen));
        this.menuScreen.on(layoutConfig.menuScreen.events.onPlayButtonPressed, this.onPlayButtonPressed.bind(this));

		this.resultScreen = this.addChild(new Screen(layoutConfig.resultScreen));
        this.resultScreen.on(layoutConfig.resultScreen.events.onMenuButtonPressed, this.onMenuButtonPressed.bind(this));
        this.resultScreen.on(layoutConfig.resultScreen.events.onRestartButtonPressed, this.onRestartButtonPressed.bind(this));

		this.gameScreen = this.addChild(new Screen());

		this.switchScreen('MENU');
	}

	switchScreen(screenName) {
		this.children.forEach(child => {
			if (!child.isScreen) return;

			child.visible = child.name === screenName;
		});
	}

	selectGameSession() {
		return new CustomGameSession(this.gameScreen, gameConfig);
	}

	startGameSession() {
		this.gameSession = this.selectGameSession();

		this.switchScreen('GAME');

		InputManager.enable();

		this.gameSession.on('SESSION_END', this.finishGameSession.bind(this));
		this.gameSession.start();
	}

	finishGameSession(isWin) {
		this.gameSession.finish();
		InputManager.disable();
		
		this.gameSession.off('SESSION_END', this.finishGameSession.bind(this));
		this.resultScreen.getChildByName('ResultText').text = `YOU ${isWin ? 'WIN' : 'LOSE'}`;
		this.switchScreen('RESULT');
	}

	onMenuButtonPressed() {
		this.switchScreen('MENU');
	}

    onRestartButtonPressed() {
		this.startGameSession();
    }

    onPlayButtonPressed() {
		this.startGameSession();
    }

	destroy() {
		this.gameSession.finish();
	}
}

export default Game;