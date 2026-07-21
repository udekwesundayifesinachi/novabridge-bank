/*
# Update account number default to 12-digit US format

1. Modified Tables
   - `accounts`: Changed `account_number` default from 10-digit NUBAN format to 12-digit US format.
2. Important Notes
   - US bank account numbers typically range from 9 to 17 digits; 12 digits is a reasonable default.
   - Existing account numbers are NOT modified — only future inserts pick up the new default.
*/

ALTER TABLE accounts ALTER COLUMN account_number SET DEFAULT LPAD(FLOOR(RANDOM() * 999999999999 + 100000000000)::text, 12, '0');