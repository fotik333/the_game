import { TransformComponent } from "../components";
import GameWorld from "./GameWorld";

class GameObject {
    components = [];
    enabled = false;
    name = '';
    #transform = new TransformComponent;

    constructor(name, components) {
        if (name) this.name = name;
        this.components.push(this.#transform, ...components);
        GameWorld.addGameObject(this);
    }

    get transform() {
        return this.#transform;
    }

    getComponent(name) {
        return this.components.find(component => component.constructor.name === name);
    }

    hasComponent(name) {
        return !!this.components.find(component => component.constructor.name === name);
    }

    awake() {
        this.enabled = true;
        
        this.components.forEach(c => {
            c.gameObject = this;
            c.onAwake();
            c.onEnable();
        });
    }

    enable() {
        this.enabled = true;
        this.components.forEach(c => c.onEnable());
    }

    disable() {
        this.enabled = false;
        this.components.forEach(c => c.onDisable());
    }

    destroy() {
        this.enabled = false;

        this.components.forEach(c => {
            c.onDisable();
            c.onDestroy();
        });

        GameWorld.removeGameObject(this);
    }

    tick(dt) {
        if (!this.enabled) return;
        this.components.forEach(c => c.tick(dt));
    }

    onPositionSet() {
        this.components.forEach(c => c.onPositionSet());
    }

    onRotationSet() {
        this.components.forEach(c => c.onRotationSet());
    }
}

export default GameObject;