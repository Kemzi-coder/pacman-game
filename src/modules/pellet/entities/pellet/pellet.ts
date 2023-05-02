import {Position} from "../../../../common";
import {PelletConstructor, IPellet} from "../../types/pellet";

class Pellet implements IPellet {
	position: Position;

	radius: number;

	constructor({position, radius}: PelletConstructor) {
		this.radius = radius || 3;
		this.position = position;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();

		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

		ctx.fillStyle = "white";
		ctx.fill();

		ctx.closePath();
	}
}

export default Pellet;
