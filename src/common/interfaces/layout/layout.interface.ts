import type {Boundary} from "../../../modules/boundary";
import type {Pellet} from "../../../modules/pellet";

interface ILayout {
	boundaries: Boundary[];
	pellets: Pellet[];
	draw: (
		ctx: CanvasRenderingContext2D,
		options: {
			onEachBoundaryDraw?: (value: Boundary, index: number) => void;
			onEachPelletDraw?: (value: Pellet, index: number) => void;
		}
	) => void;
}

export type {ILayout};
