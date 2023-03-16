<?php /**
 * @version 1.0
 * @description WPBC_AJX__Availability
 * @category  WPBC_AJX__Availability Class
 * @author wpdevelop
 *
 * @web-site http://oplugins.com/
 * @email info@oplugins.com
 *
 * @modified 2022-10-24
 */

if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit if accessed directly


class WPBC_AJX__Availability {

	// <editor-fold     defaultstate="collapsed"                        desc=" ///  JS | CSS files | Tpl loading  /// "  >

		/**
		 * Define HOOKs for loading CSS and  JavaScript files
		 */
		public function init_load_css_js_tpl() {

			// Load only  at  specific  Page
			if  ( strpos( $_SERVER['REQUEST_URI'], 'page=wpbc-availability' ) !== false ) {

				add_action( 'wpbc_enqueue_js_files',  array( $this, 'js_load_files' ),     50 );
				add_action( 'wpbc_enqueue_css_files', array( $this, 'enqueue_css_files' ), 50 );

				add_action( 'wpbc_hook_settings_page_footer', array( $this, 'hook__page_footer_tmpl' ) );
			}
		}


		/** JS */
		public function js_load_files( $where_to_load ) {

			$in_footer = true;

			if ( ( is_admin() ) && ( in_array( $where_to_load, array( 'admin', 'both' ) ) ) ) {

				wp_enqueue_script(    'wpbc-ajx_availability_page'
									, trailingslashit( plugins_url( '', __FILE__ ) ) . '_out/availability_page.js'         /* wpbc_plugin_url( '/_out/js/codemirror.js' ) */
									, array( 'wpbc-global-vars' ), '1.0', $in_footer );

				wp_enqueue_script( 'wpbc-main-client', wpbc_plugin_url( '/js/client.js' ),     array( 'wpbc-datepick' ),    WP_BK_VERSION_NUM );
				wp_enqueue_script( 'wpbc-times',       wpbc_plugin_url( '/js/wpbc_times.js' ), array( 'wpbc-main-client' ), WP_BK_VERSION_NUM );
				/**
				 *
				 * wp_localize_script( 'wpbc-global-vars', 'wpbc_live_request_obj'
				 * , array(
				 * 'ajx_booking'  => '',
				 * 'reminders' => ''
				 * )
				 * );
				 */
			}
		}


		/** CSS */
		public function enqueue_css_files( $where_to_load ) {

			if ( ( is_admin() ) && ( in_array( $where_to_load, array( 'admin', 'both' ) ) ) ) {

				wp_enqueue_style( 'wpbc-ajx_availability_page'
								, trailingslashit( plugins_url( '', __FILE__ ) ) . '_out/availability_page.css'          //, wpbc_plugin_url( '/includes/listing_ajx_booking/o-ajx_booking-listing.css' )
								, array(), WP_BK_VERSION_NUM );
			}
		}

	// </editor-fold>


	// <editor-fold     defaultstate="collapsed"                        desc=" ///  R e q u e s t  /// "  >

	/**
	 * Get params names for escaping and/or default value of such  params
	 *
	 * @return array        array (  'resource_id'      => array( 'validate' => 'digit_or_csd',  	'default' => array( '1' ) )
	 *                             , ... )
	 */
	static public function request_rules_structure(){

		return  array(
												 // 'digit_or_csd' can check about 'digit_or_csd' in arrays, as well
			  'resource_id' 	=> array( 'validate' => 'd',  	'default' => 1 )	                                                // if ['0'] - All  booking resources

			, 'dates_selection' => array( 'validate' => 's', 'default' => '' )
			, 'dates_status'    => array( 'validate' => array( 'unavailable', 'available' ),     'default' => 'available' )

 			, 'ui_usr__availability_selected_toolbar'   => array( 'validate' => array( 'info', 'calendar_settings' ),     'default' => 'info' )
			, 'ui_reset'  			            		=> array( 'validate' => 's',  	                    'default' => '' )				// string
			//			, 'ui_wh_booking_date_checkout'     => array( 'validate' => 'digit_or_date',  	'default' => '' )		                    // number | date 2016-07-20
			//			, 'wh_modification_date' 			=> array( 'validate' => 'array',  	'default' => array( "3" ) )		                    // number | date 2016-07-20
			//			, 'ui_wh_modification_date_radio'   => array( 'validate' => 'd',  	            'default' => 0 )		                    // '1' | '2' ....
			//			, 'keyword'     			        => array( 'validate' => 's',  	            'default' => '' )			                //string
			//			, 'wh_cost'  		                => array( 'validate' => 'float_or_empty',  	            'default' => '' )			    // '1' | ''
			//			, 'ui_usr__send_emails'             => array( 'validate' => array( 'send', 'not_send' ),                  'default' => 'send' )
		);

	}


		/**
		 * Get default params
		 *
		 * @return array        array (  'ui_wh_modification_date_radio' => 0
		 *                             , ... )
		 */
		static public function get__request_values__default() {

			$request_rules_structure = self::request_rules_structure();

			$default_params_arr = array();

			$structure_type = 'default';

			foreach ( $request_rules_structure as $key => $value ) {
				$default_params_arr[ $key ] = $value[ $structure_type ];
			}

			return $default_params_arr;
		}

	// </editor-fold>



	// <editor-fold     defaultstate="collapsed"                        desc=" ///  Templates  /// "  >

		// Templates ===================================================================================================

		/**
		 * Templates at footer of page
		 *
		 * @param $page string
		 */
		public function hook__page_footer_tmpl( $page ){

			// page=wpbc&view_mode=vm_booking_listing
			if ( 'wpbc-ajx_booking_availability'  === $page ) {		// from >>	do_action( 'wpbc_hook_settings_page_footer', 'wpbc-ajx_booking_availability' ); as availability_page.php in bottom  of content method
				$this->template__main_page_content();

				$this->template_toolbar_select_booking_resource();

				$this->template__widget_available_unavailable();
				$this->template__widget_calendar_legend();
			}
		}


		/**
		 * Template
		 *
		 * 	Help Tips:
		 *
		 *		<script type="text/html" id="tmpl-template_name_a">
		 * 			Escaped:  	 {{data.test_key}}
		 * 			HTML:  		{{{data.test_key}}}
		 * 			JS: 	  	<# if (true) { alert( 1 ); } #>
		 * 		</script>
		 *
		 * 		var template__var = wp.template( 'template_name_a' );
		 *
		 * 		jQuery( '.content' ).html( template__var( { 'test_key' => '<strong>Data</strong>' } ) );
		 *
		 * @return void
		 */
		private function template__main_page_content() {
			?><script type="text/html" id="tmpl-wpbc_ajx_availability_main_page_content">
				<div class="wpbc_ajx_avy__container">
					<div class="wpbc_ajx_avy__section_left">
						<div class="wpbc_ajx_avy__calendar"><?php _e('Calendar is loading...', 'booking'); ?></div>
					</div>
					<div class="wpbc_ajx_avy__section_right">
						<div class="wpbc_widgets">
						<# <?php if (0) { ?><script type="text/javascript"><?php } ?>

							var wpbc_ajx_select_booking_resource = wp.template( 'wpbc_ajx_select_booking_resource' );
							jQuery( '#wpbc_hidden_template__select_booking_resource').html( wpbc_ajx_select_booking_resource( data	) );

							var wpbc_widget__available_unavailable = wp.template( 'wpbc_ajx_widget_available_unavailable' );
							var wpbc_widget__calendar_legend       = wp.template( 'wpbc_ajx_widget_calendar_legend' );

						<?php if (0) { ?></script><?php } ?>
						#>

						{{{   	wpbc_widget__available_unavailable( data.ajx_cleaned_params )	}}}
						{{{  	wpbc_widget__calendar_legend( { } )   		}}}

						</div>
					</div>
				</div>
			</script><?php
		}


		private function template__widget_available_unavailable(){

		    ?><script type="text/html" id="tmpl-wpbc_ajx_widget_available_unavailable">
				<div class="wpbc_widget wpbc_widget_available_unavailable">
					<div class="wpbc_widget_header">
						<span class="wpbc_widget_header_text"><?php _e('Apply availability', 'booking'); ?></span>
						<a href="/" class="wpbc_widget_header_settings_link"><i class="menu_icon icon-1x wpbc_icn_settings"></i></a>
					</div>
					<div class="wpbc_widget_content wpbc_ajx_toolbar" style="margin:0 0 20px;">
						<div class="ui_container" >
							<div class="ui_group    ui_group__available_unavailable"><?php

								//	Available 		Radio
								?><div class="ui_element ui_nowrap"><?php
									wpbc_ajx_avy__ui__available_radio();
								?></div><?php


								//	Unavailable 	Radio
								?><div class="ui_element ui_nowrap"><?php
									wpbc_ajx_avy__ui__unavailable_radio();
								?></div><?php

								// Set checked specific Radio button,  depends on  last action  from  user
								?><# <?php if (0) { ?><script type="text/javascript"><?php } ?>

									jQuery( document ).ready( function (){
										if ( 'unavailable' == data.dates_status ){
											jQuery( '#ui_btn_avy__set_days_availability__unavailable' ).prop( 'checked', true );//.change();
										}
										if ( 'available' == data.dates_status ){
											jQuery( '#ui_btn_avy__set_days_availability__available' ).prop( 'checked', true );//.change();
										}
									} );

								<?php if (0) { ?></script><?php } ?> #><?php


								//	Apply 			Button
								?><div class="ui_element"><?php
									wpbc_ajx_avy__ui__availability_apply_btn();
								?></div>

							</div>
						</div>
					</div>
				</div>
			</script><?php
		}


		private function template__widget_calendar_legend(){

		    ?><script type="text/html" id="tmpl-wpbc_ajx_widget_calendar_legend">
				<div class="wpbc_widget wpbc_widget_calendar_legend">
					<div class="wpbc_widget_header">
						<span class="wpbc_widget_header_text"><?php _e('Calendar Legend', 'booking'); ?></span>
						<a href="/" class="wpbc_widget_header_settings_link"><i class="menu_icon icon-1x wpbc_icn_settings"></i></a>
					</div>
					<div class="wpbc_widget_content wpbc_ajx_toolbar" style="margin:0 0 20px;">
						<div class="ui_container" >
							<div class="ui_group    ui_group__available_unavailable"><?php

								?><div class="ui_element ui_nowrap"><?php

									//echo wpbc_replace_shortcodes_in_booking_form__legend_items( '[legend_items]' );
									echo wpbc_replace_shortcodes_in_booking_form__legend_items(
												'[legend_items items="available,unavailable,pending,approved,partially" text_for_day_cell="' . date( 'd' ) . '"]'
										);
									// echo wpbc_replace_shortcodes_in_booking_form__legend_items( '[legend_items is_vertical="1"]' );
									// wpbc_get_calendar_legend();														//FixIn: 9.4.3.6

								?></div><?php

							?>
							</div>
						</div>
					</div>
				</div>
				<style type="text/css">
					.wpbc_ajx_toolbar .ui_container .ui_group .ui_element > .block_hints.datepick {
						height: auto;
						margin: 8px 0 0 !important;
					}
				</style>
			</script><?php
		}


		private function template_toolbar_select_booking_resource(){

			// Template
			?><script type="text/html" id="tmpl-wpbc_ajx_select_booking_resource"><?php

				if ( ! class_exists('wpdev_bk_personal') ) {
					echo '</script>';
					return  false;
				}
				/*
				?><# console.log( ' == TEMPLATE PARAMS "wpbc_ajx_change_booking_resource" == ', data ); #><?php
				*/
				$booking_action = 'select_booking_resource';

				$el_id = 'ui_btn_' . $booking_action;

				if ( ! wpbc_is_user_can( $booking_action, wpbc_get_current_user_id() ) ) {
					echo '</script>';
					return false;
				}


						?><div class="ui_element"><?php

							wpbc_flex_label(
												array(
													  'id' 	  => $el_id
													, 'label' => '<span class="" style="font-weight:600;">' . __( 'Booking resource', 'booking' ) . ':</span>'
												)
										   );

							?><select class="wpbc_ui_control wpbc_ui_select change_booking_resource_selectbox"
									  id="<?php echo $el_id; ?>" name="<?php echo $el_id; ?>"

									  <?php /* ?>onfocus="javascript:console.log( 'ON FOCUS:', jQuery( this ).val(), 'in element:' , jQuery( this ) );"<?php /**/ ?>

									  onchange="javascript:wpbc_ajx_availability__send_request_with_params( {
																												'resource_id': 	 jQuery( this ).val()
																										} );"

							  ><#
								_.each( data.ajx_data.ajx_booking_resources, function ( p_resource, p_resource_id, p_data ){
									#><option value="{{p_resource.booking_type_id}}"
											  <#
												if ( data.ajx_cleaned_params.resource_id == p_resource.booking_type_id ) {
													#> selected="SELECTED" <#
												}
											  #>
											  style="<#
														if( undefined != p_resource.parent ) {
															if( '0' == p_resource.parent ) {
																#>font-weight:600;<#
															} else {
																#>font-size:0.95em;padding-left:20px;<#
															}
														}
													#>"
									><#
										if( undefined != p_resource.parent ) {
											if( '0' != p_resource.parent ) {
												#>&nbsp;&nbsp;&nbsp;<#
											}
										}
									#>{{p_resource.title}}</option><#
								});
							#>
							</select><?php

						?></div>

						<div class="ui_element"><?php

							?><div class="wpbc_ui_separtor" style="margin-left: 8px;"></div><?php

						?></div><?php

			?></script><?php
		}

	// </editor-fold>



	// <editor-fold     defaultstate="collapsed"                        desc=" ///  A J A X  /// "  >

		// A J A X =====================================================================================================

		/**
		 * Define HOOKs for start  loading Ajax
		 */
		public function define_ajax_hook(){

			// Ajax Handlers.		Note. "locale_for_ajax" rechecked in wpbc-ajax.php
			add_action( 'wp_ajax_'		     . 'WPBC_AJX_AVAILABILITY', array( $this, 'ajax_' . 'WPBC_AJX_AVAILABILITY' ) );	    // Admin & Client (logged in usres)

			// Ajax Handlers for actions
			//add_action( 'wp_ajax_'		     . 'WPBC_AJX_BOOKING_ACTIONS', 			'wpbc_ajax_' . 'WPBC_AJX_BOOKING_ACTIONS' );

			// add_action( 'wp_ajax_nopriv_' . 'WPBC_AJX_BOOKING_LISTING', array( $this, 'ajax_' . 'WPBC_AJX_BOOKING_LISTING' ) );	    // Client         (not logged in)
		}



		/**
		 * Ajax - Get Listing Data and Response to JS script
		 */
		public function ajax_WPBC_AJX_AVAILABILITY() {

			if ( ! isset( $_POST['search_params'] ) || empty( $_POST['search_params'] ) ) { exit; }

			// Security  -----------------------------------------------------------------------------------------------    // in Ajax Post:   'nonce': wpbc_ajx_booking_listing.get_secure_param( 'nonce' ),
			$action_name    = 'wpbc_ajx_availability_ajx' . '_wpbcnonce';
			$nonce_post_key = 'nonce';
			$result_check   = check_ajax_referer( $action_name, $nonce_post_key );

			$user_id = ( isset( $_REQUEST['wpbc_ajx_user_id'] ) )  ?  intval( $_REQUEST['wpbc_ajx_user_id'] )  :  wpbc_get_current_user_id();

			/**
			 * SQL  ---------------------------------------------------------------------------
			 *
			 * in Ajax Post:  'search_params': wpbc_ajx_booking_listing.search_get_all_params()
			 *
			 * Use prefix "search_params", if Ajax sent -
			 *                 $_REQUEST['search_params']['page_num'], $_REQUEST['search_params']['page_items_count'],..
			 */

			$user_request = new WPBC_AJX__REQUEST( array(
													   'db_option_name'          => 'booking_availability_request_params',
													   'user_id'                 => $user_id,
													   'request_rules_structure' => WPBC_AJX__Availability::request_rules_structure()
													)
							);
			$request_prefix = 'search_params';
			$request_params = $user_request->get_sanitized__in_request__value_or_default( $request_prefix  );		 		// NOT Direct: 	$_REQUEST['search_params']['resource_id']

			//----------------------------------------------------------------------------------------------------------

			$data_arr = array();

			$data_arr['booked_dates'] = wpbc__sql__get_booked_dates( array(
																			'resource_id' => $request_params['resource_id']
																		) );
			$data_arr['booked_dates'] = wpbc__sql__get_booked_dates( array(
																			'resource_id' => $request_params['resource_id']
																		) );

			$data_arr['season_availability'] = wpbc__sql__get_season_availability( array(
																			'resource_id' => $request_params['resource_id']
																		) );

			//----------------------------------------------------------------------------------------------------------

			// Get booking resources (sql)
			$resources_arr = wpbc_ajx_get_all_booking_resources_arr();          /**
																				 * Array (   [0] => Array (     [booking_type_id] => 1
																												[title] => Standard
																												[users] => 1
																												[import] =>
																												[export] =>
																												[cost] => 25
																												[default_form] => standard
																												[prioritet] => 0
																												[parent] => 0
																												[visitors] => 2
																					), ...                  */

			$resources_arr_sorted = wpbc_ajx_get_sorted_booking_resources_arr( $resources_arr );

			$data_arr['ajx_booking_resources'] = $resources_arr_sorted;

			//----------------------------------------------------------------------------------------------------------

			$data_arr['ajx_nonce_calendar'] = wp_nonce_field( 'CALCULATE_THE_COST', 'wpbc_nonce' . 'CALCULATE_THE_COST' . $request_params['resource_id'], true, false );



			// Clear here DATES selection in $request_params['dates_selection'] to  not save such  selection

			if ( 'make_reset' === $request_params['ui_reset'] ) {

				$is_reseted = $user_request->user_request_params__db_delete();											// Delete from DB

				$request_params['ui_reset'] = $is_reseted ? 'reset_done' : 'reset_error';
			} else {
				$is_success_update = $user_request->user_request_params__db_save( $request_params );					// Save to DB		// - $request_params - serialized here automatically
			}

			//----------------------------------------------------------------------------------------------------------
			// Send JSON. Its will make "wp_json_encode" - so pass only array, and This function call wp_die( '', '', array( 'response' => null, ) )		Pass JS OBJ: response_data in "jQuery.post( " function on success.
			wp_send_json( array(
								'ajx_data'              => $data_arr,
								'ajx_search_params'     => $_REQUEST[ $request_prefix ],								// $_REQUEST[ 'search_params' ]
								'ajx_cleaned_params'    => $request_params
							) );
		}

	// </editor-fold>

}

/**
 * Just for loading CSS and  JavaScript files
 */
if ( true ) {
	$ajx_availability_loading = new WPBC_AJX__Availability;
	$ajx_availability_loading->init_load_css_js_tpl();
	$ajx_availability_loading->define_ajax_hook();
}