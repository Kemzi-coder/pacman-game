import type {Layout} from "../../../modules/layout";
import {PositionProp, VelocityProp} from "../../types/pacman";

interface IPacman {
	position: PositionProp;
	velocity: VelocityProp;
	radius: number;
	draw: (ctx: CanvasRenderingContext2D) => void;
	update: (ctx: CanvasRenderingContext2D) => void;
	initMovement: (
		ctx: CanvasRenderingContext2D,
		layout: Layout,
		canvasDims: {width: number; height: number}
	) => void;
}

export type {IPacman};
