import {Position} from "../../../../common";
import {BoundaryConstructor, IBoundary} from "../../types/boundary";

class Boundary implements IBoundary {
	static width: number = 40;

	static height: number = 40;

	width: number;

	height: number;

	position: Position;

	private image: CanvasImageSource;

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
