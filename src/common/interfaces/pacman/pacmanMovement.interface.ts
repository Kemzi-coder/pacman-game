import type {Layout} from "../../../modules/layout";
import type {Pacman} from "../../../modules/pacman";

interface IPacmanMovement {
	initMovement: (
		ctx: CanvasRenderingContext2D,
		pacman: Pacman,
		layout: Layout,
		canvasDims: {width: number; height: number}
	) => void;
}

export type {IPacmanMovement};
