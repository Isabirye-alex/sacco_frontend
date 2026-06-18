# SACCO Client Structure

This starter layout keeps the frontend small, readable, and easy to debug.

## Folder layout

- `assets/css/` — stylesheets
- `assets/js/` — application logic
  - `api/` — endpoint-specific request helpers
  - `views/` — UI logic for each page or screen
- `pages/` — HTML templates for major sections

## API grouping

- Auth: sign-in, token handling
- Members: member/profile creation and lookups
- Savings: accounts, deposit, withdraw, transfers
- Shares: accounts, purchases, dividends
- Loans: applications, approvals, repayments

## Coding rule

No file should grow beyond 500 lines. Keep each module focused on one responsibility.
