import {Direction, Velocity} from "../../types/common";

const getVelocityByDirection = ({
	direction,
	speed
}: {
	direction: Direction;
	speed: number;
}) => {
	let velocity: Velocity = {x: 0, y: 0};

	switch (direction) {
		case "left":
			velocity = {x: -speed, y: 0};
			break;
		case "right":
			velocity = {x: speed, y: 0};
			break;
		case "top":
			velocity = {y: -speed, x: 0};
			break;
		case "bottom":
			velocity = {y: speed, x: 0};
			break;
		default:
			break;
	}

	return velocity;
};

export default getVelocityByDirection;
