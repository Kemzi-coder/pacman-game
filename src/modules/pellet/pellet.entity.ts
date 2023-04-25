import {IPellet} from "../../common/interfaces/pellet";
import {PelletConstructor} from "../../common/types/pellet";

class Pellet implements IPellet {
	position;

	radius;

	constructor({position}: PelletConstructor) {
		this.radius = 3;
		this.position = position;
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();

		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

		ctx.fillStyle = "white";
		ctx.fill();

		ctx.closePath();
	}
}

export default Pellet;
