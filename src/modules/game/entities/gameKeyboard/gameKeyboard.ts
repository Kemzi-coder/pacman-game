import {Key, KeyObject, IGameKeyboard} from "../../types/game";

class GameKeyboard implements IGameKeyboard {
	private initialKeys: {[key in Key]: KeyObject} = {
		ArrowUp: {isPressed: false},
		ArrowDown: {isPressed: false},
		ArrowLeft: {isPressed: false},
		ArrowRight: {isPressed: false}
	};

	keys: {[key in Key]: KeyObject} = {
		ArrowUp: {...this.initialKeys.ArrowUp},
		ArrowDown: {...this.initialKeys.ArrowDown},
		ArrowLeft: {...this.initialKeys.ArrowLeft},
		ArrowRight: {...this.initialKeys.ArrowRight}
	};

	lastKey: Key | null = null;

	constructor() {
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
	}

	private static isValidKey(key: string): key is Key {
		return (
			key === "ArrowDown" ||
			key === "ArrowUp" ||
			key === "ArrowLeft" ||
			key === "ArrowRight"
		);
	}

	private handleKeyDown({key}: KeyboardEvent): void {
		if (GameKeyboard.isValidKey(key)) {
			this.keys[key].isPressed = true;
			this.lastKey = key;
		}
	}

	private handleKeyUp({key}: KeyboardEvent): void {
		if (GameKeyboard.isValidKey(key)) {
			this.keys[key].isPressed = false;
		}
	}

	addEventListeners(): void {
		window.addEventListener("keydown", this.handleKeyDown);
		window.addEventListener("keyup", this.handleKeyUp);
	}

	removeEventListeners(): void {
		window.removeEventListener("keydown", this.handleKeyDown);
		window.removeEventListener("keyup", this.handleKeyUp);
	}

	reset() {
		this.keys = {
			ArrowUp: {...this.initialKeys.ArrowUp},
			ArrowDown: {...this.initialKeys.ArrowDown},
			ArrowLeft: {...this.initialKeys.ArrowLeft},
			ArrowRight: {...this.initialKeys.ArrowRight}
		};
		this.lastKey = null;
	}
}

export default GameKeyboard;
