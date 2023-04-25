import "normalize.css";
import "./styles/index.scss";
import {Game} from "./modules/game";

const game = new Game("#app", {
	difficulty: "hard"
});

game.start();
