import {PositionProp} from "../../types/boundary";

interface IBoundary {
	position: PositionProp;
	width: number;
	height: number;
	image: CanvasImageSource;
	draw: (ctx: CanvasRenderingContext2D) => void;
}

export type {IBoundary};
