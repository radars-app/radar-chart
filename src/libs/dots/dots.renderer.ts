import { BehaviorSubject, combineLatest } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { TracksRenderer } from './tracks/tracks.renderer';
import { ShadowPointsRenderer } from './shadow-points/shadow-points.renderer';

export class DotsRenderer {
	private tracksRenderer: TracksRenderer;
	private tracksContainer: D3Selection;

	private shadowPointsRenderer: ShadowPointsRenderer;
	private shadowPointsContainer: D3Selection;

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private get dotSpace(): number {
		return 2 * this.config.dotsConfig.dotOffset + 2 * this.config.dotsConfig.dotRadius;
	}

	constructor(private container: D3Selection, private model: RadarChartModel, private config$: BehaviorSubject<RadarChartConfig>) {
		this.tracksRenderer = new TracksRenderer(config$);
		this.shadowPointsRenderer = new ShadowPointsRenderer(config$);
		const radarsDiameter: number =
			2 * calculateOuterRingRadius(this.model.rangeX$.getValue(), this.model.rangeY$.getValue(), this.config);
		this.initContainers(radarsDiameter);
		this.initBehavior();
	}

	private initBehavior(): void {
		combineLatest([this.model.rangeX$, this.model.rangeY$, this.config$, this.model.sectorNames$, this.model.ringNames$]).subscribe(
			([rangeX, rangeY, config, sectorNames, ringNames]: [number, number, RadarChartConfig, string[], string[]]) => {
				const outerRingRadius: number = calculateOuterRingRadius(rangeX, rangeY, config);
				this.tracksRenderer.renderTracks(this.tracksContainer, outerRingRadius, ringNames, this.dotSpace);
				this.shadowPointsRenderer.renderShadowPoints(this.shadowPointsContainer, ringNames, sectorNames, this.dotSpace);
			}
		);
	}

	private initContainers(radarsDiameter: number): void {
		this.tracksContainer = this.container.append('g').classed('radar-chart__tracks', true);

		this.shadowPointsContainer = this.container
			.append('g')
			.classed('radar-chart__points', true)
			.attr('transform', `translate(${radarsDiameter}, 0) rotate(90)`);
	}
}
