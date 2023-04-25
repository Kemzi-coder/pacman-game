import {PositionProp, VelocityProp} from "../../types/pacman";

interface IPacman {
	position: PositionProp;
	velocity: VelocityProp;
	radius: number;
	draw: (ctx: CanvasRenderingContext2D) => void;
	update: (ctx: CanvasRenderingContext2D) => void;
}

export type {IPacman};
