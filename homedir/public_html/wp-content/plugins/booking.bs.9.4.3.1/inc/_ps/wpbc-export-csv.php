<?php /**
 * @version 1.0
 * @package Booking Calendar
 * @category CSV export of bookings listing
 * @author wpdevelop
 *
 * @web-site https://wpbookingcalendar.com/
 * @email info@wpbookingcalendar.com
 *
 * @modified 2021-11-19
 *
 * This is COMMERCIAL SCRIPT
 * We are do not guarantee correct work and support of Booking Calendar, if some file(s) was modified by someone else then wpdevelop.
 */
//FixIn: 8.9.1.4

if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit, if accessed directly


/**
 * Get URL to generate CSV of booking listing,
 * for using in the button at Booking Listing page (at action toolbar)
 *
 * @param $export_all_pages     'all' | 'page'
 *
 * @return string
 */
function wpbc_csv_get_url_for_button( $export_all_pages ){

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// SECRET KEY - for using in a path of CSV link
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$hash_obj      = new WPBC_Hash();
	$special_chars         = false;
	$extra_special_chars   = false;

	$wpbc_secret_hash_path = get_transient( 'booking_csv_secret_hash_path' );
	if ( empty( $wpbc_secret_hash_path ) ) {

		$wpbc_secret_hash_path = $hash_obj->generate_password( 50, $special_chars, $extra_special_chars );

		set_transient( 'booking_csv_secret_hash_path', $wpbc_secret_hash_path, 60 * 60 * 1 );      // 1 Hour transient
	}

	$secret_csv_url_path = "/" . $wpbc_secret_hash_path . "/wpbc_bookings.csv";


	// Request transient
	$bk_request_params = wpbc_get_clean_paramas_from_request_for_booking_listing();
	$bk_request_hash   = $hash_obj->generate_password( 5, $special_chars, $extra_special_chars );
	set_transient(    'booking_csv_secret_request_params_' . $bk_request_hash
					, $bk_request_params
					, 60 * 15                   // 15 minutes
					);

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// URL depend from  button
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	if ( 'page' === $export_all_pages ){

		$js_action = "var wpbc_csv_export_url='"
									. trim( home_url(), '/' ) . $secret_csv_url_path       // 'https://server.com' . '/secret_csv/wpbc_bookings.csv'
									."?csv_request_params="
														        . $bk_request_hash
		                                               . ""
		                           . "&export_all_pages=page"
	                               . "&selected_id="
	                                                   . "'+ get_selected_bookings_id_in_booking_listing() + '"
	                                             .""
						  . "';";
	} else {

		$js_action = "var wpbc_csv_export_url='"
		                            . trim( home_url(), '/' ) . $secret_csv_url_path        // 'https://server.com' . '/secret_csv/wpbc_bookings.csv'
									."?csv_request_params="
														        . $bk_request_hash
		                                               . ""
		                           . "&export_all_pages=all"
						  . "';";
	}


	return $js_action . ' console.log( wpbc_csv_export_url ); location.href = wpbc_csv_export_url; ';
}


/**
 * Export booking listing to  CSV,  by accessing secret link.
 *
 */
function wpbc_make_export_csv(){

	// Check URL  //////////////////////////////////////////////////////////////////////////////////////////////////////

	// Get path of request URL, e.g.: 'secret_csv/wpbc_bookings.csv'
	$my_parsed_url_path = wpbc_get_request_url_path();

	if ( false === $my_parsed_url_path ) {
		return false;                                                                   // seriously malformed URLs, parse_url() may return FALSE
	}

	// Get temporary  saved HASH  for csv URL path.... Please check more here >> wpbc_csv_get_url_for_button()
	$wpbc_secret_hash_path = get_transient( 'booking_csv_secret_hash_path' );

	if ( $wpbc_secret_hash_path . '/wpbc_bookings.csv' === $my_parsed_url_path ){	// Good it's CSV

		if ( ( WPBC_EXIST_NEW_BOOKING_LISTING ) && ( 'On' != get_bk_option( 'booking_is_use_old_booking_listing' ) ) ) {
			return false;                                                           // It's new CSV
		}
	} else {                                                                        // NOT CSV
		return false;
	}

	// Start check parameters  /////////////////////////////////////////////////////////////////////////////////////////

	// Un serialize booking data from  URL - it's our parameters for request
	if ( ! empty( $_GET['csv_request_params'] ) ) {

		$bk_request_hash = trim( $_GET['csv_request_params'] );

		$csv_request_params = get_transient( 'booking_csv_secret_request_params_' . $bk_request_hash );

		if ( false !== $csv_request_params ) {
			$csv_request_params = maybe_unserialize( $csv_request_params );
		}
	}

	if ( ! is_array( $csv_request_params ) ) {
		echo "CSV Error! Request parameter not correct: <br><br>|" . $_GET['csv_request_params'] .'|';
	}

	if ( ! empty( $_GET['export_all_pages'] ) ) {
		$is_export_all = str_replace( '\"', '"', $_GET['export_all_pages'] );
	} else {
		 $is_export_all = 'all';
	}

	if ( ! empty( $_GET['selected_id'] ) ) {
		$selected_id = str_replace( '\"', '"', $_GET['selected_id'] );
	} else {
		$selected_id = '';
	}


	// Get CSV content from  booking listing  //////////////////////////////////////////////////////////////////////////

	$csv_file_content = wpbc_get_csv_content_from_bookings( $csv_request_params, $is_export_all, $selected_id );

	if ( headers_sent() ){
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
	$file                 = array();
	$file['content_type'] = 'text/csv';
	$file['name']         = 'wpbc-bookings.csv';                                                                        // Real file name after downloading

	if ( function_exists( 'mb_detect_encoding' ) ){                      //FixIn: 2.0.5.3
		$text_encoding = mb_detect_encoding( $csv_file_content );
	} else {
		$text_encoding = '';        // Unknown
	}

	if (    ( is_array( $text_encoding ) )
	     && ( ! in_array( 'UTF-8', $text_encoding ) )
	) {
		$file['size'] = wpbc_get_bytes_from_str( $csv_file_content );
	} else {
		$file['size'] = 0;    // UTF-8 encoding,  so  size calculated incorrectly ... probably
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

	echo $csv_file_content;

	exit;
}
add_action( 'template_redirect', 'wpbc_make_export_csv' );



/**
 * Get CSV content from Booking Listing
 * - Get all bookings based on  request  parameters,
 * - Generate CSV content
 *
 * @param array $csv_request_params
 *                                  Array(
										    [wh_booking_type] => 3,4,1,5,6,7,8,9,2,10,11,12
										    [wh_approved] =>
										    [wh_booking_id] =>
										    [wh_is_new] =>
										    [wh_pay_status] => all
										    [wh_keyword] =>
										    [wh_booking_date] => 3
										    [wh_booking_date2] =>
										    [wh_modification_date] => 3
										    [wh_modification_date2] =>
										    [wh_cost] =>
										    [wh_cost2] =>
										    [or_sort] =>
										    [page_num] => 1
										    [wh_trash] => 0
										    [page_items_count] => 5
										)
 * @param string $is_export_all         'all' || 'page'
 * @param string $selected_id             ''  || '10|15|20'
 *
 * @return string
 */
function wpbc_get_csv_content_from_bookings( $csv_request_params , $is_export_all = 'all', $selected_id = ''){

    //  __('Processing','booking') . '...' , 3000 );
	$all_booking_types = wpdebk_get_keyed_all_bk_resources( array() );

	$args = $csv_request_params;

	if ( $is_export_all == 'all' ) {
		$args['page_num']         = 1;                                      // Start export from the first page
		$args['page_items_count'] = 100000;                                 // Expot ALL bookings - Maximum: 1 000 000
	}

	if ( $selected_id != '' ) {
		$selected_id = explode( '|', $selected_id );
	} else {
		$selected_id = array();
	}

//debuge($selected_id, $args);

    $bk_listing = wpbc_get_bookings_objects( $args );                       // Get Bookings structure
    $bookings           = $bk_listing[ 'bookings' ];
    $booking_types      = $bk_listing[ 'resources' ];
    $bookings_count     = $bk_listing[ 'bookings_count' ];
    $page_num           = $bk_listing[ 'page_num' ];
    $page_items_count   = $bk_listing[ 'count_per_page' ];

    $export_collumn_titles = array();

    //  __('Generating columns','booking') . '...' , 3000 );

    foreach ($bookings as $key=>$value) {
        //unset($bookings[$key]->dates);
        //unset($bookings[$key]->dates_short);
        //unset($bookings[$key]->dates_short_id);
        //unset($bookings[$key]->form_show);

        // Set  here booking resoutrces for the dates of reservation, which in different sub resources
	    for ( $ibt = 0; $ibt < count( $bookings[ $key ]->dates_short_id ); $ibt ++ ) {
		    if ( ! empty( $bookings[ $key ]->dates_short_id[ $ibt ] ) ) {
			    $bookings[ $key ]->dates_short[ $ibt ] .= ' (' . $all_booking_types[ $bookings[ $key ]->dates_short_id[ $ibt ] ]->title . ') ';
		    }
	    }

	    $bookings[ $key ]->dates_show = implode( ' ', $bookings[ $key ]->dates_short );

	    $fields = $bookings[ $key ]->form_data['_all_'];
	    if ( class_exists( 'wpdev_bk_multiuser' ) ) {                        //FixIn: 6.0.1.10
		    // Get  the owner of this booking resource
		    $user_bk_id = apply_bk_filter( 'get_user_of_this_bk_resource', false, $bookings[ $key ]->booking_type );
		    $user_data  = get_userdata( $user_bk_id );
		    if ( ( ! isset( $fields[ 'user' . $bookings[ $key ]->booking_type ] ) ) && ( isset( $user_data->data ) ) && ( isset( $user_data->data->display_name ) ) ) {
			    $fields[ 'user' . $bookings[ $key ]->booking_type ] = $user_data->data->display_name;
		    }
		    if ( ( isset( $user_data->data ) ) && ( isset( $user_data->data->display_name ) ) ) {
			    $bookings[ $key ]->form_data['_all_'][ 'user' . $bookings[ $key ]->booking_type ] = $user_data->data->display_name;
		    }
	    }

//debuge($bookings[$key]->booking_type, $fields);
	    foreach ( $fields as $field_key => $field_value ) {

		    $field_key = str_replace( '[', '', $field_key );
		    $field_key = str_replace( ']', '', $field_key );
		    if ( substr( $field_key, - 1 * ( strlen( $bookings[ $key ]->booking_type ) ) ) == $bookings[ $key ]->booking_type ) {
			    $field_key = substr( $field_key, 0, - 1 * ( strlen( $bookings[ $key ]->booking_type ) ) );
		    }
		//if ( ! in_array( $field_key, array( 'term_and_condition', 'secondname' ) ) ) // Skip  some fields
		    if ( ! in_array( $field_key, $export_collumn_titles ) ) {
			    $export_collumn_titles[] = $field_key;
		    }
	    }
    }

    //  __('Exporting booking data','booking') . '...' , 3000 );
    $export_bookings = array();
//debuge($bookings);
    foreach ($bookings as $key=>$value) {

	    if ( ! empty( $selected_id ) ) {     // We was selected some bookings, so we need to export only these selected bookings.
		    if ( in_array( $value->booking_id, $selected_id ) === false ) {
			    continue;
		    }
	    }

	    $export_bk_row                      = array();
	    $export_bk_row['dates']             = $value->dates_show;
	    $export_bk_row['id']                = $value->booking_id;
	    $export_bk_row['modification_date'] = $value->modification_date;
	    $export_bk_row['booking_type']      = $all_booking_types[ $value->booking_type ]->title;
	    $export_bk_row['remark']            = $value->remark;

	    if ( isset( $value->cost ) ) {
		    $export_bk_row['cost']       = $value->cost;
		    $export_bk_row['pay_status'] = $value->pay_status;
	    }
        $export_bk_row['trash'] = ( $value->trash == 1 ) ? '+' : '' ;		//FixIn: 8.3.3.7

	    $is_approved = 0;
	    if ( count( $value->dates ) > 0 ) {
		    $is_approved = $value->dates[0]->approved;
	    }
	    if ( $is_approved ) {
		    $bk_print_status = __( 'Approved', 'booking' );
	    } else {
		    $bk_print_status = __( 'Pending', 'booking' );
	    }
	    $export_bk_row['status'] = $bk_print_status;

	    foreach ( $export_collumn_titles as $field_key => $field_value ) {

		    if ( isset( $value->form_data['_all_'][ $field_value . $value->booking_type ] ) ) {
			    $export_bk_row[ $field_value ] = html_entity_decode( $value->form_data['_all_'][ $field_value . $value->booking_type ] );
		    }        //FixIn: 8.1.2.4
		    else {
			    $export_bk_row[ $field_value ] = '';
		    }
	    }

	    $export_bk_row     = str_replace( array(
											    "\n\r",
											    "\r",
											    "\n"
	                                            ), ' ', $export_bk_row );                            //FixIn: 8.1.1.3
	    $export_bookings[] = $export_bk_row;
    }

	// Write this collumns to the begining
	array_unshift( $export_collumn_titles, 'id', 'booking_type', 'status', 'dates', 'modification_date', 'cost', 'pay_status' );
	$export_collumn_titles[] = 'trash';        //FixIn: 8.3.3.7
	$export_collumn_titles[] = 'remark';

//debuge( $export_collumn_titles, $export_bookings);

   //  __('Generating content of file' ,'booking') , 3000 );

//       $message = wp_upload_dir();
//       if ( ! empty ($message['error']) ) {
//           wpbc_show_ajax_message( $message['error'] , 3000 );
//           die;
//       }
//       // $bk_baseurl = $message['baseurl'];
//       $bk_upload_dir = $message['basedir'];

	$line__separator = get_bk_option( 'booking_csv_export_separator' );
	if ( empty( $line__separator ) ) {
		$line__separator = ';';
	}

	$csv_file_content = '';
	$write_line       = '';

    // Write Titles
	foreach ( $export_collumn_titles as $line ) {
		$write_line .= "\"" . $line . "\"" . $line__separator;
	}
	$write_line       = substr_replace( $write_line, "", - 1 );    // replace last charcater "," in EOL
	$write_line       .= "\r\n";
	$csv_file_content .= $write_line;

   // Write Values
	foreach ( $export_bookings as $line ) {
		$write_line = '';

		foreach ( $export_collumn_titles as $key ) {    // Because titles have all keys, we loop keys from titles and then get and write values

			if ( isset( $line[ $key ] ) ) {
				$line[ $key ] = html_entity_decode( $line[ $key ], ENT_QUOTES, 'UTF-8' );
				$write_line .= "\"" . $line[ $key ] . "\"" . $line__separator;
			} else {
				$write_line .= "\"" . "\"" . $line__separator;
			}

		}

		$write_line       = substr_replace( $write_line, "", - 1 );    // replace last charcater "," in EOL
		$write_line       .= "\r\n";
		$csv_file_content .= $write_line;

	}

   return $csv_file_content;
}