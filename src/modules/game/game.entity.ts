import {IGame} from "../../common/interfaces/game";
import {SettingsObject, ParametersObject} from "../../common/types/game";
import {isCircleCollidesWithRect} from "../../common/utils";
import {Boundary} from "../boundary";
import {Layout} from "../layout";
import {Pacman} from "../pacman";
import GameKeyboard from "./gameKeyboard.entity";

/* eslint-disable no-param-reassign */
class Game implements IGame {
	private canvas!: HTMLCanvasElement;

	private ctx!: CanvasRenderingContext2D;

	private gameKeyboard!: GameKeyboard;

	private animationId: number | null = null;

	private parameters!: ParametersObject;

	settings!: SettingsObject;

	score: number = 0;

	constructor(canvasSelector: string, settings?: SettingsObject) {
		this.init(canvasSelector, settings);
	}

	private init(canvasSelector: string, settings?: SettingsObject) {
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
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		// Set configuration
		this.setConfiguration(settings);

		this.gameKeyboard = new GameKeyboard();
	}

	private setConfiguration(settings?: SettingsObject) {
		this.settings = {
			difficulty: settings?.difficulty || "easy"
		};

		switch (this.settings.difficulty) {
			case "hard":
				this.parameters = {velocity: 10};
				break;
			case "medium":
				this.parameters = {velocity: 5};
				break;
			case "easy":
				this.parameters = {velocity: 3};
				break;
			default:
				break;
		}
	}

	private startAnimation(layout: Layout, pacman: Pacman) {
		const {ctx, canvas, gameKeyboard, parameters} = this;

		const frameCb = () => {
			this.animationId = window.requestAnimationFrame(frameCb);
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (
				gameKeyboard.keys.ArrowUp.isPressed &&
				gameKeyboard.lastKey === "ArrowUp"
			) {
				for (let i = 0; i < layout.boundaries.length; i += 1) {
					const boundary = layout.boundaries[i];

					if (
						isCircleCollidesWithRect(
							{...pacman, velocity: {x: 0, y: -parameters.velocity}},
							boundary
						)
					) {
						pacman.velocity.y = 0;
						break;
					} else {
						pacman.velocity.y = -parameters.velocity;
					}
				}
			} else if (
				gameKeyboard.keys.ArrowDown.isPressed &&
				gameKeyboard.lastKey === "ArrowDown"
			) {
				for (let i = 0; i < layout.boundaries.length; i += 1) {
					const boundary = layout.boundaries[i];

					if (
						isCircleCollidesWithRect(
							{...pacman, velocity: {x: 0, y: parameters.velocity}},
							boundary
						)
					) {
						pacman.velocity.y = 0;
						break;
					} else {
						pacman.velocity.y = parameters.velocity;
					}
				}
			} else if (
				gameKeyboard.keys.ArrowLeft.isPressed &&
				gameKeyboard.lastKey === "ArrowLeft"
			) {
				for (let i = 0; i < layout.boundaries.length; i += 1) {
					const boundary = layout.boundaries[i];

					if (
						isCircleCollidesWithRect(
							{...pacman, velocity: {x: -parameters.velocity, y: 0}},
							boundary
						)
					) {
						pacman.velocity.x = 0;
						break;
					} else {
						pacman.velocity.x = -parameters.velocity;
					}
				}
			} else if (
				gameKeyboard.keys.ArrowRight.isPressed &&
				gameKeyboard.lastKey === "ArrowRight"
			) {
				for (let i = 0; i < layout.boundaries.length; i += 1) {
					const boundary = layout.boundaries[i];

					if (
						isCircleCollidesWithRect(
							{...pacman, velocity: {x: parameters.velocity, y: 0}},
							boundary
						)
					) {
						pacman.velocity.x = 0;
						break;
					} else {
						pacman.velocity.x = parameters.velocity;
					}
				}
			}

			layout.draw(ctx, {
				onEachBoundaryDraw: boundary => {
					// Check if pacman collides with boundaries
					// If true, stop the pacman
					if (isCircleCollidesWithRect(pacman, boundary)) {
						pacman.velocity = {x: 0, y: 0};
					}
				},
				onEachPelletDraw: (pellet, index) => {
					// Check if pacman collides with pellet
					// If true, remove the pellet and increment game score
					if (
						Math.hypot(
							pellet.position.x - pacman.position.x,
							pellet.position.y - pacman.position.y
						) <
						pellet.radius + pacman.radius
					) {
						layout.removePellet(index);
						this.score += 1;
					}
				}
			});
			pacman.update(ctx);
		};
		frameCb();
	}

	start(): void {
		const layout = new Layout({
			map: [
				["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
				["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
				["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
				["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
				["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
				["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
				["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
				["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
				["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
				["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
				["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
				["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
				["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"]
			]
		});

		const pacman = new Pacman({
			position: {
				x: Boundary.width + Boundary.width / 2,
				y: Boundary.height + Boundary.height / 2
			},
			velocity: {x: 0, y: 0}
		});

		this.gameKeyboard.addEventListeners();
		this.startAnimation(layout, pacman);
	}

	stop(): void {
		this.gameKeyboard.removeEventListeners();
		if (this.animationId) {
			window.cancelAnimationFrame(this.animationId);
		}

		// Reset score
		this.score = 0;
	}
}

export default Game;
