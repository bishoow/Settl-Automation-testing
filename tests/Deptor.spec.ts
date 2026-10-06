import { expect, test } from '@playwright/test';
import { DebtorsPage } from '../pages/debtors.page';

const dashboardStorageState = 'playwright/.auth/dashboard.json';

test.use({ storageState: dashboardStorageState });

test.describe('DEBTOR | Debtor Management', () => {
	test('DEBTOR-001 | To verify the debtor list and its primary controls are displayed', async ({
		page,
	}) => {
		const debtors = new DebtorsPage(page);
		await debtors.goto();
		await debtors.expectLoaded();

		for (const column of ['DEBTOR', 'PHONE', 'OUTSTANDING', 'RISK LABEL', 'OPTED STATUS']) {
			await expect(
				debtors.table.getByRole('columnheader', { name: new RegExp(column, 'i') }),
			).toBeVisible();
		}
		await expect(debtors.searchInput).toBeVisible();
		await expect(debtors.quickAddButton).toBeEnabled();
		await expect(debtors.statusFilters.All).toBeVisible();
		await expect(debtors.statusFilters.Active).toBeVisible();
		await expect(debtors.statusFilters['Opted Out']).toBeVisible();
	});

	test('DEBTOR-002 | To verify debtors can be found by phone number', async ({ page }) => {
		const debtors = new DebtorsPage(page);
		await debtors.goto();
		await debtors.expectLoaded();

		const firstRow = debtors.dataRows.first();
		const phone = (await firstRow.getByRole('cell').nth(1).innerText()).trim();
		await debtors.searchInput.fill(phone);

		await expect(debtors.dataRows.first()).toContainText(phone);
	});

	test('DEBTOR-003 | To verify the Active filter only shows active debtors', async ({ page }) => {
		const debtors = new DebtorsPage(page);
		await debtors.goto();
		await debtors.expectLoaded();
		await debtors.statusFilters.Active.click();

		await expect(debtors.dataRows.first()).toBeVisible();
		for (const row of await debtors.dataRows.all()) {
			await expect(row.getByRole('cell').last()).toHaveText(/^Active$/i);
		}
	});

	test('DEBTOR-004 | To verify a search with no matches shows the empty state', async ({ page }) => {
		const debtors = new DebtorsPage(page);
		await debtors.goto();
		await debtors.expectLoaded();
		await debtors.searchInput.fill(`PW-NO-MATCH-${Date.now()}`);

		await expect(
			debtors.table.getByRole('cell', { name: 'No debtors found.' }),
		).toBeVisible();
	});

	test('DEBTOR-005 | To verify Quick Add validates required fields and email format', async ({
		page,
	}) => {
		const debtors = new DebtorsPage(page);
		await debtors.goto();
		await debtors.expectLoaded();
		await debtors.openQuickAdd();

		await expect(debtors.fullNameInput).toBeVisible();
		await expect(debtors.phoneInput).toBeVisible();
		await expect(debtors.emailInput).toHaveAttribute('type', 'email');
		await expect(debtors.addDebtorButton).toBeDisabled();

		await debtors.fullNameInput.fill('Playwright Validation Case');
		await expect(debtors.addDebtorButton).toBeDisabled();
		await debtors.phoneInput.fill('919999888877');
		await expect(debtors.addDebtorButton).toBeEnabled();

		await debtors.emailInput.fill('invalid-email');
		const emailIsValid = await debtors.emailInput.evaluate(
			(input: HTMLInputElement) => input.validity.valid,
		);
		expect(emailIsValid).toBe(false);

		await debtors.dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
		const discardDialog = page.getByRole('dialog', { name: 'Discard changes?' });
		await expect(discardDialog).toBeVisible();
		await discardDialog.getByRole('button', { name: 'Discard changes' }).click();
		await expect(page.getByRole('dialog', { name: 'Quick Add Debtor' })).toBeHidden();
		await expect(discardDialog).toBeHidden();
	});

	test('DEBTOR-006 | To verify a valid debtor can be created when the API succeeds', async ({
		page,
	}) => {
		const debtors = new DebtorsPage(page);
		let submittedBody = '';
		await page.route('**/api/proxy/api/debtors/create', async (route) => {
			submittedBody = route.request().postData() ?? '';
			await route.fulfill({
				status: 201,
				contentType: 'application/json',
				body: JSON.stringify({
					success: true,
					data: { id: 'pw-mock-debtor', name: 'PW Mock Debtor', phone: '919999888877' },
				}),
			});
		});

		await debtors.goto();
		await debtors.expectLoaded();
		await debtors.openQuickAdd();
		const name = `PW Mock ${Date.now()}`;
		const phone = '919999888877';
		await debtors.fullNameInput.fill(name);
		await debtors.phoneInput.fill(phone);

		const createRequestPromise = page.waitForRequest(
			(request) =>
				request.method() === 'POST' &&
				request.url().endsWith('/api/proxy/api/debtors/create'),
		);
		await debtors.addDebtorButton.click();
		const createRequest = await createRequestPromise;

		await expect(debtors.dialog.getByText('Debtor added', { exact: true })).toBeVisible();
		await expect(debtors.dialog).toContainText(name);
		expect(createRequest.postData()).toContain(name);
		expect(createRequest.postData()).toContain(phone);
		expect(submittedBody).toContain(name);

		await debtors.dialog.getByRole('button', { name: 'Done', exact: true }).click();
		await expect(debtors.dialog).toBeHidden();
	});

	test('DEBTOR-007 | To verify debtor details remain in the form when creation fails', async ({
		page,
	}) => {
		const debtors = new DebtorsPage(page);
		await page.route('**/api/proxy/api/debtors/create', (route) =>
			route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: '{}',
			}),
		);

		await debtors.goto();
		await debtors.expectLoaded();
		await debtors.openQuickAdd();
		const name = 'PW Failed Create';
		const phone = '919999888876';
		await debtors.fullNameInput.fill(name);
		await debtors.phoneInput.fill(phone);
		await debtors.addDebtorButton.click();

		await expect(debtors.dialog).toBeVisible();
		await expect(debtors.fullNameInput).toHaveValue(name);
		const enteredPhone = await debtors.phoneInput.inputValue();
		expect(enteredPhone.replace(/\D/g, '')).toContain(phone);
	});

	test('DEBTOR-008 | To verify the Opted Out help explains WhatsApp reminder consent', async ({
		page,
	}) => {
		const debtors = new DebtorsPage(page);
		await debtors.goto();
		await debtors.expectLoaded();

		await debtors.main.getByRole('button', { name: 'What does Opted Out mean?' }).click();
		await expect(
			page.getByText(
				'Debtors who have opted out of receiving WhatsApp payment reminders.',
				{ exact: true },
			),
		).toBeVisible();
	});

	test('DEBTOR-009 | To verify Opted Out filter results and empty state', async ({ page }) => {
		const debtors = new DebtorsPage(page);
		await debtors.goto();
		await debtors.expectLoaded();

		const optedOutRequestPromise = page.waitForRequest((request) => {
			if (request.method() !== 'GET') return false;
			const url = new URL(request.url());
			return (
				url.pathname.endsWith('/api/proxy/api/debtors') &&
				url.searchParams.get('wa_opt_out') === 'true'
			);
		});
		await debtors.statusFilters['Opted Out'].click();
		await optedOutRequestPromise;
		await expect(page.getByText('Loading debtors…', { exact: true })).toBeHidden({
			timeout: 20_000,
		});

		const emptyState = debtors.table.getByRole('cell', { name: 'No debtors found.' });
		if (await emptyState.isVisible()) {
			await expect(emptyState).toBeVisible();
			return;
		}

		await expect(debtors.dataRows.first()).toBeVisible();
		for (const row of await debtors.dataRows.all()) {
			await expect(row.getByRole('cell').last()).toHaveText(/^Opted Out$/i);
		}
	});
});
