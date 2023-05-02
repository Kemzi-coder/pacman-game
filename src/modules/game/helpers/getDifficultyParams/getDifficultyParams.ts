import {DIFFICULTY_LEVEL_PARAMS} from "../../constants/difficultyLevelParams";
import {DifficultyLevel, DifficultyLevelParamsObject} from "../../types/game";

const getDifficultyParams = (level: DifficultyLevel) => {
	let difficultyParams: DifficultyLevelParamsObject;

	switch (level) {
		case "hard": {
			difficultyParams = DIFFICULTY_LEVEL_PARAMS.HARD;
			break;
		}
		case "medium": {
			difficultyParams = DIFFICULTY_LEVEL_PARAMS.MEDIUM;
			break;
		}
		case "easy": {
			difficultyParams = DIFFICULTY_LEVEL_PARAMS.EASY;
			break;
		}
		default:
			difficultyParams = {ghostCount: 0, ghostSpeed: 0, pacmanSpeed: 0};
			break;
	}

	return difficultyParams;
};

export default getDifficultyParams;
