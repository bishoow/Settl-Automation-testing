import { expect, Locator, Page } from '@playwright/test';
import { appUrls } from '../utils/testData';

export class LoginPage {
	readonly page: Page;

	readonly logo: Locator;
	readonly heading: Locator;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly passwordToggle: Locator;
	readonly signInButton: Locator;
	readonly forgotPasswordLink: Locator;
	readonly createAccountLink: Locator;

	constructor(page: Page) {
		this.page = page;

		this.logo = page.getByRole('img', {
			name: 'Settl — Settl Karo Clear Karo',
		});

		this.heading = page.getByRole('heading', {
			name: 'Sign in',
			level: 1,
		});

		this.emailInput = page.getByRole('textbox', {
			name: 'you@example.com',
		});

		this.passwordInput = page.locator(
			'input[autocomplete="current-password"]',
		);

		this.passwordToggle = page.getByRole('button', {
			name: /show password|hide password/i,
		});

		this.signInButton = page.getByRole('button', {
			name: 'Sign in',
		});

		this.forgotPasswordLink = page.getByRole('link', {
			name: 'Forgot your password?',
		});

		this.createAccountLink = page.getByRole('link', {
			name: 'Create one',
		});
	}

	async goto() {
		await this.page.goto(appUrls.login);
	}

	async expectLoaded() {
		await expect(this.heading).toBeVisible();
		await expect(this.emailInput).toBeVisible();
		await expect(this.passwordInput).toBeVisible();
		await expect(this.signInButton).toBeVisible();
	}

	async fillCredentials(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
	}

	async login(email: string, password: string) {
		await this.fillCredentials(email, password);
		await this.signInButton.click();
	}

	async submitWithEnter() {
		await this.passwordInput.press('Enter');
	}

	async navigateToForgotPassword() {
		await this.forgotPasswordLink.click();
	}

	async navigateToCreateAccount() {
		await this.createAccountLink.click();
	}

	async togglePasswordVisibility() {
		await this.passwordToggle.click();
	}
}