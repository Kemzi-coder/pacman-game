import {Direction} from "../../../../common";
import type {Boundary} from "../../../boundary";
import type {Ghost} from "../../../ghost";
import getCollisions from "../getCollisions/getCollisions";

const getInitialGhostDirection = ({
	ghost,
	boundaries
}: {
	ghost: Ghost;
	boundaries: Boundary[];
}): Direction => {
	const directions: Direction[] = ["right", "left", "top", "bottom"];
	const collisions = getCollisions({ghost, boundaries});

	const pathways = directions.filter(dir => !collisions.includes(dir));

	const direction = pathways[Math.floor(Math.random() * pathways.length)];

	return direction;
};

export default getInitialGhostDirection;
