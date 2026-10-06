import { expect, test } from '@playwright/test';
import { VouchersPage } from '../pages/vouchers.page';

const dashboardStorageState = 'playwright/.auth/dashboard.json';

function parseVoucherDate(value: string) {
	const [day, month, year] = value.split('/').map(Number);
	return new Date(Date.UTC(year, month - 1, day));
}

function getTodayUtc() {
	const today = new Date();
	return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
}

test.use({ storageState: dashboardStorageState });

test.describe('VOUCHER | Voucher Management', () => {
	test('VC-001 | To verify the Vouchers page loads successfully', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await expect(vouchers.page).toHaveURL('https://dashboard.settl.chat/admin/vouchers');
		await expect(vouchers.heading).toBeVisible();
	});

	test('VC-002 | To verify the voucher table is displayed', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		for (const column of ['Voucher', 'Type', 'Debtor', 'Amount', 'Pending', 'Due Date', 'Status']) {
			await expect(
				vouchers.table.getByRole('columnheader', { name: new RegExp(column, 'i') }),
			).toBeVisible();
		}
	});

	test('VC-003 | To verify the voucher summary metrics are displayed', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		for (const metric of ['Total Pending', 'Overdue Vouchers', 'Overdue Amount']) {
			await expect(vouchers.main.getByText(metric, { exact: true })).toBeVisible();
		}
	});

	test('VC-004 | To verify the voucher search field is displayed', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		await expect(vouchers.searchInput).toBeVisible();
		await expect(vouchers.searchInput).toBeEnabled();
	});

	test('VC-005 | To verify the Add Voucher button is displayed and enabled', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		await expect(vouchers.addVoucherButton).toBeVisible();
		await expect(vouchers.addVoucherButton).toBeEnabled();
	});

	test('VC-006 | To verify the Import button is displayed and enabled', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		await expect(vouchers.importButton).toBeVisible();
		await expect(vouchers.importButton).toBeEnabled();
	});

	test('VC-007 | To verify the navigation bar is displayed', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		await expect(page.getByRole('navigation')).toBeVisible();
	});

	for (const voucherType of ['Sales', 'Receipt', 'Payment'] as const) {
		test(`VOUCHER-${voucherType === 'Sales' ? '002' : voucherType === 'Receipt' ? '003' : '004'} | To verify the ${voucherType} filter only shows that voucher type`, async ({
			page,
		}) => {
			const vouchers = new VouchersPage(page);
			await vouchers.goto();
			await vouchers.expectLoaded();
			await vouchers.typeFilters[voucherType].click();

			await expect.poll(() => vouchers.rows.count()).toBeGreaterThan(0);
			for (const row of await vouchers.rows.all()) {
				await expect(row.getByRole('cell').nth(1)).toHaveText(
					new RegExp(`^${voucherType}$`, 'i'),
				);
			}
		});
	}

	test('VC-008 | To verify vouchers can be searched by voucher number', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		const voucherNumber = (await vouchers.rows.first().getByRole('cell').first().innerText())
			.trim()
			.split('\n')[0];
		await vouchers.searchInput.fill(voucherNumber);

		await expect(vouchers.rows.first()).toContainText(voucherNumber);
	});

	test('VC-010 | To verify vouchers can be searched by debtor name', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		const debtorName = (await vouchers.rows.first().getByRole('cell').nth(2).innerText()).trim();
		await vouchers.searchInput.fill(debtorName);

		await expect(vouchers.rows.first().getByRole('cell').nth(2)).toContainText(debtorName);
	});

	test('VC-011 | To verify an unmatched search displays the empty state', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();
		await vouchers.searchInput.fill(`PW-NO-MATCH-${Date.now()}`);

		await expect(vouchers.table.getByRole('cell', { name: /no vouchers found/i })).toBeVisible();
	});

	test('VC-012 | To verify pagination moves forward and back between voucher pages', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		const firstPageVoucher = (await vouchers.rows.first().getByRole('cell').first().innerText())
			.trim()
			.split('\n')[0];
		const nextPageButton = vouchers.main.locator('button').filter({ hasText: 'Next page' });
		const previousPageButton = vouchers.main
			.locator('button')
			.filter({ hasText: 'Previous page' });
		await expect(nextPageButton).toBeEnabled();
		await nextPageButton.click();
		await expect(previousPageButton).toBeEnabled();
		await expect
			.poll(async () =>
				(await vouchers.rows.first().getByRole('cell').first().innerText()).trim().split('\n')[0],
			)
			.not.toBe(firstPageVoucher);

		await previousPageButton.click();
		await expect
			.poll(async () =>
				(await vouchers.rows.first().getByRole('cell').first().innerText()).trim().split('\n')[0],
			)
			.toBe(firstPageVoucher);
	});

	test('VC-013 | To verify required fields keep Add Voucher disabled until valid minimum data is entered', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();
		await vouchers.openAddVoucher();

		const addButton = vouchers.dialog.getByRole('button', {
			name: 'Add Voucher',
			exact: true,
		});
		await expect(addButton).toBeDisabled();
		await vouchers.selectDefaultDebtor();
		await expect(addButton).toBeDisabled();
		await vouchers.voucherNumberInput.fill(`PW-VALIDATION-${Date.now()}`);
		await expect(addButton).toBeDisabled();
		await vouchers.amountInput.fill('15.99');
		await expect(addButton).toBeEnabled();

		await vouchers.dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
		const discardDialog = page.getByRole('dialog', { name: 'Discard changes?' });
		await expect(discardDialog).toBeVisible();
		await discardDialog.getByRole('button', { name: 'Discard changes' }).click();
		await expect(page.getByRole('dialog', { name: 'Add Voucher' })).toBeHidden();
		await expect(discardDialog).toBeHidden();
	});

	test('VC-014 | To verify a valid voucher is created when the API succeeds', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		let submittedBody = '';
		await page.route('**/api/proxy/api/vouchers/create', async (route) => {
			submittedBody = route.request().postData() ?? '';
			await route.fulfill({
				status: 201,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					data: { id: 'pw-mock-voucher', voucher_no: 'PW-MOCK', amount: 15.99 },
				}),
			});
		});

		await vouchers.goto();
		await vouchers.expectLoaded();
		await vouchers.openAddVoucher();
		const voucherNumber = `PW-MOCK-${Date.now()}`;
		await vouchers.fillRequiredVoucherFields(voucherNumber, '15.99');
		const voucherDate = '2026-08-12';
		await vouchers.dialog.getByRole('textbox', { name: 'Date *' }).fill(voucherDate);

		const requestPromise = page.waitForRequest(
			(request) =>
				request.method() === 'POST' &&
				request.url().endsWith('/api/proxy/api/vouchers/create'),
		);
		await vouchers.dialog.getByRole('button', { name: 'Add Voucher', exact: true }).click();
		const request = await requestPromise;

		await expect(vouchers.dialog.getByText('Voucher added', { exact: true })).toBeVisible();
		await expect(vouchers.dialog).toContainText(voucherNumber);
		expect(request.postData()).toContain(voucherNumber);
		expect(request.postData()).toContain('15.99');
		expect(request.postData()).toContain(voucherDate);
		expect(submittedBody).toContain(voucherNumber);
		expect(submittedBody).toContain(voucherDate);

		await vouchers.dialog.getByRole('button', { name: 'Done', exact: true }).click();
		await expect(vouchers.dialog).toBeHidden();
	});

	test('VC-015 | To verify voucher values remain available after a server error', async ({ page }) => {
		const vouchers = new VouchersPage(page);
		await page.route('**/api/proxy/api/vouchers/create', (route) =>
			route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }),
		);

		await vouchers.goto();
		await vouchers.expectLoaded();
		await vouchers.openAddVoucher();
		const voucherNumber = `PW-FAILED-${Date.now()}`;
		await vouchers.fillRequiredVoucherFields(voucherNumber, '9.99');
		await vouchers.dialog.getByRole('button', { name: 'Add Voucher', exact: true }).click();

		await expect(vouchers.dialog).toBeVisible();
		await expect(vouchers.voucherNumberInput).toHaveValue(voucherNumber);
		await expect(vouchers.amountInput).toHaveValue('9.99');
	});

	test('VC-016 | To verify import cannot preview until the required debtor mapping is selected', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();
		await vouchers.uploadCsv('voucher-mapping.csv', `PW-MAP-${Date.now()}`);

		await expect(vouchers.dialog.getByText(/Map these required fields to continue/)).toBeVisible();
		await expect(vouchers.dialog.getByRole('button', { name: /Preview/ })).toBeDisabled();
	});

	test('VC-017 | To verify a mapped CSV reaches review without importing records', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();
		const voucherNumber = `PW-PREVIEW-${Date.now()}`;
		await vouchers.uploadCsv('voucher-preview.csv', voucherNumber);

		await vouchers.dialog.locator('button').filter({ hasText: 'not mapped' }).first().click();
		await page.getByRole('option', { name: 'Debtor', exact: true }).click();
		await vouchers.dialog.getByRole('button', { name: /Preview/ }).click();

		await expect(vouchers.dialog).toContainText('Previewing 1 of 1 rows');
		await expect(vouchers.dialog).toContainText(voucherNumber);
		await expect(vouchers.dialog.getByRole('button', { name: 'Confirm Import' })).toBeEnabled();
	});

	test('VC-018 | To verify amount sorting toggles between ascending and descending order', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		const readAmounts = async () =>
			Promise.all(
				(await vouchers.rows.all()).map(async (row) =>
					Number((await row.getByRole('cell').nth(3).innerText()).replace(/[₹,]/g, '')),
				),
			);
		const amountHeader = vouchers.table.getByRole('columnheader', { name: 'Amount' });

		await amountHeader.click();
		await expect
			.poll(async () => {
				const amounts = await readAmounts();
				return amounts.every((amount, index) => index === 0 || amounts[index - 1] <= amount);
			})
			.toBe(true);

		await amountHeader.click();
		await expect
			.poll(async () => {
				const amounts = await readAmounts();
				return amounts.every((amount, index) => index === 0 || amounts[index - 1] >= amount);
			})
			.toBe(true);
	});

	test('VC-019 | To verify amount and date boundary validation in Add Voucher', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();
		await vouchers.openAddVoucher();

		const amountInput = vouchers.amountInput;
		const pendingInput = vouchers.dialog.getByLabel('Pending amount');
		const voucherDateInput = vouchers.dialog.getByLabel('Date *');
		const dueDateInput = vouchers.dialog.getByLabel('Due date');
		await expect(amountInput).toHaveAttribute('min', '1');
		await expect(amountInput).toHaveAttribute('max', '999999999999.99');
		await expect(pendingInput).toHaveAttribute('min', '0');

		await amountInput.fill('0.99');
		expect(
			await amountInput.evaluate((input: HTMLInputElement) => input.validity.rangeUnderflow),
		).toBe(true);
		await amountInput.fill('1000000000000');
		expect(
			await amountInput.evaluate((input: HTMLInputElement) => input.validity.rangeOverflow),
		).toBe(true);

		await pendingInput.fill('0');
		expect(await pendingInput.evaluate((input: HTMLInputElement) => input.validity.valid)).toBe(
			true,
		);
		await pendingInput.fill('-0.01');
		expect(
			await pendingInput.evaluate((input: HTMLInputElement) => input.validity.rangeUnderflow),
		).toBe(true);

		const voucherDate = await voucherDateInput.inputValue();
		const priorDate = new Date(`${voucherDate}T00:00:00Z`);
		priorDate.setUTCDate(priorDate.getUTCDate() - 1);
		await dueDateInput.fill(priorDate.toISOString().slice(0, 10));
		expect(
			await dueDateInput.evaluate((input: HTMLInputElement) => input.validity.rangeUnderflow),
		).toBe(true);
		await dueDateInput.fill(voucherDate);
		expect(await dueDateInput.evaluate((input: HTMLInputElement) => input.validity.valid)).toBe(
			true,
		);

		await vouchers.dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
		const discardDialog = page.getByRole('dialog', { name: 'Discard changes?' });
		await expect(discardDialog).toBeVisible();
		await discardDialog.getByRole('button', { name: 'Discard changes' }).click();
	});

	test('VC-020 | To verify the import size limit and supported file formats are stated', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();
		await vouchers.importButton.click();

		const fileInput = vouchers.dialog.locator('input[type="file"]');
		await expect(fileInput).toHaveAttribute('accept', '.csv,.xls,.xlsx,.json');
		await expect(vouchers.dialog).toContainText('CSV, XLS, XLSX, JSON — max 10 MB');
		await vouchers.dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
	});

	test('VC-022 | To verify the voucher date matches between the main list and detail page', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		const firstRow = vouchers.rows.first();
		const voucherNumber = (await firstRow.getByRole('cell').first().innerText())
			.trim()
			.split('\n')[0];
		const listDate = (await firstRow.getByRole('cell').first().innerText())
			.split('\n')
			.map((value) => value.trim())
			.find((value) => /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value));
		expect(listDate, `expected a calendar date in row for ${voucherNumber}`).toBeTruthy();
		const [day, month, year] = listDate!.split('/').map(Number);
		const expectedDetailDate = new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}).format(new Date(Date.UTC(year, month - 1, day)));

		await firstRow.click();
		const detailDate = (await page
			.getByRole('main')
			.getByText('Voucher Date', { exact: true })
			.locator('..')
			.innerText())
			.split('\n')
			.map((value) => value.trim())
			.filter(Boolean)
			.at(-1);
		expect(detailDate).toBe(expectedDetailDate);
	});

	test('VC-23 | To verify a voucher with a future due date remains Active', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		const today = getTodayUtc();
		const activeRows = [];
		for (const row of await vouchers.rows.all()) {
			const cells = await row.getByRole('cell').allInnerTexts();
			const dueDate = cells[5].trim();
			const status = cells[6].trim().toLowerCase();
			if (dueDate !== '—' && status === 'active' && parseVoucherDate(dueDate) > today) {
				activeRows.push({ row, dueDate });
			}
		}

		expect(activeRows.length, 'expected an Active voucher with a future due date').toBeGreaterThan(0);
		for (const { row, dueDate } of activeRows) {
			await expect(row.getByRole('cell').last()).toHaveText(/^Active$/i);
			await expect(row).toContainText(dueDate);
		}
	});

	test('VC-24 | To verify a voucher becomes Overdue when its due date is reached with pending balance', async ({
		page,
	}) => {
		const vouchers = new VouchersPage(page);
		await vouchers.goto();
		await vouchers.expectLoaded();

		const today = getTodayUtc();
		const overdueRows = [];
		for (const row of await vouchers.rows.all()) {
			const cells = await row.getByRole('cell').allInnerTexts();
			const pending = cells[4].trim();
			const dueDate = cells[5].trim();
			const status = cells[6].trim().toLowerCase();
			if (
				dueDate !== '—' &&
				pending !== '—' &&
				Number(pending.replace(/[₹,]/g, '')) > 0 &&
				parseVoucherDate(dueDate) <= today
			) {
				overdueRows.push({ row, dueDate, status });
			}
		}

		expect(
			overdueRows.length,
			'expected at least one voucher whose due date has been reached and pending balance is positive',
		).toBeGreaterThan(0);
		for (const { row, dueDate, status } of overdueRows) {
			expect(status, `voucher row with due date ${dueDate}`).toBe('overdue');
			await expect(row.getByRole('cell').last()).toHaveText(/^Overdue$/i);
		}
	});

	// test('VC-25 | To verify a fully paid voucher is not marked Overdue', async ({ page }) => {
	// 	const vouchers = new VouchersPage(page);
	// 	await vouchers.goto();
	// 	await vouchers.expectLoaded();

	// 	const paidRows = [];
	// 	for (const row of await vouchers.rows.all()) {
	// 		const cells = await row.getByRole('cell').allInnerTexts();
	// 		if (cells[6].trim().toLowerCase() === 'paid') {
	// 			paidRows.push(row);
	// 		}
	// 	}

	// 	expect(paidRows.length, 'expected at least one fully paid voucher').toBeGreaterThan(0);
	// 	for (const row of paidRows) {
	// 		await expect(row.getByRole('cell').last()).toHaveText(/^Paid$/i);
	// 	}
	// });
});
