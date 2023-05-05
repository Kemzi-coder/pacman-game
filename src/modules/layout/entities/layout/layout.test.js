import {describe, it, expect, vi, beforeEach} from "vitest";
import Layout from "./layout";
import {Boundary} from "../../../boundary";
import {Pellet} from "../../../pellet";

describe("Layout", () => {
	const mockCtx = {
		drawImage: vi.fn(),
		beginPath: vi.fn(),
		arc: vi.fn(),
		fill: vi.fn(),
		closePath: vi.fn()
	};
	const mockMap = [
		["-", "-", "-", "-", "-"],
		["-", "p", ".", "p", "-"],
		["-", "-", "-", "-", "-"]
	];
	let layout;

	beforeEach(() => {
		vi.restoreAllMocks();
		layout = new Layout({map: mockMap});
	});

	describe("constructor", () => {
		it("should create boundaries and pellets based on the provided map", () => {
			expect(layout.boundaries).toHaveLength(12);
			expect(layout.pellets).toHaveLength(1);
			expect(layout.powerUps).toHaveLength(2);

			// Check that the correct types of objects were created
			expect(layout.boundaries.every(obj => obj instanceof Boundary)).toBe(
				true
			);
			expect(layout.pellets.every(obj => obj instanceof Pellet)).toBe(true);
			expect(layout.powerUps.every(obj => obj instanceof Pellet)).toBe(true);

			// Check that object positions match expected positions based on the map
			expect(layout.boundaries[0].position).toEqual({x: 0, y: 0});
			expect(layout.boundaries[11].position).toEqual({
				x: 4 * Boundary.width,
				y: 2 * Boundary.height
			});
			expect(layout.pellets[0].position).toEqual({
				x: 2 * Boundary.width + Boundary.width / 2,
				y: 1 * Boundary.height + Boundary.height / 2
			});
			expect(layout.powerUps[1].position).toEqual({
				x: 3 * Boundary.width + Boundary.width / 2,
				y: 1 * Boundary.height + Boundary.height / 2
			});
		});
	});

	describe("removePellet", () => {
		it("should remove the specified pellet from the pellets array", () => {
			// Check that the pellet is initially in the array
			expect(layout.pellets).toContainEqual(
				expect.objectContaining({
					position: {
						x: 2 * Boundary.width + Boundary.width / 2,
						y: 1 * Boundary.height + Boundary.height / 2
					}
				})
			);

			// Remove the pellet and check that it's no longer in the array
			layout.removePellet(0);
			expect(layout.pellets).not.toContainEqual(
				expect.objectContaining({
					position: {
						x: 2 * Boundary.width + Boundary.width / 2,
						y: 1 * Boundary.height + Boundary.height / 2
					}
				})
			);
		});
	});

	describe("removePowerUp", () => {
		it("should remove the specified powerUp from the powerUps array", () => {
			// Check that the powerUp is initially in the array
			expect(layout.powerUps).toContainEqual(
				expect.objectContaining({
					position: {
						x: 3 * Boundary.width + Boundary.width / 2,
						y: 1 * Boundary.height + Boundary.height / 2
					},
					radius: 6
				})
			);

			// Remove the powerUp and check that it's no longer in the array
			layout.removePowerUp(1);
			expect(layout.powerUps).not.toContainEqual(
				expect.objectContaining({
					position: {
						x: 3 * Boundary.width + Boundary.width / 2,
						y: 1 * Boundary.height + Boundary.height / 2
					},
					radius: 6
				})
			);
		});
	});

	describe("draw", () => {
		it("should call draw method for every entity", () => {
			const boundarySpies = layout.boundaries.map(boundary =>
				vi.spyOn(boundary, "draw")
			);
			const pelletSpies = layout.pellets.map(pellet =>
				vi.spyOn(pellet, "draw")
			);
			const powerUpSpies = layout.powerUps.map(powerUp =>
				vi.spyOn(powerUp, "draw")
			);

			layout.draw(mockCtx);

			boundarySpies.forEach(spy => {
				expect(spy).toHaveBeenCalled();
			});

			pelletSpies.forEach(spy => {
				expect(spy).toHaveBeenCalled();
			});

			powerUpSpies.forEach(spy => {
				expect(spy).toHaveBeenCalled();
			});
		});
	});
});
