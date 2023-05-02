import {Boundary} from "../../../boundary";
import {Ghost} from "../../../ghost";
import {Layout} from "../../../layout";
import {Pacman} from "../../../pacman";
import {
	ParamsObject,
	SettingsObject,
	IGame,
	MapVariant,
	DifficultyLevel
} from "../../types/game";
import {
	getVelocityByDirection,
	isCircleCollidesWithCircle,
	isCircleCollidesWithRect
} from "../../../../common";
import GameKeyboard from "../gameKeyboard/gameKeyboard";
import getNextGhostDirection from "../../helpers/getNextGhostDirection/getNextGhostDirection";
import {HEIGHT, WIDTH} from "../../constants/canvas";
import getRandomGhosts from "../../helpers/getRandomGhosts/getRandomGhosts";
import {defaultSettings} from "../../constants/defaultSettings";
import getMap from "../../helpers/getMap/getMap";
import getDifficultyParams from "../../helpers/getDifficultyParams/getDifficultyParams";

/* eslint-disable no-param-reassign */
class Game implements IGame {
	private canvas: HTMLCanvasElement;

	private ctx: CanvasRenderingContext2D;

	private gameKeyboard: GameKeyboard;

	private animationId: number | null = null;

	private settings: SettingsObject;

	private params: ParamsObject;

	private score: number = 0;

	constructor(canvasSelector: string, settings?: Partial<SettingsObject>) {
		const canvas: HTMLCanvasElement | null =
			document.querySelector(canvasSelector);

		if (!canvas) {
			throw new Error("Canvas element is null.");
		}

		const canvasContext: CanvasRenderingContext2D | null =
			canvas.getContext("2d");

		if (!canvasContext) {
			throw new Error("Error getting canvas context.");
		}

		this.canvas = canvas;
		this.ctx = canvasContext;

		// Set canvas dimensions
		this.canvas.width = WIDTH;
		this.canvas.height = HEIGHT;

		this.settings = {...defaultSettings, ...settings};

		this.params = this.getParams();

		this.gameKeyboard = new GameKeyboard();
	}

	private getParams(): ParamsObject {
		const {scoreStep, map: mapVariant, difficulty} = this.settings;

		const map = getMap(mapVariant);
		const difficultyParams = getDifficultyParams(difficulty);

		const params: ParamsObject = {...difficultyParams, map, scoreStep};

		return params;
	}

	private handleWin() {
		this.settings.onWin?.({score: this.score});
		this.stop();
	}

	private handleLose() {
		this.settings.onLose?.({score: this.score});
		this.stop();
	}

	private addScore() {
		const value = this.score + this.params.scoreStep;
		this.score = value;
		this.settings.onScore?.(value);
	}

	private resetScore() {
		this.score = -this.params.scoreStep;
	}

	set Map(value: MapVariant) {
		const map = getMap(value);
		this.params.map = map;
	}

	set Difficulty(value: DifficultyLevel) {
		const difficultyParams = getDifficultyParams(value);
		this.params = {...this.params, ...difficultyParams};
	}

	set ScoreStep(value: number) {
		this.params.scoreStep = value;
	}

	private startAnimation({
		layout,
		pacman,
		ghosts
	}: {
		layout: Layout;
		pacman: Pacman;
		ghosts: Ghost[];
	}) {
		const {ctx, canvas, gameKeyboard} = this;

		const frameCb = () => {
			this.animationId = window.requestAnimationFrame(frameCb);
			// Clear canvas on each frame
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (
				gameKeyboard.keys.ArrowUp.isPressed &&
				gameKeyboard.lastKey === "ArrowUp"
			) {
				for (let i = 0; i < layout.boundaries.length; i += 1) {
					const boundary = layout.boundaries[i];

					if (
						isCircleCollidesWithRect({
							circle: {...pacman, velocity: {x: 0, y: -pacman.speed}},
							rectangle: boundary
						})
					) {
						pacman.velocity.y = 0;
						break;
					} else {
						pacman.velocity.y = -pacman.speed;
					}
				}
			} else if (
				gameKeyboard.keys.ArrowDown.isPressed &&
				gameKeyboard.lastKey === "ArrowDown"
			) {
				for (let i = 0; i < layout.boundaries.length; i += 1) {
					const boundary = layout.boundaries[i];

					if (
						isCircleCollidesWithRect({
							circle: {...pacman, velocity: {x: 0, y: pacman.speed}},
							rectangle: boundary
						})
					) {
						pacman.velocity.y = 0;
						break;
					} else {
						pacman.velocity.y = pacman.speed;
					}
				}
			} else if (
				gameKeyboard.keys.ArrowLeft.isPressed &&
				gameKeyboard.lastKey === "ArrowLeft"
			) {
				for (let i = 0; i < layout.boundaries.length; i += 1) {
					const boundary = layout.boundaries[i];

					if (
						isCircleCollidesWithRect({
							circle: {...pacman, velocity: {x: -pacman.speed, y: 0}},
							rectangle: boundary
						})
					) {
						pacman.velocity.x = 0;
						break;
					} else {
						pacman.velocity.x = -pacman.speed;
					}
				}
			} else if (
				gameKeyboard.keys.ArrowRight.isPressed &&
				gameKeyboard.lastKey === "ArrowRight"
			) {
				for (let i = 0; i < layout.boundaries.length; i += 1) {
					const boundary = layout.boundaries[i];

					if (
						isCircleCollidesWithRect({
							circle: {...pacman, velocity: {x: pacman.speed, y: 0}},
							rectangle: boundary
						})
					) {
						pacman.velocity.x = 0;
						break;
					} else {
						pacman.velocity.x = pacman.speed;
					}
				}
			}

			// If there are no pellets left, execute win scenario
			if (layout.pellets.length === 0) {
				this.handleWin();
			}

			layout.draw(ctx, {
				onEachBoundaryDraw: boundary => {
					// True, if pacman collides with boundary
					if (isCircleCollidesWithRect({circle: pacman, rectangle: boundary})) {
						// Stop the pacman
						pacman.velocity = {x: 0, y: 0};
					}
				},
				onEachPelletDraw: (pellet, index) => {
					// True, if pacman collides with pellet
					if (isCircleCollidesWithCircle({circle1: pellet, circle2: pacman})) {
						// Remove the pellet
						layout.removePellet(index);

						// Increment game score
						this.addScore();
					}
				},
				onEachPowerUpDraw: (powerUp, index) => {
					// True, if pacman collides with powerUp pellet
					if (isCircleCollidesWithCircle({circle1: powerUp, circle2: pacman})) {
						// Remove the powerUp pellet
						layout.removePowerUp(index);

						// Make all the ghosts scared for 3 seconds
						ghosts.forEach(ghost => {
							ghost.isScared = true;

							setTimeout(() => {
								ghost.isScared = false;
							}, 3000);
						});
					}
				}
			});

			for (let i = ghosts.length - 1; i >= 0; i -= 1) {
				const ghost = ghosts[i];

				// True, if pacman collides with ghost
				if (isCircleCollidesWithCircle({circle1: ghost, circle2: pacman})) {
					// If ghost isn't scared, execute lose scenario
					if (!ghost.isScared) {
						this.handleLose();
					} else {
						// Otherwise, kill (remove) ghost
						ghosts.splice(i, 1);
					}
				}

				ghost.update(ctx);

				// Get next random ghost movement direction
				const direction = getNextGhostDirection({
					ghost,
					boundaries: layout.boundaries
				});

				// Update ghost movement direction
				if (direction) {
					const velocity = getVelocityByDirection({
						direction,
						speed: ghost.speed
					});
					ghost.velocity = velocity;
				}
			}

			pacman.update(ctx);

			// Rotate pacman depending on it's movement direction
			if (pacman.velocity.x > 0) {
				pacman.rotation = 0;
			} else if (pacman.velocity.x < 0) {
				pacman.rotation = Math.PI;
			} else if (pacman.velocity.y > 0) {
				pacman.rotation = Math.PI / 2;
			} else if (pacman.velocity.y < 0) {
				pacman.rotation = -Math.PI / 2;
			}
		};
		frameCb();
	}

	start(): void {
		// Reset score
		this.resetScore();

		const layout = new Layout({map: this.params.map});

		const pacman = new Pacman({
			position: {
				x: Boundary.width + Boundary.width / 2,
				y: Boundary.height + Boundary.height / 2
			},
			velocity: {x: 0, y: 0},
			speed: this.params.pacmanSpeed
		});

		const ghostPositions = layout.pellets
			.map(({position}) => position)
			// Remove positions, that are too close to the pacman
			.filter(position => {
				const distance = Math.sqrt(
					(pacman.position.x - position.x) ** 2 +
						(pacman.position.y - position.y) ** 2
				);

				if (distance < Boundary.width * 3) {
					return false;
				}

				return true;
			});

		const ghosts = getRandomGhosts({
			boundaries: layout.boundaries,
			positions: ghostPositions,
			ghostCount: this.params.ghostCount,
			ghostSpeed: this.params.ghostSpeed
		});

		this.gameKeyboard.addEventListeners();
		this.startAnimation({layout, pacman, ghosts});
	}

	stop(): void {
		this.gameKeyboard.removeEventListeners();
		if (this.animationId) {
			window.cancelAnimationFrame(this.animationId);
		}
	}

	restart(): void {
		this.stop();
		this.start();
	}
}

export default Game;
