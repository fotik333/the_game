import Component from "../core/Component";

class TransformComponent extends Component {
    #position = { x: 0, y: 0 };
    #rotation = 0;

    set position(position) {
        this.#position = position;
        this.gameObject && this.gameObject.onPositionSet();
    }
    
    set rotation(angle) {
        this.#rotation = angle;
        this.gameObject && this.gameObject.onRotationSet();
    }

    get position() {
        return this.#position;
    }
    
    get rotation() {
        return this.#rotation;
    }
}

export default TransformComponent;