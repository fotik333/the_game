import GameSession from "../core/GameSession";
import { layoutConfig } from '../config/layout';
import gameConfig from '../config/gameConfig.json';
import GameObject from "../core/GameObject";
import { SpaceshipMotionComponent, SpaceshipAttackComponent, DisplayObjectComponent, RocketBehaviorComponent, CircleColliderComponent, AsteroidBehaviorComponent, SetupComponent } from '../components';
import { WIDTH, HEIGHT } from '../index.js';
import { Sprite, Graphics } from "pixi.js";
import { LAYERS } from "../components/CircleColliderComponent";

export default class CustomGameSession extends GameSession {
    #layout = layoutConfig.gameScreen;
    #config;
    #asteroids = [];

    constructor(screen, config) {
        super(screen);

        this.#config = config;
        this.inflate(this.#layout);

        this.initGameObjects();
        this.initUI();
        this.initSetup();
    }

    initUI() {
        this.timer = this.screen.getChildByName('Timer');
        this.timer.setup(gameConfig.gameTime);

        this.screen.getChildByName('RocketsAmount').text = gameConfig.rocketsCount;
    }

    initGameObjects() {
        this.createPlayer();
        this.createAsteroids();
    }

    initSetup() {
        let setupComponent = new SetupComponent(this.screen, this.#layout);
        setupComponent.on('WIN', this.onWin.bind(this));
        setupComponent.on('LOSE', this.onLose.bind(this));
        
        let components = [
            setupComponent
        ];

        new GameObject('Setup', components);
    }

    onWin() {
        this.emit('SESSION_END', true);
    }

    onLose() {
        this.emit('SESSION_END', false);
    }

    createPlayer() {
        let sprite = Sprite.from('spaceship');
        sprite.anchor.set(.5, 1);

        let components = [
            new DisplayObjectComponent(sprite, this.screen),
            new SpaceshipMotionComponent(),
            new SpaceshipAttackComponent(this.createRocket.bind(this), 5, -sprite.height)
        ];

        this.spaceship = new GameObject('Spaceship', components);
        this.spaceship.transform.position = { x: WIDTH / 2, y: HEIGHT - 10 };
    }

    createAsteroids() {
        for (let i = 0; i < gameConfig.asteroidsCount; i++) {
            let sprite = Sprite.from('asteroid');
            sprite.anchor.set(.5, .5);

            if (gameConfig.asteroidsRandomizeScale) {
                sprite.width = sprite.height = sprite.height * (gameConfig.asteroidsScaleRange[0] + Math.random() * (gameConfig.asteroidsScaleRange[1] - gameConfig.asteroidsScaleRange[0]));
            }

            let components = [
                new DisplayObjectComponent(sprite, this.screen),
                new CircleColliderComponent(sprite.height / 2, LAYERS.asteroids),
            ];

            let spaceshipHeight = this.spaceship.getComponent(DisplayObjectComponent).displayObject.height;

            if (gameConfig.movingAsteroids) {
                components.push(new AsteroidBehaviorComponent({
                    x: Math.random() * gameConfig.asteroidsSpeedMax.x * 2 - gameConfig.asteroidsSpeedMax.x,
                    y: Math.random() * gameConfig.asteroidsSpeedMax.y * 2 - gameConfig.asteroidsSpeedMax.y
                }, spaceshipHeight));
            }

            let asteroid = new GameObject('Asteroid', components);

            asteroid.transform.position = {
                x: sprite.height + Math.random() * (WIDTH - sprite.height * 2),
                y: sprite.height + Math.random() * (HEIGHT - sprite.height * 2 - spaceshipHeight) ,
            };

            this.#asteroids.push(asteroid);
        }
    }

    createRocket() {
        let rocketGraphics = new Graphics();
        rocketGraphics.beginFill(0x00ff00);
        rocketGraphics.drawCircle(0, 0, 15);
        rocketGraphics.endFill();

        let components = [
            new DisplayObjectComponent(rocketGraphics, this.screen),
            new CircleColliderComponent(rocketGraphics.height / 2, LAYERS.rockets),
            new RocketBehaviorComponent(LAYERS.asteroids)
        ];

        let rocket = new GameObject('Rocket', components);

        return rocket;
    }
}