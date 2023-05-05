import {describe, it, expect, vi, beforeEach} from "vitest";
import Ghost from "./ghost";

describe("Ghost class", () => {
	const mockCtx = {
		beginPath: vi.fn(),
		arc: vi.fn(),
		fillStyle: "",
		fill: vi.fn(),
		closePath: vi.fn()
	};
	let ghost;

	beforeEach(() => {
		vi.restoreAllMocks();
		ghost = new Ghost({
			position: {x: 10, y: 20},
			velocity: {x: 2, y: 0},
			color: "pink",
			speed: 1.5
		});
	});

	describe("constructor", () => {
		it("should set the position, velocity, color, radius, and speed properties correctly", () => {
			const position = {x: 10, y: 20};
			const velocity = {x: 2, y: 0};
			const color = "pink";
			const speed = 1.5;
			const newGhost = new Ghost({position, velocity, color, speed});
			expect(newGhost.position).toEqual(position);
			expect(newGhost.velocity).toEqual(velocity);
			expect(newGhost.color).toEqual(color);
			expect(newGhost.radius).toEqual(15);
			expect(newGhost.speed).toEqual(speed);
			expect(newGhost.isScared).toEqual(false);
			expect(newGhost.prevCollisions).toEqual([]);
		});
	});

	describe("draw method", () => {
		it("should call the CanvasRenderingContext2D methods with the correct arguments", () => {
			ghost.draw(mockCtx);
			expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
			expect(mockCtx.arc).toHaveBeenCalledTimes(1);
			expect(mockCtx.arc).toHaveBeenCalledWith(
				ghost.position.x,
				ghost.position.y,
				ghost.radius,
				0,
				2 * Math.PI
			);
			expect(mockCtx.fillStyle).toEqual(ghost.color);
			expect(mockCtx.fill).toHaveBeenCalledTimes(1);
			expect(mockCtx.closePath).toHaveBeenCalledTimes(1);
		});

		it('should set the fillStyle to "blue" if the ghost is scared', () => {
			ghost.isScared = true;
			ghost.draw(mockCtx);
			expect(mockCtx.fillStyle).toEqual("blue");
		});
	});

	describe("update method", () => {
		it("should call the draw method and update the position correctly", () => {
			ghost.update(mockCtx);
			expect(ghost.position.x).toEqual(12);
			expect(ghost.position.y).toEqual(20);
			expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
			expect(mockCtx.arc).toHaveBeenCalledTimes(1);
			expect(mockCtx.fillStyle).toEqual(ghost.color);
			expect(mockCtx.fill).toHaveBeenCalledTimes(1);
			expect(mockCtx.closePath).toHaveBeenCalledTimes(1);
		});
	});
});
