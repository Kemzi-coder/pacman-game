import type {PacmanMovement} from "../../../modules/pacman";

type MovementProp = PacmanMovement;

type PositionProp = {x: number; y: number};

type VelocityProp = {x: number; y: number};

type PacmanConstructor = {
	position: PositionProp;
	velocity: VelocityProp;
};

export type {MovementProp, PacmanConstructor, PositionProp, VelocityProp};
