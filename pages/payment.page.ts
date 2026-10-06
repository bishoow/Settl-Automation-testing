import { expect, Page } from '@playwright/test';

export class PaymentPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async expectLoaded() {
		await expect(this.page).toHaveURL(/^https:\/\/checkout\.stripe\.com\/(?:c|f|g)\/pay\//);
		await expect(this.page.getByRole('heading', { name: 'Pay EasyPR LLC' })).toBeVisible();
		await expect(this.page.getByRole('heading', { name: 'Payment method' })).toBeVisible();
	}
}