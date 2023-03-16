<?php
/**
 * @package  Hash for Booking Calendar
 * @description  Generate and check  about hashes
 *
 * Author: wpdevelop, oplugins
 * @link http://oplugins.com/
 * @email info@oplugins.com
 *
 * @version 1.0
 * @modified 2019-05-02
 */

if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit if accessed directly

////////////////////////////////////////////////////////////////////////////////
// Generate and Check - Hash
////////////////////////////////////////////////////////////////////////////////

//FixIn: 8.4.7.20.1

/**
 * Class for generating and checking one way hashes.
 */
class WPBC_Hash {



    // unlike a const, static property values can be changed
    public static $settings = array(
                                  //  'is_show_file_name' => true
                                  //, 'is_send_email_notification' => true
                                  'hash_type' => 'phpass'                     // 'phpass' - hashing using WP Portable PHP password hashing framework instance.
                                                                                // 'wp' - using standard WP password functions
                                                                                // 'md5' (simple hashing using md5,  not recommended)
                                );
    private $secret_key;


    /** Load Secret HASH from DB */
    function __construct() {

		// Load Pass class
		require_once( ABSPATH . 'wp-includes/class-phpass.php');

		// SECRET KEY - key for checking valid links
		$wpbc_secret_key = get_bk_option( 'booking_secret_key' );
		if ( empty( $wpbc_secret_key ) ) {
			update_bk_option( 'booking_secret_key', $this->generate_password( 30, false, false ) );
		}
		$this->secret_key = get_bk_option( 'booking_secret_key' );
	}


	/**
	 * Generate Password based on different symbols,
	 * basically this overriding WP function wp_generate_password from ../wp-includes/pluggable.php
	 *
	 * @param int  $length
	 * @param bool $special_chars
	 * @param bool $extra_special_chars
	 *
	 * @return mixed|void
	 * @throws Exception
	 */
	function generate_password( $length = 12, $special_chars = true, $extra_special_chars = false ) {
		$chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		if ( $special_chars ) {
			$chars .= '!@#$%^&*()';
		}
		if ( $extra_special_chars ) {
			$chars .= '-_ []{}<>~`+=,.;:/?|';
		}

		$password = '';
		for ( $i = 0; $i < $length; $i++ ) {
			$password .= substr( $chars, random_int( 0, strlen( $chars ) - 1 ), 1 );
		}

		/**
		 * Filters the randomly-generated password.
		 *
		 * @since 3.0.0
		 *
		 * @param string $password The generated password.
		 */
		return apply_filters( 'wpbc_random_password', $password );              //FixIn: 9.2.1.9
	}


	/**
	 * Get secret HASH based on specific parameters - ORDER of parameters is IMPORTANT!
     *
     * @param array  with  parameters, which used for generating HASH
                                                                                                      )
     * @return string = YmNicywxNDg4MTg2ODE4LDAsMC4wLjAuMCwwLDgwM2FlNTk0YjQ3NzMwNzg3NDlmZTQ0NjdiOWM0MDg4
     */
    public function generate_secret_hash( $params_arr = array() ) {
//debuge($params_arr , $opt)		;die;

	    $params_arr = implode( '^', $params_arr );

		// Verify Hash
		$hash_for_verification = $this->generate_one_way_hash( $this->secret_key . $params_arr );

		$auth = $params_arr . '^' . $hash_for_verification;

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Encode URL
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// This encoding is designed to make binary data survive transport
		// through transport layers that are not 8-bit clean, such as mail bodies.
		$auth = base64_encode( $auth );
		// Returns a string in which all non-alphanumeric characters except -_.~
		// have been replaced with a percent (%) sign followed by two hex digits.
		$auth = rawurlencode( $auth );

		return  $auth;

    }


	/**
	 * Check if the url for download valid, and return error key or valid path  to file
	 *
	 * @param string $auth  - HASH
	 * @return mixed	    - return  FALSE on error or array with parameters on SUCCESS
	*/
	public function check_secret_hash( $auth ) {

		////////////////////////////////////////////////////////////////////
		// Decode URL
		////////////////////////////////////////////////////////////////////

		// percent (%) signs with two hex digits replace to symbols:: 'foo%20bar%40baz' => foo bar@baz
		$auth = rawurldecode( $auth );

		//    2,    1486134709, 1486048303,     176.102.54.50   ,0  ,2c70a0c65a2f8a84c649bd6e957151e5
		// bcbs,    1488185523,          0,     0.0.0.0         ,0  ,6ef85ddb126dfde4f0cf6dd1b1afc4bf
		$auth = base64_decode( $auth );

		////////////////////////////////////////////////////////////////////


		// Get parameters /////////////////////////////////////////
		$params_arr    = explode( '^', $auth );
		$verifyhash = array_pop( $params_arr ); // 2c70a0c65a2f8a84c649bd6e957151e5
		$verifyhash = trim( $verifyhash );


		////////////////////////////////////////////////////////////////////
		// Check Hash
		////////////////////////////////////////////////////////////////////


		// Generate Hash based on secret key    - for rechecking about verification of this link
		$hash = $this->secret_key . implode( '^', $params_arr );
		if ( ! $this->verify_one_way_hash( $verifyhash, $hash ) ) {

			return false;   'wrong_hash_in_url';
		} else {
			return $params_arr;
		}

	}


	/**
	 * Generate One Way  hash here
     *
     * @param string $known_string
     * @return string
     */
    function generate_one_way_hash( $known_string ) {

        switch ( self::$settings[ 'hash_type' ] ) {

            case 'phpass':
                /** https://roots.io/improving-wordpress-password-security/
                 * the 1st parameter can be from 8 to 30
                 * The 2nd parameter of true is the important one. That boolean flag tells phpass whether to use a "portable" hash.
                 * If that flag was false then phpass would check for the existence of a strong hashing function such as bcrypt and use it.
                 */
                $hasher_obj	 = new PasswordHash( 12, false );
				$hash		 = $hasher_obj->HashPassword( wp_unslash( $known_string ) );
				break;
            case 'wp':
				$hash		 = wp_hash_password( $known_string );
				break;
			default:															// same as 'md5'
				$hash		 = md5( $known_string );
				break;
		}

        return $hash;
    }


	/**
	 * Check if hash Valid
     *
     * @param string $input_hash   - hash, which we need to check,  if its VALID
     * @param string $known_string - from which is generating HASH
     * @return boolean
     */
    function verify_one_way_hash( $hash, $known_string ) {

        $hash_is_correct = false;

		switch ( self::$settings[ 'hash_type' ] ) {

			case 'phpass':
				$hasher_obj		 = new PasswordHash( 12, false );
				$hash_is_correct = $hasher_obj->CheckPassword( $known_string, $hash );
				break;
			case 'wp':
				$hash_is_correct = wp_check_password( $known_string, $hash );
				break;
			default:															// same as 'md5'
				$known_hash		 = $this->generate_one_way_hash( $known_string );
				if ( $hash == $known_hash )
					$hash_is_correct = true;
				break;
		}

		return $hash_is_correct;
	}

}


/**
 * Get 1 Way Hash
 *
 * @param array - with  parameters
 *
 * @return string = YmNicywxNDg4MTg2ODE4LDAsMC4wLjAuMCwwLDgwM2FlNTk0YjQ3NzMwNzg3NDlmZTQ0NjdiOWM0MDg4
 */
function wpbc_get_secret_hash( $params_arr ) {

	$secret_link = '';

	//FixIn: 8.7.1.7
	if ( version_compare( PHP_VERSION, '5.4' ) < 0 ) {
		return $secret_link;
	}

	if ( ! empty( $params_arr ) ) {

		$wpbc_link = new WPBC_Hash();

		$secret_link = $wpbc_link->generate_secret_hash( $params_arr );
	}
	return $secret_link;
}


/**
 * Check 1 Way Hash
 *
 * @param $hash
 *
 * @return bool or array on  Success
 */
function wpbc_check_secret_hash( $hash ) {

	//FixIn: 8.7.1.7
	if ( version_compare( PHP_VERSION, '5.4' ) < 0 ) {
		return false;
	}

	$wpbc_link = new WPBC_Hash();

	$is_link_valid = $wpbc_link->check_secret_hash( $hash );

	if ( false === $is_link_valid ) {
		return false;              // Wrong Hash
	} else {
		return $is_link_valid;               // Success
	}
}