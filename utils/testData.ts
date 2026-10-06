export const appUrls = {
	login: 'https://dashboard.settl.chat/login',
	admin: 'https://dashboard.settl.chat/admin',
	forgotPassword: 'https://dashboard.settl.chat/forgot-password',
	register: 'https://dashboard.settl.chat/register',
};

export const loginTestData = {
	validUser: {
		email: 'test@test.com',
		password: 'test',
	},
	invalidUser: {
		email: 'invalid@test.com',
		password: 'invalid-password',
	},
	invalidCredentials: [
		{ email: 'invalid@test.com', password: 'invalid-password' },
		{ email: 'wrong@example.com', password: 'test' },
		{ email: 'wrong@example.com', password: 'wrong-password' },
	],
	emailBoundaryCases: ['a@b.co', 'user+tag@example.co.uk', 'USER@EXAMPLE.COM'],
	passwordBoundaryCases: [
		'a',
		'password with spaces',
		'P@ssw0rd!#$%^&*()',
		'p'.repeat(256),
	],
};