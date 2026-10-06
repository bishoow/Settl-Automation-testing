import { expect, test as setup } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { appUrls, loginTestData } from '../utils/testData';

const authFile = 'playwright/.auth/dashboard.json';

// DASH-SMK-001: Verifies the valid test-data credentials create an authenticated dashboard session; expected result is storageState is saved after dashboard access succeeds.
setup('DASH-SMK-001 | Save authenticated dashboard session', async ({ page }) => {
	const loginPage = new LoginPage(page);
	await loginPage.goto();
	await loginPage.login(loginTestData.validUser.email, loginTestData.validUser.password);
	await expect(page).toHaveURL(appUrls.admin);
	await expect(page.getByRole('heading', { name: 'Dashboard', level: 2 })).toBeVisible();
	await page.context().storageState({ path: authFile });
});
