import {IBoundary} from "../../common/interfaces/boundary";
import {BoundaryConstructor} from "../../common/types/boundary";

class Boundary implements IBoundary {
	static width = 40;

	static height = 40;

	width;

	height;

	position;

	image;

	constructor({position, image}: BoundaryConstructor) {
		this.position = position;
		this.width = Boundary.width;
		this.height = Boundary.height;
		this.image = image;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.drawImage(this.image, this.position.x, this.position.y);
	}
}

export default Boundary;
