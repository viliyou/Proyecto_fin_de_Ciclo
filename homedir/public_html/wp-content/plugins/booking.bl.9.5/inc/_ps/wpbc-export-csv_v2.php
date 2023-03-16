<?php /**
 * @version 2.0
 * @package Booking Calendar
 * @category CSV export of Ajax Bookings Listing    V.2
 * @author wpdevelop
 *
 * @web-site https://wpbookingcalendar.com/
 * @email info@wpbookingcalendar.com
 *
 * @modified 2022-07-17
 *
 * This is COMMERCIAL SCRIPT
 * We are do not guarantee correct work and support of Booking Calendar, if some file(s) was modified by someone else then wpdevelop.
 */


if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit, if accessed directly


/**
 * Get URL to generate CSV of booking listing that  is available during 15 minutes,
 * for using at Ajax Booking Listing page
 *
 * @param $export_all_pages     array
 *
 * @return string
 */
function wpbc_csv_get_url_export( $request_params_for_listing ){

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// SECRET KEY - for using in a path of CSV link
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$hash_obj      = new WPBC_Hash();
	$special_chars         = false;
	$extra_special_chars   = false;

	$wpbc_secret_hash_path = get_transient( 'booking_csv_v2_secret_hash_path' );
	if ( empty( $wpbc_secret_hash_path ) ) {

		$wpbc_secret_hash_path = $hash_obj->generate_password( 50, $special_chars, $extra_special_chars );

		set_transient( 'booking_csv_v2_secret_hash_path', $wpbc_secret_hash_path, 60 * 60 * 1 );      // 1 Hour transient
	}

	$secret_csv_url_path = "/" . $wpbc_secret_hash_path . "/wpbc_bookings.csv";


	// Request transient
	$bk_request_hash   = $hash_obj->generate_password( 5, $special_chars, $extra_special_chars );


	$request_params_for_listing['wpbc_ajx_user_id'] = ( isset( $_REQUEST['wpbc_ajx_user_id'] ) ) ? intval( $_REQUEST['wpbc_ajx_user_id'] ) : wpbc_get_current_user_id();
	$request_params_for_listing['wpbc_ajx_locale']  = ( isset( $_REQUEST['wpbc_ajx_locale'] ) )  ? esc_js( $_REQUEST['wpbc_ajx_locale'] )  : 'en_US';

	set_transient(    'booking_csv_v2_secret_request_params_' . $bk_request_hash
					, $request_params_for_listing
					, 60 * 15                   // 15 minutes
					);

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// URL
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	return trim( home_url(), '/' ) . $secret_csv_url_path . '?csv_request_params=' . $bk_request_hash;
}


/**
 * Export booking listing to  CSV,  by accessing secret link.
 *
 */
function wpbc_make_export_csv_v2(){

	// Check URL  //////////////////////////////////////////////////////////////////////////////////////////////////////

	// Get path of request URL, e.g.: 'secret_csv/wpbc_bookings.csv'
	$my_parsed_url_path = wpbc_get_request_url_path();

	if ( false === $my_parsed_url_path ) {
		return false;                                                                   // seriously malformed URLs, parse_url() may return FALSE
	}

	// Get temporary  saved HASH  for csv URL path.... Please check more here >> wpbc_csv_get_url_for_button()
	$wpbc_secret_hash_path = get_transient( 'booking_csv_v2_secret_hash_path' );

	if ( $wpbc_secret_hash_path . '/wpbc_bookings.csv' === $my_parsed_url_path ){	// Good it's CSV

		if ( ( WPBC_EXIST_NEW_BOOKING_LISTING ) && ( 'On' != get_bk_option( 'booking_is_use_old_booking_listing' ) ) ) {

		} else {
			return false;                                                           // It's NOT new CSV
		}
	} else {                                                                        // NOT CSV
		return false;
	}


	// Start check parameters  /////////////////////////////////////////////////////////////////////////////////////////

	// Un serialize booking data from  URL - it's our parameters for request
	if ( ! empty( $_GET['csv_request_params'] ) ) {

		$bk_request_hash = trim( $_GET['csv_request_params'] );

		$csv_request_params = get_transient( 'booking_csv_v2_secret_request_params_' . $bk_request_hash );

		if ( false !== $csv_request_params ) {
			$csv_request_params = maybe_unserialize( $csv_request_params );
		}
	}

	if ( ! is_array( $csv_request_params ) ) {
		echo "CSV Error! Request parameter not correct: <br><br>|" . $_GET['csv_request_params'] .'|';
	}

	$export_params_arr = array(
		'export_type'            => 'csv_all',
		'selected_id'            => '',
		'csv_export_separator'   => 'semicolon',
		'csv_export_skip_fields' => ''
	);

	if ( ! empty( $_GET['export_type'] ) ) {
		$export_params_arr['export_type'] = str_replace( '\"', '"', $_GET['export_type'] );    //csv_page | csv_all
	}

	if ( ! empty( $_GET['selected_id'] ) ) {
		$export_params_arr['selected_id'] = str_replace( '\"', '"', $_GET['selected_id'] );
	}

	if ( ! empty( $_GET['csv_export_separator'] ) ) {
		$export_params_arr['csv_export_separator'] = $_GET['csv_export_separator'];
	}

	if ( ! empty( $_GET['csv_export_skip_fields'] ) ) {
		$export_params_arr['csv_export_skip_fields'] = $_GET['csv_export_skip_fields'];
	}

	// $csv_request_params['wpbc_ajx_locale']
	// Update user CSV export paramters to DB
	$user_id = intval( $csv_request_params['wpbc_ajx_user_id'] );
	if ( ! empty( $user_id ) ) {
		$is_ok = update_user_option( (int) $user_id, 'booking_csv_export_params' ,  $export_params_arr );
	}

	// Reload locale for CSV export
//	if ( ( ! empty( $csv_request_params['wpbc_ajx_locale'] ) ) && ( 'en_US' != $csv_request_params['wpbc_ajx_locale'] ) ) {
//		$_REQUEST['wpbc_ajx_locale'] = $csv_request_params['wpbc_ajx_locale'];
//		$locale = wpbc_get_maybe_reloaded_booking_locale();
//		wpbc_check_ajax_locale__reload_it( $locale );
//	}

	// Get CSV content from  booking listing  //////////////////////////////////////////////////////////////////////////

	$csv_file_content = wpbc_get_csv_v2_content_from_bookings( $csv_request_params, $export_params_arr );

	wpbc_generate_file_content( $csv_file_content, array(
															'content_type' => 'text/csv',
															'name'         => 'wpbc-bookings.csv'	    // Real file name after downloading
														)
							 );
}
add_action( 'template_redirect', 'wpbc_make_export_csv_v2' );


/**
 * Generate content of the file,  before sending headers by  WordPress  and release download of this file.
 *
 * @param $file_content     - file content
 * @param $file             - array  of parameters,  like       array( 'content_type' => 'text/csv', 'name' => 'wpbc-bookings.csv')
 *
 * @return void
 */
function wpbc_generate_file_content( $file_content, $file = array() ) {

	$defaults = array(
						'content_type'  => 'text/csv',
						'name'          => 'wpbc-bookings.csv',    // Real file name after downloading
						'size'          => 0
	);
	$file = wp_parse_args( $file, $defaults );

	if ( headers_sent() ) {
		die( "<br><br> Headers sent before download" );
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Prepare system before downloading set time limits, server output options
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$disabled         = explode( ',', ini_get( 'disable_functions' ) );
	$is_func_disabled = in_array( 'set_time_limit', $disabled );
	if ( ! $is_func_disabled && ! ini_get( 'safe_mode' ) ) {
		@set_time_limit( 0 );
	}

	@session_write_close();
	if ( function_exists( 'apache_setenv' ) ) {
		@apache_setenv( 'no-gzip', 1 );
	}
	@ini_set( 'zlib.output_compression', 'Off' );
	@ob_end_clean();    // In case,  if somewhere opened output buffer, may be  required for working fpassthru with  large files


	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Set Headers before file download
	////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if ( function_exists( 'mb_detect_encoding' ) ) {                      //FixIn: 2.0.5.3
		$text_encoding = mb_detect_encoding( $file_content );
	} else {
		$text_encoding = '';        // Unknown
	}

	// If not UTF-8 encoding,  so  size calculated incorrectly ... probably,  because of that  we are using default 0 size
	if ( ( is_array( $text_encoding ) )
	     && ( ! in_array( 'UTF-8', $text_encoding ) )
	) {
		$file['size'] = wpbc_get_bytes_from_str( $file_content );
	}

	nocache_headers();
	header( "Robots: none" . "\n" );
	@header( $_SERVER['SERVER_PROTOCOL'] . ' 200 OK' . "\n" );
	header( "Content-Type: " . $file['content_type'] . "\n" );      // 'text/csv'    // header('Content-Type: application/octet-stream');
	header( "Content-Description: File Transfer" . "\n" );
	header( "Content-Disposition: attachment; filename=\"" . $file['name'] . "\"" . "\n" );

	//// The Content-Transfer-Encoding header should be unnecessary, if the Content-Type correctly set,
	//// and indeed it is probably misleading the browser into thinking it has received a binary file as well:
	// header( "Content-Transfer-Encoding: binary" . "\n" );

	if ( (int) $file['size'] > 0 ) {
		header( "Content-Length: " . $file['size'] . "\n" );
	}

	header( 'Expires: 0' );
	header( 'Cache-Control: must-revalidate, post-check=0, pre-check=0' );
	header( 'Pragma: public' );
	echo "\xEF\xBB\xBF"; // UTF-8 BOM

	echo $file_content;

	exit;
}


/**
 * Get CSV content from Booking Listing
 * - Get all bookings based on  request  parameters,
 * - Generate CSV content
 *
 * @param array $csv_request_params
 *                                  Array(
										    * [wh_booking_type] => 3,4,1,5,6,7,8,9,2,10,11,12
										    * [wh_approved] =>
										    * [wh_booking_id] =>
										    * [wh_is_new] =>
										    * [wh_pay_status] => all
										    * [wh_keyword] =>
										    * [wh_booking_date] => 3
										    * [wh_booking_date2] =>
										    * [wh_modification_date] => 3
										    * [wh_modification_date2] =>
										    * [wh_cost] =>
										    * [wh_cost2] =>
										    * [or_sort] =>
										    * [page_num] => 1
										    * [wh_trash] => 0
										    * [page_items_count] => 5
 * )
 * @param array $export_params_arr
 *                                array(
										'export_type'            => 'csv_all',          // 'csv_all' | 'csv_page'
										'selected_id'            => '',                 //  ''  | '10|15|20'
										'csv_export_separator'   => 'semicolon',                // 'comma'  | 'semicolon'
										'csv_export_skip_fields' => ''                  // 'secondname,email'
									)
 *
 * @param string $export_params_arr['selected_id']
 *
 * @return string
 */
function wpbc_get_csv_v2_content_from_bookings( $csv_request_params , $export_params_arr = array() ){                   // $all_booking_types = wpdebk_get_keyed_all_bk_resources( array() );

	$defaults = array(
		'export_type'            => 'csv_all',
		'selected_id'            => '',
		'csv_export_separator'   => 'semicolon',
		'csv_export_skip_fields' => ''
	);
	$export_params_arr   = wp_parse_args( $export_params_arr, $defaults );

	if ( $export_params_arr['export_type'] == 'csv_all' ) {
		$csv_request_params['page_num']         = 1;                                      // Start export from the first page
		$csv_request_params['page_items_count'] = 100000;                                 // Export ALL bookings - Maximum: 100 000
	}

	if ( $export_params_arr['selected_id'] != '' ) {
		$export_params_arr['selected_id'] = explode( ',', $export_params_arr['selected_id'] );
	} else {
		$export_params_arr['selected_id'] = array();
	}
	$export_params_arr['csv_export_skip_fields'] = explode( ',', $export_params_arr['csv_export_skip_fields'] );

	$bk_listing = wpbc_ajx_get_booking_data_arr( $csv_request_params );
	$bookings   = $bk_listing['data_arr'];


	// Get Titles ======================================================================================================
	$export_collumn_titles = array();
	foreach ( $bookings as $key => $value ) {

		// Define dates
		$bookings[ $key ]->parsed_fields[ 'booking_dates' ] = strip_tags( $bookings[ $key ]->templates['short_dates_content'] );

		// Get the name od user owner of this booking
	    if ( class_exists( 'wpdev_bk_multiuser' ) ) {

		    $user_bk_id = apply_bk_filter( 'get_user_of_this_bk_resource', false, $bookings[ $key ]->parsed_fields['booking_type'] );            // Get  the owner of this booking resource
		    $user_data  = get_userdata( $user_bk_id );

		    if ( ( isset( $user_data->data ) ) && ( isset( $user_data->data->display_name ) ) ) {
			    $bookings[ $key ]->parsed_fields[ 'user' ] = $user_data->data->display_name;
		    }
	    }

		// Get all possible titles (fields names) from all bookings
		foreach ( $bookings[ $key ]->parsed_fields as $field_name => $field_value ) {

			if ( ! in_array( $field_name, $export_collumn_titles ) ) {
				$export_collumn_titles[] = $field_name;
			}
		}
    }

	// Add some Title names that  will be defined manually. Check  code bellow.
	if ( ! in_array( 'booking_status', $export_collumn_titles ) ) {     // Approved | Pending
		$export_collumn_titles[] = 'booking_status';
	}

	// Sort & Skip  columns  ===========================================================================================
	$export_collumn_titles = wpbc_csv_sort_skip_titles(  $export_collumn_titles, $export_params_arr['csv_export_skip_fields'] );


	// Get Rows ========================================================================================================
	$export_bookings = array();

	foreach ( $bookings as $booking_key => $booking_value ) {

		// If we selected some bookings, then we need to export only these selected bookings.
	    if ( ! empty( $export_params_arr['selected_id'] ) ) {
		    if ( in_array( $bookings[ $booking_key ]->parsed_fields['booking_id'], $export_params_arr['selected_id'] ) === false ) {
			    continue;
		    }
	    }

		$booking_value = $bookings[ $booking_key ]->parsed_fields;

		$export_bk_row = array();

	    foreach ( $export_collumn_titles as $title_name ) {

			$export_bk_row[ $title_name ] = '';

		    if (
					(      isset( $booking_value[ $title_name ] ) )
		         && ( ! is_array( $booking_value[ $title_name ] ) )
		    ) {
			    $export_bk_row[ $title_name ] = html_entity_decode( $booking_value[ $title_name ] );
		    }
	    }


		$export_bk_row['resource_title'] = ( isset( $export_bk_row['resource_title'] ) ) ? apply_bk_filter( 'wpdev_check_for_active_language', $export_bk_row['resource_title'] ) : '';     //FixIn: 9.4.4.4
		$export_bk_row['trash']          = ( $booking_value['trash'] == 1 ) ? '+' : '';        //FixIn: 8.3.3.7
		$export_bk_row['booking_status'] = ( $bookings[ $booking_key ]->approved ) ? __( 'Approved', 'booking' ) : __( 'Pending', 'booking' );

	    $export_bk_row     = str_replace( array( "\n\r", "\r", "\n" ), ' ', $export_bk_row );
	    $export_bookings[] = $export_bk_row;
    }

	$csv_file_content = wpbc_generate_csv_file_content( $export_collumn_titles, $export_bookings, $export_params_arr['csv_export_separator'] );

	return $csv_file_content;
}


	/**
	 * Get sorted list of field names (Titles) for CSV exporting and Remove some fields from  export
	 *
	 * @param array $export_collumn_titles
	 *
	 * @return array
	 */
	function wpbc_csv_sort_skip_titles(  $export_collumn_titles, $csv_export_skip_fields_arr ){

		// Fields that  will be skipped from Export
		$skip_fields = array(
			'google_calendar_link',
			'booking_options',
			'sync_gid',
			'booking_id',
			'booking_type',
			'pay_status',
			'status'
		);
		$csv_export_skip_fields_arr = array_map( 'trim', $csv_export_skip_fields_arr );
		$skip_fields = array_merge( $skip_fields, $csv_export_skip_fields_arr );

		$skip_fields = apply_filters( 'wpbc_csv_skip_titles_hook', $skip_fields );




		$possible_first_titles = array(
			'id',
			'booking_status',
			'approved',        /* 0 | 1 */
			'resource_title',
			'resource_id',     /* 0 | 1 */
			'booking_dates',
			'name',
			'secondname',
			'email',
			'cost',
			'currency_symbol',
			'pay_print_status',
			'is_paid',
			'pay_request',
			'sort_date',
			'modification_date'
		);

		$export_collumn_titles__sorted = array();

		// Add first fields,  if they  exist in original  fields array
		foreach (  $possible_first_titles as $sort_item  ) {

			if ( in_array( $sort_item, $export_collumn_titles  ) ) {
				$export_collumn_titles__sorted[] = $sort_item;
			}
		}

		// Add all  other fields to the list
		foreach ( $export_collumn_titles as $collumn_title ) {
			if ( ! in_array( $collumn_title, $export_collumn_titles__sorted  ) ) {
				$export_collumn_titles__sorted[] = $collumn_title;
			}
		}

		// Remove SKIPPED fields from array
		$export_collumn_titles__sorted   = array_diff( $export_collumn_titles__sorted, $skip_fields );

		// Define remark field at  the end of column list
		if ( in_array( 'remark', $export_collumn_titles__sorted ) ){                                                    //FixIn: 9.4.4.5
			$export_collumn_titles__sorted = array_diff( $export_collumn_titles__sorted, array( 'remark' ) );
			$export_collumn_titles__sorted[] = 'remark';
		}

		$export_collumn_titles__sorted = apply_filters( 'wpbc_csv_titles_hook', $export_collumn_titles__sorted );

	    return $export_collumn_titles__sorted;
	}


/**
 * Get content of CSV file
 *
 * @param array $export_collumn_titles      array of titles
 * @param array $export_bookings            array of booking fields
 *
 * @return string
 */
function wpbc_generate_csv_file_content($export_collumn_titles, $export_bookings, $csv_export_separator = '' ){

	if ( empty( $csv_export_separator ) ) {
		$line__separator = get_bk_option( 'booking_csv_export_separator' );
		if ( empty( $line__separator ) ) {
			$line__separator = ';';
		}
	} else {
		$line__separator = $csv_export_separator;
	}

	$line__separator = ( 'semicolon' == $line__separator ) ? ';' : $line__separator;
	$line__separator = ( 'comma' == $line__separator )     ? ',' : $line__separator;

	$csv_file_content = '';
	$write_line       = '';

	// Write Titles  ///////////////////////////////////////////////////////////////////////////////////////////////////
	foreach ( $export_collumn_titles as $line ) {
		$write_line .= "\"" . $line . "\"" . $line__separator;
	}
	$write_line       = substr_replace( $write_line, "", - 1 );    // replace last character "," in EOL
	$write_line       .= "\r\n";
	$csv_file_content .= $write_line;

	//  Write Row  /////////////////////////////////////////////////////////////////////////////////////////////////////
	foreach ( $export_bookings as $line ) {
		$write_line = '';

		foreach ( $export_collumn_titles as $key ) {    // Because titles have all keys, we loop keys from titles and then get and write values

			if ( isset( $line[ $key ] ) ) {
				$line[ $key ] = html_entity_decode( $line[ $key ], ENT_QUOTES, 'UTF-8' );
				$write_line   .= "\"" . $line[ $key ] . "\"" . $line__separator;
			} else {
				$write_line .= "\"" . "\"" . $line__separator;
			}
		}

		$write_line       = substr_replace( $write_line, "", - 1 );    // replace last character "," in EOL
		$write_line       .= "\r\n";

		$csv_file_content .= $write_line;
	}

	return $csv_file_content;
}