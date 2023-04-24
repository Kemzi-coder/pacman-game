import type {Layout} from "../../../modules/layout";
import type {Pacman} from "../../../modules/pacman";

interface IPacmanMovement {
	pacman: Pacman;
	initMovement: (
		ctx: CanvasRenderingContext2D,
		layout: Layout,
		canvasDims: {width: number; height: number}
	) => void;
}

export type {IPacmanMovement};
