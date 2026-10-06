# Test Index

| Test ID | Module | Type | Description | Status | Bug ID |
|---|---|---|---|---|---|
| Login-001 | AUTH | IT | Login form renders with secure required fields. | PASS | |
| Login-002 | AUTH | IT | Password visibility toggles show and hide states. | PASS | |
| Login-003 | AUTH | NEG | Empty required fields stay disabled; whitespace behavior is recorded. | PASS | |
| Login-004 | AUTH | NEG | Malformed emails fail browser validation and surrounding whitespace is normalized. | PASS | |
| Login-005 | AUTH | EDGE | Supported email boundary values pass client validation. | PASS | |
| Login-006 | AUTH | EDGE | Long and spaced credentials can be entered and cleared. | PASS | |
| Login-007 | AUTH | EDGE | Password boundary values enable sign-in. | PASS | |
| Login-008 | AUTH | NEG | Whitespace-only passwords are rejected. | FAIL | BUG-002 |
| Login-009 | AUTH | E2E | Valid credentials authenticate and persist after reload. | PASS | |
| Login-010 | AUTH | NEG | Invalid credentials combination 1 is rejected. | PASS | |
| Login-011 | AUTH | NEG | Invalid credentials combination 2 is rejected. | PASS | |
| Login-012 | AUTH | NEG | Invalid credentials combination 3 is rejected. | PASS | |
| Login-013 | AUTH | EDGE | Rapid repeated submission sends at most one authentication request. | PASS | |
| Login-014 | AUTH | NEG | Failed authentication requests keep the user on login safely. | PASS | |
| Login-015 | AUTH | NEG | Server errors keep the user on login without exposing the password. | PASS | |
| Login-016 | AUTH | NEG | Unauthenticated admin access redirects to login. | PASS | |
| Login-017 | AUTH | IT | Recovery and registration links navigate to their targets. | PASS | |
| Login-018 | AUTH | EDGE | Keyboard tab order gives each control focus with visible styling. | FAIL | BUG-001 |
| Login-019 | AUTH | EDGE | Enter submits on mobile without horizontal overflow. | PASS | |
| DASH-SMK-001 | DASH | SMK | Valid test-data credentials log in and save an authenticated dashboard session. | PASS | |
| DASH-SMK-002 | DASH | SMK | Dashboard loads after successful login without console or HTTP errors. | PASS | |
| DASH-UI-001 | DASH | UI | Dashboard sections and named controls are rendered. | PASS | |
| DASH-NAV-001 | DASH | NAV | Sidebar links navigate and highlight the active page. | FAIL | BUG-003 |
| DASH-FUNC-001 | DASH | FUNC | Widgets show data or an explicit empty state. | PASS | |
| DASH-FUNC-002 | DASH | FUNC | Search, filters, sorting, pagination, and date controls respond when present. | PASS | |
| DASH-EDGE-001 | DASH | EDGE | Refresh keeps the authenticated dashboard session. | PASS | |
| DASH-NEG-001 | DASH | NEG | Logout prevents further dashboard access. | FAIL | BUG-004 |
| DASH-NEG-002 | DASH | NEG | Expired sessions redirect from admin to login. | PASS | |
| DASH-NEG-003 | DASH | NEG | A failed dashboard API shows a friendly error or empty state. | FAIL | BUG-005 |
| DASH-EDGE-002 | DASH | EDGE | Dashboard remains usable on a mobile viewport. | PASS | |
| DASH-A11Y-001 | DASH | A11Y | Headings, labels, and keyboard focus are accessible. | PASS | |
| DEBTOR-001 | DEBTOR | UI | Debtor listing, search, filters, and table headings render. | PASS | |
| DEBTOR-002 | DEBTOR | FUNC | Search returns an existing debtor by phone number. | PASS | |
| DEBTOR-003 | DEBTOR | FUNC | Active filter displays only active debtors. | PASS | |
| DEBTOR-004 | DEBTOR | NEG | A non-matching search displays the explicit no-debtors empty state. | PASS | |
| DEBTOR-005 | DEBTOR | NEG/EDGE | Quick Add enforces required fields and browser email validation. | PASS | |
| DEBTOR-006 | DEBTOR | E2E | Successful debtor creation shows confirmation with the API mocked. | PASS | |
| DEBTOR-007 | DEBTOR | NEG | Failed debtor creation keeps entered values available. | PASS | |
| DEBTOR-008 | DEBTOR | UI | Opted Out help explains WhatsApp reminder consent. | ADDED | |
| DEBTOR-009 | DEBTOR | FILTER/EDGE | Opted Out filter sends the status query and shows only opted-out debtors or the empty state. | ADDED | |
| VC-001 | VOUCHER | UI | Vouchers page loads successfully. | ADDED | |
| VC-002 | VOUCHER | UI | Voucher table displays all required columns. | ADDED | |
| VC-003 | VOUCHER | UI | Voucher summary metrics are displayed. | ADDED | |
| VC-004 | VOUCHER | UI | Voucher search field is displayed and enabled. | ADDED | |
| VC-005 | VOUCHER | UI | Add Voucher button is displayed and enabled. | ADDED | |
| VC-006 | VOUCHER | UI | Import button is displayed and enabled. | ADDED | |
| VC-007 | VOUCHER | UI | Navigation bar is displayed. | ADDED | |
| VOUCHER-002 | VOUCHER | FILTER | Sales filter displays only sales vouchers. | ADDED | |
| VOUCHER-003 | VOUCHER | FILTER | Receipt filter displays only receipt vouchers. | ADDED | |
| VOUCHER-004 | VOUCHER | FILTER | Payment filter displays only payment vouchers. | ADDED | |
| VOUCHER-005 | VOUCHER | SEARCH | Search returns a voucher by voucher number. | ADDED | |
| VOUCHER-006 | VOUCHER | SEARCH | Search returns vouchers by debtor name. | ADDED | |
| VOUCHER-007 | VOUCHER | NEG | An unmatched search shows the no-vouchers empty state. | ADDED | |
| VOUCHER-008 | VOUCHER | EDGE | Pagination advances to the next page and returns to the first. | ADDED | |
| VOUCHER-009 | VOUCHER | NEG | Missing required debtor, number, or amount keeps creation disabled. | ADDED | |
| VOUCHER-010 | VOUCHER | E2E | Valid voucher creation shows confirmation with the API mocked. | ADDED | |
| VOUCHER-011 | VOUCHER | NEG | A server error preserves voucher form values. | ADDED | |
| VOUCHER-012 | VOUCHER | NEG | Import preview is blocked until the debtor mapping is selected. | ADDED | |
| VOUCHER-013 | VOUCHER | E2E | A mapped CSV reaches review without committing an import. | ADDED | |
| VOUCHER-014 | VOUCHER | SORT | Amount sorting toggles between ascending and descending order. | ADDED | |
| VOUCHER-015 | VOUCHER | EDGE | Amount, pending amount, and due date boundary constraints are validated. | ADDED | |
| VOUCHER-016 | VOUCHER | IMPORT/EDGE | Importer states supported file extensions and the 10 MB limit. | ADDED | |
| VOUCHER-018 | VOUCHER | REGRESSION | Voucher calendar date matches between the main list and detail page. | FAIL | BUG-006 |
| VOUCHER-019 | VOUCHER | STATUS | A voucher with a future due date remains Active. | ADDED | |
| VOUCHER-020 | VOUCHER | STATUS | A voucher with a reached due date and pending balance is Overdue. | ADDED | |
| VOUCHER-021 | VOUCHER | STATUS | A fully paid voucher is not marked Overdue. | ADDED | |

## Coverage notes

- The executable suite contains 19 test cases, run against Chromium, Firefox, and WebKit.
- `tests/EasyPR.spec.ts` contains four fully commented-out draft cases, so EasyPR has no executable coverage and no status rows above.
- There is no unit-test layer; current coverage is browser-level integration, end-to-end, negative, and edge testing.
- Dashboard authentication uses `loginTestData.validUser` in `utils/testData.ts`; the resulting session is saved and reused by dashboard tests.
- Chromium dashboard execution observed 9 passing tests and 3 product failures; the failures are retained with `test.fail()` and screenshot attachments.
