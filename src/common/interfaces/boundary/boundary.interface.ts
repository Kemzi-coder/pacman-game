import {PositionProp} from "../../types/boundary";

interface IBoundary {
	position: PositionProp;
	draw: (ctx: CanvasRenderingContext2D) => void;
}

export type {IBoundary};
