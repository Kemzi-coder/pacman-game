import {Position, Velocity} from "../../../common";

interface IGhost {
	position: Position;
	velocity: Velocity;
	color?: string;
	radius: number;
	speed: number;
	draw: (ctx: CanvasRenderingContext2D) => void;
}

type GhostConstructor = {
	position: Position;
	velocity: Velocity;
	color?: string;
	speed: number;
};

export type {IGhost, GhostConstructor};
