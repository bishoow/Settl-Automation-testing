import { expect, Locator, Page } from '@playwright/test';
import { appUrls } from '../utils/testData';

const vouchersUrl = `${appUrls.admin}/vouchers`;

export class VouchersPage {
	readonly page: Page;
	readonly main: Locator;
	readonly heading: Locator;
	readonly table: Locator;
	readonly rows: Locator;
	readonly searchInput: Locator;
	readonly addVoucherButton: Locator;
	readonly importButton: Locator;
	readonly dialog: Locator;
	readonly voucherNumberInput: Locator;
	readonly amountInput: Locator;
	readonly typeFilters: Record<'All' | 'Sales' | 'Receipt' | 'Payment', Locator>;

	constructor(page: Page) {
		this.page = page;
		this.main = page.getByRole('main');
		this.heading = this.main.getByRole('heading', { name: 'Vouchers', level: 2 });
		this.table = this.main.getByRole('table');
		this.rows = this.table.locator('tbody tr');
		this.searchInput = this.main.locator(
			'input[placeholder="Search by voucher no. or debtor name"]',
		);
		this.addVoucherButton = this.main.getByRole('button', {
			name: 'Add Voucher',
			exact: true,
		});
		this.importButton = this.main.getByRole('button', {
			name: 'Import CSV / XLS / JSON',
		});
		this.dialog = page.getByRole('dialog');
		this.voucherNumberInput = this.dialog.getByLabel('Voucher no. *');
		this.amountInput = this.dialog.getByLabel('Amount *');
		this.typeFilters = {
			All: this.main.locator('button').filter({ hasText: 'All' }).first(),
			Sales: this.main.locator('button').filter({ hasText: 'Sales' }).first(),
			Receipt: this.main.locator('button').filter({ hasText: 'Receipt' }).first(),
			Payment: this.main.locator('button').filter({ hasText: 'Payment' }).first(),
		};
	}

	async goto() {
		await this.page.goto(vouchersUrl);
	}

	async expectLoaded() {
		await expect(this.page).toHaveURL(vouchersUrl);
		await expect(this.heading).toBeVisible();
		await expect(this.table).toBeVisible();
		await expect
			.poll(() => this.rows.first().getByRole('cell').count(), { timeout: 20_000 })
			.toBe(7);
	}

	async openAddVoucher() {
		await this.addVoucherButton.click();
		await expect(this.dialog.getByRole('heading', { name: 'Add Voucher' })).toBeVisible();
	}

	async selectDefaultDebtor() {
		await this.dialog.getByRole('combobox').first().click();
		await this.page.getByRole('option', { name: /test test 919798775388/ }).click();
	}

	async fillRequiredVoucherFields(voucherNumber: string, amount: string) {
		await this.selectDefaultDebtor();
		await this.voucherNumberInput.fill(voucherNumber);
		await this.amountInput.fill(amount);
	}

	async uploadCsv(fileName: string, voucherNumber: string) {
		await this.importButton.click();
		await expect(this.dialog.getByRole('heading', { name: 'Import Vouchers' })).toBeVisible();
		const date = new Date().toISOString().slice(0, 10);
		const csv = `Voucher No,Type,Debtor,Amount,Date\n${voucherNumber},Sales,test test,15.99,${date}\n`;
		await this.dialog.locator('input[type="file"]').setInputFiles({
			name: fileName,
			mimeType: 'text/csv',
			buffer: Buffer.from(csv),
		});
		await expect(this.dialog.getByText(/rows detected/)).toBeVisible();
	}
}