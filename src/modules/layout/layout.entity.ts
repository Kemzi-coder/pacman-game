import {Boundary} from "../boundary";
import {ILayout} from "../../common/interfaces/layout";
import {LayoutConstructor, MapProp} from "../../common/types/layout";
import pipeHorizontal from "../../assets/images/pipeHorizontal.png";
import pipeVertical from "../../assets/images/pipeVertical.png";
import pipeCorner1 from "../../assets/images/pipeCorner1.png";
import pipeCorner2 from "../../assets/images/pipeCorner2.png";
import pipeCorner3 from "../../assets/images/pipeCorner3.png";
import pipeCorner4 from "../../assets/images/pipeCorner4.png";
import block from "../../assets/images/block.png";
import capLeft from "../../assets/images/capLeft.png";
import capRight from "../../assets/images/capRight.png";
import capBottom from "../../assets/images/capBottom.png";
import capTop from "../../assets/images/capTop.png";
import pipeCross from "../../assets/images/pipeCross.png";
import pipeConnectorTop from "../../assets/images/pipeConnectorTop.png";
import pipeConnectorRight from "../../assets/images/pipeConnectorRight.png";
import pipeConnectorLeft from "../../assets/images/pipeConnectorLeft.png";
import pipeConnectorBottom from "../../assets/images/pipeConnectorBottom.png";
import {Pellet} from "../pellet";

class Layout implements ILayout {
	boundaries: Boundary[] = [];

	pellets: Pellet[] = [];

	constructor({map}: LayoutConstructor) {
		this.init(map);
	}

	private init(map: MapProp): void {
		const createImage = (src: string): HTMLImageElement => {
			const image = new Image();
			image.src = src;
			return image;
		};

		map.forEach((row, i) => {
			row.forEach((symbol, j) => {
				switch (symbol) {
					case "-":
						this.boundaries.push(
							new Boundary({
								position: {
									x: Boundary.width * j,
									y: Boundary.height * i
								},
								image: createImage(pipeHorizontal)
							})
						);
						break;
					case "|":
						this.boundaries.push(
							new Boundary({
								position: {
									x: Boundary.width * j,
									y: Boundary.height * i
								},
								image: createImage(pipeVertical)
							})
						);
						break;
					case "1":
						this.boundaries.push(
							new Boundary({
								position: {
									x: Boundary.width * j,
									y: Boundary.height * i
								},
								image: createImage(pipeCorner1)
							})
						);
						break;
					case "2":
						this.boundaries.push(
							new Boundary({
								position: {
									x: Boundary.width * j,
									y: Boundary.height * i
								},
								image: createImage(pipeCorner2)
							})
						);
						break;
					case "3":
						this.boundaries.push(
							new Boundary({
								position: {
									x: Boundary.width * j,
									y: Boundary.height * i
								},
								image: createImage(pipeCorner3)
							})
						);
						break;
					case "4":
						this.boundaries.push(
							new Boundary({
								position: {
									x: Boundary.width * j,
									y: Boundary.height * i
								},
								image: createImage(pipeCorner4)
							})
						);
						break;
					case "b":
						this.boundaries.push(
							new Boundary({
								position: {
									x: Boundary.width * j,
									y: Boundary.height * i
								},
								image: createImage(block)
							})
						);
						break;
					case "[":
						this.boundaries.push(
							new Boundary({
								position: {
									x: j * Boundary.width,
									y: i * Boundary.height
								},
								image: createImage(capLeft)
							})
						);
						break;
					case "]":
						this.boundaries.push(
							new Boundary({
								position: {
									x: j * Boundary.width,
									y: i * Boundary.height
								},
								image: createImage(capRight)
							})
						);
						break;
					case "_":
						this.boundaries.push(
							new Boundary({
								position: {
									x: j * Boundary.width,
									y: i * Boundary.height
								},
								image: createImage(capBottom)
							})
						);
						break;
					case "^":
						this.boundaries.push(
							new Boundary({
								position: {
									x: j * Boundary.width,
									y: i * Boundary.height
								},
								image: createImage(capTop)
							})
						);
						break;
					case "+":
						this.boundaries.push(
							new Boundary({
								position: {
									x: j * Boundary.width,
									y: i * Boundary.height
								},
								image: createImage(pipeCross)
							})
						);
						break;
					case "5":
						this.boundaries.push(
							new Boundary({
								position: {
									x: j * Boundary.width,
									y: i * Boundary.height
								},
								image: createImage(pipeConnectorTop)
							})
						);
						break;
					case "6":
						this.boundaries.push(
							new Boundary({
								position: {
									x: j * Boundary.width,
									y: i * Boundary.height
								},
								image: createImage(pipeConnectorRight)
							})
						);
						break;
					case "7":
						this.boundaries.push(
							new Boundary({
								position: {
									x: j * Boundary.width,
									y: i * Boundary.height
								},
								image: createImage(pipeConnectorBottom)
							})
						);
						break;
					case "8":
						this.boundaries.push(
							new Boundary({
								position: {
									x: j * Boundary.width,
									y: i * Boundary.height
								},
								image: createImage(pipeConnectorLeft)
							})
						);
						break;
					case ".":
						this.pellets.push(
							new Pellet({
								position: {
									x: j * Boundary.width + Boundary.width / 2,
									y: i * Boundary.height + Boundary.height / 2
								}
							})
						);
						break;
					default:
						break;
				}
			});
		});
	}

	removePellet(index: number) {
		this.pellets.splice(index, 1);
	}

	draw(
		ctx: CanvasRenderingContext2D,
		options: {
			onEachBoundaryDraw?: (value: Boundary, index: number) => void;
			onEachPelletDraw?: (value: Pellet, index: number) => void;
		}
	): void {
		this.boundaries.forEach((boundary, index) => {
			boundary.draw(ctx);
			options.onEachBoundaryDraw?.(boundary, index);
		});

		for (let i = this.pellets.length - 1; i > 0; i -= 1) {
			const pellet = this.pellets[i];

			pellet.draw(ctx);
			options.onEachPelletDraw?.(pellet, i);
		}
	}
}

export default Layout;
