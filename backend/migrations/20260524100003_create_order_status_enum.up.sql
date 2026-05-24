CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
UPDATE orders SET status = 'pending' WHERE status NOT IN ('pending', 'completed', 'cancelled', 'refunded');
ALTER TABLE orders ALTER COLUMN status TYPE order_status USING status::order_status;
