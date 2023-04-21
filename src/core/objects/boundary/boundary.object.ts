import {BoundaryObject} from "./boundary.types";

class Boundary implements BoundaryObject {
	static width = 40;

	static height = 40;

	position;

	constructor({position}: Pick<BoundaryObject, "position">) {
		this.position = position;
	}

	draw(ctx: CanvasRenderingContext2D) {
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
