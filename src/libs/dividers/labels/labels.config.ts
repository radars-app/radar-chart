export class LabelsConfig {
	public isLabelShown: boolean;
	public fontFamily: string;
	public fontSize: number;
	public lineHeight: number;
	public letterSpacing: number;
	public textColor: string;

	constructor() {
		this.isLabelShown = true;
		this.textColor = '#6B7885';
		this.fontSize = 10;
		this.lineHeight = 12;
		this.letterSpacing = 0.48;
		this.fontFamily = 'Roboto, sans-serif';
	}
}
