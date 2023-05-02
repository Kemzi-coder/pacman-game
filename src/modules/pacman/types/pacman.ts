import {Position, Velocity} from "../../../common";

interface IPacman {
	position: Position;
	velocity: Velocity;
	radius: number;
	speed: number;
	rotation: number;
	draw: (ctx: CanvasRenderingContext2D) => void;
	update: (ctx: CanvasRenderingContext2D) => void;
}

type PacmanConstructor = {
	position: Position;
	velocity: Velocity;
	speed: number;
};

export type {PacmanConstructor, IPacman};
