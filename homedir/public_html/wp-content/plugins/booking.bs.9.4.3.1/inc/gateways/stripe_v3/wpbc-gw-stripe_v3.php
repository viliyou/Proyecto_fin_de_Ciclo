<?php
/**
 * @package  Stripe Checkout Server  Integration
 * @category Payment Gateway for Booking Calendar 
 * @author wpdevelop
 * @version 2.0
 * @web-site https://wpbookingcalendar.com/
 * @email info@wpbookingcalendar.com 
 * 
 * @modified 2019-04-24
 *
 * Integration based on Stripe PHP library 6.33.0 2019-04-24
 * Based on guide: https://stripe.com/docs/payments/checkout/server#integrate	-- "Checkout Server Quickstart" - 2019-04-24
 *
 * Integration updated because of: "On 14 September 2019, a new European regulatory requirement called Strong Customer Authentication (SCA)"
 * Migrate to "Strong Customer Authentication"          - https://stripe.com/docs/strong-customer-authentication
 *
 * Stripe library: https://github.com/stripe/stripe-php/releases
 *
 * Integration based on Stripe PHP library 9.0.0 2022-08-10
 * 2022-08-10  Update configuration  relative to this:  https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items
 */

//FixIn: 8.4.7.20

/**
 * Testing. Use test card number: 4242 4242 4242 4242,
 * 			any future month and year for the expiration,
 * 			any three-digit number for the CVC, and any random ZIP code.
 *
   $stripe_v3 = array(
					  "publishable_key" => "pk_test_6pRNASCoBOKtIshFeQd4XMUh"		// booking_stripe_v3_stripe_v3_public_test_key = pk_test_6pRNASCoBOKtIshFeQd4XMUh
					  "secret_key"      => "sk_test_BQokikJOvBiI2HlWgH4olfQ2",		// booking_stripe_v3_stripe_v3_secret_test_key = sk_test_BQokikJOvBiI2HlWgH4olfQ2
				);
 */


if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit if accessed directly
                                                                                
if ( ! defined( 'WPBC_STRIPE_V3_GATEWAY_ID' ) )        define( 'WPBC_STRIPE_V3_GATEWAY_ID', 'stripe_v3' );


//                                                                              <editor-fold   defaultstate="collapsed"   desc=" Gateway API " >

/** API  for  Payment Gateway  */
class WPBC_Gateway_API_STRIPE_V3 extends WPBC_Gateway_API  {

	/**
	 * Get payment Form
	 * @param string $output    - other active payment forms
	 * @param array $params     - input params                          array (
																				[id] => 514
																				[days_input_format] => 24.05.2019
																				[days_only_sql] => 2019-05-24
																				[dates_sql] => 2019-05-24 00:00:00
																				[check_in_date_sql] => 2019-05-24 00:00:00
																				[check_out_date_sql] => 2019-05-24 00:00:00
																				[dates] => 05/24/2019
																				[check_in_date] => 05/24/2019
																				[check_out_date] => 05/24/2019
																				[check_out_plus1day] => 05/25/2019
																				[dates_count] => 1
																				[days_count] => 1
																				[nights_count] => 1
																				[check_in_date_hint] => 05/24/2019
																				[check_out_date_hint] => 05/24/2019
																				[start_time_hint] => 00:00
																				[end_time_hint] => 00:00
																				[selected_dates_hint] => 05/24/2019
																				[selected_timedates_hint] => 05/24/2019
																				[selected_short_dates_hint] => 05/24/2019
																				[selected_short_timedates_hint] => 05/24/2019
																				[days_number_hint] => 1
																				[nights_number_hint] => 1
																				[siteurl] => http://beta
																				[resource_title] => Apartment#2
																				[bookingtype] => Apartment#2
																				[remote_ip] => 127.0.0.1
																				[user_agent] => Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0
																				[request_url] => http://beta/resource-id3/
																				[current_date] => 04/24/2019
																				[current_time] => 10:19
																				[cost_hint] => CURRENCY_SYMBOL140.00
																				[name] => John
																				[secondname] => Smith
																				[email] => user@beta.com
																				[phone] => test
																				[visitors] => 1
																				[children] => 0
																				[details] => test
																				[term_and_condition] => I Accept term and conditions
																				[booking_resource_id] => 3
																				[resource_id] => 3
																				[type_id] => 3
																				[type] => 3
																				[resource] => 3
																				[content] =>
																								First Name:John
																								Last Name:Smith
																								Email:user@beta.com
																								Phone:test
																								Adults: 1
																								Details:
																								 test
																				[moderatelink] => http://beta/wp-admin/admin.php?page=wpbc&view_mode=vm_listing&tab=actions&wh_booking_id=514
																				[visitorbookingediturl] => http://beta/edit/?booking_hash=d4e19e315f8ed7903e38d1c8b2210356
																				[visitorbookingslisting] => http://beta/list-customer-bookings/?booking_hash=d4e19e315f8ed7903e38d1c8b2210356
																				[visitorbookingcancelurl] => http://beta/edit/?booking_hash=d4e19e315f8ed7903e38d1c8b2210356&booking_cancel=1
																				[visitorbookingpayurl] => http://beta/edit/?booking_hash=d4e19e315f8ed7903e38d1c8b2210356&booking_pay=1
																				[bookinghash] => d4e19e315f8ed7903e38d1c8b2210356
																				[db_cost] => 140.00
																				[db_cost_hint] => CURRENCY_SYMBOL140.00
																				[modification_date] =>  2019-04-24 10:19:23
																				[modification_year] => 2019
																				[modification_month] => 04
																				[modification_day] => 24
																				[modification_hour] => 10
																				[modification_minutes] => 19
																				[modification_seconds] => 23
																				[__form] => text^selected_short_timedates_hint3^05/24/2019~text^nights_number_hint3^1~text^cost_hint3^CURRENCY_SYMBOL140.00~text^name3^John~text^secondname3^Smith~email^email3^user@beta.com~text^phone3^test~select-one^visitors3^1~select-one^children3^0~textarea^details3^test~checkbox^term_and_condition3[]^I Accept term and conditions
																				[__nonce] => 155609396391.65
																				[__payment_type] => payment_form
																				[__is_deposit] =>
																				[__additional_calendars] => Array ()
																				[__booking_form_type] => standard
																				[additional_description] =>
																				[payment_cost] => 140.00
																				[payment_cost_hint] => CURRENCY_SYMBOL140.00
																				[calc_total_cost] => 140.00
																				[calc_cost_hint] => CURRENCY_SYMBOL140.00
																				[calc_total_cost_hint] => CURRENCY_SYMBOL140.00
																				[calc_deposit_cost] => 140.00
																				[calc_deposit_hint] => CURRENCY_SYMBOL140.00
																				[calc_deposit_cost_hint] => CURRENCY_SYMBOL140.00
																				[calc_balance_cost] => 0.00
																				[calc_balance_hint] => CURRENCY_SYMBOL0.00
																				[calc_balance_cost_hint] => CURRENCY_SYMBOL0.00
																				[calc_original_cost] => 100.00
																				[calc_original_cost_hint] => CURRENCY_SYMBOL100.00
																				[calc_additional_cost] => 40.00
																				[calc_additional_cost_hint] => CURRENCY_SYMBOL40.00
																				[calc_coupon_discount] => 0.00
																				[calc_coupon_discount_hint] => CURRENCY_SYMBOL0.00
																				[payment_form_target] =>
																				[cost_in_gateway] => 140.00
																				[cost_in_gateway_hint] => CURRENCY_SYMBOL140.00
																				[is_deposit] =>
																				[gateway_hint] => Total
																			)
	 * @return string        - you must  return  in format: return $output . $your_payment_form_content
	 */
	public function get_payment_form( $output, $params, $gateway_id = '' ) {

		// Check  if currently  is showing this Gateway
		if (
				   (  ( ! empty( $gateway_id ) ) && ( $gateway_id !== $this->get_id() )  )      // Does we need to show this Gateway
				|| ( ! $this->is_gateway_on() )                                                 // Payment Gateway does NOT active
		) return $output ;


		////////////////////////////////////////////////////////////////////////
		// Payment Options
		////////////////////////////////////////////////////////////////////////
		$payment_options                         = array();
		$payment_options['subject']              = get_bk_option( 'booking_stripe_v3_subject' );                        	// 'Payment for booking %s on these day(s): %s'
		$payment_options['subject']              = apply_bk_filter( 'wpdev_check_for_active_language', $payment_options['subject'] );
		$payment_options['subject']              = wpbc_replace_booking_shortcodes( $payment_options['subject'], $params );
		$payment_options['subject'] = substr( $payment_options['subject'], 0, 499 );    								 //FixIn: 8.4.7.10

		$payment_options['payment_methods'] = get_bk_option( 'booking_stripe_v3_payment_methods' );						//FixIn: 8.8.1.12


		$payment_options['payment_button_title'] = get_bk_option( 'booking_stripe_v3_payment_button_title' );            	// 'Pay via Stripe'
		$payment_options['payment_button_title'] = apply_bk_filter( 'wpdev_check_for_active_language', $payment_options['payment_button_title'] );
		$payment_options['account_mode'] 		 = get_bk_option( 'booking_stripe_v3_account_mode' );                            					// 'TEST'
		if ( 'test' == $payment_options['account_mode'] ) {
			$payment_options['publishable_key']  = get_bk_option( 'booking_stripe_v3_publishable_key_test' );              // 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
			// $payment_options['secret_key']       = get_bk_option( 'booking_stripe_v3_secret_key_test' );                // 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
		} else {
			$payment_options['publishable_key']  = get_bk_option( 'booking_stripe_v3_publishable_key' );                   // 'pk_test_6pRNASCoBOKtIshFeQd4XMUh'
			// $payment_options['secret_key']       = get_bk_option( 'booking_stripe_v3_secret_key' );                     // 'sk_test_BQokikJOvBiI2HlWgH4olfQ2'
		}
		$payment_options['curency'] 			 = get_bk_option( 'booking_stripe_v3_curency' );                        	// 'USD'


		////////////////////////////////////////////////////////////////////////
		// Check about not correct configuration  of settings:
		////////////////////////////////////////////////////////////////////////
		if ( empty( $payment_options[ 'curency' ] ) )          return 'Wrong configuration in gateway settings.' . ' <em>Empty: "Currency" option</em>';
		if ( empty( $payment_options[ 'publishable_key' ] ) )  return 'Wrong configuration in gateway settings.' . ' <em>Empty: "Publishable Key" option</em>';
		// if ( empty( $payment_options[ 'secret_key' ] ) )       return 'Wrong configuration in gateway settings.' . ' <em>Empty: "Secret Key" option</em>';

		//FixIn: 8.4.7.20
		if ( version_compare( PHP_VERSION, '5.4' ) < 0 ) {
			return 'Stripe (v.3) payment require PHP version 5.4 or newer!';
		}

		if ( ! class_exists( 'Stripe\Stripe' ) ) {
			//require_once( dirname( __FILE__ ) . '/stripe-php-master/init.php' );
			//require_once( dirname( __FILE__ ) . '/stripe-php-7.46.1/init.php' );    	//FixIn: 8.7.9.2
			require_once( dirname( __FILE__ ) . '/stripe-php-9.0.0/init.php' );    		//FixIn: 9.2.3.7		// 2022-08-10
		}


		// Get Secret key
		$stripe_v3_account_mode = get_bk_option( 'booking_stripe_v3_account_mode' );
		if ( 'test' == $stripe_v3_account_mode ) {
			$payment_options[ 'secret_key' ] = get_bk_option( 'booking_stripe_v3_secret_key_test' );
		} else {
			$payment_options[ 'secret_key' ] = get_bk_option( 'booking_stripe_v3_secret_key' );
		}
		// Check whether secret key was assigned,  Otherwise -- ERROR
		if ( empty( $payment_options[ 'secret_key' ] ) )        return 'Wrong configuration in gateway settings.' . ' <em>Empty: "Secret key" option</em>';

		$edit_url_for_visitors = get_bk_option( 'booking_url_bookings_edit_by_visitors' );
		// Edit URL was NOT configured
		if ( site_url() == $edit_url_for_visitors ) 			return 'Stripe require correct configuration ' . ' <em>"URL to edit bookings" option</em>';

		// Success & Failed URLs
		/*
		$payment_options['success_url'] = get_bk_option( 'booking_stripe_v3_order_successful' );
		if ( empty( $payment_options['success_url'] ) ) {
			$payment_options['success_url'] = get_bk_option( 'booking_thank_you_page_URL' );
		}
		$payment_options['error_url']   = get_bk_option( 'booking_stripe_v3_order_failed' );
		$edit_url_for_visitors          = get_bk_option( 'booking_url_bookings_edit_by_visitors' );

		// Something was set for Edit Booking URL
		if ( site_url() != $edit_url_for_visitors ) {
			$payment_options['success_url'] = $edit_url_for_visitors;
			$payment_options['error_url']   = $edit_url_for_visitors;
		}
		$payment_options['error_url']   = wpbc_make_link_absolute( $payment_options['error_url'] );
		$payment_options['success_url'] = wpbc_make_link_absolute( $payment_options['success_url'] );

		$payment_options['success_url'] .= ( false === strpos( $payment_options['success_url'], '?' ) ) ? '?' : '&';
		$payment_options['success_url'] .=
										  'booking_hash' . '=' . $params['bookinghash']
										. '&' . 'action' . '=' . 'approve'
										. '&' . 'source' . '=' . WPBC_STRIPE_V3_GATEWAY_ID
										. '&' . 'status' . '=' . 'OK'
										. '&' . 'nonce' . '=' .  $params['__nonce'];		// 'pay_status' in DB, like this 	155609396391.65
		*/

		$hash_approve = wpbc_get_secret_hash( array(
											'payment', WPBC_STRIPE_V3_GATEWAY_ID,
											$params['bookinghash'], 'approve'
		) );
		$payment_options['success_url'] = wpbc_get_1way_hash_url( $hash_approve );

		$hash_decline = wpbc_get_secret_hash( array(
											'payment', WPBC_STRIPE_V3_GATEWAY_ID,
											$params['bookinghash'], 'decline'
		) );
		$payment_options['error_url'] = wpbc_get_1way_hash_url( $hash_approve );


				////////////////////////////////////////////////////////////////////////
				// Cost and Currency
				////////////////////////////////////////////////////////////////////////

				/**
				 * Zero-decimal currencies - check  more here https://stripe.com/docs/currencies#zero-decimal
				 *  Its can  generate this issue: ... ?error=Invalid%20parameters%20were%20supplied%20to%20Stripe%27s%20API
				 */

				/**
				 * Zero-decimal currencies: BIF, MGA, CLP, DJF, PYG, RWF, GNF, UGX, JPY, KMF, KRW, VND, VUV, XAF, XOF, XPF
				 * Add support of Zero-decimal currencies in  Stripe payment system
				 */
				$check_currency = strtolower( $payment_options['curency'] );  //FixIn: 8.2.1.16
				if ( in_array(  $check_currency , array( 'bif', 'mga', 'clp', 'djf', 'pyg', 'rwf', 'gnf', 'ugx', 'jpy', 'kmf', 'krw', 'vnd', 'vuv', 'xaf', 'xof', 'xpf' ) ) ) {
					$is_cents = 1;
				} else {
					$is_cents = 100;
				}

				/**
				 * Minimum and maximum charge amounts - https://stripe.com/docs/currencies#minimum-and-maximum-charge-amounts

					USD 	$0.50
					AUD 	$0.50
					BRL 	R$0.50
					CAD 	$0.50
					CHF 	0.50 Fr
					DKK 	2.50-kr.
					EUR 	€0.50
					GBP 	£0.30
					HKD 	$4.00
					JPY 	¥50
					MXN 	$10
					NOK 	3.00-kr.
					NZD 	$0.50
					SEK 	3.00-kr.
					SGD 	$0.50
				 */

				$currency_minimum = array(
					  'usd' =>  0.50
					, 'aud' => 	0.50
					, 'brl' => 	0.50
					, 'cad' => 	0.50
					, 'chf' => 	0.50
					, 'dkk' => 	2.50
					, 'eur' => 	0.50
					, 'gbp' => 	0.30
					, 'hkd' => 	4.00
					, 'jpy' => 	50
					, 'mxn' => 	10
					, 'nok' => 	3.00
					, 'nzd' => 	0.50
					, 'sek' => 	3.00
					, 'sgd' => 	0.50
				);
				foreach ( $currency_minimum as $min_currency => $min_currency_value ) {

					if ( (  $min_currency == $check_currency ) && ( floatval( $params['cost_in_gateway'] ) * $is_cents < floatval( $min_currency_value ) * $is_cents ) ) {
						return '<strong>' . __('Error' ,'booking') . '</strong>! '
							   . 'Stripe require minimum amount in this currency as ' . '<strong>' . strtoupper( $min_currency ) . '</strong> '
							   . '<strong>' . $min_currency_value . '</strong>';
					}
				}

		////////////////////////////////////////////////////////////////////////
		// Step 1. Back-End: Create a Checkout Session on your server		    - https://stripe.com/docs/payments/checkout/server#integrate
		////////////////////////////////////////////////////////////////////////
		\Stripe\Stripe::setApiKey( $payment_options[ 'secret_key' ] );

		if ( empty( $payment_options['payment_methods'] ) || ( 'card' == $payment_options['payment_methods'] ) ) {		//FixIn: 8.8.1.12
			$payment_options['payment_methods'] = array( 'card' );
		}
		// Check more here https://stripe.com/docs/api/checkout/sessions/create
		$stripe_session_params = [
			  'success_url'          => esc_url_raw( $payment_options['success_url'] )
			, 'cancel_url'           => esc_url_raw( $payment_options['error_url'] )
			//, 'payment_method_types' => [ 'card' ]
			, 'mode' => 'payment'
			, 'payment_method_types' => $payment_options['payment_methods']
//[
//											  'card'
//											, 'alipay'
// Available only, if activated 'EUR' currency:
//											, 'ideal'																	// `ideal` only supports the following currencies: `eur`.
//											, 'bancontact'																// `bancontact` only supports the following currencies: `eur`.
//											, 'giropay'																	// `giropay` only supports the following currencies: `eur`
//											, 'p24'																		// `p24` only supports the following currencies: `eur`, `pln`
//											, 'eps'																		// `eps` only supports the following currencies: `eur`
//											, 'sofort'																	// `sofort` only supports the following currencies: `eur`		// sofort.country required: AT, BE, DE, ES, IT, NL
//											, 'sepa_debit'																// `sepa_debit` only supports the following currencies: `eur`

// Please ensure the provided type is activated in your Stripe dashboard (https://dashboard.stripe.com/account/payments/settings)
// and your account is enabled for any preview features that you are trying to use.
//											, 'grabpay'
//											, 'fpx'
//											, 'bacs_debit'

// These payment  methods generate this Error: Caught exception: Invalid payment_method_types[2]: must be one of alipay, card, ideal, fpx, bacs_debit, bancontact, giropay, p24, eps, sofort, sepa_debit, or grabpay
											//, 'au_becs_debit'
											//, 'interac_present'
											// , 'oxxo'
//										]
			, 'client_reference_id'  => $params['bookinghash'] 	// A unique string to reference the Checkout Session. This can be a customer ID, a cart ID, or similar, and can be used to reconcile the session with your internal systems.
			, 'line_items'           => []
			//, 'locale' => 'auto' 								// Optional auto, da, de, en, es, fi, fr, it, ja, nb, nl, pl, pt, sv, or zh
			//, 'payment_intent_data' => [		    			// Optional
			//		  'application_fee_amount' =>  '' 			// Optional  - The amount of the application fee (if any) that will be applied to the payment and transferred to the application owner’s Stripe account. To use an application fee, the request must be made on behalf of another account, using the Stripe-Account header or an OAuth key. For more information, see the PaymentIntents Connect usage guide.
			//      , 'capture_method optional' => '' 			// Optional  - Capture method of this PaymentIntent, one of automatic or manual.
			//      , 'on_behalf_of optional' => '' 			// Optional  - The Stripe account ID for which these funds are intended. For details, see the PaymentIntents Connect usage guide.
			//      , 'receipt_email optional' => '' 			// Optional  - Email address that the receipt for the resulting payment will be sent to.
			//      , 'statement_descriptor optional' => '' 	// Optional  - Extra information about the payment. This will appear on your customer’s statement when this payment succeeds in creating a charge.
			//     ]

			//, 'payment_intent_data' => [ 'capture_method' => 'automatic' ]
			//FixIn: 8.6.1.20
			, 'payment_intent_data' => [
											  'description' => 'Booking #' . $params['booking_id'] . '. ' . substr( $payment_options['subject'], 0, 255 )
											, 'metadata' => [
																'booking_id' => $params[ 'booking_id' ]
					                                          , 'booking_description' => substr( $payment_options['subject'], 0, 255 )
															]
			                           ]
		];

		if (   in_array( 'bacs_debit' ,$payment_options['payment_methods'] ) ) {                                        //FixIn: 9.2.4.4
			$stripe_session_params['payment_intent_data']['setup_future_usage'] = 'off_session';
		}

		if ( ! empty( $params['email'] ) ) {
			$stripe_session_params['customer_email'] = $params['email'];
		}

		// Booking Item for payment
		/**
		 *  $stripe_item=[
						  		  'amount'   => floatval( $params['cost_in_gateway'] ) * $is_cents
								, 'currency' => $payment_options['curency']
								, 'name'     => 'Booking #' . $params[ 'booking_id' ] //substr( $payment_options['subject'], 0, 255 )
								, 'quantity' => 1
								, 'description' => substr( $payment_options[ 'subject' ], 0, 255),		// Optional
							 // , 'images'      => [ 'https://www.example.com/t-shirt.png' ],			// Optional
					 ];
		$stripe_session_params['line_items'][] = $stripe_item;
		*/

		// Since 2022-08-09 new documentation for creation product here
		// https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-line_items

		$stripe_item = [];
		$stripe_item['quantity'] = 1;
		$stripe_item['price_data'] = [];
		$stripe_item['price_data']['currency'] = $payment_options['curency'];
		$stripe_item['price_data']['unit_amount'] = intval( floatval( $params['cost_in_gateway'] ) * $is_cents );       //FixIn: 9.2.4.3
		$stripe_item['price_data']['product_data'] = [];
		$stripe_item['price_data']['product_data']['name'] = 'Booking #' . $params[ 'booking_id' ] ; //substr( $payment_options['subject'], 0, 255 )
		$stripe_item['price_data']['product_data']['description'] = substr( $payment_options[ 'subject' ], 0, 255);		// Optional

		$stripe_session_params['line_items'][] = $stripe_item;

		try {
			$session_response = \Stripe\Checkout\Session::create( $stripe_session_params );
		} catch ( Exception $e ) {
			return 'Caught exception: ' . $e->getMessage();
		}

		/**
		 $response =Stripe\Checkout\Session Object
													(
														[id] => cs_HuqhXJqsCt7FAWvEQSp0QmoY2E92hBXfep6ZKb7vksVCGwyOiz6PfCqJatm96
														[object] => checkout.session
														[billing_address_collection] =>
														[cancel_url] => http://beta/failed_v3
														[client_reference_id] =>
														[customer] =>
														[customer_email] =>
														[display_items] => Array
															(
																[0] => Stripe\StripeObject Object
																	(
																		[amount] => 500
																		[currency] => usd
																		[custom] => Stripe\StripeObject Object
																			( [description] => Comfortable cotton t-shirt
																			  [images] => Array ( [0] => https://www.example.com/t-shirt.png )
																			  [name] => T-shirt
																			)
																		[quantity] => 1
																		[type] => custom
																	)
															)
														[livemode] =>
														[locale] =>
														[payment_intent] => pi_1ESg8w2eZvKYlo2C1ruFs71t
														[payment_method_types] => Array ( [0] => card )
														[subscription] =>
														[success_url] => http://beta/successful_v3
													)
	 	*/


		////////////////////////////////////////////////////////////////////////
		// Step 2. Front-End: Add Checkout to your website 					    - https://stripe.com/docs/payments/checkout/server#add
		////////////////////////////////////////////////////////////////////////

		ob_start();

		?><div style="width:100%;clear:both;margin-top:20px;"></div><?php
		?><div class="stripe_v3_div wpbc-replace-ajax wpbc-payment-form" style="text-align:left;clear:both;"><?php

		/**
		 * Please note! ajax_script will be replaced to script after form will show in page.
		 * If we will use script directly  here, so then error at  the page will appear and its will not work
		 */

		?><div style="display:none;"><?php	//FixIn: 8.5.1.2
		?><ajax_script src="https://js.stripe.com/v3/"></ajax_script><?php

		// Closures function. Internal variables: stripe_publish_key, stripe_session are private.

		/**
		   Important !!! Do  not use in this script,  comments like  "// Some comment",  instead of that  use comments like "/ *  some comment * /"
		   Its because, during payment request,  all  this script become script in one ROW,  and all  JavaScript after // become commented !!!
			//FixIn: 8.5.1.2
		*/

		$is_immediate_redirection = false;

		if ( ! $is_immediate_redirection ) {

			?>
			<ajax_script>
				var wpbc_stripe_payment = (function(){
					var stripe_publish_key = "<?php echo $payment_options['publishable_key']; ?>";
					var stripe_session = "<?php 	echo $session_response->id; ?>";

					return function stripe_check_out(){
						var stripe = Stripe( stripe_publish_key );

						stripe.redirectToCheckout({
						  sessionId: stripe_session
						}).then(function (result) {
						  /* If `redirectToCheckout` fails due to a browser or network error, display the localized error message to your customer using `result.error.message`.*/
						});
					}
				})();
			</ajax_script>
			<?php
			?></div><?php						//FixIn: 8.5.1.2

			echo "<strong>" . $params['gateway_hint'] . ': ' . $params['cost_in_gateway_hint'] . "</strong><br />";

			?><a class="btn" href="javascript:void(0)" onclick="javascript:wpbc_stripe_payment();"><?php echo trim( $payment_options['payment_button_title'] ); ?></a><?php

		} else {	// Activate immediate redirection

			?><ajax_script>
				setTimeout(function() {
					var stripe = Stripe('<?php echo $payment_options['publishable_key']; ?>');
					stripe.redirectToCheckout({
					  sessionId: '<?php echo $session_response->id; ?>'
					}).then(function (result) {
					  /* If `redirectToCheckout` fails due to a browser or network error, display the localized error message to your customer using `result.error.message`.*/
					});
				}, 1500);
			</ajax_script><?php
		}
		?></div><?php

		$payment_form = ob_get_clean();

		return $output . $payment_form;
	}


	/** Define settings Fields  */
	public function init_settings_fields() {

		$this->fields = array();

		// On | Off
		$this->fields['is_active'] = array(
									  'type'        => 'checkbox'
									, 'default'     => 'On'
									, 'title'       => __( 'Enable / Disable', 'booking' )
									, 'label'       => __( 'Enable this payment gateway', 'booking')
									, 'description' => ''
									, 'group'       => 'general'

								);

		// Switcher accounts - Test | Live
		$this->fields['account_mode'] = array(
									  'type' 		=> 'radio'
									, 'default' 	=> 'test'
									, 'title' 		=> __( 'Chose payment account', 'booking' )
									, 'description' => ''//__( 'Select TEST for the Test Server and LIVE in the live environment', 'booking' )
									, 'description_tag' => 'span'
									, 'css' 		=> ''
									, 'options' => array(
											 'test' => array( 'title' => __( 'TEST', 'booking' ), 'attr' => array( 'id' => 'stripe_v3_mode_test' ) )
											,'live' => array( 'title' => __( 'LIVE', 'booking' ), 'attr' => array( 'id' => 'stripe_v3_mode_live' ) )
										)
									, 'group' 		=> 'general'
		);

		// Public Key
		$this->fields['publishable_key'] = array(
									  'type'        => 'text'
									, 'default'     => ( wpbc_is_this_demo() ? 'pk_test_6pRNASCoBOKtIshFeQd4XMUh' : '' )
									//, 'placeholder' => ''
									, 'title'       => __('Publishable key', 'booking')
									, 'description' => __('Required', 'booking') . '.<br/>'
													   . sprintf( __('This parameter have to assigned to you by %s' ,'booking'), 'Stripe' )
													   . ( ( wpbc_is_this_demo() ) ? wpbc_get_warning_text_in_demo_mode() : '' )
									, 'description_tag' => 'span'
									, 'css'         => ''//'width:100%'
									, 'group'       => 'general'
									, 'tr_class'    => 'wpbc_sub_settings_grayed wpbc_sub_settings_mode_live'
									//, 'validate_as' => array( 'required' )
							);
		// Secret Key
		$this->fields['secret_key'] = array(
									  'type'        => 'text'
									, 'default'     => ( wpbc_is_this_demo() ? 'sk_test_BQokikJOvBiI2HlWgH4olfQ2' : '' )
									//, 'placeholder' => ''
									, 'title'       => __('Secret key', 'booking')
									, 'description' => __('Required', 'booking') . '.<br/>'
													   . sprintf( __( 'This parameter have to assigned to you by %s' ,'booking'), 'Stripe' )
													   . ( ( wpbc_is_this_demo() ) ? wpbc_get_warning_text_in_demo_mode() : '' )
									, 'description_tag' => 'span'
									, 'css'         => ''//'width:100%'
									, 'group'       => 'general'
									, 'tr_class'    => 'wpbc_sub_settings_grayed wpbc_sub_settings_mode_live'
									//, 'validate_as' => array( 'required' )
							);


		  // Public Key
		$this->fields['publishable_key_test'] = array(
									  'type'        => 'text'
									, 'default'     => ( wpbc_is_this_demo() ? 'pk_test_6pRNASCoBOKtIshFeQd4XMUh' : '' )
									//, 'placeholder' => ''
									, 'title'       => __('Publishable key', 'booking') . ' (' . __( 'TEST', 'booking' ) . ')'
									, 'description' => __('Required', 'booking') . '.<br/>'
													   . sprintf( __('This parameter have to assigned to you by %s' ,'booking'), 'Stripe' )
													   . ( ( wpbc_is_this_demo() ) ? wpbc_get_warning_text_in_demo_mode() : '' )
									, 'description_tag' => 'span'
									, 'css'         => ''//'width:100%'
									, 'group'       => 'general'
									, 'tr_class'    => 'wpbc_sub_settings_grayed wpbc_sub_settings_mode_test'
									//, 'validate_as' => array( 'required' )
							);
		// Secret Key
		$this->fields['secret_key_test'] = array(
									  'type'        => 'text'
									, 'default'     => ( wpbc_is_this_demo() ? 'sk_test_BQokikJOvBiI2HlWgH4olfQ2' : '' )
									//, 'placeholder' => ''
									, 'title'       => __('Secret key', 'booking') . ' (' . __( 'TEST', 'booking' ) . ')'
									, 'description' => __('Required', 'booking') . '.<br/>'
													   . sprintf( __( 'This parameter have to assigned to you by %s' ,'booking'), 'Stripe' )
													   . ( ( wpbc_is_this_demo() ) ? wpbc_get_warning_text_in_demo_mode() : '' )
											. '<div class="wpbc-settings-notice notice-info" style="text-align:left;"><strong>'
												. __('Note:' ,'booking') . '</strong> '
												. 'Testing at front-end side. Use following <strong>test</strong> card number <strong>4242 4242 4242 4242</strong> (Visa),'
												. ' a valid expiration date in the future, and any random CVC number, to create a successful payment.'
												. '<br>If you need to create test card payments using cards for other than US billing country,'
												. ' use Stripe international test cards from <a href="https://stripe.com/docs/testing#cards" target="_blank">this page</a>.'
											. '</div>'
									, 'description_tag' => 'span'
									, 'css'         => ''//'width:100%'
									, 'group'       => 'general'
									, 'tr_class'    => 'wpbc_sub_settings_grayed wpbc_sub_settings_mode_test'
									//, 'validate_as' => array( 'required' )
							);
	// https://stripe.com/docs/testing#cards
	// Instead, use any of the following test card numbers, a valid expiration date in the future, and any random CVC number, to create a successful payment.
	//

		// Currency
		$currency_list = array(
								  'USD' => __( 'U.S. Dollars', 'booking' )
								, 'GBP' => __( 'Pounds Sterling', 'booking' )
								, 'EUR' => __( 'Euros', 'booking' )
								, 'CAD' => __( 'Canadian Dollars', 'booking' )

								, 'AED' =>  'United Arab Emirates dirham',
								'AFN' =>  'Afghan afghani' . '*',
								'ALL' =>  'Albanian lek',
								'AMD' =>  'Armenian dram',
								'ANG' =>  'Netherlands Antillean guilder',
								'AOA' =>  'Angolan kwanza' . '*',
								'ARS' =>  'Argentine peso' . '*',
								'AUD' =>  'Australian dollar',
								'AWG' =>  'Aruban florin',
								'AZN' =>  'Azerbaijani manat',
								'BAM' =>  'Bosnia and Herzegovina convertible mark',
								'BBD' =>  'Barbadian dollar',
								'BDT' =>  'Bangladeshi taka',
								'BGN' =>  'Bulgarian lev',
								'BIF' =>  'Burundian franc',
								'BMD' =>  'Bermudian dollar',
								'BND' =>  'Brunei dollar',
								'BOB' =>  'Bolivian boliviano' . '*',
								'BRL' =>  'Brazilian real' . '*',
								'BSD' =>  'Bahamian dollar',
								'BWP' =>  'Botswana pula',
								'BZD' =>  'Belize dollar',
								// 'CAD' =>  'Canadian dollar',
								'CDF' =>  'Congolese franc',
								'CHF' =>  'Swiss franc',
								'CLP' =>  'Chilean peso' . '*',
								'CNY' =>  'Chinese yuan',
								'COP' =>  'Colombian peso' . '*',
								'CRC' =>  'Costa Rican col&oacute;n' . '*',
								'CVE' =>  'Cape Verdean escudo' . '*',
								'CZK' =>  'Czech koruna' . '*',
								'DJF' =>  'Djiboutian franc' . '*',
								'DKK' =>  'Danish krone' . '*',
								'DOP' =>  'Dominican peso',
								'DZD' =>  'Algerian dinar',
								'EGP' =>  'Egyptian pound',
								'ETB' =>  'Ethiopian birr',
								// 'EUR' =>  'Euro',
								'FJD' =>  'Fijian dollar',
								'FKP' =>  'Falkland Islands pound' . '*',
								// 'GBP' =>  'Pound sterling',
								'GEL' =>  'Georgian lari',
								'GIP' =>  'Gibraltar pound',
								'GMD' =>  'Gambian dalasi',
								'GNF' =>  'Guinean franc' . '*',
								'GTQ' =>  'Guatemalan quetzal' . '*',
								'GYD' =>  'Guyanese dollar' . '*',
								'HKD' =>  'Hong Kong dollar',
								'HNL' =>  'Honduran lempira' . '*',
								'HRK' =>  'Croatian kuna',
								'HTG' =>  'Haitian gourde',
								'HUF' =>  'Hungarian forint' . '*',
								'IDR' =>  'Indonesian rupiah',
								'ILS' =>  'Israeli new shekel',
								'INR' =>  'Indian rupee' . '*',
								'ISK' =>  'Icelandic kr&oacute;na',
								'JMD' =>  'Jamaican dollar',
								'JPY' =>  'Japanese yen',
								'KES' =>  'Kenyan shilling',
								'KGS' =>  'Kyrgyzstani som',
								'KHR' =>  'Cambodian riel',
								'KMF' =>  'Comorian franc',
								'KRW' =>  'South Korean won',
								'KYD' =>  'Cayman Islands dollar',
								'KZT' =>  'Kazakhstani tenge',
								'LAK' =>  'Lao kip' . '*',
								'LBP' =>  'Lebanese pound',
								'LKR' =>  'Sri Lankan rupee',
								'LRD' =>  'Liberian dollar',
								'LSL' =>  'Lesotho loti',
								'MAD' =>  'Moroccan dirham',
								'MDL' =>  'Moldovan leu',
								'MGA' =>  'Malagasy ariary',
								'MKD' =>  'Macedonian denar',
								'MMK' =>  'Burmese kyat',
								'MNT' =>  'Mongolian t&ouml;gr&ouml;g',
								'MOP' =>  'Macanese pataca',
								'MRO' =>  'Mauritanian ouguiya',
								'MUR' =>  'Mauritian rupee' . '*',
								'MVR' =>  'Maldivian rufiyaa',
								'MWK' =>  'Malawian kwacha',
								'MXN' =>  'Mexican peso' . '*',
								'MYR' =>  'Malaysian ringgit',
								'MZN' =>  'Mozambican metical',
								'NAD' =>  'Namibian dollar',
								'NGN' =>  'Nigerian naira',
								'NIO' =>  'Nicaraguan c&oacute;rdoba' . '*',
								'NOK' =>  'Norwegian krone',
								'NPR' =>  'Nepalese rupee',
								'NZD' =>  'New Zealand dollar',
								'PAB' =>  'Panamanian balboa' . '*',
								'PEN' =>  'Peruvian nuevo sol' . '*',
								'PGK' =>  'Papua New Guinean kina',
								'PHP' =>  'Philippine peso',
								'PKR' =>  'Pakistani rupee',
								'PLN' =>  'Polish z&#x142;oty',
								'PYG' =>  'Paraguayan guaran&iacute;' . '*',
								'QAR' =>  'Qatari riyal',
								'RON' =>  'Romanian leu',
								'RSD' =>  'Serbian dinar',
								'RUB' =>  'Russian ruble',
								'RWF' =>  'Rwandan franc',
								'SAR' =>  'Saudi riyal',
								'SBD' =>  'Solomon Islands dollar',
								'SCR' =>  'Seychellois rupee',
								'SEK' =>  'Swedish krona',
								'SGD' =>  'Singapore dollar',
								'SHP' =>  'Saint Helena pound' . '*',
								'SLL' =>  'Sierra Leonean leone',
								'SOS' => 'Somali shilling',
								'SRD' =>  'Surinamese dollar' . '*',
								'STD' =>  'S&atilde;o Tom&eacute; and Pr&iacute;ncipe dobra',
								'SZL' =>  'Swazi lilangeni',
								'THB' =>  'Thai baht',
								'TJS' =>  'Tajikistani somoni',
								'TOP' =>  'Tongan pa&#x2bb;anga',
								'TRY' =>  'Turkish lira',
								'TTD' =>  'Trinidad and Tobago dollar',
								'TWD' =>  'New Taiwan dollar',
								'TZS' =>  'Tanzanian shilling',
								'UAH' =>  'Ukrainian hryvnia',
								'UGX' =>  'Ugandan shilling',
								// 'USD' =>  'United States dollar',
								'UYU' =>  'Uruguayan peso' . '*',
								'UZS' =>  'Uzbekistani som',
								'VND' =>  'Vietnamese &#x111;&#x1ed3;ng',
								'VUV' =>  'Vanuatu vatu',
								'WST' =>  'Samoan t&#x101;l&#x101;',
								'XAF' =>  'Central African CFA franc',
								'XCD' =>  'East Caribbean dollar',
								'XOF' =>  'West African CFA franc' . '*',
								'XPF' =>  'CFP franc' . '*',
								'YER' =>  'Yemeni rial',
								'ZAR' =>  'South African rand',
								'ZMW' =>  'Zambian kwacha'
							);
		$this->fields['curency'] = array(
									'type' => 'select'
									, 'default' => 'USD'
									, 'title' => __('Accepted Currency', 'booking')
									, 'description' => __('The currency code that gateway will process the payment in.', 'booking')
													. '<div class="wpbc-settings-notice notice-info" style="text-align:left;"><strong>'
														. __('Note:' ,'booking') . '</strong> '
														. __('Setting the currency that is not supported by the payment processor will result in an error.' ,'booking')
													   . '<br/><strong>' . __( 'For more information:' ) . '</strong> '
													   . '<a href="https://stripe.com/docs/currencies#charge-currencies">Stripe Docs</a>'
	//													   . '<ul style="list-style: inside disc;">'
	//                                                       . ' <li>' . 'JCB, Discover, and Diners Club cards can only be charged in USD' . '</li>'
	//                                                       . ' <li>' . 'Currencies marked with * are not supported by American Express' . '</li>'
	//                                                       . ' <li>' . 'Brazilian Stripe accounts (currently in Preview) can only charge in Brazilian Real' . '</li>'
	//                                                       . ' <li>' . 'Mexican Stripe accounts (currently in Preview) can only charge in Mexican Peso' . '</li>'
	//													   . '</ul>'
													. '</div>'
									, 'description_tag' => 'span'
									, 'css' => ''
									, 'options' => $currency_list
									, 'group' => 'general'
							);

		//FixIn: 8.8.1.12
		$payment_methods_list = array(
								  'card'	=> __( 'Card', 'booking' )
								, 'alipay'	=> 'Alipay'
// Available only, if activated 'EUR' currency:
								, 'ideal'			=> 'iDEAL'  								// `ideal` only supports the following currencies: `eur`.
								, 'bancontact'		=> 'Bancontact'							// `bancontact` only supports the following currencies: `eur`.
								, 'giropay'			=> 'giropay'								// `giropay` only supports the following currencies: `eur`
								, 'p24'				=> 'P24'									// `p24` only supports the following currencies: `eur`, `pln`
								, 'eps'				=> 'EPS'									// `eps` only supports the following currencies: `eur`
								, 'sofort'			=> 'Sofort'	 // `sofort` only supports the following currencies: `eur`		// sofort.country required: AT, BE, DE, ES, IT, NL
								, 'sepa_debit'		=> 'SEPA Direct Debit'							// `sepa_debit` only supports the following currencies: `eur`

// Please ensure the provided type is activated in your Stripe dashboard (https://dashboard.stripe.com/account/payments/settings)
// and your account is enabled for any preview features that you are trying to use.
								, 'grabpay'			=> 'GrabPay'
								, 'fpx'				=> 'FPX'
								, 'bacs_debit'		=> 'Bacs Direct Debit'

// These payment  methods generate this Error: Caught exception: Invalid payment_method_types[2]: must be one of alipay, card, ideal, fpx, bacs_debit, bancontact, giropay, p24, eps, sofort, sepa_debit, or grabpay
											//, 'au_becs_debit'
											//, 'interac_present'
											// , 'oxxo'

		);
		$this->fields['payment_methods'] = array(
									'type' => 'select'
			, 'multiple' => true
									, 'default' => 'USD'
									, 'title' => __('Payment Methods', 'booking')
									, 'description' => __('Select one or several payment methods.', 'booking') . ' ' . __('Use Ctrl button to select multiple options.' ,'booking')
													. '<div class="wpbc-settings-notice notice-info" style="text-align:left;"><strong>'
														. __('Important!' ,'booking') . '</strong><br/>'
														. __('Different payment methods require different conditions. Some payment methods require selection of EUR currency, other available only in specific countries.' ,'booking')
													   . ' ' . __( 'For more information:', 'booking' ) . ' '
													   . '<a href="https://stripe.com/docs/payments/payment-methods/overview">Stripe Docs</a>.<hr/>'
														   . '<ul style="list-style: inside disc;">'
	                                                       . ' <li>' . '<strong>iDEAL, Bancontact, giropay, P24, EPS, Sofort, SEPA Direct Debit</strong> ' . __( 'can only be charged in', 'booking' ) . '  <strong>EUR</strong>' . '</li>'
	                                                       . ' <li>' . '<strong>Sofort</strong> ' . __( 'available only  for countries', 'booking' ) . '  <strong>AT, BE, DE, ES, IT, NL</strong>' . '</li>'
	                                                       . ' <li>' . '<strong>GrabPay, FPX, Bacs Direct</strong> ' . __( 'require activation in your Stripe dashboard', 'booking' ) . '.' . '</li>'
														   . '</ul>'
													. '</div>'
									, 'description_tag' => 'p'
									, 'css' => 'width:100%;height:20em;'
									, 'options' => $payment_methods_list
									, 'group' => 'general'
									, 'tr_class'    => 'wpbc_sub_settings_payment_button_title wpbc_sub_settings_grayed'
							);



		// Payment Button Title
		$this->fields['payment_button_title'] = array(
								'type'          => 'text'
								, 'default'     => __('Pay via' ,'booking') .' Stripe'
								, 'placeholder' => __('Pay via' ,'booking') .' Stripe'
								, 'title'       => __('Payment button title' ,'booking')
								, 'description' => __('Enter the title of the payment button' ,'booking')
								,'description_tag' => 'p'
								, 'css'         => 'width:100%'
								, 'group'       => 'general'
								//, 'tr_class'    => 'wpbc_sub_settings_payment_button_title wpbc_sub_settings_grayed'
						);
		//$this->fields['description_hr'] = array( 'type' => 'hr' );

		// Additional settings /////////////////////////////////////////////////
		$this->fields['subject'] = array(
								'type'          => 'textarea'
								, 'default'     => sprintf(__('Payment for booking %s on these day(s): %s'  ,'booking'),'[resource_title]','[dates]')
								, 'placeholder' => sprintf(__('Payment for booking %s on these day(s): %s'  ,'booking'),'[resource_title]','[dates]')
								, 'title'       => __('Payment description at gateway website' ,'booking')
								, 'description' => sprintf(__('Enter the service name or the reason for the payment here.' ,'booking'),'<br/>','</b>')
													. '<br/>' .  __('You can use any shortcodes, which you have used in content of booking fields data form.' ,'booking')
													// . '<div class="wpbc-settings-notice notice-info" style="text-align:left;"><strong>'
													//    . __('Note:' ,'booking') . '</strong> '
													//    . sprintf( __('This field support only up to %s characters by payment system.' ,'booking'), '255' )
													//. '</div>'
								,'description_tag' => 'p'
								, 'css'         => 'width:100%'
								, 'rows' => 2
								, 'group'       => 'general'
								, 'tr_class'    => 'wpbc_sub_settings_is_description_show wpbc_sub_settings_grayedNO'
						);


		////////////////////////////////////////////////////////////////////
		// Return URL    &   Auto approve | decline
		////////////////////////////////////////////////////////////////////

		//  Success URL
		$this->fields['order_successful_prefix'] = array(
								'type'          => 'pure_html'
								, 'group'       => 'auto_approve_cancel'
								, 'html'        => '<tr valign="top" class="wpbc_tr_stripe_v3_order_successful">
														<th scope="row">'.
															WPBC_Settings_API::label_static( 'stripe_v3_order_successful'
																, array(   'title'=> __('Return URL after Successful order' ,'booking'), 'label_css' => '' ) )
														.'</th>
														<td><fieldset>' . '<code style="font-size:14px;">' .  get_option('siteurl') . '</code>'
								, 'tr_class'    => 'relay_response_sub_class'
						);
		$this->fields['order_successful'] = array(
								'type'          => 'text'
								, 'default'     => '/successful'
								, 'placeholder' => '/successful'
								, 'css'         => 'width:75%'
								, 'group'       => 'auto_approve_cancel'
								, 'only_field'  => true
								, 'tr_class'    => 'relay_response_sub_class'
						);
		$this->fields['order_successful_sufix'] = array(
								'type'          => 'pure_html'
								, 'group'       => 'auto_approve_cancel'
								, 'html'        =>    '<p class="description" style="line-height: 1.7em;margin: 0;">'
														. __('The URL where visitor will be redirected after completing payment.' ,'booking')
														. '<br/>' . sprintf( __('For example, a URL to your site that displays a %s"Thank you for the payment"%s.' ,'booking'),'<b>','</b>')
													. '</p>
														   </fieldset>
														</td>
													</tr>'
								, 'tr_class'    => 'relay_response_sub_class'
						);

		//  Failed URL
		$this->fields['order_failed_prefix'] = array(
								'type'          => 'pure_html'
								, 'group'       => 'auto_approve_cancel'
								, 'html'        => '<tr valign="top" class="wpbc_tr_stripe_v3_order_failed">
														<th scope="row">'.
															WPBC_Settings_API::label_static( 'stripe_v3_order_failed'
																, array(   'title'=> __('Return URL after Failed order' ,'booking'), 'label_css' => '' ) )
														.'</th>
														<td><fieldset>' . '<code style="font-size:14px;">' .  get_option('siteurl') . '</code>'
								, 'tr_class'    => 'relay_response_sub_class'
						);
		$this->fields['order_failed'] = array(
								'type'          => 'text'
								, 'default'     => '/failed'
								, 'placeholder' => '/failed'
								, 'css'         => 'width:75%'
								, 'group'       => 'auto_approve_cancel'
								, 'only_field'  => true
								, 'tr_class'    => 'relay_response_sub_class'
						);
		$this->fields['order_failed_sufix'] = array(
								'type'          => 'pure_html'
								, 'group'       => 'auto_approve_cancel'
								, 'html'        =>    '<p class="description" style="line-height: 1.7em;margin: 0;">'
														. __('The URL where the visitor will be redirected after completing payment.' ,'booking')
														. '<br/>' . sprintf( __('For example, the URL to your website that displays a %s"Payment Canceled"%s page.' ,'booking'),'<b>','</b>' )
													. '</p>
														   </fieldset>
														</td>
													</tr>'
								, 'tr_class'    => 'relay_response_sub_class'
						);
		// Auto Approve / Cancel
        $this->fields['is_auto_approve_cancell_booking'] = array(
                                      'type'        => 'checkbox'
                                    , 'default'     => 'Off'
                                    , 'title'       => __( 'Automatically approve/cancel booking', 'booking' )
                                    , 'label'       => __('Check this box to automatically approve bookings, when visitor makes a successful payment, or automatically cancel the booking, when visitor makes a payment cancellation.' ,'booking')
                                    , 'description' =>  '<div class="wpbc-settings-notice notice-warning" style="text-align:left;">'
                                                            . '<strong>' . __('Warning' ,'booking') . '!</strong> ' . __('This will not work, if the visitor leaves the payment page.' ,'booking')
                                                        . '</div>'
                                    , 'description_tag' => 'p'
                                    , 'group'       => 'auto_approve_cancel'
							        , 'tr_class'    => 'relay_response_sub_class'
                                );

	}

    
    // Support /////////////////////////////////////////////////////////////////

	/**
	 * Return info about Gateway
	 *
	 * @return array        Example: array(
											'id'      => 'stripe_v3
										  , 'title'   => 'Stripe'
										  , 'currency'   => 'USD'
										  , 'enabled' => true
										);
	 */
	public function get_gateway_info() {

		$gateway_info = array(
					  'id'       => $this->get_id()
					, 'title'    => 'Stripe v.3'
					, 'currency' => get_bk_option(  'booking_' . $this->get_id() . '_' . 'curency' )
					, 'enabled'  => $this->is_gateway_on()
		);
		return $gateway_info;
	}

    
    /**
 	 * Get payment Statuses of gateway
     * 
     * @return array
     */
    public function get_payment_status_array() {
        
        return array(
                          'ok'      => array( 'Stripe_v3:OK' )
                        , 'pending' => array( 'Stripe_v3:Pending' )
                        , 'unknown' => array( 'Stripe_v3:Unknown' )
                        , 'error'   => array(   'Stripe_v3:Failed',
												'Stripe_v3:REJECTED',
												'Stripe_v3:NOTAUTHED',
												'Stripe_v3:MALFORMED',
												'Stripe_v3:INVALID',
												'Stripe_v3:ABORT',
												'Stripe_v3:ERROR' )
                    ); 
    }


}

//                                                                              </editor-fold>



//                                                                              <editor-fold   defaultstate="collapsed"   desc=" Settings  Page " >

/** Settings  Page  */
class WPBC_Settings_Page_Gateway_STRIPE_V3 extends WPBC_Page_Structure {

	public $gateway_api = false;

	/**
	 * Define interface for  Gateway  API
	 *
	 * @param string $selected_email_name - name of Email template
	 * @param array $init_fields_values - array of init form  fields data - this array  can  ovveride "default" fields and loaded data.
	 * @return object Email API
	 */
	public function get_api( $init_fields_values = array() ){

		if ( $this->gateway_api === false ) {
			$this->gateway_api = new WPBC_Gateway_API_STRIPE_V3( WPBC_STRIPE_V3_GATEWAY_ID , $init_fields_values );
		}

		return $this->gateway_api;
	}


	public function in_page() {                                                 // P a g e    t a g
        if (
			   ( 'On' == get_bk_option( 'booking_super_admin_receive_regular_user_payments' ) )								//FixIn: 9.2.3.8
        	&& ( ! wpbc_is_mu_user_can_be_here( 'only_super_admin' ) )
        	// && ( ! wpbc_is_current_user_have_this_role('contributor') )
		){
	        return (string) rand( 100000, 1000000 );        // If this User not "super admin",  then  do  not load this page at all
        }

		return 'wpbc-settings';
	}


	public function tabs() {                                                    // T a b s      A r r a y

		$tabs = array();

		$subtabs = array();

		// Checkbox Icon, for showing in toolbar panel does this payment system active
		$is_data_exist = get_bk_option( 'booking_'. WPBC_STRIPE_V3_GATEWAY_ID .'_is_active' );
		if (  ( ! empty( $is_data_exist ) ) && ( $is_data_exist == 'On' )  )
			$icon = '<i class="menu_icon icon-1x wpbc_icn_check_circle_outline"></i> &nbsp; ';
		else
			$icon = '<i class="menu_icon icon-1x wpbc_icn_radio_button_unchecked"></i> &nbsp; ';


		$subtabs[ WPBC_STRIPE_V3_GATEWAY_ID ] = array(
							'type' => 'subtab'                                  // Required| Possible values:  'subtab' | 'separator' | 'button' | 'goto-link' | 'html'
							, 'title' =>  $icon . 'Stripe v.3'       // Title of TAB
							, 'page_title' => sprintf( __('%s Settings', 'booking'), 'Stripe' )  // Title of Page
							, 'hint' => sprintf( __('Integration of %s payment system' ,'booking' ), 'Stripe' )    // Hint
							, 'link' => ''                                      // link
							, 'position' => ''                                  // 'left'  ||  'right'  ||  ''
							, 'css_classes' => ''                               // CSS class(es)
							//, 'icon' => 'http://.../icon.png'                 // Icon - link to the real PNG img
							//, 'font_icon' => 'wpbc_icn_mail_outline'   // CSS definition of Font Icon
							, 'default' =>  false                                // Is this sub tab activated by default or not: true || false.
							, 'disabled' => false                               // Is this sub tab deactivated: true || false.
							, 'checkbox'  => false                              // or definition array  for specific checkbox: array( 'checked' => true, 'name' => 'feature1_active_status' )   //, 'checkbox'  => array( 'checked' => $is_checked, 'name' => 'enabled_active_status' )
							, 'content' => 'content'                            // Function to load as conten of this TAB
						);

		$tabs[ 'payment' ]['subtabs'] = $subtabs;

		return $tabs;
	}


	/** Show Content of Settings page */
	public function content() {


		$this->css();

		////////////////////////////////////////////////////////////////////////
		// Checking
		////////////////////////////////////////////////////////////////////////

		do_action( 'wpbc_hook_settings_page_header', 'gateway_settings');       // Define Notices Section and show some static messages, if needed
		do_action( 'wpbc_hook_settings_page_header', 'gateway_settings_' . WPBC_STRIPE_V3_GATEWAY_ID );

		if ( ! wpbc_is_mu_user_can_be_here('activated_user') ) return false;       // Check if MU user activated, otherwise show Warning message.

		// if ( ! wpbc_is_mu_user_can_be_here('only_super_admin') ) return false;  // User is not Super admin, so exit.  Basically its was already checked at the bottom of the PHP file, just in case.


		////////////////////////////////////////////////////////////////////////
		// Load Data
		////////////////////////////////////////////////////////////////////////

		// $this->check_compatibility_with_older_7_ver();

		$init_fields_values = array();

		$this->get_api( $init_fields_values );


		////////////////////////////////////////////////////////////////////////
		//  S u b m i t   Main Form
		////////////////////////////////////////////////////////////////////////

		$submit_form_name = 'wpbc_gateway_' . WPBC_STRIPE_V3_GATEWAY_ID;               // Define form name

		$this->get_api()->validated_form_id = $submit_form_name;                // Define ID of Form for ability to  validate fields (like required field) before submit.

		if ( isset( $_POST['is_form_sbmitted_'. $submit_form_name ] ) ) {

			// Nonce checking    {Return false if invalid, 1 if generated between, 0-12 hours ago, 2 if generated between 12-24 hours ago. }
			$nonce_gen_time = check_admin_referer( 'wpbc_settings_page_' . $submit_form_name );  // Its stop show anything on submiting, if its not refear to the original page

			// Save Changes
			$this->update();
		}


		////////////////////////////////////////////////////////////////////////
		// JavaScript: Tooltips, Popover, Datepick (js & css)
		////////////////////////////////////////////////////////////////////////

		echo '<span class="wpdevelop">';

		wpbc_js_for_bookings_page();

		echo '</span>';


		////////////////////////////////////////////////////////////////////////
		// Content
		////////////////////////////////////////////////////////////////////////
		?>
		<div class="clear" style="margin-bottom:10px;"></div>

		<span class="metabox-holder">
			<form  name="<?php echo $submit_form_name; ?>" id="<?php echo $submit_form_name; ?>" action="" method="post" autocomplete="off">
				<?php
				   // N o n c e   field, and key for checking   S u b m i t
				   wp_nonce_field( 'wpbc_settings_page_' . $submit_form_name );
				?><input type="hidden" name="is_form_sbmitted_<?php echo $submit_form_name; ?>" id="is_form_sbmitted_<?php echo $submit_form_name; ?>" value="1" />



					<div class="wpbc-settings-notice notice-info" style="text-align:left;">
						<strong><?php _e('Note!' ,'booking'); ?></strong> <?php
							printf( __('If you have no account on this system, please visit %s to create one.' ,'booking')
								, '<a href="https://dashboard.stripe.com/register"  target="_blank" style="text-decoration:none;">stripe.com</a>');
						?>
					</div>
					<div class="clear" style="height:10px;"></div>
					<?php

					$edit_url_for_visitors = get_bk_option( 'booking_url_bookings_edit_by_visitors');

					if ( site_url() == $edit_url_for_visitors ) {
						$message_type = 'error';
					} else {
						$message_type = 'warning';
					}

					?>
					<div class="wpbc-settings-notice notice-<?php echo $message_type ?>" style="text-align:left;">
						<strong><?php echo ( ( 'error' == $message_type ) ? __('Error' ,'booking') : __('Note' ,'booking') ); ?></strong>! <?php
							echo 'Stripe ';
							printf( __('require correct  configuration of this option: %sURL to edit bookings%s' ,'booking')
								, '<strong><a href="'. wpbc_get_settings_url() .'#url_booking_edit">', '</a></strong>'
							);
						?>
					</div>
					<div class="clear" style=""></div>
					<?php

					if ( version_compare( PHP_VERSION, '5.4' ) < 0 ) {
						echo '';
						?>
						<div class="wpbc-settings-notice notice-error" style="text-align:left;">
							<strong><?php _e('Error' ,'booking'); ?></strong>! <?php
								echo 'Stripe v3';
								printf( __('require PHP version %s or newer!' ,'booking'), '<strong>5.4</strong>');
							?>
						</div>
						<div class="clear" style="height:10px;"></div>
						<?php
					}
					if ( ( ! function_exists('curl_init') ) && ( ! wpbc_is_this_demo() ) ){								//FixIn: 8.1.1.1
						?>
						<div class="wpbc-settings-notice notice-error" style="text-align:left;">
							<strong><?php _e('Error' ,'booking'); ?></strong>! <?php
								echo 'Stripe ';
								printf( 'require CURL library in your PHP!' , '<strong>'.PHP_VERSION.'</strong>');
							?>
						</div>
						<div class="clear" style="height:10px;"></div>
						<?php
					}
					?>
					<!--div class="clear" style="height:5px;"></div>
					<div class="wpbc-settings-notice notice-warning" style="text-align:left;">
						<strong><?php _e('Important!' ,'booking'); ?></strong> <?php
						printf( __('Please configure all fields inside the %sBilling form fields%s section at %sPayments General%s tab.' ,'booking')
							, '<strong>', '</strong>', '<strong>', '</strong>' );
						?>
					</div-->
					<div class="clear" style="height:10px;"></div>
					<div class="wpbc-settings-notice notice-warning" style="text-align:left;">
						<strong><?php _e('Important!' ,'booking'); ?></strong> <?php
						printf( __('You may test your integration over HTTP. However, live integrations must use HTTPS.' ,'booking')
							, '<strong>', '</strong>', '<strong>', '</strong>' );
						?>
					</div>
					<div class="clear" style="height:10px;"></div>
				<div class="clear"></div>
				<div class="metabox-holder">

					<div class="wpbc_settings_row wpbc_settings_row_left_NO" >
					<?php
						wpbc_open_meta_box_section( $submit_form_name . 'general', 'Stripe' );
							$this->get_api()->show( 'general' );
						wpbc_close_meta_box_section();
					?>
					</div>
					<div class="clear"></div>


					<div class="wpbc_settings_row wpbc_settings_row_left_NO" >
					<?php
						wpbc_open_meta_box_section( $submit_form_name . 'auto_approve_cancel', __('Advanced', 'booking')   );
							$this->get_api()->show( 'auto_approve_cancel' );
						wpbc_close_meta_box_section();
					?>
					</div>
					<div class="clear"></div>

				</div>

				<input type="submit" value="<?php _e('Save Changes', 'booking'); ?>" class="button button-primary" />
			</form>
		</span>
		<?php

		$this->enqueue_js();
	}


	/** Update Email template to DB */
	public function update() {

		// Get Validated Email fields
		$validated_fields = $this->get_api()->validate_post();

		$validated_fields = apply_filters( 'wpbc_gateway_stripe_v3_validate_fields_before_saving', $validated_fields );   //Hook for validated fields.

		$this->get_api()->save_to_db( $validated_fields );

		wpbc_show_message ( __('Settings saved.', 'booking'), 5 );              // Show Save message
	}


	// <editor-fold     defaultstate="collapsed"                        desc=" CSS & JS  "  >

	/** CSS for this page */
	private function css() {
		?>
		<style type="text/css">
			.wpbc-help-message {
				border:none;
				margin:0 !important;
				padding:0 !important;
			}
			@media (max-width: 399px) {
			}
		</style>
		<?php
	}


	/**
	 * Add Custon JavaScript - for some specific settings options
	 *      Executed After post content, after initial definition of settings,  and possible definition after POST request.
	 *
	 * @param type $menu_slug
	 */
	private function enqueue_js(){
		$js_script = '';

		//Show|Hide grayed section
		$js_script .= " 
						if ( ! jQuery('#stripe_v3_mode_test').is(':checked') ) {   
							jQuery('.wpbc_sub_settings_mode_test').addClass('hidden_items'); 
						}
						if ( ! jQuery('#stripe_v3_mode_live').is(':checked') ) {   
							jQuery('.wpbc_sub_settings_mode_live').addClass('hidden_items'); 
						}
					  ";
		// Hide|Show  on Click    Radio
		$js_script .= " jQuery('input[name=\"stripe_v3_account_mode\"]').on( 'change', function(){    
								jQuery('.wpbc_sub_settings_mode_test,.wpbc_sub_settings_mode_live').addClass('hidden_items'); 
								if ( jQuery('#stripe_v3_mode_test').is(':checked') ) {   
									jQuery('.wpbc_sub_settings_mode_test').removeClass('hidden_items');
								} else {
									jQuery('.wpbc_sub_settings_mode_live').removeClass('hidden_items');
								}
							} ); ";


		$js_script .= " jQuery('select[name=\"stripe_v3_curency\"]').on( 'change', function(){    
						
                            var wpbc_selected_p_mode = jQuery('select[name=\"stripe_v3_curency\"] option:selected').val(); 

							if ( 'EUR' == wpbc_selected_p_mode ) {   
								jQuery( '#stripe_v3_payment_methods option' ).prop( 'disabled', false );
								jQuery( '#stripe_v3_payment_methods option' ).removeClass('hidden_items');
							} else {
								jQuery( '#stripe_v3_payment_methods' ).find( 'option' ).prop( 'selected', false );
								jQuery( '#stripe_v3_payment_methods option:eq(0)').prop('selected', true);
									
								for( var oi = 2; oi < 9; oi++) {
									jQuery( '#stripe_v3_payment_methods option:eq(' + oi + ')' ).prop( 'disabled', true );
								}
								jQuery('#stripe_v3_payment_methods option:disabled').addClass('hidden_items'); 									
							}
						} ); ";


		// Eneque JS to  the footer of the page
		wpbc_enqueue_js( $js_script );
	}

	// </editor-fold>

}
add_action('wpbc_menu_created',  array( new WPBC_Settings_Page_Gateway_STRIPE_V3() , '__construct') );    // Executed after creation of Menu



/**
 * Override VALIDATED fields BEFORE saving to DB
 * Description:
 * Check "Return URLs" and "STRIPE_V3 Email"m, etc...
 *
 * @param array $validated_fields
 */
function wpbc_gateway_stripe_v3_validate_fields_before_saving__all( $validated_fields ) {

	if ( 'On' == $validated_fields['is_active'] ) {
		// Only one instance of Stripe integration can  be active !
		update_bk_option( 'booking_stripe_is_active', 'Off');
	}

	$validated_fields['order_successful'] = wpbc_make_link_relative( $validated_fields['order_successful'] );
	$validated_fields['order_failed']     = wpbc_make_link_relative( $validated_fields['order_failed'] );

	if ( wpbc_is_this_demo() ) {
		$validated_fields['publishable_key'] 	  = 'pk_test_6pRNASCoBOKtIshFeQd4XMUh';
		$validated_fields['secret_key']      	  = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2';
		$validated_fields['publishable_key_test'] = 'pk_test_6pRNASCoBOKtIshFeQd4XMUh';
		$validated_fields['secret_key_test']      = 'sk_test_BQokikJOvBiI2HlWgH4olfQ2';
		$validated_fields['account_mode'] 		  = 'test';
	}

	return $validated_fields;
}
add_filter( 'wpbc_gateway_stripe_v3_validate_fields_before_saving', 'wpbc_gateway_stripe_v3_validate_fields_before_saving__all', 10, 1 );   // Hook for validated fields.

//                                                                              </editor-fold>



//                                                                              <editor-fold   defaultstate="collapsed"   desc=" Activate | Deactivate " >

////////////////////////////////////////////////////////////////////////////////
// Activate | Deactivate
////////////////////////////////////////////////////////////////////////////////

/**
 * Get previous option from Stripe v.1 (if exist)
 *
 * @param $option_name
 * @param $default_value
 *
 * @return bool|mixed|void
 */
function wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( $option_name, $default_value ){

	$op_prefix = 'booking_' . 'stripe'  . '_';		// WPBC_STRIPE_GATEWAY_ID

	$previos_version_value = get_bk_option( $op_prefix . $option_name );

	if ( false === $previos_version_value ) {
		return $default_value;
	} else {
		return $previos_version_value;
	}

}

/** A c t i v a t e */
function wpbc_booking_activate_STRIPE_V3() {

	$op_prefix = 'booking_' . WPBC_STRIPE_V3_GATEWAY_ID . '_';

	add_bk_option( $op_prefix . 'is_active',    		( wpbc_is_this_demo() ? 'On' : wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'is_active', 'Off' ) )  );
	add_bk_option( $op_prefix . 'account_mode',         wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'account_mode', 'test' ) );
	add_bk_option( $op_prefix . 'publishable_key', 		( wpbc_is_this_demo() ? 'pk_test_6pRNASCoBOKtIshFeQd4XMUh' : wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'publishable_key', '' )  ) );
	add_bk_option( $op_prefix . 'secret_key', 			( wpbc_is_this_demo() ? 'sk_test_BQokikJOvBiI2HlWgH4olfQ2' : wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'secret_key', '' )  ) );
	add_bk_option( $op_prefix . 'publishable_key_test', ( wpbc_is_this_demo() ? 'pk_test_6pRNASCoBOKtIshFeQd4XMUh' : wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'publishable_key_test', '' )  ) );
	add_bk_option( $op_prefix . 'secret_key_test', 		( wpbc_is_this_demo() ? 'sk_test_BQokikJOvBiI2HlWgH4olfQ2' : wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'secret_key_test', '' )  ) );
	add_bk_option( $op_prefix . 'curency',          	wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'curency', 'USD' )  );
	add_bk_option( $op_prefix . 'payment_methods', 		'card' );		//FixIn: 8.8.1.12
	add_bk_option( $op_prefix . 'payment_button_title' ,wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'payment_button_title', __('Pay via' ,'booking') .' Stripe' ) );
	add_bk_option( $op_prefix . 'subject',      		wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'subject', sprintf( __('Payment for booking %s on these day(s): %s'  ,'booking'), '[resource_title]','[dates]') ) );
	add_bk_option( $op_prefix . 'order_successful',     wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'order_successful', '/successful' )  );
	add_bk_option( $op_prefix . 'order_failed',         wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'order_failed', '/failed' ) );
	add_bk_option( $op_prefix . 'is_auto_approve_cancell_booking' , wpbc_booking_check_previous_STRIPE_option_for_STRIPE_V3( 'is_auto_approve_cancell_booking', 'Off' ) );
}
add_bk_action( 'wpbc_other_versions_activation',   'wpbc_booking_activate_STRIPE_V3'   );


/** D e a c t i v a t e */
function wpbc_booking_deactivate_STRIPE_V3() {

	$op_prefix = 'booking_' . WPBC_STRIPE_V3_GATEWAY_ID . '_';

	delete_bk_option( $op_prefix . 'is_active' );
	delete_bk_option( $op_prefix . 'account_mode' );
	delete_bk_option( $op_prefix . 'publishable_key' );
	delete_bk_option( $op_prefix . 'secret_key' );
	delete_bk_option( $op_prefix . 'publishable_key_test' );
	delete_bk_option( $op_prefix . 'secret_key_test' );
	delete_bk_option( $op_prefix . 'curency' );
	delete_bk_option( $op_prefix . 'payment_methods' );		//FixIn: 8.8.1.12
	delete_bk_option( $op_prefix . 'payment_button_title' );
	delete_bk_option( $op_prefix . 'subject' );
	delete_bk_option( $op_prefix . 'order_successful' );
	delete_bk_option( $op_prefix . 'order_failed' );
	delete_bk_option( $op_prefix . 'is_auto_approve_cancell_booking' );
}
add_bk_action( 'wpbc_other_versions_deactivation', 'wpbc_booking_deactivate_STRIPE_V3' );

//                                                                              </editor-fold>


// Hook for getting gateway payment form to  show it after  booking process,  or for "payment request" after  clicking on link in email.
// Note,  here we generate new Object for correctly getting payment fields data of specific WP User  in WPBC MU version. 
add_filter( 'wpbc_get_gateway_payment_form', array( new WPBC_Gateway_API_STRIPE_V3( WPBC_STRIPE_V3_GATEWAY_ID ), 'get_payment_form' ), 10, 3 );



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// RESPONSE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 *  Update Payment status of booking
	 * @param $booking_id
	 * @param $status
	 *
	 * @return bool
	 */
	function wpbc_stripe_v3_update_payment_status( $booking_id, $status ){

		global $wpdb;

		// Update payment status
		$update_sql = $wpdb->prepare( "UPDATE {$wpdb->prefix}booking AS bk SET bk.pay_status = %s WHERE bk.booking_id = %d;", $status, $booking_id );

		if ( false === $wpdb->query( $update_sql  ) ){
			return  false;
		}

		return  true;
	}


	/**
	 * Auto cancel booking and redirect
	 * @param $booking_id
	 * @param $stripe_v3_error_code
	 */
	function wpbc_stripe_v3_auto_cancel_booking( $booking_id , $stripe_v3_error_code ){

		// Lets check whether the user wanted auto-approve or cancel
		$auto_approve = get_bk_option( 'booking_stripe_v3_is_auto_approve_cancell_booking'  );
		if ($auto_approve == 'On')
			wpbc_auto_cancel_booking( $booking_id );

		$stripe_v3_error_url   = get_bk_option( 'booking_stripe_v3_order_failed' );

		$stripe_v3_error_url = wpbc_make_link_absolute( $stripe_v3_error_url );

		// if relay is active, this will point to some valid url the user entered. If not, it will point to the original gateway url
		// header ("Location: ". $stripe_v3_error_url ."?error=".$stripe_v3_error_code);

		wpbc_redirect( $stripe_v3_error_url ."?error=".$stripe_v3_error_code );
	}


	/**
	 * Auto approve booking and redirect
	 *
	 * @param $booking_id
	 */
	function wpbc_stripe_v3_auto_approve_booking( $booking_id ){

		// Lets check whether the user wanted auto-approve or cancel
		$auto_approve = get_bk_option( 'booking_stripe_v3_is_auto_approve_cancell_booking'  );
		if ($auto_approve == 'On'){
			wpbc_auto_approve_booking( $booking_id );
		}


		$stripe_v3_success_url = get_bk_option( 'booking_stripe_v3_order_successful' );
		if ( empty( $stripe_v3_success_url ) ) {
			$stripe_v3_success_url = get_bk_option( 'booking_thank_you_page_URL' );
		}

		$stripe_v3_success_url = wpbc_make_link_absolute( $stripe_v3_success_url );

		// if relay is active, this will point to some valid url the user entered. If not, it will point to the original gateway url
		// header ("Location: ". $stripe_v3_success_url );


		//$booking_data = wpbc_get_booking_details( $booking_id );
		/*
		  stdClass Object (
							[booking_id] => 39
							[trash] => 0
							[sync_gid] =>
							[is_new] => 1
							[status] =>
							[sort_date] => 2021-12-09 09:00:01
							[modification_date] => 2021-11-29 08:53:47
							[form] => text^days_number_hint3^1~text^cost_hint3^&#36;250.00~select-one^rangetime3^09:00 - 20:30~text^name3^John~text^secondname3^Smith~email^email3^john.smith@server.com~select-one^visitors3^1~select-one^children3^0
							[hash] => 63e2799db2739ca8f5701bb0d982e12f
							[booking_type] => 3
							[remark] =>
							[cost] => 250.00
							[pay_status] => Stripe_v3:OK
							[pay_request] => 0
						)
		 */
		//$stripe_v3_success_url .= '?booking_id=' . $booking_id . '&booking_cost=' . $booking_data->cost;
		wpbc_redirect( $stripe_v3_success_url );

	}




/**
 * Parse 1 way secret HASH, usually  after  redirection from payment system
 * and make approve / decline specific booking.
 *
 * @param $parsed_response  Array
									(
										[0] => payment
										[1] => stripe_v3
										[2] => ec1f2c35728603edee9bde65ff3ba665
										[3] => approve
									)
 */
function wpbc_payment_response__stripe_v3( $parsed_response ) {

	list( $response_type, $response_source, $booking_hash, $response_action ) = $parsed_response;

	// Check if its response from Stripe
	if ( (  'payment' === $response_type ) && ( WPBC_STRIPE_V3_GATEWAY_ID === $response_source ) ) {

		//FixIn: 8.7.9.3
		// In MultiUser version, check if this booking relative to the booking resource, from  the "regular  user"
		if ( class_exists( 'wpdev_bk_multiuser' ) ) {

			if ( ! empty( $booking_hash ) ) {

				$my_booking_id_type = wpbc_hash__get_booking_id__resource_id( $booking_hash );

				if ( ! empty( $my_booking_id_type ) ) {

					list( $booking_id, $booking_resource_id ) = $my_booking_id_type;

					$user_id = apply_bk_filter( 'get_user_of_this_bk_resource', false, $booking_resource_id );

					$is_booking_resource_user_super_admin = apply_bk_filter( 'is_user_super_admin', $user_id );

					if ( ! $is_booking_resource_user_super_admin ) {

						//Reactivate data for "regular  user
						make_bk_action( 'check_multiuser_params_for_client_side_by_user_id', $user_id );
					}
				}
			}
		}


//FixIn: 8.6.1.23
		// Get here list  of all  success payment sessions in Stripe !

		if ( version_compare( PHP_VERSION, '5.4' ) < 0 ) {
			echo  'Stripe (v.3) payment require PHP version 5.4 or newer!';
			return;
		}
		if ( ! class_exists( 'Stripe\Stripe' ) ) {
			//require_once( dirname( __FILE__ ) . '/stripe-php-master/init.php' );
			//require_once( dirname( __FILE__ ) . '/stripe-php-7.46.1/init.php' );	//FixIn: 8.7.9.2
			require_once( dirname( __FILE__ ) . '/stripe-php-9.0.0/init.php' );    		//FixIn: 9.2.3.7		// 2022-08-10
		}


		$payment_options = array();
		// Get Secret key
		$stripe_v3_account_mode = get_bk_option( 'booking_stripe_v3_account_mode' );
		if ( 'test' == $stripe_v3_account_mode ) {
			$payment_options[ 'secret_key' ] = get_bk_option( 'booking_stripe_v3_secret_key_test' );
		} else {
			$payment_options[ 'secret_key' ] = get_bk_option( 'booking_stripe_v3_secret_key' );
		}
		// Check whether secret key was assigned,  Otherwise -- ERROR
		if ( empty( $payment_options['secret_key'] ) ) {
			echo 'Wrong configuration in gateway settings.' . ' <em>Empty: "Secret key" option</em>';
			return;
		}

		////////////////////////////////////////////////////////////////////////
		// Step 1. Back-End: Create a Checkout Session on your server		    - https://stripe.com/docs/payments/checkout/server#integrate
		////////////////////////////////////////////////////////////////////////
		\Stripe\Stripe::setApiKey( $payment_options[ 'secret_key' ] );

		////////////////////////////////////////////////////////////////////////
		// Step 2. Back-End: Create a Checkout Session on your server		    - https://stripe.com/docs/payments/checkout/fulfillment#polling
		////////////////////////////////////////////////////////////////////////
		$events = \Stripe\Event::all([
		  'type' => 'checkout.session.completed',
		  'created' => [
						'gte' => time() - 24 * 60 * 60,			// Check for events created in the last 24 hours.
		  			   ],
		]);

		$is_payment_for_this_booking_exist = false;

		foreach ( $events->autoPagingIterator() as $event ) {
			$session = $event->data->object;

			if ( $booking_hash == $session->client_reference_id ) {
				$is_payment_for_this_booking_exist = true;
				break;
			}
		}

		if( false === $is_payment_for_this_booking_exist ) {
			// Not Paid,  yet
			wpbc_redirect( get_home_url() ."?error=Unknown-Stripe-Payment" );
			return;
		}
//End FixIn: 8.6.1.23

		// Get booking ID
		$my_booking_id_type = wpbc_hash__get_booking_id__resource_id( $booking_hash );
		if ( ! empty( $my_booking_id_type ) ) {

			list( $booking_id, $resource_id ) = $my_booking_id_type;

			$booking_data = wpbc_get_booking_details( $booking_id );

//debuge( '[Booking data]', $booking_data );

			switch ( $response_action ) {

			    case 'approve':

					wpbc_stripe_v3_update_payment_status( $booking_id , 'Stripe_v3:OK');

					wpbc_stripe_v3_auto_approve_booking( $booking_id );

			        break;
			    case 'decline':

					wpbc_stripe_v3_update_payment_status( $booking_id , 'Stripe_v3:ERROR');

					wpbc_stripe_v3_auto_cancel_booking( $booking_id, "Stripe payment failed." );

			        break;
			    default:
			       // Default
			}


		} else {
			// Error
			echo __('Wrong booking hash in URL. Probably hash is expired.' ,'booking');
		}
	}
}

add_bk_action( 'wpbc_payment_response', 'wpbc_payment_response__stripe_v3' );