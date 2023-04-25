type PositionProp = {x: number; y: number};

type VelocityProp = {x: number; y: number};

type PacmanConstructor = {
	position: PositionProp;
	velocity: VelocityProp;
};

export type {PacmanConstructor, PositionProp, VelocityProp};
