import { DotStatus } from './dot-status';

export interface RadarDot {
	id: string;
	name: string;
	sector: string;
	ring: string;
	number: number;
	content: string;
	status: DotStatus;
}
