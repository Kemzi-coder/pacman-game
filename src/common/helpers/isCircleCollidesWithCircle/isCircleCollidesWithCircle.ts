import {Circle} from "../../types/common";

const isCircleCollidesWithCircle = ({
	circle1,
	circle2
}: {
	circle1: Circle;
	circle2: Circle;
}) =>
	Math.hypot(
		circle1.position.x - circle2.position.x,
		circle1.position.y - circle2.position.y
	) <
	circle1.radius + circle2.radius;

export default isCircleCollidesWithCircle;
