<?php
/*
This is COMMERCIAL SCRIPT
We are do not guarantee correct work and support of Booking Calendar, if some file(s) was modified by someone else then wpdevelop.
*/
/**
 * @version 1.0
 * @package Booking Calendar 
 * @subpackage Response
 * @category Payment Gateways
 * 
 * @author wpdevelop
 * @link https://wpbookingcalendar.com/
 * @email info@wpbookingcalendar.com
 *
 * @modified 2014.06.04
 */


// Die if its just direct access to  the file without special parameters ///////
if (      (! isset( $_GET['wpdev_bkpaypal_ipn'] ) )
       && (! isset( $_GET['merchant_return_link'] ) )
       && (! isset( $_GET['payed_booking'] ) )
       && ( (! isset($_GET['pay_sys']) ) || ($_GET['pay_sys'] != 'authorizenet') )
       && (! ( ( defined('WP_BK_RESPONSE_IPN_MODE' ) )  && ( WP_BK_RESPONSE_IPN_MODE ) ) )
   ) { die('You do not have permission for direct access to this file !!!'); }
   
define('WP_BK_RESPONSE', true );

function wpbc_find_wp_base_path() {

	$dir = dirname( __FILE__ );
	do {
		if ( file_exists( $dir . "/wp-config.php" ) ) {
			return $dir;
		}
	} while ( $dir = realpath( "$dir/.." ) );

	//FixIn: 8.9.4.14
	$dir = dirname( __FILE__ );
	do {
		if ( file_exists( $dir . "/wordpress/wp-config.php" ) ) {
			return $dir . "/wordpress";
		}
	} while ( $dir = realpath( "$dir/.." ) );

	return null;
}   

// Load WP
if ( file_exists( dirname(__FILE__) . '/../../../../../wp-load.php' ) ) {
    require_once( dirname(__FILE__) . '/../../../../../wp-load.php' );
} else if (file_exists( wpbc_find_wp_base_path() . '/wp-load.php' )) {
    require_once( wpbc_find_wp_base_path() . '/wp-load.php' );
} else {
    die('Booking Calendar. Error code: 100000');
}        

if (! ( ( defined('WP_BK_RESPONSE_IPN_MODE' ) )  && ( WP_BK_RESPONSE_IPN_MODE ) ) ) {
    @header('Content-Type: text/html; charset=' . get_option('blog_charset'));
}

// Load BC
require_once( dirname(__FILE__) . '/../../wpdev-booking.php' );

// Get reloaded 'booking'  or current WordPress locale
$locale = wpbc_get_maybe_reloaded_booking_locale();             // if NOT defined WPBC_LOCALE_RELOAD define by  current  WordPress locale

// Reload Locale if its required
wpbc_check_ajax_locale__reload_it( $locale );

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   P a y m e n t     f u n c t i o n s           /////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//FixIn: 8.4.7.20.2

function wpdev_bk_update_pay_status(){


    if (  isset( $_GET['merchant_return_link']))  {
        wpbc_redirect( get_bk_option( 'booking_paypal_return_url' ) )   ;
        die;
    }

    global $wpdb;
    $status = '';  $booking_id = '';  $pay_system = ''; $wp_nonce = '';

    if (isset($_GET['payed_booking']))  $booking_id = intval( $_GET['payed_booking'] );
    if (isset($_GET['stats']))          $status = $_GET['stats'];
    if (isset($_GET['pay_sys']))        $pay_system = $_GET['pay_sys'];
    if (isset($_GET['wp_nonce']))       $wp_nonce   = $_GET['wp_nonce'];

    // Check  respose fom the payment system,  if the parameters is integrated into the crypted response
    $response_status_crypted = false;
    $response_status_crypted = apply_filters( 'wpbc_check_response_status_with_crypted_paramaters' , $response_status_crypted , $pay_system, $status, $booking_id, $wp_nonce );
    if ( $response_status_crypted !== false ) {
        // $pay_system = $response_status_crypted['pay_system'];
        $status     = $response_status_crypted['status'];
        $booking_id = $response_status_crypted['booking_id'];
        $wp_nonce   = $response_status_crypted['wp_nonce'];
    }

    $slct_sql = "SELECT pay_status FROM {$wpdb->prefix}booking WHERE booking_id IN ({$booking_id}) LIMIT 0,1";
    $slct_sql_results  = $wpdb->get_results( $slct_sql );

    $is_go_on = false;
    if ( count($slct_sql_results) > 0 )
        if ($slct_sql_results[0]->pay_status == $wp_nonce)  $is_go_on = 1; // Evrything GOOD

    if ($is_go_on == false) { // Some Unautorize request, die
        if ( count($slct_sql_results) > 0 ) {
            if ( wpbc_is_payment_status_ok( trim( $slct_sql_results[0]->pay_status ) ) )    wpbc_redirect( get_bk_option( 'booking_paypal_return_url' ) )   ;
            if ( wpbc_is_payment_status_error( trim( $slct_sql_results[0]->pay_status ) ) ) wpbc_redirect( get_bk_option( 'booking_paypal_cancel_return_url' ) )   ;
        }
        wpbc_redirect( site_url()  );
    }

    $response_status = false;
    $response_status = apply_filters( 'wpbc_check_response_status'  , $response_status , $pay_system, $status, $booking_id, $wp_nonce );
    if ( $response_status !== false ) {
        $status = $response_status;
    }

    if ( ($booking_id =='') || ($status =='') || ($pay_system =='') || ($wp_nonce =='') ) wpbc_redirect( site_url()  )   ;

    $update_sql = "UPDATE {$wpdb->prefix}booking AS bk SET bk.pay_status='$status' WHERE bk.booking_id=$booking_id;";
    if ( false === $wpdb->query( $update_sql  ) ){
        $status = 'Failed';  
    }

	do_action( 'wpbc_booking_change_payment_status', $pay_system, $status, $booking_id );

    make_bk_action( 'wpbc_auto_approve_or_cancell_and_redirect', $pay_system, $status, $booking_id );
    
    // If the system was not redirecting yet, then redirect to home page - usualy its has not happen.
    wpbc_redirect( site_url()  )   ;
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   C h e c k     R e s p o n s e           ///////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ( class_exists('wpdev_bk_personal'))
    $wpbc_p = new wpdev_bk_personal(); 
else 
    die('Booking Calendar. Error code: 100001');;    

if ( ( defined('WP_BK_RESPONSE_IPN_MODE' ) )  && ( WP_BK_RESPONSE_IPN_MODE ) ) {
    
    
} else {

    wpdev_bk_update_pay_status();
    die ;
}