import {Position} from "../../../common";

interface IPellet {
	radius: number;
	position: Position;
	draw: (ctx: CanvasRenderingContext2D) => void;
}

type PelletConstructor = {
	position: Position;
	radius?: number;
};

export type {IPellet, PelletConstructor};
