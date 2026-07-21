/*
# Rename BVN/NIN columns to ssn/drivers_license

1. Modified Tables
   - `profiles`: Renamed column `bvn` → `ssn` (Social Security Number, US equivalent)
   - `profiles`: Renamed column `nin` → `drivers_license` (US driver's license number)
2. Important Notes
   - This is a column rename, not a data type change — existing data is preserved.
   - All application code has been updated to use the new field names.
   - US SSNs are 9 digits; US driver's license numbers vary by state (up to 20 chars).
*/

ALTER TABLE profiles RENAME COLUMN bvn TO ssn;
ALTER TABLE profiles RENAME COLUMN nin TO drivers_license;