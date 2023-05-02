import {Position, Velocity} from "../../../../common";
import {PacmanConstructor, IPacman} from "../../types/pacman";

class Pacman implements IPacman {
	radius: number;

	position: Position;

	velocity: Velocity;

	speed: number;

	rotation: number;

	private radians: number = 0.75;

	private openRate: number = 0.12;

	constructor({position, velocity, speed}: PacmanConstructor) {
		this.position = position;
		this.velocity = velocity;
		this.speed = speed;
		this.radius = 15;
		this.rotation = 0;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.save();

		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(this.rotation);
		ctx.translate(-this.position.x, -this.position.y);

		ctx.beginPath();

		ctx.arc(
			this.position.x,
			this.position.y,
			this.radius,
			this.radians,
			2 * Math.PI - this.radians
		);
		ctx.lineTo(this.position.x, this.position.y);

		ctx.fillStyle = "yellow";
		ctx.fill();

		ctx.closePath();

		ctx.restore();
	}

	update(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx);
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.radians < 0 || this.radians > 0.75) {
			this.openRate = -this.openRate;
		}

		this.radians += this.openRate;
	}
}

export default Pacman;
