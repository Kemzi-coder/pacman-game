/* eslint-disable no-param-reassign */
import type {IPacmanMovement} from "../../common/interfaces/pacman";
import {MoveKey, MoveKeyObject} from "../../common/types/pacman";
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
		pacman: Pacman,
		layout: Layout,
		canvasDims: {width: number; height: number}
	): void {
		const frameCb = () => {
			window.requestAnimationFrame(frameCb);

			ctx.clearRect(0, 0, canvasDims.width, canvasDims.height);
			layout.draw(ctx);
			pacman.update(ctx);

			pacman.velocity = {x: 0, y: 0};

			if (this.keys.ArrowUp.isPressed && this.lastKey === "ArrowUp") {
				pacman.velocity.y = -5;
			} else if (
				this.keys.ArrowDown.isPressed &&
				this.lastKey === "ArrowDown"
			) {
				pacman.velocity.y = 5;
			} else if (
				this.keys.ArrowLeft.isPressed &&
				this.lastKey === "ArrowLeft"
			) {
				pacman.velocity.x = -5;
			} else if (
				this.keys.ArrowRight.isPressed &&
				this.lastKey === "ArrowRight"
			) {
				pacman.velocity.x = 5;
			}
		};
		frameCb();
	}

	initMovement(
		ctx: CanvasRenderingContext2D,
		pacman: Pacman,
		layout: Layout,
		canvasDims: {width: number; height: number}
	): void {
		this.initKeyboardListeners();
		this.startAnimation(ctx, pacman, layout, canvasDims);
	}
}

export default PacmanMovement;
