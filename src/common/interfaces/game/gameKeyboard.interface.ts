import {Key, KeyObject} from "../../types/game";

interface IGameKeyboard {
	keys: {[key in Key]: KeyObject};
	lastKey: Key | null;
	addEventListeners: () => void;
	removeEventListeners: () => void;
}

export type {IGameKeyboard};
