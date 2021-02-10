import { D3Selection } from '../../models/types/d3-selection';

export function appendNodeIfNotExist(container: D3Selection, className: string, tag: string = 'g'): D3Selection {
	const existingContainer: D3Selection = container.select(`${tag}.${className}`);
	if (Boolean(existingContainer.nodes().length)) {
		return existingContainer;
	} else {
		return container.append(tag).classed(className, true);
	}
}
