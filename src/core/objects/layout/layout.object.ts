import {Boundary} from "../boundary";
import {LayoutObject} from "./layout.types";

class Layout implements LayoutObject {
	layout;

	constructor({layout}: Pick<LayoutObject, "layout">) {
		this.layout = layout;
	}

	draw(ctx: CanvasRenderingContext2D) {
		const boundaries: Boundary[] = [];

		this.layout.forEach((row, i) => {
			row.forEach((symbol, j) => {
				switch (symbol) {
					case "-":
						boundaries.push(
							new Boundary({
								position: {
									x: Boundary.width * j,
									y: Boundary.height * i
								}
							})
						);
						break;
					default:
						break;
				}
			});
		});

		boundaries.forEach(boundary => boundary.draw(ctx));
	}
}

export default Layout;
