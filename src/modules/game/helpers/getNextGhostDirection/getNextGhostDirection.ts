import {Direction} from "../../../../common";
import type {Boundary} from "../../../boundary";
import type {Ghost} from "../../../ghost";
import getCollisions from "../getCollisions/getCollisions";

const getNextGhostDirection = ({
	ghost,
	boundaries
}: {
	ghost: Ghost;
	boundaries: Boundary[];
}): Direction | null => {
	let direction: Direction | null = null;

	const collisions = getCollisions({ghost, boundaries});

	if (collisions.length > ghost.prevCollisions.length) {
		// eslint-disable-next-line no-param-reassign
		ghost.prevCollisions = collisions;
	}

	if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
		if (ghost.velocity.x > 0) {
			ghost.prevCollisions.push("right");
		} else if (ghost.velocity.x < 0) {
			ghost.prevCollisions.push("left");
		} else if (ghost.velocity.y < 0) {
			ghost.prevCollisions.push("top");
		} else if (ghost.velocity.y > 0) {
			ghost.prevCollisions.push("bottom");
		}

		const pathways = ghost.prevCollisions.filter(
			collision => !collisions.includes(collision)
		);
		direction = pathways[Math.floor(Math.random() * pathways.length)];

		// eslint-disable-next-line no-param-reassign
		ghost.prevCollisions = [];
	}

	return direction;
};

export default getNextGhostDirection;
