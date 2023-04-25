import {IPacman} from "../../common/interfaces/pacman";
import {PacmanConstructor} from "../../common/types/pacman";

class Pacman implements IPacman {
	radius;

	position;

	velocity;

	constructor({position, velocity}: PacmanConstructor) {
		this.position = position;
		this.velocity = velocity;
		this.radius = 15;
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
}

export default Pacman;
