<?php /**
 * @version 1.1
 * @package Any
 * @category Toolbar for Availability page. UI Elements for Admin Panel
 * @author wpdevelop
 *
 * @web-site http://oplugins.com/
 * @email info@oplugins.com
 *
 * @modified 2022-11-18
 */

if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit, if accessed directly

////////////////////////////////////////////////////////////////////////////////
//   T o o l b a r s
////////////////////////////////////////////////////////////////////////////////


/**
 * Show top toolbar on Booking Listing page
 *
 * @param $escaped_search_request_params   	-	escaped search request parameters array
 */
function wpbc_ajx_availability__toolbar( $escaped_search_request_params ) {

    wpbc_clear_div();

    //  Toolbar ////////////////////////////////////////////////////////////////

	$default_param_values = WPBC_AJX__Availability::get__request_values__default();

	$selected_tab = $escaped_search_request_params['ui_usr__availability_selected_toolbar'];

    ?><div id="toolbar_booking_availability" class="wpbc_ajx_toolbar"><?php

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Info
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		?><div><?php //Required for bottom border radius in container

			?><div class="ui_container    ui_container_toolbar		ui_container_mini    ui_container_info    ui_container_filter_row_1" style="<?php echo ( 'info' == $selected_tab ) ? 'display: flex' : 'display: none' ?>;"><?php

				// Here will be composed template with  real HTML
				?><div class="ui_group"  id="wpbc_hidden_template__select_booking_resource" ><?php  					//	array( 'class' => 'group_nowrap' )	// Elements at Several or One Line
					// Resource select-box here. 																		Defined as template at: 	private function template_toolbar_select_booking_resource(){
				?></div><?php

				?><div class="ui_group"><?php  																			//	array( 'class' => 'group_nowrap' )	// Elements at Several or One Line

					wpbc_ajx_avy__ui__info( $escaped_search_request_params, $default_param_values );

				?></div><?php

			?></div><?php

		?></div><?php //Required for bottom border radius in container


		// <editor-fold     defaultstate="collapsed"                        desc="   C a l e n d a r    S e t t i n g s  "  >

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// C a l e n d a r    S e t t i n g s
		////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		?><div class="ui_container    ui_container_toolbar		ui_container_small    ui_container_options    ui_container_actions_row_1" style="<?php echo ( 'calendar_settings' == $selected_tab ) ? 'display: flex' : 'display: none' ?>;"><?php

			?><div class="ui_group"><?php

				//	Approve		//	Pending
				?><div class="ui_element hide_button_if_no_selection"><?php
					wpbc_ajx__ui__action_button__approve( $escaped_search_request_params );
					wpbc_ajx__ui__action_button__pending( $escaped_search_request_params );
				?></div><?php

				//	Trash / Reject 		//	Restore 		//	Delete
				?><div class="ui_element hide_button_if_no_selection"><?php
					wpbc_ajx__ui__action_button__trash( $escaped_search_request_params );
					wpbc_ajx__ui__action_button__restore( $escaped_search_request_params );
					wpbc_ajx__ui__action_button__delete( $escaped_search_request_params );
					wpbc_ajx__ui__action_text__delete_reason( $escaped_search_request_params );
				?></div><?php

				//	Empty Trash
				?><div class="ui_element"><?php
					wpbc_ajx__ui__action_button__empty_trash( $escaped_search_request_params );
				?></div><?php

				//	Read All 		//	Read 		//	Unread
				?><div class="ui_element"><?php
					wpbc_ajx__ui__action_button__readall( $escaped_search_request_params );
					wpbc_ajx__ui__action_button__read( $escaped_search_request_params );
					wpbc_ajx__ui__action_button__unread( $escaped_search_request_params );
				?></div><?php

				//	Print
				?><div class="ui_element"><?php
					wpbc_ajx__ui__action_button__print( $escaped_search_request_params );
				?></div><?php

				//	Import
				?><div class="ui_element"><?php
					wpbc_ajx__ui__action_button__import( $escaped_search_request_params );
				?></div><?php

				//	Export page to CSV 		//	Export all pages to CSV
				?><div class="ui_element"><?php
					wpbc_ajx__ui__action_button__export_csv( $escaped_search_request_params );
					// wpbc_ajx__ui__action_button__export_csv_page( $escaped_search_request_params );
					// wpbc_ajx__ui__action_button__export_csv_all( $escaped_search_request_params );
				?></div><?php

			?></div><?php

		?></div><?php
		// </editor-fold>


	?></div><?php
}


/**
 *  Costs 	Min - Max
 *
 * @param $escaped_search_request_params   	-	escaped search request parameters array
 * @param $defaults							-   default parameters values
 */
function wpbc_ajx_avy__ui__info( $escaped_search_request_params, $defaults ){

	$params_addon = array(
						  'type'        => 'span'
						, 'html'        => '<span style="font-size: 1.05em;line-height: 1.8em;">'.
											   sprintf( __('%sSelect days%s in calendar then select %sAvailable / Unavailable%s status and click %sApply availability%s button' ,'booking')
														, '<strong>', '&nbsp;</strong>'
														, '<strong>&nbsp;', '&nbsp;</strong>'
														, '<strong>&nbsp;', '&nbsp;</strong>'
											   )
											.'</span>'
						//, 'icon'        =>  array( 'icon_font' => 'wpbc_icn_info_outline', 'position' => 'left', 'icon_img' => '' )
						, 'class'       => 'wpbc_ui_button0 inactive0'
						, 'style'       => 'height:auto;'
						//, 'hint' 	=> array( 'title' => __('Filter bookings by booking dates' ,'booking') , 'position' => 'top' )
						, 'attr'        => array()
					);

	?><div class="ui_element" style="margin: auto;"><?php

		wpbc_flex_addon( $params_addon );

	?></div><?php

}



////////////////////////////////////////////////////////////////////////////////
//   T e m p l a t e s    UI
////////////////////////////////////////////////////////////////////////////////


function wpbc_ajx_avy__ui__available_radio(){

		$booking_action = 'set_days_availability';

		$el_id = 'ui_btn_avy__' . $booking_action . '__available';

		//if ( ! wpbc_is_user_can( $booking_action, wpbc_get_current_user_id() ) ) { 	return false; 	}

		wpbc_flex_vertical_color( array(	'vertical_line' => 'border-left: 4px solid #11be4c;' 	) );				// Green line

		?><span class="wpbc_ui_control wpbc_ui_button" style="padding-right: 8px;"><?php
			$params_radio = array(
							  'id'       => $el_id 				// HTML ID  of element
							, 'name'     => $booking_action
							, 'label'    => array( 'title' => __('Available' ,'booking') , 'position' => 'right' )
							, 'style'    => 'margin:1px 0 0;' 					// CSS of select element
									, 'class'    => '' 					// CSS Class of select element
									, 'disabled' => false
									, 'attr'     => array() 			// Any  additional attributes, if this radio | checkbox element
									, 'legend'   => ''					// aria-label parameter
									, 'value'    => 'available' 		// Some Value from options array that selected by default
									, 'selected' => !false 				// Selected or not
									//, 'onfocus' =>  "console.log( 'ON FOCUS:',  jQuery( this ).is(':checked') , 'in element:' , jQuery( this ) );"					// JavaScript code
									//, 'onchange' => "console.log( 'ON CHANGE:', jQuery( this ).val() , 'in element:' , jQuery( this ) );"							// JavaScript code
								);
			wpbc_flex_radio( $params_radio );

		?></span><?php


		$params_dropdown = array(
				  'id'      => 'wh_approved'
				, 'is_use_for_template' => true
				, 'default' => '0'	// isset( $escaped_search_request_params['wh_approved'] ) ? $escaped_search_request_params['wh_approved'] : $defaults['wh_approved']
				, 'label' 	=> ''	// __('Status', 'booking') . ':'
				//, 'title' 	=> __('Status', 'booking')
				, 'attr'		=> array( 'style' => 'border-left: none;padding-left: 8px;' ) 					// CSS style to A element
				, 'hint' 		=> array( 'title' => __('Filter bookings by booking status' ,'booking') , 'position' => 'top' )
				, 'li_options' 	=> array (
										'0' => __( '', 'booking' ),
										'1' => __( 'Approved', 'booking' ),
										'divider1' => array( 'type' => 'html', 'html' => '<hr/>' ),
										// 'header1' => array( 'type' => 'header', 'title' => __( 'Default', 'booking' ) ),
										'any' => array(
													'type'     => 'simple',
													'value'    => '',
													// 'disabled' => true,
													'title'    => __( 'Any', 'booking' )
												),
										 )
		);

//		wpbc_flex_dropdown( $params_dropdown );

}


function wpbc_ajx_avy__ui__unavailable_radio(){


		$booking_action = 'set_days_availability';

		$el_id = 'ui_btn_avy__' . $booking_action . '__unavailable';

		//if ( ! wpbc_is_user_can( $booking_action, wpbc_get_current_user_id() ) ) { 	return false; 	}

		wpbc_flex_vertical_color( array(	'vertical_line' => 'border-left: 4px solid #e43939;' 	) );				// Green line

		?><span class="wpbc_ui_control wpbc_ui_button" style="padding-right: 8px;"><?php
			$params_radio = array(
							  'id'       => $el_id 				// HTML ID  of element
							, 'name'     => $booking_action
							, 'label'    => array( 'title' => __('Unavailable' ,'booking') , 'position' => 'right' )
							, 'style'    => 'margin:1px 0 0;' 					// CSS of select element
									, 'class'    => '' 					// CSS Class of select element
									, 'disabled' => false
									, 'attr'     => array() 			// Any  additional attributes, if this radio | checkbox element
									, 'legend'   => ''					// aria-label parameter
									, 'value'    => 'unavailable' 		// Some Value from options array that selected by default
									, 'selected' => !false 				// Selected or not
									//, 'onfocus' =>  "console.log( 'ON FOCUS:',  jQuery( this ).is(':checked') , 'in element:' , jQuery( this ) );"					// JavaScript code
									//, 'onchange' => "console.log( 'ON CHANGE:', jQuery( this ).val() , 'in element:' , jQuery( this ) );"							// JavaScript code
								);
			wpbc_flex_radio( $params_radio );

		?></span><?php

}


function wpbc_ajx_avy__ui__availability_apply_btn(){

	$params_button = array(
			  'type' => 'button'
			, 'title' => 'Apply'                     // Title of the button
			, 'hint' => ''                      // , 'hint' => array( 'title' => __('Select status' ,'booking') , 'position' => 'bottom' )
			, 'link' => 'javascript:void(0)'    // Direct link or skip  it
			, 'action' => "console.log( 'ON CLICK:', jQuery( '[name=\"set_days_availability\"]:checked' ).val() , jQuery( 'textarea[id^=\"date_booking\"]' ).val() );"                    // Some JavaScript to execure, for example run  the function
						. "		wpbc_ajx_availability__send_request_with_params( {
															  'dates_status': 	 jQuery( '[name=\"set_days_availability\"]:checked' ).val()
															, 'dates_selection': jQuery( 'textarea[id^=\"date_booking\"]' ).val()
														} );
						  "
			, 'class' => 'wpbc_ui_button_primary'     				  // wpbc_ui_button  | wpbc_ui_button_primary
			, 'icon' => array( 'icon_font' => 'wpbc_icn_check', 'position' => 'left', 'icon_img' => '' )
			//, 'icon_position' => 'left'         // Position  of icon relative to Text: left | right
			, 'style' => ''                     // Any CSS class here
			, 'mobile_show_text' => false       // Show  or hide text,  when viewing on Mobile devices (small window size).
			, 'attr' => array()
	);

	wpbc_flex_button( $params_button );
}