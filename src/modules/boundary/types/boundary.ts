import {Position} from "../../../common";

interface IBoundary {
	position: Position;
	width: number;
	height: number;
	draw: (ctx: CanvasRenderingContext2D) => void;
}

type BoundaryConstructor = {
	position: Position;
	image: CanvasImageSource;
};

export type {IBoundary, BoundaryConstructor};
