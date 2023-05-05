import {describe, it, expect, vi, beforeEach} from "vitest";
import Boundary from "./boundary";

describe("Boundary class", () => {
	const mockCtx = {drawImage: vi.fn()};
	const mockImage = {};
	let boundary;

	beforeEach(() => {
		boundary = new Boundary({position: {x: 10, y: 20}, image: mockImage});
	});

	describe("constructor", () => {
		it("should set the position, width, height, and image properties correctly", () => {
			const position = {x: 10, y: 20};
			const newBoundary = new Boundary({position, image: mockImage});
			expect(newBoundary.position).toEqual(position);
			expect(newBoundary.width).toEqual(40);
			expect(newBoundary.height).toEqual(40);
			expect(newBoundary.image).toEqual(mockImage);
		});
	});

	describe("draw method", () => {
		it("should call ctx.drawImage with the correct arguments", () => {
			const position = {x: 10, y: 20};
			boundary.draw(mockCtx);
			expect(mockCtx.drawImage).toHaveBeenCalledTimes(1);
			expect(mockCtx.drawImage).toHaveBeenCalledWith(
				mockImage,
				position.x,
				position.y
			);
		});
	});
});
