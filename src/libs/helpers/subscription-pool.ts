import { Subscription } from 'rxjs';

export class SubscriptionPool {
	private subscriptions: Subscription[];

	constructor() {
		this.subscriptions = [];
	}

	public add(subscription: Subscription): void {
		this.subscriptions.push(subscription);
	}

	public addAll(...subscriptions: Subscription[]): void {
		this.subscriptions = this.subscriptions.concat(subscriptions);
	}

	public unsubscribeAll(): void {
		this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
		this.subscriptions = [];
	}
}
