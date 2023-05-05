import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import GameKeyboard from "./gameKeyboard";

describe("GameKeyboard", () => {
	let gameKeyboard;

	beforeEach(() => {
		gameKeyboard = new GameKeyboard();
	});

	afterEach(() => {
		gameKeyboard.removeEventListeners();
		gameKeyboard.reset();
	});

	describe("isValidKey", () => {
		it("should return true for valid keys", () => {
			expect(GameKeyboard.isValidKey("ArrowUp")).toBe(true);
			expect(GameKeyboard.isValidKey("ArrowDown")).toBe(true);
			expect(GameKeyboard.isValidKey("ArrowLeft")).toBe(true);
			expect(GameKeyboard.isValidKey("ArrowRight")).toBe(true);
		});

		it("should return false for invalid keys", () => {
			expect(GameKeyboard.isValidKey("a")).toBe(false);
			expect(GameKeyboard.isValidKey("Enter")).toBe(false);
		});
	});

	describe("handleKeyDown", () => {
		it("should set isPressed to true for valid keys", () => {
			const event = new KeyboardEvent("keydown", {key: "ArrowUp"});
			gameKeyboard.handleKeyDown(event);
			expect(gameKeyboard.keys.ArrowUp.isPressed).toBe(true);
		});

		it("should not set isPressed for invalid keys", () => {
			const event = new KeyboardEvent("keydown", {key: "a"});
			gameKeyboard.handleKeyDown(event);
			expect(gameKeyboard.keys.a).toBe(undefined);
		});

		it("should set lastKey to the pressed key", () => {
			const event = new KeyboardEvent("keydown", {key: "ArrowLeft"});
			gameKeyboard.handleKeyDown(event);
			expect(gameKeyboard.lastKey).toBe("ArrowLeft");
		});
	});

	describe("handleKeyUp", () => {
		it("should set isPressed to false for valid keys", () => {
			const event = new KeyboardEvent("keyup", {key: "ArrowDown"});
			gameKeyboard.handleKeyUp(event);
			expect(gameKeyboard.keys.ArrowDown.isPressed).toBe(false);
		});

		it("should not set isPressed for invalid keys", () => {
			const event = new KeyboardEvent("keyup", {key: "a"});
			gameKeyboard.handleKeyUp(event);
			expect(gameKeyboard.keys.a).toBe(undefined);
		});
	});

	describe("addEventListeners", () => {
		it("should add keydown and keyup event listeners", () => {
			const addEventListenerSpy = vi.spyOn(window, "addEventListener");
			gameKeyboard.addEventListeners();
			expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
			expect(addEventListenerSpy).toHaveBeenCalledWith(
				"keydown",
				gameKeyboard.handleKeyDown
			);
			expect(addEventListenerSpy).toHaveBeenCalledWith(
				"keyup",
				gameKeyboard.handleKeyUp
			);
		});
	});

	describe("removeEventListeners", () => {
		it("should remove keydown and keyup event listeners", () => {
			const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
			gameKeyboard.removeEventListeners();
			expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
			expect(removeEventListenerSpy).toHaveBeenCalledWith(
				"keydown",
				gameKeyboard.handleKeyDown
			);
			expect(removeEventListenerSpy).toHaveBeenCalledWith(
				"keyup",
				gameKeyboard.handleKeyUp
			);
		});
	});

	describe("reset", () => {
		it("should reset game keyboard state", () => {
			gameKeyboard.reset();
			expect(gameKeyboard.keys).toEqual(gameKeyboard.initialKeys);
			expect(gameKeyboard.lastKey).toBe(null);
		});
	});
});
