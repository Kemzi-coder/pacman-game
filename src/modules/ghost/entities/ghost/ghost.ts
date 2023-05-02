import {Direction, Position, Velocity} from "../../../../common";
import {GhostConstructor, IGhost} from "../../types/ghost";

class Ghost implements IGhost {
	radius: number;

	position: Position;

	velocity: Velocity;

	color: string;

	speed: number;

	isScared: boolean = false;

	prevCollisions: Direction[] = [];

	constructor({position, velocity, color, speed}: GhostConstructor) {
		this.position = position;
		this.velocity = velocity;
		this.color = color || "red";
		this.radius = 15;
		this.speed = speed;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();

		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

		ctx.fillStyle = this.isScared ? "blue" : this.color;
		ctx.fill();

		ctx.closePath();
	}

	update(ctx: CanvasRenderingContext2D): void {
		this.draw(ctx);
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

export default Ghost;
