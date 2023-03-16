<?php
/*
This is COMMERCIAL SCRIPT
We are do not guarantee correct work and support of Booking Calendar, if some file(s) was modified by someone else then wpdevelop.
*/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  S Q L   Modifications  for  Booking Listing  ///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Resources
function get_l_bklist_sql_resources($blank, $wh_booking_type, $wh_approved, $wh_booking_date, $wh_booking_date2 ){

        global $wpdb;
        $sql_where = '';

        // BL                                                               // Childs in dif sub resources
        $sql_where.=   "        OR ( bk.booking_id IN (
                                                 SELECT DISTINCT booking_id
                                                 FROM {$wpdb->prefix}bookingdates as dtt
                                                 WHERE  " ;
        if ($wh_approved !== '')
                                $sql_where.=                  " dtt.approved = $wh_approved  AND " ;
        $sql_where.= wpbc_set_sql_where_for_dates($wh_booking_date, $wh_booking_date2, 'dtt.') ;

        $sql_where.=                                          "   (
                                                                dtt.type_id IN ( ". $wh_booking_type ." )
                                                                OR  dtt.type_id IN (
                                                                                     SELECT booking_type_id
                                                                                     FROM {$wpdb->prefix}bookingtypes as bt
                                                                                     WHERE  bt.parent IN ( ". $wh_booking_type ." )
                                                                                    )
                                                             )
                                                 )
                              ) " ;
        // BL                                                               // Just Childs sub resources
        $sql_where.=   "         OR ( bk.booking_type IN (
                                                     SELECT booking_type_id
                                                     FROM {$wpdb->prefix}bookingtypes as bt
                                                     WHERE  bt.parent IN ( ". $wh_booking_type ." )
                                                    )
                              )" ;

    return $sql_where;
}
add_bk_filter('get_l_bklist_sql_resources', 'get_l_bklist_sql_resources');


// Resources
function get_l_bklist_sql_resources_for_calendar_view($blank, $wh_booking_type, $wh_approved, $wh_booking_date, $wh_booking_date2 ){

        global $wpdb;
        $sql_where = '';

        // BL                                                               // Childs in dif sub resources
        $sql_where.=   "        OR ( bk.booking_id IN (
                                                 SELECT DISTINCT booking_id
                                                 FROM {$wpdb->prefix}bookingdates as dtt
                                                 WHERE  " ;
        if ($wh_approved !== '')
                                $sql_where.=                  " dtt.approved = $wh_approved  AND " ;
        $sql_where.= wpbc_set_sql_where_for_dates($wh_booking_date, $wh_booking_date2, 'dtt.') ;

        $sql_where.=                                          "   (
                                                                dtt.type_id IN ( ". $wh_booking_type ." )
                                                                OR  dtt.type_id IN (
                                                                                     SELECT booking_type_id
                                                                                     FROM {$wpdb->prefix}bookingtypes as bt
                                                                                     WHERE  bt.parent IN ( ". $wh_booking_type ." )
                                                                                    )
                                                             )
                                                 )
                              ) " ;
/*
        // BL                                                               // Just Childs sub resources
        $sql_where.=   "         OR ( bk.booking_type IN (
                                                     SELECT booking_type_id
                                                     FROM {$wpdb->prefix}bookingtypes as bt
                                                     WHERE  bt.parent IN ( ". $wh_booking_type ." )
                                                    )
                              )" ;
/**/
    return $sql_where;
}
add_bk_filter('get_l_bklist_sql_resources_for_calendar_view', 'get_l_bklist_sql_resources_for_calendar_view');


//FixIn: 6.1.1.9       
/**
	 * Check  if this resource child
 * 
 * @param true | false
 */
function wpbc_is_this_child_resource( $resource_id ) {
   
    if ( ! empty( $resource_id ) )																						//FixIn: 7.1.2.10
		$booking_resource_attr = get_booking_resource_attr( $resource_id );
	
    /**
    [booking_type_id] => 11
    [title] => Apartment#1-2
    [users] => 1
    [import] => 
    [cost] => 50
    [default_form] => standard
    [prioritet] => 2
    [parent] => 2
    [visitors] => 1
     */
    if ( ( ! empty( $resource_id ) ) && ( $booking_resource_attr->parent != 0 )    )
        return true;
    else 
        return false;
}

//FixIn: 9.1.2.7
/**
 * Check  if this resource parent
 *
 * @param $resource_id
 *
 * @return false|int    return  PARENT - number of child booking resources    if Single/child - 0 || false
 */
function wpbc_is_this_parent_resource( $resource_id ) {

	$child_resources_count = wpbc_get_child_resources_number( $resource_id );

	if ( $child_resources_count > 0 ) {
		return true;
	} else {
		return false;
	}
}

//FixIn: 9.1.2.7
/**
 * Get number of child booking resources
 *
 * @param $resource_id
 *
 * @return int    - number of child booking resources
 */
function wpbc_get_child_resources_number( $resource_id ) {
	if ( $resource_id < 1 ) {
		return 0;
	}
	global $wpdb;
	$mysql = $wpdb->prepare( "SELECT booking_type_id as id, prioritet  FROM {$wpdb->prefix}bookingtypes WHERE ( parent= %d )  ORDER BY prioritet", $resource_id );
	$types_list = $wpdb->get_results( $mysql );
	if ( count( $types_list ) > 0 ) {
		return count( $types_list );
	} else {
		return 0;
	}
}

/**
	 * Get ID of parent booking resource,  for this child resource
 * 
 * @param int $resource_id
 * @return int - ID of booking resource
 */
function wpbc_get_parent_resource( $resource_id ) {
    
    $booking_resource_attr = get_booking_resource_attr( $resource_id );
    
    return $booking_resource_attr->parent;
}

//FixIn: 8.7.1.6
function wpbc_get_featured_imge_url( $resource_id ){

	$booking_cache_content = get_bk_option( 'booking_cache_content' );

	if ( is_serialized( $booking_cache_content ) ) {
		$booking_cache_content = unserialize( $booking_cache_content );
	}

	if ( wpbc_is_this_child_resource( $resource_id ) ) {
		$resource_id = wpbc_get_parent_resource( $resource_id );
	}
	$image_src = '';
	if ( isset( $booking_cache_content[ $resource_id ]->picture ) ) {
		$image_src = $booking_cache_content[ $resource_id ]->picture;
		//$image_w = $booking_cache_content[ $resource_id ]->picture[1];
		//$image_h = $booking_cache_content[ $resource_id ]->picture[2];
	}
	if ( ! empty( $image_src ) ) {
		$image_src = $image_src[0];
	}
	return $image_src;
}

function wpbc_replace_params_for_booking_featured_image( $replace, $booking_id, $bktype, $formdata ){

	//FixIn: 8.7.1.6
    if ( function_exists( 'wpbc_get_featured_imge_url' ) ) {
    	$replace[ 'booking_featured_image' ] = wpbc_get_featured_imge_url( $bktype );
	}

	return $replace;
}
add_filter( 'wpbc_replace_params_for_booking', 'wpbc_replace_params_for_booking_featured_image', 10, 4 );