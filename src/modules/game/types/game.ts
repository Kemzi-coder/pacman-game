import type {Ghost} from "../../ghost";
import type {Layout} from "../../layout";
import type {Pacman} from "../../pacman";

interface IGame {
	start: () => void;
	stop: () => void;
}

interface IGameKeyboard {
	keys: {[key in Key]: KeyObject};
	lastKey: Key | null;
	addEventListeners: () => void;
	removeEventListeners: () => void;
}

type DifficultyLevel = "easy" | "medium" | "hard";

type MapVariant = "round1" | "round2";

type StateObject = {score: number};

type DifficultyLevelParamsObject = {
	pacmanSpeed: number;
	ghostSpeed: number;
	ghostCount: number;
};

type Callbacks = {
	onScore?: (score: number) => void;
	onWin?: (state: StateObject) => void;
	onLose?: (state: StateObject) => void;
};

type SettingsObject = {
	difficulty: DifficultyLevel;
	map: MapVariant;
	scoreStep: number;
} & Callbacks;

type ParamsObject = {
	scoreStep: number;
	ghosts: Ghost[];
	layout: Layout;
	pacman: Pacman;
} & Callbacks;

type Key = "ArrowDown" | "ArrowUp" | "ArrowLeft" | "ArrowRight";

type KeyObject = {isPressed: boolean};

export type {
	SettingsObject,
	ParamsObject,
	MapVariant,
	Key,
	KeyObject,
	IGame,
	IGameKeyboard,
	DifficultyLevel,
	DifficultyLevelParamsObject
};
