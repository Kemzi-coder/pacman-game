import {DifficultyLevelParamsObject, DifficultyLevel} from "../types/game";

const DIFFICULTY_LEVEL_PARAMS: {
	[key in Uppercase<DifficultyLevel>]: DifficultyLevelParamsObject;
} = {
	EASY: {
		ghostSpeed: 2,
		ghostCount: 1,
		pacmanSpeed: 5
	},
	MEDIUM: {
		ghostSpeed: 4,
		ghostCount: 2,
		pacmanSpeed: 5
	},
	HARD: {
		ghostSpeed: 5,
		ghostCount: 3,
		pacmanSpeed: 5
	}
};

export {DIFFICULTY_LEVEL_PARAMS};
