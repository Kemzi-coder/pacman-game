import {describe, it, expect, vi, beforeEach} from "vitest";
import Pacman from "./pacman";

describe("Pacman", () => {
	const mockCtx = {
		beginPath: vi.fn(),
		arc: vi.fn(),
		fillStyle: "",
		fill: vi.fn(),
		closePath: vi.fn(),
		translate: vi.fn(),
		rotate: vi.fn(),
		save: vi.fn(),
		restore: vi.fn(),
		lineTo: vi.fn()
	};
	let pacman;

	beforeEach(() => {
		vi.resetAllMocks();
		pacman = new Pacman({
			position: {x: 10, y: 20},
			velocity: {x: 5, y: 0},
			speed: 5
		});
	});

	describe("constructor", () => {
		it("should set the position, velocity, and speed properties correctly", () => {
			const position = {x: 10, y: 20};
			const velocity = {x: 5, y: 0};
			const speed = 5;
			const newPacman = new Pacman({position, speed, velocity});
			expect(newPacman.position).toEqual(position);
			expect(newPacman.speed).toEqual(speed);
			expect(newPacman.velocity).toEqual(velocity);
		});
	});

	describe("draw method", () => {
		it("should call ctx.drawImage with the correct arguments", () => {
			pacman.draw(mockCtx);
			expect(mockCtx.save).toHaveBeenCalledTimes(1);
			expect(mockCtx.translate).toHaveBeenCalledTimes(2);
			expect(mockCtx.rotate).toHaveBeenCalledTimes(1);
			expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
			expect(mockCtx.arc).toHaveBeenCalledTimes(1);
			expect(mockCtx.fillStyle).toEqual("yellow");
			expect(mockCtx.fill).toHaveBeenCalledTimes(1);
			expect(mockCtx.closePath).toHaveBeenCalledTimes(1);
			expect(mockCtx.restore).toHaveBeenCalledTimes(1);
		});
	});

	describe("update method", () => {
		it("should call the draw method and update the position correctly", () => {
			pacman.update(mockCtx);
			expect(pacman.position.x).toEqual(15);
			expect(pacman.position.y).toEqual(20);
			expect(mockCtx.beginPath).toHaveBeenCalledTimes(1);
			expect(mockCtx.arc).toHaveBeenCalledTimes(1);
			expect(mockCtx.fillStyle).toEqual("yellow");
			expect(mockCtx.fill).toHaveBeenCalledTimes(1);
			expect(mockCtx.closePath).toHaveBeenCalledTimes(1);
		});
	});
});
