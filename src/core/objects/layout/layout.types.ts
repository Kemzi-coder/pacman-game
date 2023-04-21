interface LayoutObject {
	layout: string[][];
	draw: (ctx: CanvasRenderingContext2D) => void;
}

export type {LayoutObject};
