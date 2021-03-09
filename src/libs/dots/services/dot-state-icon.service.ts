import { D3Selection } from '../../../models/types/d3-selection';

export class DotStateIconService {
	public renderDotMovedIcon(container: D3Selection): D3Selection {
		return container.html(`
			<svg version="1.1" id="dot-moved-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve" transform="translate(-8, -8)">
			<style type="text/css">
				.st0{fill-rule:evenodd;clip-rule:evenodd;}
			</style>
			<g id="_x2D_-------------------------------NINA">
				<g id="Status-dot_x2F_desktop_x2F_updated" transform="translate(-26.000000, 0.000000)">
					<g id="Dot_x2F_moved" transform="translate(26.805769, 0.000000)">
						<circle id="Dot-bg" class="st0" cx="7.2" cy="8" r="6"/>
						<path id="tail" class="st0" d="M10.2,15.4l0-1c1.5-0.7,2.7-1.9,3.4-3.4l1,0C13.8,13,12.2,14.6,10.2,15.4z M4.2,14.4l0,1
							c-2-0.8-3.6-2.4-4.4-4.4l1,0C1.5,12.5,2.7,13.7,4.2,14.4z M14.6,5l-1,0c-0.7-1.5-1.9-2.7-3.4-3.4l0-1C12.2,1.4,13.8,3,14.6,5z
							M4.2,0.6l0,1C2.7,2.3,1.5,3.5,0.7,5l-1,0C0.6,3,2.2,1.4,4.2,0.6z"/>
					</g>
				</g>
			</g>
			</svg>
		`);
	}

	public renderDotUpdatedIcon(container: D3Selection): D3Selection {
		return container.html(`
			<svg version="1.1" id="dot-updated-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve">
			<style type="text/css">
				.st0{fill-rule:evenodd;clip-rule:evenodd;}
			</style>
			<g id="_x2D_-------------------------------NINA">
				<g id="Status-dot_x2F_updated">
					<circle id="Dot-bg" class="st0" cx="8" cy="8" r="6"/>
					<path id="outer-circle" class="st0" d="M8,0c4.4,0,8,3.6,8,8s-3.6,8-8,8s-8-3.6-8-8S3.6,0,8,0z M8,0.9C4.1,0.9,0.9,4.1,0.9,8
						s3.2,7.1,7.1,7.1s7.1-3.2,7.1-7.1S11.9,0.9,8,0.9z"/>
				</g>
			</g>
			</svg>
		`);
	}
}
