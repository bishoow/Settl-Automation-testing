// import { expect, test } from '@playwright/test';
// import { OrderFormPage } from '../pages/order-form.page';
// import { PaymentPage } from '../pages/payment.page';

// const validDetails = {
// 	name: 'Playwright Test User',
// 	email: 'playwright.test@example.com',
// 	country: 'United States',
// 	phone: '+1 (702) 123-4567',
// };

// test('To verify that valid Starter order details open the payment page', async ({ page }) => {
// 	const orderForm = new OrderFormPage(page);
// 	const payment = new PaymentPage(page);
// 	await orderForm.openStarterOrderForm();
// 	await orderForm.fillDetails(validDetails);

// 	await orderForm.proceedToPayment();
// 	await payment.expectLoaded();
// });

// test('To verify that required order fields display validation messages', async ({ page }) => {
// 	const orderForm = new OrderFormPage(page);
// 	await orderForm.openStarterOrderForm();
// 	await orderForm.proceedToPayment();

// 	await expect(page.getByText('Name must be at least 3 characters.')).toBeVisible();
// 	await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
// 	await expect(page.getByText('Please select a country.')).toBeVisible();
// 	await expect(page.getByText('Please enter a valid phone number.')).toBeVisible();
// 	await expect(page).toHaveURL(/\/checkout\/starter$/);
// });

// test('To verify that invalid order field values are rejected', async ({ page }) => {
// 	const orderForm = new OrderFormPage(page);
// 	await orderForm.openStarterOrderForm();
// 	await orderForm.fillDetails({
// 		name: 'QA',
// 		email: 'invalid-email',
// 		country: 'United States',
// 		phone: '123',
// 	});

// 	await orderForm.proceedToPayment();

// 	await expect(page).toHaveURL(/\/checkout\/starter$/);
// 	await expect(page.getByRole('heading', { name: 'Order Form' })).toBeVisible();
// });

// test('To verify that a three-character name is accepted', async ({ page }) => {
// 	const orderForm = new OrderFormPage(page);
// 	const payment = new PaymentPage(page);
// 	await orderForm.openStarterOrderForm();
// 	await orderForm.fillDetails({
// 		name: 'QAT',
// 		email: 'qa+starter@example.com',
// 		country: 'United States',
// 		phone: '+1 (702) 123-4567',
// 	});

// 	await orderForm.proceedToPayment();
// 	await payment.expectLoaded();
// });
