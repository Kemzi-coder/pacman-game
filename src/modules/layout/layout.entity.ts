import {Boundary} from "../boundary";
import {ILayout} from "../../common/interfaces/layout";
import {
	LayoutConstructor,
	LayoutObject,
	LayoutProp
} from "../../common/types/layout";

class Layout implements ILayout {
	private layout: LayoutProp;

	constructor({layout}: LayoutConstructor) {
		this.layout = layout;
	}

	toObject(): LayoutObject {
		const layout: LayoutObject = {boundaries: []};

		this.layout.forEach((row, i) => {
			row.forEach((symbol, j) => {
				switch (symbol) {
					case "-":
						layout.boundaries.push(
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

		return layout;
	}

	draw(ctx: CanvasRenderingContext2D): void {
		const {boundaries} = this.toObject();

		boundaries.forEach(boundary => {
			boundary.draw(ctx);
		});
	}
}

export default Layout;
