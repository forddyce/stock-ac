# ABC Elektronik - Deployment Guide

## Pre-Deployment Preparation (Local Machine)

### 1. Build Production Assets

```bash
cd /home/forddyce/web/abc-elektronik
npm run build
composer install --optimize-autoloader --no-dev
```

### 2. Prepare Environment File

Create a production `.env` file with these settings:

```env
APP_NAME="ABC Elektronik"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

### 3. Create Database Backup

```bash
php artisan db:seed  # If seeding permissions/roles
mysqldump -u root -p abc_elektronik > backup.sql
```

## Server Setup

### Directory Structure on Shared Hosting

```
public_html/
├── index.php                    (modified from Laravel's public/index.php)
├── .htaccess                    (from Laravel's public/.htaccess)
├── robots.txt                   (from Laravel's public/robots.txt)
├── build/                       (from Laravel's public/build/)
└── abc-elektronik/              (Laravel application root)
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── resources/
    ├── routes/
    ├── storage/
    ├── vendor/
    ├── .env
    ├── artisan
    └── composer.json
```

## Deployment Steps

### Step 1: Upload Files via FileZilla

1. **Connect to your hosting via FileZilla**
    - Host: Your hosting FTP address
    - Username: Your FTP username
    - Password: Your FTP password
    - Port: 21 (or as provided by hosting)

2. **Upload Laravel Application**
    - Upload entire project folder contents to `public_html/abc-elektronik/`
    - Exclude: `node_modules`, `.git`, `.env` (upload separately)

3. **Move Public Folder Contents**
    - From local: `public/`
    - Move these files to `public_html/`:
        - `index.php`
        - `.htaccess`
        - `robots.txt`
        - `build/` folder (entire folder)

4. **Delete Empty Public Folder**
    - Delete `public_html/abc-elektronik/public/` on server

### Step 2: Modify index.php

Edit `public_html/index.php` and update these lines:

**FROM:**

```php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```

**TO:**

```php
require __DIR__.'/abc-elektronik/vendor/autoload.php';
$app = require_once __DIR__.'/abc-elektronik/bootstrap/app.php';
```

### Step 3: Upload Environment File

1. Upload your production `.env` file to `public_html/abc-elektronik/.env`
2. Ensure it contains correct database credentials from cPanel

### Step 4: Setup Database via cPanel

1. **Create Database**
    - Go to cPanel → MySQL Databases
    - Create new database: `your_db_name`

2. **Create Database User**
    - Create user with strong password
    - Grant ALL PRIVILEGES to the database

3. **Import Database**
    - Go to phpMyAdmin
    - Select your database
    - Import `backup.sql` or run migrations (see Step 5)

### Step 5: Run Setup Commands

**Option A: If SSH Access Available**

```bash
cd public_html/abc-elektronik
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```

**Option B: Without SSH (Using Setup Script)**

1. The `setup.php` file is already in `public` folder
2. Upload it to `public_html/setup.php`
3. Visit: `https://yourdomain.com/setup.php` in browser
4. You should see: "Running setup... Setup complete!"
5. **IMPORTANT: Delete `setup.php` immediately after use**

### Step 6: Set File Permissions

Via FileZilla, right-click folders and set permissions:

```
storage/ → 755 (recursive)
bootstrap/cache/ → 755 (recursive)
```

If permission issues occur, ask hosting support to run:

```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Step 7: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. Try to login with your credentials
3. Test key features:
    - Create item
    - Create purchase
    - Create sale
    - View reports

## Post-Deployment Tasks

### 1. Migrate Old Data (If Needed)

If you have old data to import:

1. Upload SQL files via phpMyAdmin:
    - `old_items.sql`
    - `old_suppliers.sql`
    - `old_customers.sql`
    - `old_sales_persons.sql`
    - `old_purchase.sql`
    - `old_sales.sql`

2. Create a migration setup file `public_html/migrate.php`:

```php
<?php
require __DIR__.'/abc-elektronik/vendor/autoload.php';
$app = require_once __DIR__.'/abc-elektronik/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<pre>";
echo "Starting data migration...\n\n";

echo "Migrating suppliers...\n";
$kernel->call('migrate:old-suppliers', ['--table' => 'old_suppliers']);

echo "\nMigrating customers...\n";
$kernel->call('migrate:old-customers', ['--table' => 'old_customers']);

echo "\nMigrating sales persons...\n";
$kernel->call('migrate:old-salespersons', ['--table' => 'old_sales_persons']);

echo "\nMigrating items...\n";
$kernel->call('migrate:old-items', ['--table' => 'old_items']);

echo "\nMigrating purchases...\n";
$kernel->call('migrate:old-purchases', ['--table' => 'old_purchase']);

echo "\nMigrating sales...\n";
$kernel->call('migrate:old-sales', ['--table' => 'old_sales']);

echo "\n\nMigration complete!";
echo "</pre>";
```

3. Visit: `https://yourdomain.com/migrate.php`
4. **IMPORTANT: Delete `migrate.php` after migration completes**

### 2. Adjust Stock Manually

After migration, go to Stock Adjustments page and adjust initial stock for each item in ABC warehouse.

### 3. Security Checklist

- [ ] `.env` file is NOT in public_html root (should be in abc-elektronik/)
- [ ] APP_DEBUG is set to `false`
- [ ] APP_ENV is set to `production`
- [ ] Strong database password is used
- [ ] Delete `setup.php` after use
- [ ] Delete `migrate.php` after use
- [ ] Verify `storage` and `bootstrap/cache` are not publicly accessible

### 4. Setup Backup Routine

Ask hosting support or setup via cPanel:

- Daily database backups
- Weekly full file backups

## Troubleshooting

### Issue: "500 Internal Server Error"

**Solution:**

- Check `.htaccess` is uploaded to `public_html/`
- Verify paths in `index.php` are correct
- Check error logs in cPanel or `storage/logs/laravel.log`

### Issue: "Route not found" or CSS/JS not loading

**Solution:**

- Run setup.php again to cache routes
- Verify `build/` folder is in `public_html/`
- Check APP_URL in `.env` matches your domain

### Issue: "Storage link not working"

**Solution:**

- Ask hosting support to create symlink manually:

```bash
ln -s /path/to/public_html/abc-elektronik/storage/app/public /path/to/public_html/storage
```

### Issue: Database connection errors

**Solution:**

- Verify database credentials in `.env`
- Use `localhost` as DB_HOST (not 127.0.0.1)
- Ensure user has ALL PRIVILEGES on database

### Issue: Permission denied errors

**Solution:**

- Set correct permissions via FileZilla
- Ask hosting support to set ownership to web server user

## Maintenance

### Updating the Application

1. Build assets locally
2. Upload changed files via FileZilla
3. Visit `setup.php` to clear caches
4. Delete `setup.php`

### Monitoring

- Regularly check `storage/logs/laravel.log` via FileZilla
- Monitor disk space in cPanel
- Check database size regularly

## Support Contacts

- Hosting Support: [Your hosting support contact]
- Developer: forddyce@abc-elektronik.com

---

**Last Updated:** December 26, 2025
