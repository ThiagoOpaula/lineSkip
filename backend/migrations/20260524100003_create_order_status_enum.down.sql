ALTER TABLE orders ALTER COLUMN status TYPE VARCHAR(50) USING status::text;
DROP TYPE IF EXISTS order_status;
