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

type SettingsObject = {
	difficulty: DifficultyLevel;
	map: MapVariant;
	scoreStep: number;
	onScore?: (score: number) => void;
	onWin?: (state: StateObject) => void;
	onLose?: (state: StateObject) => void;
};

type ParamsObject = {
	map: string[][];
	scoreStep: number;
} & DifficultyLevelParamsObject;

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
