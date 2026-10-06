# Bug Register

| Bug ID | Related Test ID(s) | File:Line | Severity (Critical/High/Medium/Low) | Expected vs Actual | Suggested fix |
|---|---|---|---|---|---|
| BUG-001 | Login-018 | tests/Settl.spec.ts:229 | Medium | Expected the forgot-password link to receive focus after the password field in the logical Tab sequence on every supported browser. Actual: WebKit leaves the link inactive; Chromium and Firefox pass. | Inspect the rendered login DOM and WebKit focus behavior, then correct the focus order or use an accessibility-compatible focus strategy. Add a WebKit-specific regression check after the fix. |
| BUG-002 | Login-008 | tests/Settl.spec.ts:123 | Medium | Expected sign-in to remain disabled when the password contains only whitespace. Actual: the button is enabled in Chromium, Firefox, and WebKit. | Trim or reject whitespace-only passwords in the login form validation before enabling submission, while preserving intentional leading/trailing password behavior if required by the product contract. |

## Observations

- The EasyPR test drafts in `tests/EasyPR.spec.ts` are commented out and therefore provide no executable coverage for order validation or payment navigation.
- The current suite depends on live external Settl and EasyPR services, which can introduce environment and availability noise.

## Dashboard Bugs

| Bug ID | Related Test ID | Title | Severity | Steps to reproduce | Expected | Actual |
|---|---|---|---|---|---|---|
| BUG-003 | DASH-NAV-001 | [Dashboard] Dashboard navigation has no active state | Low | Log in with `loginTestData.validUser`, open `/admin`, and inspect the Dashboard sidebar link. | The current Dashboard link exposes an active state through `aria-current` or an active class. | The Dashboard link navigates correctly but exposes neither state. Screenshot is attached by the test. |
| BUG-004 | DASH-NEG-001 | [Dashboard] Logout control is missing | High | Log in with `loginTestData.validUser` and open `/admin`. | A visible logout control lets the user end the session. | No role-button named Logout or Sign out is exposed, so logout cannot be tested through the UI. Screenshot is attached by the test. |
| BUG-005 | DASH-NEG-003 | [Dashboard] Failed API response leaves dashboard without a friendly error | Medium | Mock dashboard API requests with HTTP 500, open `/admin`, and reload. | The page shows a friendly error, retry action, or explicit empty state. | The dashboard heading is not rendered and no matching friendly error or empty-state message is shown. Screenshot is attached by the test. |

## Voucher Bugs

| Bug ID | Related Test ID | Title | Severity | Steps to reproduce | Expected | Actual |
|---|---|---|---|---|---|---|
| BUG-006 | VOUCHER-018 | [Voucher] Detail date displays one day earlier than the main list | Medium | Create a voucher with date `2026-08-12`, open its detail page, then edit the date to `2026-08-19` and save. | The detail page and main list display the same calendar date selected in the form. | The list displays `19/8/2026` while detail displays `18 Aug 2026`; the initial date showed the same one-day discrepancy. Format date-only values without a timezone shift. |
| BUG-007 | VOUCHER-020 | [Voucher] Reached due date does not change status to Overdue | High | Open the Vouchers page and inspect a voucher with due date on or before today and a positive pending amount. | The voucher status is Overdue. | A voucher due `1/10/2026` with a positive pending amount is still displayed as Active. Recalculate status from the date-only due date and pending amount. |
