-- MySQL Initialization Script for Nautilus Trader Web Interface
-- Creates database and grants permissions

-- Use the database
USE nautilus_web;

-- Grant all privileges to nautilus_web user
GRANT ALL PRIVILEGES ON nautilus_web.* TO 'nautilus_web'@'%';
FLUSH PRIVILEGES;

-- Note: Tables will be created by Drizzle ORM migrations
-- This script just ensures the database is ready

SELECT 'MySQL initialization completed successfully!' AS message;
SELECT 'Database: nautilus_web' AS info;
SELECT 'User: nautilus_web' AS info;
SELECT 'Tables will be created by Drizzle ORM migrations' AS info;

