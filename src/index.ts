import "normalize.css";
import "./styles/index.scss";
import {Game} from "./modules/game";
import {
	DifficultyLevel,
	MapVariant,
	SettingsObject
} from "./modules/game/types/game";

const scoreEl: HTMLSpanElement = document.querySelector("#score")!;
const modalEl: HTMLDivElement = document.querySelector("#modal")!;
const restartButtonEl: HTMLButtonElement = document.querySelector("#restart")!;
const modalTextEl: HTMLParagraphElement = modalEl.querySelector("#modal-text")!;
const modalButtonEl: HTMLButtonElement =
	modalEl.querySelector("#modal-button")!;
const difficultyButtonEls: NodeListOf<HTMLButtonElement> =
	document.querySelectorAll("button[data-type='difficulty']")!;
const mapButtonEls: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
	"button[data-type='map']"
)!;

// Close modal on click outside of the modal content
modalEl.addEventListener("click", e => {
	const target = e.target as HTMLElement;
	if (target.id === "modal") {
		target.classList.remove("modal--open");
	}
});

const settings: Partial<SettingsObject> = {
	difficulty: "easy",
	map: "round1",
	onScore: score => {
		scoreEl.innerHTML = `${score}`;
	},
	onWin: ({score}) => {
		modalTextEl.innerHTML = `You've won! Score: ${score}`;
		modalEl.classList.add("modal--open");
	},
	onLose: ({score}) => {
		modalTextEl.innerHTML = `You've lost! Score: ${score}`;
		modalEl.classList.add("modal--open");
	}
};

const game = new Game("#app", settings);

// Iterate through buttons, that change difficulty level
difficultyButtonEls.forEach(button => {
	// If button value equals to the default value, make it active
	if (button.dataset.value === settings.difficulty) {
		button.classList.add("button--active");
	}

	button.addEventListener("click", e => {
		const target = e.target as HTMLButtonElement;
		// Deactivate all buttons
		difficultyButtonEls.forEach(btn => {
			btn.classList.remove("button--active");
		});

		// Update game difficulty
		game.Difficulty = target.dataset.value as DifficultyLevel;
		// Activate clicked button
		target.classList.add("button--active");
	});
});

// Iterate through buttons, that change map variant
mapButtonEls.forEach(button => {
	// If button value equals to the default value, make it active
	if (button.dataset.value === settings.map) {
		button.classList.add("button--active");
	}

	button.addEventListener("click", e => {
		const target = e.target as HTMLButtonElement;
		// Deactivate all buttons
		mapButtonEls.forEach(btn => {
			btn.classList.remove("button--active");
		});

		// Update game map
		game.Map = target.dataset.value as MapVariant;
		// Activate clicked button
		target.classList.add("button--active");
	});
});

// Start the game
game.start();

modalButtonEl.addEventListener("click", () => {
	modalEl.classList.remove("modal--open");
	game.restart();
});

restartButtonEl.addEventListener("click", () => {
	game.restart();
});
