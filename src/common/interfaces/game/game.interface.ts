import {SettingsObject} from "../../types/game";

interface IGame {
	settings: SettingsObject;
	score: number;
	start: () => void;
	stop: () => void;
}

export type {IGame};
