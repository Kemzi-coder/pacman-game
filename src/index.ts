import "normalize.css";
import {Boundary} from "./modules/boundary";
import {Layout} from "./modules/layout";
import {Pacman} from "./modules/pacman";
import "./styles/index.scss";

const canvas: HTMLCanvasElement | null = document.querySelector("#app");

if (!canvas) {
	throw new Error("Canvas element is null.");
}

const canvasContext = canvas.getContext("2d");

if (!canvasContext) {
	throw new Error("Error getting canvas context.");
}

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const layout = new Layout({
	layout: [
		["-", "-", "-", "-", "-", "-", "-"],
		["-", " ", " ", " ", " ", " ", "-"],
		["-", " ", "-", " ", "-", " ", "-"],
		["-", " ", " ", " ", " ", " ", "-"],
		["-", " ", "-", " ", "-", " ", "-"],
		["-", " ", " ", " ", " ", " ", "-"],
		["-", "-", "-", "-", "-", "-", "-"]
	]
});

const pacman = new Pacman({
	position: {
		x: Boundary.width + Boundary.width / 2,
		y: Boundary.height + Boundary.height / 2
	},
	velocity: {x: 0, y: 0}
});

pacman.initMovement(canvasContext, layout, {
	width: canvas.width,
	height: canvas.height
});
