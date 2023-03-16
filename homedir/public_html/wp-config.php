<?php
define( 'WP_CACHE', true );
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'vilas_wp657' );

/** Database username */
define( 'DB_USER', 'vilas_wp657' );

/** Database password */
define( 'DB_PASSWORD', '3Y5A6S[p5.' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'qsjqsk0bgm3jkf3m3mbq7h0expa7m8qjvgf6jrsugrdh0vs0vmas8gi8oxuxkfuz' );
define( 'SECURE_AUTH_KEY',  '47lafhspninbsz1c8yspsomyxpxwrj2ssy7svtcb3v4ltgs8p5qva7laugozrm7j' );
define( 'LOGGED_IN_KEY',    'd5ahowcqatwkidixqulx3bbsbzoae6hcm8o5f82zftd1skaob8czihbg0df79net' );
define( 'NONCE_KEY',        'nf1j9xxbzby2culaumxx0rbpg5zizmogsutwrrzwwulhmc8lneutati2h4ayzoc3' );
define( 'AUTH_SALT',        'bg0a5oos5mdg4wtahpj9kymxdaziplktverna66d2nvivptmftdsgey0tafgt1f3' );
define( 'SECURE_AUTH_SALT', 'ne5uu9fdo4k0p2pjjjpe2vsrgebsy7fdzi11c22igelktjkxxuaj4sfscptdvgei' );
define( 'LOGGED_IN_SALT',   '2u76edh8wtdgcw9dluqo2ofyc20fbaebnwcnbyezw0r6p4ynsihn8tjtvlwcktts' );
define( 'NONCE_SALT',       'lr9ur46gvqpvhgmt61oeywwelmbv3macwhxzdniqaaogye2njtlhiutgx6jlsto0' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp7i_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';


@ini_set( 'upload_max_filesize' , '168M' );
@ini_set( 'post_max_size', '168M');
@ini_set( 'memory_limit', '256M' );
@ini_set( 'max_execution_time', '300' );
@ini_set( 'max_input_time', '300' );
