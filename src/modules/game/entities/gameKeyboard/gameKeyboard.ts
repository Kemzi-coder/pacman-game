import {Key, KeyObject, IGameKeyboard} from "../../types/game";

class GameKeyboard implements IGameKeyboard {
	keys: {[key in Key]: KeyObject} = {
		ArrowUp: {isPressed: false},
		ArrowDown: {isPressed: false},
		ArrowLeft: {isPressed: false},
		ArrowRight: {isPressed: false}
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
}

export default GameKeyboard;
