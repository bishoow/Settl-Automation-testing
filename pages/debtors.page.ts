import { expect, Locator, Page } from '@playwright/test';
import { appUrls } from '../utils/testData';

const debtorsUrl = `${appUrls.admin}/debtors`;

export class DebtorsPage {
	readonly page: Page;
	readonly main: Locator;
	readonly heading: Locator;
	readonly table: Locator;
	readonly dataRows: Locator;
	readonly searchInput: Locator;
	readonly quickAddButton: Locator;
	readonly dialog: Locator;
	readonly fullNameInput: Locator;
	readonly phoneInput: Locator;
	readonly emailInput: Locator;
	readonly addDebtorButton: Locator;
	readonly statusFilters: Record<'All' | 'Active' | 'Opted Out', Locator>;

	constructor(page: Page) {
		this.page = page;
		this.main = page.getByRole('main');
		this.heading = this.main.getByRole('heading', { name: 'Debtors', level: 2 });
		this.table = this.main.getByRole('table');
		this.dataRows = this.table.locator('tbody tr');
		this.searchInput = this.main.getByRole('textbox', {
			name: 'Search by name or phone',
		});
		this.quickAddButton = this.main.getByRole('button', { name: 'Quick Add', exact: true });
		this.dialog = page.getByRole('dialog');
		this.fullNameInput = this.dialog.getByLabel('Full name *');
		this.phoneInput = this.dialog.getByLabel('Phone *');
		this.emailInput = this.dialog.getByLabel('Email');
		this.addDebtorButton = this.dialog.getByRole('button', {
			name: 'Add Debtor',
			exact: true,
		});
		this.statusFilters = {
			All: this.main.getByRole('button', { name: 'All', exact: true }),
			Active: this.main.getByRole('button', { name: 'Active', exact: true }),
			'Opted Out': this.main.getByRole('button', { name: 'Opted Out', exact: true }),
		};
	}

	async goto() {
		await this.page.goto(debtorsUrl);
	}

	async expectLoaded() {
		await expect(this.page).toHaveURL(debtorsUrl);
		await expect(this.heading).toBeVisible();
		await expect(this.table).toBeVisible();
		await expect(this.page.getByText('Loading debtors…', { exact: true })).toBeHidden({
			timeout: 20_000,
		});
		await expect
			.poll(() => this.dataRows.count(), { timeout: 20_000 })
			.toBeGreaterThan(0);
	}

	async openQuickAdd() {
		await this.quickAddButton.click();
		await expect(this.dialog).toBeVisible();
		await expect(
			this.dialog.getByRole('heading', { name: 'Quick Add Debtor' }),
		).toBeVisible();
	}
}