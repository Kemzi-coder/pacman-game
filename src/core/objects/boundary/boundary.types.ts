interface BoundaryObject {
	position: {
		x: number;
		y: number;
	};
	draw: (ctx: CanvasRenderingContext2D) => void;
}

export type {BoundaryObject};
