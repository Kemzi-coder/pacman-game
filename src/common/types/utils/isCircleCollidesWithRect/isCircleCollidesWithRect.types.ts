type Circle = {
	position: {x: number; y: number};
	velocity: {x: number; y: number};
	radius: number;
};

type Rectangle = {
	width: number;
	height: number;
	position: {x: number; y: number};
};

export type {Circle, Rectangle};
