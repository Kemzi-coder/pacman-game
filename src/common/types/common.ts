type Direction = "left" | "right" | "bottom" | "top";

type Position = {
	x: number;
	y: number;
};

type Velocity = {
	x: number;
	y: number;
};

type Circle = {
	position: Position;
	radius: number;
};

type Rectangle = {
	width: number;
	height: number;
	position: Position;
};

export type {Direction, Position, Velocity, Circle, Rectangle};
