<?php

/**
 * MySQL hostname
 */
define("DB_HOST", "your_host_adress_here");

/**
 * MySQL database username
 */
define("DB_USER", "your_username_here");

/**
 * MySQL database password
 */
define("DB_PASSWORD", "your_password_here");

/**
 * The name of the database for Shadis
 * Accepts only numbers, letters, and underscores
 */
define("DB_NAME", "your_database_name_here");

/**
 * Database Charset to use in creating database tables.
 */
define("DB_CHARSET", "utf8");

/**
 * Token used for uploading if you are not logged in
 */
define("UPLOAD_TOKEN", "your_secret_upload_token_here");

/**
 * Shadis Database Table prefix.
 * Accepts only numbers, letters, and underscores
 */
$table_prefix = "shadis_";

/**
 * Path to the upload directory of Shadis
 *
 * If you want to save the upload path elsewhere, make sure
 * you edit the root .htaccess file aswell, so that the client
 * can also find the requested files.
 */
$upload_directory = dirname(__FILE__) . "/../uploads/";

/**
 * Path to ImageMagick executable
 * Make sure the given path is really the right one.
 *
 * Since the binary is called differently on macOS
 * than on other platforms, you also need to append
 * the name of the executable.
 * 
 */
$imagick_path = "/usr/local/bin/magick";
