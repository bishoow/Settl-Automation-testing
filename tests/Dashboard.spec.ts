import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';
import { appUrls } from '../utils/testData';

const dashboardStorageState = 'playwright/.auth/dashboard.json';

test.use({ storageState: dashboardStorageState });

test.describe('DASH | Dashboard', () => {
	test('DS-001 | To verify the dashboard loads for an authenticated user', async ({ page }) => {
		const dashboard = new DashboardPage(page);

		await dashboard.goto();

		await expect(page).toHaveURL(appUrls.admin);
		await expect(page).toHaveTitle('Settl');
		await expect(dashboard.main).toBeVisible();
		await expect(dashboard.dashboardHeading).toBeVisible();
	});

	test('DS-002 | To verify the dashboard header and navigation are displayed', async ({ page }) => {
		const dashboard = new DashboardPage(page);
		await dashboard.goto();

		await expect(page.getByRole('banner')).toContainText('Business Admin');
		await expect(page.getByText('Live', { exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Dashboard', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Debtors', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Vouchers', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Reminders', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Extensions', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Payment Attempts', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'WhatsApp', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Broadcasts', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Connect Tally', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Billing', exact: true })).toBeVisible();
		await expect(dashboard.navigation.getByRole('link', { name: 'Settings', exact: true })).toBeVisible();
	});

	test('DS-003 | To verify the dashboard quick action buttons are available', async ({ page }) => {
		const dashboard = new DashboardPage(page);
		await dashboard.goto();

		const quickAddDebtor = page.getByRole('button', { name: 'Quick Add Debtor' });
		const addVoucher = page.getByRole('button', { name: 'Add Voucher' });

		await expect(quickAddDebtor).toBeVisible();
		await expect(quickAddDebtor).toBeEnabled();
		await expect(addVoucher).toBeVisible();
		await expect(addVoucher).toBeEnabled();
	});

	test('DS-004 | To verify all dashboard summary metrics are rendered', async ({ page }) => {
		const dashboard = new DashboardPage(page);
		await dashboard.goto();

		for (const metric of ['Total Outstanding', 'Active Debtors', 'Overdue Amount', 'Opted Out']) {
			await expect(dashboard.main.getByText(metric, { exact: true })).toBeVisible();
		}
	});

	test('DS-005 | To verify dashboard chart headings and available states are displayed', async ({ page }) => {
		const dashboard = new DashboardPage(page);
		await dashboard.goto();

		await expect(dashboard.main.getByRole('heading', { name: 'Outstanding Balance Trend' })).toBeVisible();
		// await expect(dashboard.main.getByText('Historical trend charts are on the way.')).toBeVisible();
		await expect(dashboard.main.getByRole('heading', { name: 'Debtor Risk Distribution' })).toBeVisible();
		for (const risk of ['Excellent', 'Fair', 'Poor', 'Critical']) {
			await expect(dashboard.main.getByText(risk, { exact: true })).toBeVisible();
		}
	});

	test('DS-006 | To verify the top debtors and recent vouchers sections are displayed', async ({ page }) => {
		const dashboard = new DashboardPage(page);
		await dashboard.goto();

		await expect(dashboard.main.getByRole('heading', { name: 'Top Debtors by Outstanding' })).toBeVisible();
		await expect(dashboard.main.getByRole('heading', { name: 'Recent Vouchers' })).toBeVisible();

		const vouchers = dashboard.main.getByRole('table');
		await expect(vouchers).toBeVisible();
		for (const column of ['Debtor', 'Type', 'Amount', 'Status']) {
			await expect(vouchers.getByRole('columnheader', { name: column })).toBeVisible();
		}
		await expect(vouchers.getByRole('row')).toHaveCount(6);
	});

	test('DS-007 | To verify dashboard View all links point to their matching sections', async ({ page }) => {
		const dashboard = new DashboardPage(page);
		await dashboard.goto();

		await expect(dashboard.main.getByRole('link', { name: 'View all' }).nth(0)).toHaveAttribute('href', '/admin/debtors');
		await expect(dashboard.main.getByRole('link', { name: 'View all' }).nth(1)).toHaveAttribute('href', '/admin/vouchers');
		await expect(dashboard.main.getByRole('link', { name: 'View all' }).nth(2)).toHaveAttribute('href', '/admin/extensions');
	});

	test('DS-008 | To verify extension requests and reminders show their current states', async ({ page }) => {
		const dashboard = new DashboardPage(page);
		await dashboard.goto();

		await expect(dashboard.main.getByRole('heading', { name: 'Recent Extension Requests' })).toBeVisible();
		await expect(dashboard.main.getByText('No pending extension requests.')).toBeVisible();
		await expect(dashboard.main.getByRole('heading', { name: 'Reminders' })).toBeVisible();
		await expect(dashboard.main.getByText('Automated reminder cadences are on the way.')).toBeVisible();
	});

	test('DS-009 | To verify an authenticated dashboard remains available after refresh', async ({ page }) => {
		const dashboard = new DashboardPage(page);
		await dashboard.goto();
		await page.reload();

		await dashboard.expectLoaded();
	});

	test('DS-010 | To verify the dashboard has no horizontal overflow on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		const dashboard = new DashboardPage(page);
		await dashboard.goto();
		await dashboard.expectLoaded();

		const hasHorizontalOverflow = await page
			.locator('html')
			.evaluate((html) => html.scrollWidth > window.innerWidth);

		expect(hasHorizontalOverflow).toBe(false);
	});

	test('DS-011 | To verify unauthenticated users are redirected from the dashboard', async ({ page }) => {
		await page.context().clearCookies();
		await page.goto(appUrls.admin);

		await expect(page).toHaveURL(`${appUrls.login}?from=%2Fadmin`);
	});

	test('DS-012 | To verify a created voucher is listed on the Vouchers page', async ({ page }) => {
		const dashboard = new DashboardPage(page);
		const voucherNumber = `PW-E2E-${Date.now()}`;
		const voucherAmount = '123.45';

		await dashboard.goto();
		await page.getByRole('button', { name: 'Add Voucher' }).click();

		const voucherDialog = page.getByRole('dialog');
		await expect(voucherDialog.getByRole('heading', { name: 'Add Voucher' })).toBeVisible();
		await voucherDialog.getByRole('combobox').first().click();
		await page.getByRole('option', { name: /test test 919798775388/ }).click();
		await voucherDialog.getByRole('textbox', { name: 'Voucher no. *' }).fill(voucherNumber);
		await voucherDialog.getByRole('spinbutton', { name: 'Amount *' }).fill(voucherAmount);
		await voucherDialog.getByRole('button', { name: 'Add Voucher' }).click();

		await expect(page.getByText('Voucher created successfully.')).toBeVisible();
		await voucherDialog.getByRole('button', { name: 'Close' }).click();
		await dashboard.navigation.getByRole('link', { name: 'Vouchers', exact: true }).click();
		await expect(page).toHaveURL(`${appUrls.admin}/vouchers`);

		const vouchers = page.getByRole('table');
		await page.getByRole('textbox', { name: 'Search by voucher no. or debtor name' }).fill(voucherNumber);
		const createdVoucherRow = vouchers.getByRole('row').filter({ hasText: voucherNumber });
		await expect(createdVoucherRow).toBeVisible();
		await expect(createdVoucherRow).toContainText('sales');
		await expect(createdVoucherRow).toContainText('test test');
		await expect(createdVoucherRow).toContainText('₹123.45');
	});
});