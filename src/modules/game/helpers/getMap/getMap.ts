import {MAPS} from "../../constants/maps";
import {MapVariant} from "../../types/game";

const getMap = (variant: MapVariant) => {
	let map: string[][];

	switch (variant) {
		case "round1":
			map = MAPS.ROUND1;
			break;
		case "round2":
			map = MAPS.ROUND2;
			break;
		default:
			map = [[]];
			break;
	}

	return map;
};

export default getMap;
