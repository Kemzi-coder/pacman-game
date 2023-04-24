import type {Boundary} from "../../../modules/boundary";

type LayoutProp = string[][];

type LayoutObject = {boundaries: Boundary[]};

type LayoutConstructor = {layout: LayoutProp};

export type {LayoutProp, LayoutConstructor, LayoutObject};
