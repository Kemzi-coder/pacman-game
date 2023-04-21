import "normalize.css";
import "./styles/index.scss";
import {Layout} from "./core/objects/layout";

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
		["-", "-", "-", "-", "-", "-"],
		["-", "", "", "", "", "-"],
		["-", "", "-", "-", "", "-"],
		["-", "", "-", "-", "", "-"],
		["-", "", "", "", "", "-"],
		["-", "-", "-", "-", "-", "-"]
	]
});

layout.draw(canvasContext);
