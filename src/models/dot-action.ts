import { Cluster } from './cluster';
import { RadarDot } from './radar-dot';

export interface DotAction {
	items: RadarDot[];
	target: Element;
}
