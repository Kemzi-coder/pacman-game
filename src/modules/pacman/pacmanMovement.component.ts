/* eslint-disable no-param-reassign */
import type {IPacmanMovement} from "../../common/interfaces/pacman";
import {MoveKey, MoveKeyObject} from "../../common/types/pacman";
import {isCircleCollidesWithRect} from "../../common/utils";
import type {Layout} from "../layout";
import type Pacman from "./pacman.entity";

class PacmanMovement implements IPacmanMovement {
	private keys: {[key in MoveKey]: MoveKeyObject} = {
		ArrowUp: {isPressed: false},
		ArrowDown: {isPressed: false},
		ArrowLeft: {isPressed: false},
		ArrowRight: {isPressed: false}
	};

	private lastKey: MoveKey | null = null;

	pacman;

	constructor(pacman: Pacman) {
		this.pacman = pacman;
	}

	private static isMoveKey(key: string): key is MoveKey {
		return (
			key === "ArrowDown" ||
			key === "ArrowUp" ||
			key === "ArrowLeft" ||
			key === "ArrowRight"
		);
	}

	private initKeyboardListeners(): void {
		window.addEventListener("keydown", ({key}) => {
			if (PacmanMovement.isMoveKey(key)) {
				this.keys[key].isPressed = true;
				this.lastKey = key;
			}
		});

		window.addEventListener("keyup", ({key}) => {
			if (PacmanMovement.isMoveKey(key)) {
				this.keys[key].isPressed = false;
			}
		});
	}

	private startAnimation(
		ctx: CanvasRenderingContext2D,
		layout: Layout,
		canvasDims: {width: number; height: number}
	): void {
		const frameCb = () => {
			window.requestAnimationFrame(frameCb);
			ctx.clearRect(0, 0, canvasDims.width, canvasDims.height);

			const {boundaries} = layout.toObject();

			if (this.keys.ArrowUp.isPressed && this.lastKey === "ArrowUp") {
				for (let i = 0; i < boundaries.length; i += 1) {
					const boundary = boundaries[i];

					if (
						isCircleCollidesWithRect(
							{...this.pacman, velocity: {x: 0, y: -5}},
							boundary
						)
					) {
						this.pacman.velocity.y = 0;
						break;
					} else {
						this.pacman.velocity.y = -5;
					}
				}
			} else if (
				this.keys.ArrowDown.isPressed &&
				this.lastKey === "ArrowDown"
			) {
				for (let i = 0; i < boundaries.length; i += 1) {
					const boundary = boundaries[i];

					if (
						isCircleCollidesWithRect(
							{...this.pacman, velocity: {x: 0, y: 5}},
							boundary
						)
					) {
						this.pacman.velocity.y = 0;
						break;
					} else {
						this.pacman.velocity.y = 5;
					}
				}
			} else if (
				this.keys.ArrowLeft.isPressed &&
				this.lastKey === "ArrowLeft"
			) {
				for (let i = 0; i < boundaries.length; i += 1) {
					const boundary = boundaries[i];

					if (
						isCircleCollidesWithRect(
							{...this.pacman, velocity: {x: -5, y: 0}},
							boundary
						)
					) {
						this.pacman.velocity.x = 0;
						break;
					} else {
						this.pacman.velocity.x = -5;
					}
				}
			} else if (
				this.keys.ArrowRight.isPressed &&
				this.lastKey === "ArrowRight"
			) {
				for (let i = 0; i < boundaries.length; i += 1) {
					const boundary = boundaries[i];

					if (
						isCircleCollidesWithRect(
							{...this.pacman, velocity: {x: 5, y: 0}},
							boundary
						)
					) {
						this.pacman.velocity.x = 0;
						break;
					} else {
						this.pacman.velocity.x = 5;
					}
				}
			}

			boundaries.forEach(boundary => {
				// Check if pacman collides with boundaries
				// If true, stop the pacman
				if (isCircleCollidesWithRect(this.pacman, boundary)) {
					this.pacman.velocity = {x: 0, y: 0};
				}
			});

			layout.draw(ctx);
			this.pacman.update(ctx);
		};
		frameCb();
	}

	initMovement(
		ctx: CanvasRenderingContext2D,
		layout: Layout,
		canvasDims: {width: number; height: number}
	): void {
		this.initKeyboardListeners();
		this.startAnimation(ctx, layout, canvasDims);
	}
}

export default PacmanMovement;
