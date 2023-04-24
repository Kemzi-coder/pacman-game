import {IPacman} from "../../common/interfaces/pacman";
import {MovementProp, PacmanConstructor} from "../../common/types/pacman";
import type {Layout} from "../layout";
import PacmanMovement from "./pacmanMovement.component";

class Pacman implements IPacman {
	private movement: MovementProp;

	radius;

	position;

	velocity;

	constructor({position, velocity}: PacmanConstructor) {
		this.position = position;
		this.velocity = velocity;
		this.radius = 15;
		this.movement = new PacmanMovement();
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();

		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

		ctx.fillStyle = "yellow";
		ctx.fill();

		ctx.closePath();
	}

	update(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx);
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}

	initMovement(
		ctx: CanvasRenderingContext2D,
		layout: Layout,
		canvasDims: {width: number; height: number}
	): void {
		this.movement.initMovement(ctx, this, layout, canvasDims);
	}
}

export default Pacman;
