type DifficultyLevel = "easy" | "medium" | "hard";

type SettingsObject = {
	difficulty: DifficultyLevel;
};

type ParametersObject = {
	velocity: number;
};

export type {SettingsObject, ParametersObject};
