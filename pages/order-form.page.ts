import { expect, Page } from '@playwright/test';

const homeUrl = 'https://easyprwire.com/?srsltid=AfmBOopkpD_C7JVC-DOx9EIOo7D3R08g__viAyURrPQF-spBXva771TO';

export class OrderFormPage {
	readonly page: Page;
	readonly fullNameInput;
	readonly emailInput;
	readonly countryInput;
	readonly phoneInput;
	readonly proceedToPaymentButton;

	constructor(page: Page) {
		this.page = page;
		this.fullNameInput = page.getByRole('textbox', { name: 'Enter your full name' });
		this.emailInput = page.getByRole('textbox', { name: 'Enter a valid email' });
		this.countryInput = page.getByRole('combobox');
		this.phoneInput = page.getByRole('textbox', { name: '1 (702) 123-4567' });
		this.proceedToPaymentButton = page.getByRole('button', { name: 'Proceed to Payment' });
	}

	async openStarterOrderForm() {
		await this.page.goto(homeUrl);
		await this.page.getByRole('link', { name: 'Order Now' }).click();
		await expect(this.page).toHaveURL(/\/pricings(?:#packages|\?scroll=pricing-cards)$/);

		const starterPlan = this.page.getByRole('link', { name: 'Select Starter' });
		await starterPlan.scrollIntoViewIfNeeded();
		await starterPlan.click({ force: true });

		await expect(this.page).toHaveURL(/\/checkout\/starter$/);
		await expect(this.page.getByRole('heading', { name: 'Order Form' })).toBeVisible();
		await expect(this.page.getByRole('heading', { name: 'Your Details' })).toBeVisible();
	}

	async fillDetails(details: {
		name: string;
		email: string;
		country: string;
		phone: string;
	}) {
		await this.fullNameInput.fill(details.name);
		await this.emailInput.fill(details.email);
		await this.countryInput.fill(details.country);
		await this.countryInput.press('Enter');
		await this.phoneInput.fill(details.phone);
	}

	async proceedToPayment() {
		await this.proceedToPaymentButton.click({ force: true });
	}
}