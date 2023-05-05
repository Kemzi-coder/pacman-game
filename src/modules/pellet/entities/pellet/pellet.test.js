import {describe, it, expect, vi, beforeAll} from "vitest";
import Pellet from "./pellet";

describe("Pellet class", () => {
	const mockCtx = {
		beginPath: vi.fn(),
		arc: vi.fn(),
		fill: vi.fn(),
		closePath: vi.fn()
	};
	let pellet;

	beforeAll(() => {
		vi.restoreAllMocks();
		pellet = new Pellet({position: {x: 50, y: 50}});
	});

	describe("constructor", () => {
		it("should set the radius and position properties correctly", () => {
			const position = {x: 50, y: 50};
			const newPellet = new Pellet({position});
			expect(newPellet.radius).toBe(3);
			expect(newPellet.position).toEqual(position);
		});
	});

	describe("draw", () => {
		it("should call the fill method of the canvas context", () => {
			pellet.draw(mockCtx);
			expect(mockCtx.fill).toHaveBeenCalled();
		});

		it("should call the arc method of the canvas context with the correct arguments", () => {
			pellet.draw(mockCtx);
			expect(mockCtx.arc).toHaveBeenCalledWith(50, 50, 3, 0, 2 * Math.PI);
		});
	});
});
