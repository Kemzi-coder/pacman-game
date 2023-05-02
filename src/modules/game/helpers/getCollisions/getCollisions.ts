import {Direction, isCircleCollidesWithRect} from "../../../../common";
import type {Boundary} from "../../../boundary";
import type {Ghost} from "../../../ghost";

const getCollisions = ({
	ghost,
	boundaries
}: {
	ghost: Ghost;
	boundaries: Boundary[];
}) => {
	const collisions: Direction[] = [];
	boundaries.forEach(boundary => {
		if (
			!collisions.includes("right") &&
			isCircleCollidesWithRect({
				circle: {...ghost, velocity: {x: ghost.speed, y: 0}},
				rectangle: boundary
			})
		) {
			collisions.push("right");
		}

		if (
			!collisions.includes("left") &&
			isCircleCollidesWithRect({
				circle: {...ghost, velocity: {x: -ghost.speed, y: 0}},
				rectangle: boundary
			})
		) {
			collisions.push("left");
		}

		if (
			!collisions.includes("top") &&
			isCircleCollidesWithRect({
				circle: {...ghost, velocity: {x: 0, y: -ghost.speed}},
				rectangle: boundary
			})
		) {
			collisions.push("top");
		}

		if (
			!collisions.includes("bottom") &&
			isCircleCollidesWithRect({
				circle: {...ghost, velocity: {x: 0, y: ghost.speed}},
				rectangle: boundary
			})
		) {
			collisions.push("bottom");
		}
	});
	return collisions;
};

export default getCollisions;
