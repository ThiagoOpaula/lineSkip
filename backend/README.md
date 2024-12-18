[CursorSurroundingLines]
To interact with the PostgreSQL database, we use sqlx-cli. This tool allows us to easily manage our database schema and perform migrations.

### Installing sqlx-cli

To install sqlx-cli, run the following command:
```bash
cargo install sqlx-cli
```
### Configuring the Database

Create a new file named `.env` in the root of the project with the following contents:
```makefile
DATABASE_URL=postgres://lineskip_user:secretpassword@localhost:5432/lineskip_db
```
Replace the placeholders with your actual database credentials.

### Running Migrations

To apply the database schema, run the following command:
```bash
sqlx migrate run
```
This will create the necessary tables and indexes in your database.

### Creating a New Migration

To create a new migration, run the following command:
```bash
sqlx migrate add <migration_name>
```
Replace `<migration_name>` with a descriptive name for your migration.

This will create two new files in the `migrations` directory: `<timestamp>_create_<migration_name>.up.sql` and `<timestamp>_create_<migration_name>.down.sql`. The `up.sql` file contains the SQL commands to apply the migration, while the `down.sql` file contains the SQL commands to revert the migration.

### Example Migration

For example, to create a new table called `orders`, you would create a new migration with the following `up.sql` file:
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ticket_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL
);
```
And the following `down.sql` file:
```sql
DROP TABLE orders;
```
### Applying Migrations

Once you have created your migration files, you can apply them to your database by running the following command:
```bash
sqlx migrate run
```
This will apply all pending migrations to your database.

### Reverting Migrations

If you need to revert a migration, you can do so by running the following command:
```bash
sqlx migrate revert
```
This will revert the most recently applied migration. You can also specify a specific migration to revert by passing the migration name as an argument:
```bash
sqlx migrate revert <migration_name>
```
</CursorSurroundingLines>