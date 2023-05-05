import {Boundary} from "../../../boundary";
import {Ghost} from "../../../ghost";
import {Layout} from "../../../layout";
import {Pacman} from "../../../pacman";
import {
	ParamsObject,
	SettingsObject,
	IGame,
	MapVariant,
	DifficultyLevel,
	DifficultyLevelParamsObject
} from "../../types/game";
import {
	Direction,
	Position,
	getVelocityByDirection,
	isCircleCollidesWithCircle,
	isCircleCollidesWithRect
} from "../../../../common";
import GameKeyboard from "../gameKeyboard/gameKeyboard";
import {HEIGHT, WIDTH} from "../../constants/canvas";
import {defaultSettings} from "../../constants/defaultSettings";
import {DIFFICULTY_LEVEL_PARAMS} from "../../constants/difficultyLevelParams";
import {MAPS} from "../../constants/maps";
import {Pellet} from "../../../pellet";

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

		const canvasContext: CanvasRenderingContext2D = canvas.getContext("2d")!;

		this.canvas = canvas;
		this.ctx = canvasContext;

		// Set canvas dimensions
		this.canvas.width = WIDTH;
		this.canvas.height = HEIGHT;

		const completeSettings = {...defaultSettings, ...settings};
		this.settings = completeSettings;
		this.params = Game.getParamsFromSettings(completeSettings);

		this.gameKeyboard = new GameKeyboard();
	}

	private static getDifficultyParamsByLevel(level: DifficultyLevel) {
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
	}

	private static getMapByVariant(variant: MapVariant) {
		let map: string[][];

		switch (variant) {
			case "round1":
				map = MAPS.ROUND1;
				break;
			case "round2":
				map = MAPS.ROUND2;
				break;
			default:
				map = [[]];
				break;
		}

		return map;
	}

	private static getParamsFromSettings(settings: SettingsObject): ParamsObject {
		const {
			scoreStep,
			map: mapVariant,
			difficulty,
			onLose,
			onScore,
			onWin
		} = settings;

		const map = Game.getMapByVariant(mapVariant);
		const {ghostCount, ghostSpeed, pacmanSpeed} =
			Game.getDifficultyParamsByLevel(difficulty);

		const layout = new Layout({map});
		const pacman = new Pacman({
			position: {
				x: Boundary.width + Boundary.width / 2,
				y: Boundary.height + Boundary.height / 2
			},
			velocity: {x: 0, y: 0},
			speed: pacmanSpeed
		});

		const ghosts = Game.getRandomGhosts({
			boundaries: layout.boundaries,
			count: ghostCount,
			speed: ghostSpeed,
			pacmanPosition: pacman.position,
			pellets: layout.pellets
		});

		const params: ParamsObject = {
			scoreStep,
			pacman,
			layout,
			ghosts,
			onLose,
			onScore,
			onWin
		};

		return params;
	}

	// Methods for pacman and ghost
	private static getCollisionDirections({
		boundaries,
		entity
	}: {
		entity: Pacman | Ghost;
		boundaries: Boundary[];
	}) {
		const collisions: Direction[] = [];

		boundaries.forEach(boundary => {
			if (
				!collisions.includes("right") &&
				isCircleCollidesWithRect({
					circle: {...entity, velocity: {x: entity.speed, y: 0}},
					rectangle: boundary
				})
			) {
				collisions.push("right");
			}

			if (
				!collisions.includes("left") &&
				isCircleCollidesWithRect({
					circle: {...entity, velocity: {x: -entity.speed, y: 0}},
					rectangle: boundary
				})
			) {
				collisions.push("left");
			}

			if (
				!collisions.includes("top") &&
				isCircleCollidesWithRect({
					circle: {...entity, velocity: {x: 0, y: -entity.speed}},
					rectangle: boundary
				})
			) {
				collisions.push("top");
			}

			if (
				!collisions.includes("bottom") &&
				isCircleCollidesWithRect({
					circle: {...entity, velocity: {x: 0, y: entity.speed}},
					rectangle: boundary
				})
			) {
				collisions.push("bottom");
			}
		});
		return collisions;
	}

	private static getAvailableDirection({
		entity,
		boundaries
	}: {
		entity: Pacman | Ghost;
		boundaries: Boundary[];
	}) {
		const directions: Direction[] = ["right", "left", "top", "bottom"];
		const collisions = Game.getCollisionDirections({entity, boundaries});

		const pathways = directions.filter(dir => !collisions.includes(dir));

		const direction = pathways[Math.floor(Math.random() * pathways.length)];

		return direction;
	}
	//

	// Ghost methods
	private static getGhostPositions({
		pacmanPosition,
		pelletPositions
	}: {
		pelletPositions: Position[];
		pacmanPosition: Position;
	}) {
		return (
			pelletPositions
				// Remove positions, that are too close to the pacman
				.filter(position => {
					const distance = Math.sqrt(
						(pacmanPosition.x - position.x) ** 2 +
							(pacmanPosition.y - position.y) ** 2
					);

					if (distance <= Boundary.width) {
						return false;
					}

					return true;
				})
		);
	}

	private static getNextGhostDirection({
		ghost,
		boundaries
	}: {
		ghost: Ghost;
		boundaries: Boundary[];
	}) {
		let direction: Direction | null = null;

		const collisions = Game.getCollisionDirections({entity: ghost, boundaries});

		if (collisions.length > ghost.prevCollisions.length) {
			// eslint-disable-next-line no-param-reassign
			ghost.prevCollisions = collisions;
		}

		if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
			if (ghost.velocity.x > 0) {
				ghost.prevCollisions.push("right");
			} else if (ghost.velocity.x < 0) {
				ghost.prevCollisions.push("left");
			} else if (ghost.velocity.y < 0) {
				ghost.prevCollisions.push("top");
			} else if (ghost.velocity.y > 0) {
				ghost.prevCollisions.push("bottom");
			}

			const pathways = ghost.prevCollisions.filter(
				collision => !collisions.includes(collision)
			);
			direction = pathways[Math.floor(Math.random() * pathways.length)];

			// eslint-disable-next-line no-param-reassign
			ghost.prevCollisions = [];
		}

		return direction;
	}

	private static getRandomGhostsByPositions({
		positions,
		boundaries,
		speed,
		count
	}: {
		positions: Position[];
		boundaries: Boundary[];
		speed: number;
		count: number;
	}) {
		const originalColors = ["pink", "orange", "red", "purple", "green", "aqua"];
		let colors = [...originalColors];

		const getRandomColor = () => {
			if (colors.length === 0) {
				colors = [...originalColors];
			}

			const colorIndex = Math.floor(Math.random() * colors.length);
			const color = colors[colorIndex];
			colors.splice(colorIndex, 1);

			return color;
		};

		const getRandomGhost = () => {
			const position = positions[Math.floor(Math.random() * positions.length)];

			const color = getRandomColor();

			const ghost = new Ghost({
				position: {...position},
				color,
				velocity: {x: 0, y: 0},
				speed
			});

			const direction = Game.getAvailableDirection({entity: ghost, boundaries});

			const velocity = getVelocityByDirection({direction, speed: ghost.speed});
			ghost.velocity = velocity;

			return ghost;
		};

		const ghosts: Ghost[] = Array(count).fill(null).map(getRandomGhost);

		return ghosts;
	}

	private static getRandomGhosts({
		pacmanPosition,
		pellets,
		boundaries,
		count,
		speed
	}: {
		pellets: Pellet[];
		pacmanPosition: Position;
		boundaries: Boundary[];
		count: number;
		speed: number;
	}) {
		const pelletPositions = pellets.map(({position}) => ({...position}));

		const ghostPositions = Game.getGhostPositions({
			pelletPositions,
			pacmanPosition
		});

		const ghosts = Game.getRandomGhostsByPositions({
			positions: ghostPositions,
			boundaries,
			count,
			speed
		});

		return ghosts;
	}
	//

	// Score handlers
	private addScore() {
		const value = this.score + this.params.scoreStep;
		this.score = value;
		this.params.onScore?.(value);
	}

	private resetScore() {
		this.score = -this.params.scoreStep;
	}
	//

	// Win and lose handlers
	private handleWin() {
		this.params.onWin?.({score: this.score});
		this.stop();
	}

	private handleLose() {
		this.params.onLose?.({score: this.score});
		this.stop();
	}
	//

	private startAnimation() {
		const {ctx, canvas, gameKeyboard} = this;
		const {pacman, layout, ghosts} = this.params;

		const frameCb = () => this.startAnimation();

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
			const direction = Game.getNextGhostDirection({
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
	}

	set Map(value: MapVariant) {
		this.settings.map = value;
	}

	get Map() {
		return this.settings.map;
	}

	set Difficulty(value: DifficultyLevel) {
		this.settings.difficulty = value;
	}

	get Difficulty() {
		return this.settings.difficulty;
	}

	set ScoreStep(value: number) {
		this.settings.scoreStep = value;
	}

	get ScoreStep() {
		return this.settings.scoreStep;
	}

	start(): void {
		this.params = Game.getParamsFromSettings(this.settings);

		// Reset score
		this.resetScore();

		this.gameKeyboard.addEventListeners();
		this.startAnimation();
	}

	stop(): void {
		this.gameKeyboard.removeEventListeners();
		this.gameKeyboard.reset();
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
