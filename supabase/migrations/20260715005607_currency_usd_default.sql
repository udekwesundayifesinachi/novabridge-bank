/*
# Change default currency from NGN to USD

1. Modified Tables
   - `accounts`: Changed column `currency` default from 'NGN' to 'USD'.
   - `cards`: Changed column `currency` default from 'NGN' to 'USD'.
2. Important Notes
   - Existing rows are NOT modified — only future inserts pick up the new default.
   - No data loss: currency is a free-text column, values remain intact.
*/

ALTER TABLE accounts ALTER COLUMN currency SET DEFAULT 'USD';
ALTER TABLE cards ALTER COLUMN currency SET DEFAULT 'USD';