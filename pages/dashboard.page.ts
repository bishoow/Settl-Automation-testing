import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
	readonly page: Page;
	readonly main: Locator;
	readonly dashboardHeading: Locator;
	readonly navigation: Locator;
	readonly logoutButton: Locator;

	constructor(page: Page) {
		this.page = page;
		this.main = page.getByRole('main');
		this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard', level: 2 });
		this.navigation = page.getByRole('navigation').first();
		this.logoutButton = page.getByRole('button', { name: /log ?out|sign ?out/i }).first();
	}

	async goto() {
		await this.page.goto('https://dashboard.settl.chat/admin');
	}

	async expectLoaded() {
		await expect(this.page).toHaveURL('https://dashboard.settl.chat/admin');
		await expect(this.dashboardHeading).toBeVisible();
	}

	async navigationItems() {
		return this.navigation.getByRole('link').evaluateAll((links) => links.map((link) => ({
			name: (link.textContent || '').trim(),
			href: (link as HTMLAnchorElement).href,
		})));
	}

	async visibleControlInventory() {
		return this.main.locator('h1, h2, h3, table, input, button, a, [role="button"], [role="menuitem"], [role="tab"], [role="combobox"]').evaluateAll((elements) => elements.map((element) => ({
			role: element.getAttribute('role') || element.tagName.toLowerCase(),
			name: (element.textContent || element.getAttribute('aria-label') || '').trim(),
		})));
	}

	async expectAccessibleMainControls() {
		await expect(this.main).toBeVisible();
		const headings = await this.main.locator('h1, h2, h3, h4, h5, h6').evaluateAll((elements) => elements.map((element) => Number(element.tagName.substring(1))));
		expect(headings.length).toBeGreaterThan(0);
		for (const control of await this.main.locator('button, input, select, textarea').all()) {
			await expect(control).toHaveAccessibleName(/.+/);
		}
	}
}
