<?php
/**
 * @version 1.0
 * @package  iPay88 Response
 * @category Payment Gateway for Booking Calendar 
 * @author wpdevelop
 *
 * @web-site https://wpbookingcalendar.com/
 * @email info@wpbookingcalendar.com 
 * 
 * @modified 2016-07-28
 */

error_reporting(E_ALL ^ E_NOTICE);
$_GET['wpdev_bkpaypal_ipn'] = 1;                                                // This parmeter  we need for the wpbc-response.php file. Its the same as with  PayPal IPN.

define('WP_BK_RESPONSE_IPN_MODE', true );                                       // This parmeter  we need for the wpbc-response.php file. Its the same as with  PayPal IPN.
// Load the main libraries
require_once( dirname(__FILE__) . '/../../../inc/gateways/wpbc-response.php' );

//FixIn: 8.6.1.3

// Checking response from  payment system
function wpbc_check_response_status__ipay88_for_backendpost( $status, $booking_id, $wp_nonce) {

	/**
		HTTPS POST response from iPay88 OPSG after performing payment
		Field Name      Type Size M/O       Description

		MerchantCode    String 20 M         The Merchant Code provided by iPay88 and use to uniquely identify the Merchant.
		PaymentId       Integer M		    Refer to Appendix I.pdf file for MYR gateway. Refer to Appendix II.pdf file for Multi-curency gateway.
		RefNo           String 30 M         Unique merchant transaction number / Order	ID
		Amount          Currency M		    Payment amount with two decimals and thousand symbols.  Example: 1,278.99
		Currency        String 5 M          Refer to Appendix I.pdf file for MYR gateway. Refer to Appendix II.pdf file for Multi-curency gateway.
		Remark          String 100 O        Merchant remarks
		TransId         String 30 O         iPay88 OPSG Transaction ID
		AuthCode        String 20 O         Bank’s approval code
		Status          String 1 M		    Payment status: 	“1” – Success		“0” – Fail
		ErrDesc         String 100 O        Payment status description (Refer to Appendix I.pdf or Appendix II.pdf)
		Signature       String 100 M        SHA-256 signature (refer to 3.2)
		CCName          String 200 O        Applicable for credit card payment only. Credit	card holder name
		CCNo            String 16 O         Applicable for credit card payment only. Masked credit card number. First six and last	four of credit card number. Eg:	492159xxxxxx4941
		S_bankname      String 100 O        Applicable for credit card payment only. Credit	card issuing bank name
		S_country       String 100 O        Applicable for credit card payment only. Credit	card issuing country

	    ////////////////////////////////////

		$merchantcode = $_REQUEST["MerchantCode"];
		$paymentid    = $_REQUEST["PaymentId"];
		$refno        = $_REQUEST["RefNo"];
		$amount       = $_REQUEST["Amount"];
		$ecurrency    = $_REQUEST["Currency"];
		$remark       = $_REQUEST["Remark"];
		$transid      = $_REQUEST["TransId"];
		$authcode     = $_REQUEST["AuthCode"];
		$estatus      = $_REQUEST["Status"];
		$errdesc      = $_REQUEST["ErrDesc"];
		$signature    = $_REQUEST["Signature"];
		$ccname       = $_REQUEST["CCName"];
		$ccno         = $_REQUEST["CCNo"];
		$s_bankname   = $_REQUEST["S_bankname"];
		$s_country    = $_REQUEST["S_country"];
	 */

    if ( ( isset($_REQUEST['Status']) )&& ($_REQUEST['Status'] == 1 ) ){


        $MerchantCode = $_REQUEST['MerchantCode'];
        $RefNo = $_REQUEST['RefNo'];
        // Amount  Currency- Payment amount with two decimals and thousand symbols.  Example: 1,278.99 
        // Check  iPay88 Technical Spec v.1.6.1 on page #9
        $Amount = $_REQUEST['Amount'];

        $status = '';

        // Check the REFERER site
        if ($status == '')
            if(isset($_SERVER['HTTP_REFERER'])) {
                $pos1 = strpos($_SERVER['HTTP_REFERER'], 'https://payment.ipay88.com.my');
                $pos2 = strpos($_SERVER['HTTP_REFERER'], 'http://payment.ipay88.com.my/');

                if (( $pos1 === false) && ($pos2 === false)) {
//                    debuge( 'Respond not from correct payment site !' );
                    die('Respond not from correct payment site !');
                    $status = 'ipay88:Failed';
                }
            }
        // Requery
        if ($status == '') {
            $result = iPay88_Requery($MerchantCode, $RefNo, $Amount);
            if ( $result === '00') {
                $iPayStatusMessage = __('Successful payment' ,'booking');
            } else {
                if ( $result == 'Invalid parameters') $iPayStatusMessage = __(' Parameters are incorrect,' ,'booking');
                else if ( $result == 'Record not found') $iPayStatusMessage = __('Cannot find the record' ,'booking');
                else if ( $result == 'Incorrect amount') $iPayStatusMessage = __('Amount different' ,'booking');
                else if ( ($result == 'Payment fail') || ($result =='Payment failed') )$iPayStatusMessage = __('Payment failed' ,'booking');
                else if ( $result == 'M88Admin') $iPayStatusMessage = __('Payment status updated by Mobile88 Admin(Fail)' ,'booking');
                else if ( $result == 'Connection Error') $iPayStatusMessage = __('Connection Error' ,'booking');

                $status = 'ipay88:Failed';
//                debuge($_REQUEST['ErrDesc'], $iPayStatusMessage );
                die($result);                
            }
        }

//        if(0){ //Disabled check
//            // Check payment ammount
//            if ($status == '')
//                if ($slct_sql_results[0]->cost != $Amount ) {
////                    debuge( 'Payment amount is different from original !' );
//                    die('Payment amount is different from original !');
//                    $status = 'ipay88:Failed';
//                }
//        }
        // Check signature
        if ($status == '') {

            $summ_sing = str_replace('.', '', $Amount /*$slct_sql_results[0]->cost*/);
            $summ_sing = str_replace(',', '', $summ_sing );
            $ipay88_merchant_code = get_bk_option( 'booking_ipay88_merchant_code' );
            $ipay88_merchant_key = get_bk_option( 'booking_ipay88_merchant_key' );
            // $signature = $ipay88_merchant_key . $ipay88_merchant_code . $_REQUEST['RefNo'] . $summ_sing .  $_REQUEST['Currency'] ;
            $signature = $ipay88_merchant_key . $ipay88_merchant_code . $_REQUEST['PaymentId']. $_REQUEST['RefNo'] . $summ_sing .  $_REQUEST['Currency'] . $_REQUEST['Status'];

            $signature = iPay88_signature($signature);

            if ($_REQUEST["Signature"] != $signature ) {
//                debuge( 'Signature is different from original !' );
                die('Signature is different from original !');
                $status = 'ipay88:Failed';
            }
        }

        if ($status == '') $status = 'ipay88:OK';

    } else {
        $status = 'ipay88:Failed';
//        if ( isset($_REQUEST['ErrDesc']) )
//            debuge($_REQUEST['ErrDesc']);

        //debuge($booking_id, $status);die;
        /* // Parameters in Respond
        [payed_booking] => 44
        [wp_nonce] => 30068
        [pay_sys] => ipay88
        [stats] => OK
        [MerchantCode] => 1111111
        [PaymentId] => 0
        [RefNo] => A044
        [Amount] => 240
        [Currency] => PHP
        [Remark] =>
        [TransId] => T0203282500
        [AuthCode] =>
        [Status] => 0
        [ErrDesc] => Invalid parameters(Currency Not Supported By Merchant Account)
        [Signature] =>
        /**/
    }

    return $status;

}


function wpbc_ipay88_backend_update_pay_status(){

    global $wpdb;
    $status = '';  $booking_id = '';  $pay_system = ''; $wp_nonce = '';

    if (isset($_GET['payed_booking']))  $booking_id = intval( $_GET['payed_booking'] );
    if (isset($_GET['stats']))          $status = $_GET['stats'];
    if (isset($_GET['pay_sys']))        $pay_system = $_GET['pay_sys'];
    if (isset($_GET['wp_nonce']))       $wp_nonce   = $_GET['wp_nonce'];
    
    if ($pay_system != 'ipay88') 
        die();
    
    $status = wpbc_check_response_status__ipay88_for_backendpost( $status, $booking_id, $wp_nonce );

    if ( ($booking_id =='') || ($status =='')  || ($wp_nonce =='') ) die() ;

    $update_sql = "UPDATE {$wpdb->prefix}booking AS bk SET bk.pay_status='$status' WHERE bk.booking_id=$booking_id;";
    if ( false === $wpdb->query( $update_sql  ) ){
        $status = 'Failed';  
    }
    
    $auto_approve = get_bk_option( 'booking_ipay88_is_auto_approve_cancell_booking'  );

    if ( ($status == 'OK') || ($status == 'ipay88:OK') ) {
        if ($auto_approve == 'On')                 
            wpbc_auto_approve_booking( $booking_id );
        

    } else {
        if ($auto_approve == 'On')                 
            wpbc_auto_cancel_booking( $booking_id );
        
    }

	/**
		On the ‘backend_response.php’ page you need to write out the word ‘RECEIVEOK’ only (without quote)
		as an acknowledgement once the backend page success get the payment status from iPay88 OPSG and update status to success on merchant system.

		Ensure just the word ‘RECEIVEOK’ only on the backend page and without any HTML tag on the page.
		iPay88 OPSG will re-try send the payment status to the ‘backend_response.php’ page up to 3 times on different interval if no ‘RECEIVEOK’ acknowledgement detected.
	 */

    echo "RECEIVEOK";    
}

wpbc_ipay88_backend_update_pay_status();