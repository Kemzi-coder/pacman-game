import type {Boundary} from "../../boundary";
import type {Pellet} from "../../pellet";

interface ILayout {
	boundaries: Boundary[];
	pellets: Pellet[];
	powerUps: Pellet[];
	draw: (
		ctx: CanvasRenderingContext2D,
		options: {
			onEachBoundaryDraw?: (value: Boundary, index: number) => void;
			onEachPelletDraw?: (value: Pellet, index: number) => void;
			onEachPowerUpDraw?: (value: Pellet, index: number) => void;
		}
	) => void;
}

type MapProp = string[][];

type LayoutConstructor = {map: MapProp};

export type {MapProp, LayoutConstructor, ILayout};
