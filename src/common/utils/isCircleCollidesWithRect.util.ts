import {Circle, Rectangle} from "../types/utils/isCircleCollidesWithRect";

const isCircleCollidesWithRect = (
	circle: Circle,
	rectangle: Rectangle
): boolean =>
	circle.position.y - circle.radius + circle.velocity.y <=
		rectangle.position.y + rectangle.height &&
	circle.position.x + circle.radius + circle.velocity.x >=
		rectangle.position.x &&
	circle.position.y + circle.radius + circle.velocity.y >=
		rectangle.position.y &&
	circle.position.x - circle.radius + circle.velocity.x <=
		rectangle.position.x + rectangle.width;

export default isCircleCollidesWithRect;
