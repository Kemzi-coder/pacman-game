import {
	describe,
	it,
	expect,
	vi,
	beforeAll,
	afterAll,
	beforeEach
} from "vitest";
import Game from "./game";
import {WIDTH, HEIGHT} from "../../constants/canvas";
import {defaultSettings} from "../../constants/defaultSettings";
import GameKeyboard from "../gameKeyboard/gameKeyboard";
import {Ghost} from "../../../ghost";
import {Layout} from "../../../layout";
import {Pacman} from "../../../pacman";
import {Boundary} from "../../../boundary";

describe("Game class", () => {
	let game;
	let canvas;
	let ctx;

	beforeAll(() => {
		canvas = document.createElement("canvas");
		ctx = canvas.getContext("2d");
		canvas.setAttribute("id", "canvas");
		document.body.append(canvas);
		game = new Game("#canvas");
	});

	afterAll(() => {
		canvas.remove();
	});

	describe("constructor", () => {
		it("should throw error when canvas element is null", () => {
			expect(() => new Game("#sddsad")).toThrow(
				Error("Canvas element is null.")
			);
		});

		it("should set properties", () => {
			expect(game.canvas.width).toBe(WIDTH);
			expect(game.canvas.height).toBe(HEIGHT);
			expect(game.canvas).toEqual(canvas);
			expect(game.ctx).toEqual(ctx);
			expect(game.settings).toEqual(defaultSettings);
			expect(game.gameKeyboard).toBeInstanceOf(GameKeyboard);
			expect(game.params).toBeDefined();
		});

		it("should set custom settings", () => {
			const settings = {
				map: "round1",
				difficulty: "hard",
				onScore: vi.fn(),
				onWin: vi.fn(),
				onLose: vi.fn()
			};
			const newGame = new Game("#canvas", settings);
			expect(newGame.settings).toEqual({
				...defaultSettings,
				...settings
			});
		});
	});

	describe("game actions", () => {
		const mockMap = [
			["1", "-", "-", "-", "2"],
			["|", ".", ".", ".", "|"],
			["|", ".", "b", ".", "|"],
			["|", ".", ".", ".", "|"],
			["4", "-", "-", "-", "3"]
		];
		let game2;
		let handleWin;
		let handleLose;

		beforeAll(() => {
			vi.useFakeTimers();
			game2 = new Game("#canvas");
			handleWin = vi.spyOn(game2, "handleWin");
			handleLose = vi.spyOn(game2, "handleLose");
		});

		it("should win", () => {
			game2.start();
			game2.params.ghosts = [];
			game2.params.layout = new Layout({map: mockMap});

			// Move pacman 2 blocks right
			game2.gameKeyboard.handleKeyDown({key: "ArrowRight"});
			vi.advanceTimersByTime(16);
			game2.gameKeyboard.handleKeyUp({key: "ArrowRight"});
			vi.advanceTimersByTime(16 * 16);

			// Move pacman 2 blocks down
			game2.gameKeyboard.handleKeyDown({key: "ArrowDown"});
			vi.advanceTimersByTime(16);
			game2.gameKeyboard.handleKeyUp({key: "ArrowDown"});
			vi.advanceTimersByTime(16 * 16);

			// Move pacman 2 blocks left
			game2.gameKeyboard.handleKeyDown({key: "ArrowLeft"});
			vi.advanceTimersByTime(16);
			game2.gameKeyboard.handleKeyUp({key: "ArrowLeft"});
			vi.advanceTimersByTime(16 * 16);

			// Move pacman 2 blocks top
			game2.gameKeyboard.handleKeyDown({key: "ArrowUp"});
			vi.advanceTimersByTime(16);
			game2.gameKeyboard.handleKeyUp({key: "ArrowUp"});
			vi.advanceTimersByTime(16 * 16);

			expect(handleWin).toBeCalledTimes(1);
			expect(game2.score).toBe(game2.params.scoreStep * 8);
		});

		it("should loose (pacman collides with ghost)", () => {
			game2.start();
			game2.params.pacman = new Pacman({
				position: {x: 0, y: 0},
				speed: 0,
				velocity: {x: 0, y: 0}
			});
			game2.params.ghosts = [
				new Ghost({
					position: {x: 0, y: 0},
					speed: 0,
					velocity: {x: 0, y: 0}
				})
			];

			vi.advanceTimersByTime(16);

			expect(handleLose).toBeCalledTimes(1);
		});
	});

	describe("methods", () => {
		let startMethodSpy;
		let stopMethodSpy;

		beforeAll(() => {
			vi.useFakeTimers();
			startMethodSpy = vi.spyOn(game, "start");
			stopMethodSpy = vi.spyOn(game, "stop");
		});

		beforeEach(() => {
			vi.restoreAllMocks();
		});

		it("should handle win", () => {
			const onWin = vi.fn();
			game.params.onWin = onWin;
			game.handleWin();
			expect(onWin).toBeCalledTimes(1);
			expect(onWin).toHaveBeenCalledWith({score: game.score});
			expect(stopMethodSpy).toBeCalled();
		});

		it("should handle lose", () => {
			const onLose = vi.fn();
			game.params.onLose = onLose;
			game.handleLose();
			expect(onLose).toBeCalledTimes(1);
			expect(onLose).toBeCalledWith({score: game.score});
			expect(stopMethodSpy).toBeCalledTimes(1);
		});

		it("should add score", () => {
			const onScore = vi.fn();
			game.params.onScore = onScore;
			game.addScore();
			expect(game.score).toBe(defaultSettings.scoreStep);
			expect(onScore).toBeCalledTimes(1);
			expect(onScore).toBeCalledWith(defaultSettings.scoreStep);
		});

		it("should reset score", () => {
			game.resetScore();
			expect(game.score).toBe(-defaultSettings.scoreStep);
		});

		it("should start game", () => {
			const addEventListenersSpy = vi.spyOn(
				game.gameKeyboard,
				"addEventListeners"
			);
			game.start();
			expect(addEventListenersSpy).toBeCalledTimes(1);
		});

		it("should stop game", () => {
			const reset = vi.spyOn(game.gameKeyboard, "reset");
			const removeEventListeners = vi.spyOn(
				game.gameKeyboard,
				"removeEventListeners"
			);
			const cancelAnimationFrame = vi.spyOn(window, "cancelAnimationFrame");
			game.start();
			game.stop();
			expect(cancelAnimationFrame).toBeCalledTimes(1);
			expect(cancelAnimationFrame).toBeCalledWith(game.animationId);
			expect(removeEventListeners).toBeCalledTimes(1);
			expect(reset).toBeCalledTimes(1);
		});

		it("should restart game", () => {
			game.restart();
			expect(stopMethodSpy).toBeCalledTimes(1);
			expect(startMethodSpy).toBeCalledTimes(1);
		});

		it("should return correct params object", () => {
			const params = Game.getParamsFromSettings(game.settings);
			const {
				onLose,
				onWin,
				onScore,
				scoreStep,
				difficulty,
				map: mapVariant
			} = game.settings;

			const map = Game.getMapByVariant(mapVariant);
			const {pacmanSpeed, ghostCount, ghostSpeed} =
				Game.getDifficultyParamsByLevel(difficulty);

			const layout = new Layout({map});
			const pacman = new Pacman({
				position: {
					x: Boundary.width + Boundary.width / 2,
					y: Boundary.height + Boundary.height / 2
				},
				velocity: {x: 0, y: 0},
				speed: pacmanSpeed
			});

			const ghosts = Game.getRandomGhosts({
				boundaries: layout.boundaries,
				count: ghostCount,
				speed: ghostSpeed,
				pacmanPosition: pacman.position,
				pellets: layout.pellets
			});

			const expectedParams = {
				scoreStep,
				pacman,
				layout,
				ghosts,
				onLose,
				onScore,
				onWin
			};

			expect(params.scoreStep).toBe(expectedParams.scoreStep);
			expect(params.ghosts.length).toBe(expectedParams.ghosts.length);
			expect(expectedParams.ghosts.every(ghost => ghost instanceof Ghost)).toBe(
				true
			);
			expect(params.pacman).toEqual(expectedParams.pacman);
			expect(params.layout).toEqual(expectedParams.layout);
			expect(params.onLose).toEqual(expectedParams.onLose);
			expect(params.onWin).toEqual(expectedParams.onWin);
			expect(params.onScore).toEqual(expectedParams.onScore);
			expect(params.onLose).toEqual(expectedParams.onLose);
		});
	});

	describe("setters and getters", () => {
		it("should set and get map", () => {
			const map = "round1";
			game.Map = map;
			expect(game.settings.map).toBe(map);
			expect(game.Map).toBe(map);
		});

		it("should set and get difficulty", () => {
			const difficulty = "hard";
			game.Difficulty = difficulty;
			expect(game.settings.difficulty).toBe("hard");
			expect(game.Difficulty).toBe(difficulty);
		});

		it("should set and get score step", () => {
			const scoreStep = 100;
			game.ScoreStep = scoreStep;
			expect(game.settings.scoreStep).toBe(scoreStep);
			expect(game.ScoreStep).toBe(scoreStep);
		});
	});
});
