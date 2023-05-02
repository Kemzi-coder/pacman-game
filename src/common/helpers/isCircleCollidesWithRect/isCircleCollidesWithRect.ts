import {Circle, Rectangle, Velocity} from "../../types/common";

const isCircleCollidesWithRect = ({
	circle,
	rectangle
}: {
	circle: Circle & {velocity: Velocity};
	rectangle: Rectangle;
}): boolean => {
	const padding = rectangle.width / 2 - circle.radius - 1;
	return (
		circle.position.y - circle.radius + circle.velocity.y <=
			rectangle.position.y + rectangle.height + padding &&
		circle.position.x + circle.radius + circle.velocity.x >=
			rectangle.position.x - padding &&
		circle.position.y + circle.radius + circle.velocity.y >=
			rectangle.position.y - padding &&
		circle.position.x - circle.radius + circle.velocity.x <=
			rectangle.position.x + rectangle.width + padding
	);
};

export default isCircleCollidesWithRect;
