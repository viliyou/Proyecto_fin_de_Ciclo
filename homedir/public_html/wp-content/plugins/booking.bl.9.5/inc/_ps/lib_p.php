<?php
/*
This is COMMERCIAL SCRIPT
We are do not guarantee correct work and support of Booking Calendar, if some file(s) was modified by someone else then wpdevelop.
*/

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  S u p p o r t    f u n c t i o n s       ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
        // Get COUNT of booking resources.
        function get_booking_resources_count(){
            global $wpdb;
            $sql_count  = " SELECT COUNT(*) as count FROM {$wpdb->prefix}bookingtypes as bt" ;

            $where = '';
            $where = apply_bk_filter('multiuser_modify_SQL_for_current_user', $where);
            if ($where != '') $where = ' WHERE ' . $where;
            if ( class_exists('wpdev_bk_biz_l')) {
                if ($where != '')   $where .= ' AND bt.parent = 0 ';
                else                $where .= ' WHERE bt.parent = 0 ';
            }
            if (isset($_REQUEST['wh_resource_id'])) {
                 if ($where == '') $where .= " WHERE " ;
                 else $where .= " AND ";
                 
                 
                 $sql_wh_resource_id    = intval( $_REQUEST['wh_resource_id'] );
                 $sql_wh_resource_title = wpbc_clean_like_string_for_db( $_REQUEST['wh_resource_id'] );
                 $where .= " ( (bt.booking_type_id = '{$sql_wh_resource_id}') OR (bt.title like '%%{$sql_wh_resource_title}%%') ) ";
            }

            $booking_resources_count = $wpdb->get_results(  $sql_count . $where  );
            return $booking_resources_count[0]->count;
        }

        /**
	 * Get array of booking resources Objects
         * 
         * @return array
         */
        function wpbc_get_br_as_objects(){
            
            $br_cache = wpbc_br_cache();  // Init booking resources cache
            
            $all_resources = $br_cache->get_resources();           

            foreach ($all_resources as $key => $value) {
                 $all_resources[$key] = json_decode( json_encode( $value ) );       // Turn array into an object
                 $all_resources[$key]->ID = $all_resources[$key]->id;
            }
            
            return $all_resources;
        }
    

        
        function get__default_type(){

            if ( class_exists('wpdev_bk_multiuser')) {  // If MultiUser so
                $bk_multiuser = apply_bk_filter( 'get_default_bk_resource_for_user' , false );
                if ($bk_multiuser !== false) return $bk_multiuser;
            }

            global $wpdb;
            $mysql = "SELECT booking_type_id as id FROM  {$wpdb->prefix}bookingtypes ORDER BY id ASC LIMIT 1";
            $types_list = $wpdb->get_results( $mysql );
            if (count($types_list) > 0 ) $types_list = $types_list[0]->id;
            else $types_list =1;
            return $types_list;
                    
        }

        
        function get_booking_title( $type_id = 1){
            global $wpdb;
            $type_id = intval($type_id);
            $types_list = $wpdb->get_results( "SELECT title FROM {$wpdb->prefix}bookingtypes  WHERE booking_type_id = {$type_id}" );
            if ($types_list)
                return strip_tags( $types_list[0]->title );                                                                //FixIn: 8.8.3.17
            else
                return '';
        }


        function get_booking_resource_attr( $type_id = '' ){
            global $wpdb;
            $type_id = intval($type_id);
            if (! empty($type_id) ) {
                $types_list = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}bookingtypes  WHERE booking_type_id = {$type_id}" );
                if ($types_list)
                    return $types_list[0];
                else
                    return false;
            } else {
                $types_list = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}bookingtypes" );
                if ($types_list)
                    return $types_list;
                else
                    return false;                
            }
        }


        function wpdebk_get_keyed_all_bk_resources($blank){
            // Get All Booking types in array with Keys using bk res ID
            $booking_types = array();
            $booking_types_res = wpbc_get_br_as_objects();
            foreach ($booking_types_res as $value) {
                $booking_types[$value->id] = $value;
            }
            return $booking_types;
        }
        add_bk_filter('wpdebk_get_keyed_all_bk_resources', 'wpdebk_get_keyed_all_bk_resources');


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  Filters interface     Controll elements  ///////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

        // Get the sort options for the filter at the booking listing page
        function get_p_bk_filter_sort_options($wpdevbk_selectors_def){

              $wpdevbk_selectors = array(__('ID' ,'booking').'&nbsp;<i class="wpbc_icn_north "></i>' =>'',
                               __('Dates' ,'booking').'&nbsp;<i class="wpbc_icn_north "></i>' =>'sort_date',
                               __('Resource' ,'booking').'&nbsp;<i class="wpbc_icn_north "></i>' =>'booking_type',
                               'divider0'=>'divider',
                               __('ID' ,'booking').'&nbsp;<i class="wpbc_icn_south "></i>' =>'booking_id_asc',
                               __('Dates' ,'booking').'&nbsp;<i class="wpbc_icn_south "></i>' =>'sort_date_asc',
                               __('Resource' ,'booking').'&nbsp;<i class="wpbc_icn_south "></i>' =>'booking_type_asc'
                              );
              return $wpdevbk_selectors;
        }
        add_bk_filter('bk_filter_sort_options', 'get_p_bk_filter_sort_options');


                              
    ////////////////////////////////////////////////////////////////////////////
    //  S Q L   Modifications  for  Booking Listing  ///////////////////////////
    ////////////////////////////////////////////////////////////////////////////

        // Keyword
        function get_p_bklist_sql_keyword($blank, $wh_keyword ){
            $sql_where = '';
			global $wpdb;

            if ( $wh_keyword !== '' ) {
	            $sql_where .= " AND  ( bk.form LIKE '%" . $wpdb->esc_like($wh_keyword) . "%' ";
	            $sql_where .= " OR  bk.sync_gid LIKE '%" . $wpdb->esc_like($wh_keyword) . "%' ";    //FixIn: 8.5.1.1
	            $sql_where .= " OR  bk.remark LIKE '%" . $wpdb->esc_like($wh_keyword) . "%' ";		 //FixIn: 8.5.1.1
				$sql_where .= ")";
            }
            return $sql_where;
        }
        add_bk_filter('get_bklist_sql_keyword', 'get_p_bklist_sql_keyword');


        // Resources
        function get_p_bklist_sql_resources($blank, $wh_booking_type, $wh_approved, $wh_booking_date, $wh_booking_date2 ){
            global $wpdb;
            $sql_where = '';

            if ( ! empty($wh_booking_type) )  {
                // P
                $sql_where.=   " AND (  " ;
                $sql_where.=   "       ( bk.booking_type IN  ( ". $wh_booking_type ." ) ) " ;     // BK Resource conections

                if ( ( isset($_REQUEST['view_mode']) ) && ( $_REQUEST['view_mode']== 'vm_calendar' ) ) {
                    // Skip the bookings from the children  resources, if we are in the Calendar view mode at the admin panel
                    $sql_where .= apply_bk_filter('get_l_bklist_sql_resources_for_calendar_view', ''  , $wh_booking_type, $wh_approved, $wh_booking_date, $wh_booking_date2 );
                } else {
                    //  BL
                    $sql_where .= apply_bk_filter('get_l_bklist_sql_resources', ''  , $wh_booking_type, $wh_approved, $wh_booking_date, $wh_booking_date2 );
                }
                // P
                $sql_where.=   "     )  " ;
            }

            return $sql_where;
        }
        add_bk_filter('get_bklist_sql_resources', 'get_p_bklist_sql_resources');

    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  A D M I N    B O O K I N G     C A L E N D A R      O V E R V I E W     P A N E L     //////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Get inline title for days in admin panel at calendar
        function get_title_for_showing_in_day( $bk_id, $bookings, $what_show_in_day_template='[id]'){
            /* ?></div></div></div></div><?php
            debuge($bk_id, $bookings[$bk_id]->form_data['_all_fields_']);/**/

            $x_pos = $y_pos = 0;
            $x_pos = strpos($what_show_in_day_template,'[' ) ;
            $y_pos = strpos($what_show_in_day_template,']' ) ;

            while ($x_pos !== false) {

                $what_show_in_day_title = substr( $what_show_in_day_template, ($x_pos+1), ($y_pos- $x_pos-1) ) ;
                switch ($what_show_in_day_title) {
                  case 'id':
                      $title_in_day =  $bk_id ; break;
                  default:
                     //$title_in_day  =   $bookings[$bk_id]->form_data['_all_'][ $what_show_in_day_title . $bookings[$bk_id]->booking_type ] ;    break;
                     if ( isset($bookings[$bk_id]->form_data['_all_fields_'][ $what_show_in_day_title ]) ) 
                            $title_in_day  =   $bookings[$bk_id]->form_data['_all_fields_'][ $what_show_in_day_title ] ;    
                     else   $title_in_day  =  '';
                     break;

                }

                $what_show_in_day_template = substr( $what_show_in_day_template, 0, $x_pos) . $title_in_day . substr( $what_show_in_day_template, ($y_pos+1) );

                if ( ($x_pos !== false) && ($x_pos<= strlen($what_show_in_day_template))  )
                            $x_pos = strpos($what_show_in_day_template,'[', $x_pos) ;
                else        $x_pos = false;
                if ($x_pos !== false)  $y_pos = strpos($what_show_in_day_template,']', $x_pos) ;

            }
            return  $what_show_in_day_template;
        }


/**
 * Use simple booking form -- checkbox at toolbar  in Booking > Settings > Form page.
 */
function toolbar_use_simple_booking_form(){                                                                             //FixIn: 8.2.1.23

	$submit_form_name = 'form_is_use_simple_booking_form';

	if ( ( isset($_POST[ 'is_form_sbmitted_' .  $submit_form_name ] )) && ( ! empty( $_POST[ 'is_form_sbmitted_' .  $submit_form_name ] ) ) ) {

		// Nonce checking    {Return false if invalid, 1 if generated between, 0-12 hours ago, 2 if generated between 12-24 hours ago. }
		$nonce_gen_time = check_admin_referer( 'wpbc_settings_page_' . $submit_form_name  );  // Its stop show anything on submiting, if its not refear to the original page

		$is_use_simple_booking_form = isset( $_POST[ 'is_use_simple_booking_form' ] ) ? 'On' : 'Off';

		// Save Changes
		update_bk_option( 'booking_is_use_simple_booking_form' , $is_use_simple_booking_form );

		wpbc_show_changes_saved_message();

		// Reload Page
		?><script type="text/javascript"> window.location.href='<?php echo wpbc_get_settings_url() . '&tab=form'; ?>'; </script><?php
	}

	$is_use_simgple_form = get_bk_option( 'booking_is_use_simple_booking_form' );


	?><form name="<?php echo $submit_form_name; ?>" action="" method="post" id="<?php echo $submit_form_name; ?>"><?php

		wp_nonce_field( 'wpbc_settings_page_' . $submit_form_name );
		?><input type="hidden" name="is_form_sbmitted_<?php echo $submit_form_name; ?>" id="is_form_sbmitted_<?php echo $submit_form_name; ?>" value="1" /><?php

		?><div class="control-group wpbc-no-padding" id="wpbc_save_simple_booking_form"><?php
			?><div class="btn-group" style="margin-top:5px;">
				<fieldset>
					<label for="is_use_simple_booking_form" style="display: inline-block;">
						<input style="margin:0 4px 2px;"
							   <?php if ( 'On' === $is_use_simgple_form ) {
							   		echo ' checked="CHECKED" ';
							   } ?>
							   id="is_use_simple_booking_form" name="is_use_simple_booking_form" class="tooltip_top" title=""
							   data-original-title="<?php esc_attr_e('Check the box, if you want to use simple booking form customization from Free plugin version at Settings - Form page.' ,'booking'); ?>"
							   type="checkbox"
							   onchange="javascript: document.forms['<?php echo $submit_form_name; ?>'].submit(); "
						/>
						<?php echo __('Simple' ,'booking') . ' ' . __('Booking Form', 'booking'); ?>
					</label>
				</fieldset>
			</div><?php

		?></div><?php
	?></form><?php
}


//FixIn: 8.7.3.2

/**
 * Get path  to DIR with CSV file
 *
 * @return string
 */
function wpbc_get_csv_dir() {

	return WP_CONTENT_DIR . '/' . 'wpbc_csv';
}

/**
 * Create wpbc_csv folder for csv files exporting
 */
function wpbc_create_csv_dir() {

	$wpbc_dir = wpbc_get_csv_dir();

	if ( ! is_dir( $wpbc_dir ) ) {

		mkdir( $wpbc_dir, 0755, true );
	}

	$index_file = $wpbc_dir . '/index.html';
	if ( ! file_exists( $index_file ) ) {
		$handle = fopen( $index_file, 'w' );
		fclose( $handle );
	}

	$server_type = wpbc_get_server_type();

	if ( $server_type == 'apache' || $server_type == 'litespeed' ) {
		$file = $wpbc_dir . '/.htaccess';
		if ( ! file_exists( $file ) ) {
			// Create an .htacces file  with  rules which will only allow people originating from wp admin page to download the DB backup
			$rules        = '';
			$rules        .= 'order deny,allow' . PHP_EOL;
			$rules        .= 'deny from all' . PHP_EOL;
			$write_result = file_put_contents( $file, $rules );
			if ( $write_result === false ) {
				// Creation of .htaccess file in " . AIO_WP_SECURITY_BACKUPS_DIR_NAME . " directory failed!
			}
		}
	}
}

/**
 * Gets server type
 *
 * @return string or -1 if server is not supported
 */
function wpbc_get_server_type() {
	//figure out what server they're using
	if ( strstr( strtolower( filter_var( $_SERVER['SERVER_SOFTWARE'], FILTER_SANITIZE_STRING ) ), 'apache' ) ) {
		return 'apache';
	} else if ( strstr( strtolower( filter_var( $_SERVER['SERVER_SOFTWARE'], FILTER_SANITIZE_STRING ) ), 'nginx' ) ) {
		return 'nginx';
	} else if ( strstr( strtolower( filter_var( $_SERVER['SERVER_SOFTWARE'], FILTER_SANITIZE_STRING ) ), 'litespeed' ) ) {
		return 'litespeed';
	} else if ( strstr( strtolower( filter_var( $_SERVER['SERVER_SOFTWARE'], FILTER_SANITIZE_STRING ) ), 'iis' ) ) {
		return 'iis';
	} else { //unsupported server
		return - 1;
	}
}
