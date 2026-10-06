import { expect, test } from './fixtures';
import { appUrls, loginTestData } from '../utils/testData';

test.describe('AUTH | Login Page', () => {
	test.describe('UI and Validation', () => {
		test('LG-001 | To verify the login page is displayed correctly', async ({ page, loginPage }) => {
			await loginPage.goto();

			await expect(page).toHaveURL(appUrls.login);
			await expect(page).toHaveTitle('Settl');

			await expect(loginPage.logo).toBeVisible();
			await expect(loginPage.heading).toHaveText('Sign in');
			await expect(page.getByText('Welcome back to Settl')).toBeVisible();

			await expect(loginPage.emailInput).toBeVisible();
			await expect(loginPage.passwordInput).toBeVisible();
			await expect(loginPage.passwordToggle).toBeVisible();
			await expect(loginPage.signInButton).toBeVisible();
			await expect(loginPage.forgotPasswordLink).toBeVisible();
			await expect(loginPage.createAccountLink).toBeVisible();
		});

		test('LG-002 | To verify the email field has the correct attributes', async ({ loginPage }) => {
			await loginPage.goto();

			await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
			await expect(loginPage.emailInput).toHaveAttribute('autocomplete', 'email');
			await expect(loginPage.emailInput).toHaveAttribute('required', '');
		});

		test('LG-003 | To verify the password field has the correct attributes', async ({ loginPage }) => {
			await loginPage.goto();

			await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
			await expect(loginPage.passwordInput).toHaveAttribute('autocomplete', 'current-password');
			await expect(loginPage.passwordInput).toHaveAttribute('required', '');
		});

		test('LG-004 | To verify the Sign In button is disabled when the login fields are empty', async ({
			loginPage,
		}) => {
			await loginPage.goto();

			await expect(loginPage.signInButton).toBeDisabled();
		});

		test('LG-005 | To verify the password is masked by default', async ({ loginPage }) => {
			await loginPage.goto();

			await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
			await expect(loginPage.passwordToggle).toHaveAccessibleName('Show password');
		});

		test('LG-006 | To verify the password visibility can be enabled', async ({ loginPage }) => {
			await loginPage.goto();

			await loginPage.passwordInput.fill(loginTestData.validUser.password);
			await loginPage.passwordToggle.click();

			await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
			await expect(loginPage.passwordToggle).toHaveAccessibleName('Hide password');
		});

		test('LG-007 | To verify the password visibility can be disabled', async ({ loginPage }) => {
			await loginPage.goto();

			await loginPage.passwordInput.fill(loginTestData.validUser.password);

			await loginPage.passwordToggle.click();
			await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

			await loginPage.passwordToggle.click();

			await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
			await expect(loginPage.passwordToggle).toHaveAccessibleName('Show password');
		});

		test('LG-008 | To verify the Sign In button remains disabled when the email field is empty', async ({
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.passwordInput.fill(loginTestData.validUser.password);

			await expect(loginPage.signInButton).toBeDisabled();
		});

		test('LG-009 | To verify the Sign In button remains disabled when the password field is empty', async ({
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.emailInput.fill(loginTestData.validUser.email);

			await expect(loginPage.signInButton).toBeDisabled();
		});

		test('LG-010 | To verify whitespace-only email is rejected', async ({ loginPage }) => {
			await loginPage.goto();

			await loginPage.emailInput.fill('   ');
			await loginPage.passwordInput.fill(loginTestData.validUser.password);

			await expect(loginPage.signInButton).toBeDisabled();
		});

		test('LG-011 | To verify whitespace-only password is rejected', async ({ loginPage }) => {
			await loginPage.goto();

			await loginPage.emailInput.fill(loginTestData.validUser.email);
			await loginPage.passwordInput.fill('   ');

			await expect(loginPage.signInButton).toBeDisabled();
		});

		test('LG-012 | To verify an invalid email format is rejected', async ({ loginPage }) => {
			await loginPage.goto();

			await loginPage.emailInput.fill('invalid-email');
			await loginPage.passwordInput.fill(loginTestData.validUser.password);

			const validation = await loginPage.emailInput.evaluate(
				(input: HTMLInputElement) => ({
					valid: input.validity.valid,
					message: input.validationMessage,
				}),
			);

			expect(validation.valid).toBe(false);
			expect(validation.message).not.toBe('');
		});

		test('LG-013 | To verify a valid email format is accepted', async ({ loginPage }) => {
			await loginPage.goto();

			await loginPage.emailInput.fill(loginTestData.validUser.email);

			await expect(loginPage.emailInput).toHaveJSProperty('validity.valid', true);
		});

		test('LG-014 | To verify a long email address can be entered', async ({ loginPage }) => {
			await loginPage.goto();

			const longEmail = `${'a'.repeat(120)}@example.com`;

			await loginPage.emailInput.fill(longEmail);

			await expect(loginPage.emailInput).toHaveValue(longEmail);
		});

		// test('LG-015 | To verify leading and trailing spaces can be entered in the password field', async ({
		// 	loginPage,
		// }) => {
		// 	await loginPage.goto();

		// 	const password = ' test with spaces ';

		// 	await loginPage.passwordInput.fill(password);

		// 	await expect(loginPage.passwordInput).toHaveValue(password);
		// });

		test('LG-016 | To verify the login fields can be cleared', async ({ loginPage }) => {
			await loginPage.goto();

			await loginPage.fillCredentials(
				loginTestData.validUser.email,
				loginTestData.validUser.password,
			);

			await loginPage.emailInput.clear();
			await loginPage.passwordInput.clear();

			await expect(loginPage.emailInput).toHaveValue('');
			await expect(loginPage.passwordInput).toHaveValue('');
		});
	});

	test.describe('Authentication', () => {
		test('LG-017 | To verify the user can log in with valid credentials', async ({
			page,
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.login(
				loginTestData.validUser.email,
				loginTestData.validUser.password,
			);

			await expect(page).toHaveURL(appUrls.admin);
			await expect(
				page.getByRole('heading', { name: 'Dashboard', level: 2 }),
			).toBeVisible();
		});

		test('LG-018 | To verify authentication persists after page refresh', async ({
			page,
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.login(
				loginTestData.validUser.email,
				loginTestData.validUser.password,
			);

			await expect(page).toHaveURL(appUrls.admin);

			await page.reload();

			await expect(page).toHaveURL(appUrls.admin);
			await expect(
				page.getByRole('heading', { name: 'Dashboard', level: 2 }),
			).toBeVisible();
		});

		test('LG-019 | To verify the user cannot log in with an invalid email', async ({
			page,
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.login(
				loginTestData.invalidUser.email,
				loginTestData.validUser.password,
			);

			await expect(page).toHaveURL(appUrls.login);
			await expect(loginPage.heading).toBeVisible();
		});

		test('LG-020 | To verify the user cannot log in with an invalid password', async ({
			page,
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.login(
				loginTestData.validUser.email,
				loginTestData.invalidUser.password,
			);

			await expect(page).toHaveURL(appUrls.login);
			await expect(loginPage.heading).toBeVisible();
		});

		test('LG-021 | To verify unauthenticated users cannot access the admin page directly', async ({
			page,
		}) => {
			await page.goto(appUrls.admin);

			await expect(page).toHaveURL(`${appUrls.login}?from=%2Fadmin`);
		});

		test('LG-022 | To verify login remains on the login page when the authentication request fails', async ({
			page,
			loginPage,
		}) => {
			await page.route('**/*', async (route) => {
				if (route.request().method() === 'POST') {
					await route.abort('failed');
					return;
				}

				await route.continue();
			});

			await loginPage.goto();

			await loginPage.login(
				loginTestData.validUser.email,
				loginTestData.validUser.password,
			);

			await expect(page).toHaveURL(appUrls.login);
			await expect(loginPage.heading).toBeVisible();
		});

		test('LG-023 | To verify login handles a server error without exposing the password', async ({
			page,
			loginPage,
		}) => {
			await page.route('**/*', async (route) => {
				if (route.request().method() === 'POST') {
					await route.fulfill({
						status: 500,
						contentType: 'application/json',
						body: '{}',
					});
					return;
				}

				await route.continue();
			});

			await loginPage.goto();

			await loginPage.login(
				loginTestData.validUser.email,
				loginTestData.validUser.password,
			);

			await expect(page).toHaveURL(appUrls.login);
			await expect(loginPage.heading).toBeVisible();

			await expect(page.locator('body')).not.toContainText(
				loginTestData.validUser.password,
			);
		});
	});

	test.describe('Navigation and Accessibility', () => {
		test('LG-024 | To verify the Forgot Password link navigates to the password recovery page', async ({
			page,
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.navigateToForgotPassword();

			await expect(page).toHaveURL(appUrls.forgotPassword);
		});

		test('LG-025 | To verify the Create Account link navigates to the registration page', async ({
			page,
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.navigateToCreateAccount();

			await expect(page).toHaveURL(appUrls.register);
		});

		test('LG-026 | To verify the login form supports keyboard navigation', async ({
			page,
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.emailInput.focus();
			await expect(loginPage.emailInput).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(loginPage.passwordInput).toBeFocused();

			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			await expect(loginPage.forgotPasswordLink).toBeFocused();

			await page.keyboard.press('Tab');
			await expect(loginPage.createAccountLink).toBeFocused();
		});

		test('LG-027 | To verify the login form can be submitted using the Enter key', async ({
			page,
			loginPage,
		}) => {
			await loginPage.goto();

			await loginPage.fillCredentials(
				loginTestData.validUser.email,
				loginTestData.validUser.password,
			);

			await loginPage.submitWithEnter();

			await expect(page).toHaveURL(appUrls.admin);
		});

		test('LG-028 | To verify the login page has no horizontal overflow on mobile', async ({
			page,
			loginPage,
		}) => {
			await page.setViewportSize({
				width: 390,
				height: 844,
			});

			await loginPage.goto();

			const hasHorizontalOverflow = await page
				.locator('html')
				.evaluate((html) => html.scrollWidth > window.innerWidth);

			expect(hasHorizontalOverflow).toBe(false);
		});
	});
});