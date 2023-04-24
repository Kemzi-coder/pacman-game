import {IBoundary} from "../../common/interfaces/boundary";
import {BoundaryConstructor} from "../../common/types/boundary";

class Boundary implements IBoundary {
	static width = 40;

	static height = 40;

	width;

	height;

	position;

	constructor({position}: BoundaryConstructor) {
		this.position = position;
		this.width = Boundary.width;
		this.height = Boundary.height;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.fillStyle = "blue";
		ctx.fillRect(
			this.position.x,
			this.position.y,
			Boundary.width,
			Boundary.height
		);
	}
}

export default Boundary;
