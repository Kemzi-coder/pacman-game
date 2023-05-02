import {Position, getVelocityByDirection} from "../../../../common";
import type {Boundary} from "../../../boundary";
import {Ghost} from "../../../ghost";
import getInitialGhostDirection from "../getInitialGhostDirection/getInitialGhostDirection";

const getRandomGhosts = ({
	positions,
	boundaries,
	ghostCount,
	ghostSpeed
}: {
	positions: Position[];
	boundaries: Boundary[];
	ghostCount: number;
	ghostSpeed: number;
}): Ghost[] => {
	const originalColors = ["pink", "orange", "red", "purple", "green", "aqua"];
	let colors = [...originalColors];

	const getRandomColor = () => {
		if (colors.length === 0) {
			colors = [...originalColors];
		}

		const colorIndex = Math.floor(Math.random() * colors.length);
		const color = colors[colorIndex];
		colors.splice(colorIndex, 1);

		return color;
	};

	const getRandomGhost = () => {
		const position = positions[Math.floor(Math.random() * positions.length)];

		const color = getRandomColor();

		const ghost = new Ghost({
			position: {...position},
			color,
			velocity: {x: 0, y: 0},
			speed: ghostSpeed
		});

		const direction = getInitialGhostDirection({ghost, boundaries});

		const velocity = getVelocityByDirection({direction, speed: ghost.speed});
		ghost.velocity = velocity;

		return ghost;
	};

	const ghosts: Ghost[] = Array(ghostCount).fill(null).map(getRandomGhost);

	return ghosts;
};

export default getRandomGhosts;
