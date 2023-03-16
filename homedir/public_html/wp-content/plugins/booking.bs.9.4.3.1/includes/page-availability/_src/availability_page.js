"use strict";

/**
 * Request Object
 * Here we can  define Search parameters and Update it later,  when  some parameter was changed
 *
 */

var wpbc_ajx_availability = (function ( obj, $) {

	// Secure parameters for Ajax	------------------------------------------------------------------------------------
	var p_secure = obj.security_obj = obj.security_obj || {
															user_id: 0,
															nonce  : '',
															locale : ''
														  };

	obj.set_secure_param = function ( param_key, param_val ) {
		p_secure[ param_key ] = param_val;
	};

	obj.get_secure_param = function ( param_key ) {
		return p_secure[ param_key ];
	};


	// Listing Search parameters	------------------------------------------------------------------------------------
	var p_listing = obj.search_request_obj = obj.search_request_obj || {
																		// sort            : "booking_id",
																		// sort_type       : "DESC",
																		// page_num        : 1,
																		// page_items_count: 10,
																		// create_date     : "",
																		// keyword         : "",
																		// source          : ""
																	};

	obj.search_set_all_params = function ( request_param_obj ) {
		p_listing = request_param_obj;
	};

	obj.search_get_all_params = function () {
		return p_listing;
	};

	obj.search_get_param = function ( param_key ) {
		return p_listing[ param_key ];
	};

	obj.search_set_param = function ( param_key, param_val ) {
		// if ( Array.isArray( param_val ) ){
		// 	param_val = JSON.stringify( param_val );
		// }
		p_listing[ param_key ] = param_val;
	};

	obj.search_set_params_arr = function( params_arr ){
		_.each( params_arr, function ( p_val, p_key, p_data ){															// Define different Search  parameters for request
			this.search_set_param( p_key, p_val );
		} );
	}


	// Other parameters 			------------------------------------------------------------------------------------
	var p_other = obj.other_obj = obj.other_obj || { };

	obj.set_other_param = function ( param_key, param_val ) {
		p_other[ param_key ] = param_val;
	};

	obj.get_other_param = function ( param_key ) {
		return p_other[ param_key ];
	};


	return obj;
}( wpbc_ajx_availability || {}, jQuery ));



/**
 *   Show Content  ---------------------------------------------------------------------------------------------- */

/**
 * Show Content - Calendar and UI
 *
 * @param ajx_data
 * @param ajx_search_params
 */
function wpbc_ajx_availability__show( ajx_data_arr, ajx_search_params , ajx_cleaned_params ){


	var template__availability_main_page_content = wp.template( 'wpbc_ajx_availability_main_page_content' );

	// Content
	jQuery( wpbc_ajx_availability.get_other_param( 'listing_container' ) ).html( template__availability_main_page_content( {
																'ajx_data'              : ajx_data_arr,
																'ajx_search_params'     : ajx_search_params,								// $_REQUEST[ 'search_params' ]
																'ajx_cleaned_params'    : ajx_cleaned_params
									} ) );


	wpbc_ajx_availability__calendar_show( {
											'resource_id'       : ajx_cleaned_params.resource_id,
											'ajx_nonce_calendar': ajx_data_arr.ajx_nonce_calendar,
											'ajx_data_arr'          : ajx_data_arr,
											'ajx_cleaned_params'    : ajx_cleaned_params
										} );

}


function wpbc_ajx_availability__calendar_show( calendar_params_arr ){

	// Update nonce
	jQuery( '#ajx_nonce_calendar_section' ).html( calendar_params_arr.ajx_nonce_calendar );

	var months_num_in_row = 4;
	var cal_count = 12;
	var booking_timeslot_day_bg_as_available = '';
	var width = 'width:100%;max-width:100%;';				//var width = 'width:100%;max-width:' + ( months_num_in_row * 284 ) + 'px;';

	jQuery( '.wpbc_ajx_avy__calendar' ).html(

		'<div class="bk_calendar_frame months_num_in_row_' + months_num_in_row + ' cal_month_num_' + cal_count  + booking_timeslot_day_bg_as_available + '" style="' + width + '">'

			+ '<div id="calendar_booking' + calendar_params_arr.resource_id + '">' + 'Calendar is loading...' + '</div>'

		+ '</div>'

		+ '<textarea id="date_booking'  + calendar_params_arr.resource_id +  '" name="date_booking' + calendar_params_arr.resource_id + '" autocomplete="off" style="display:none0;width:100%;height:10em;margin:2em 0 0;"></textarea>'
	);


	var date_approved_par = [];
	var my_num_month = 12;
	var start_day_of_week = 1;
	var start_bk_month = false;
	avalaibility_filters[ calendar_params_arr.resource_id ] = [];
	is_all_days_available[ calendar_params_arr.resource_id ] = 1;


	//init_datepick_cal( calendar_params_arr.resource_id, date_approved_par, my_num_month, start_day_of_week, start_bk_month );

	var cal_param_arr = {
							'html_id'           : 'calendar_booking' + calendar_params_arr.ajx_cleaned_params.resource_id,
							'text_id'           : 'date_booking' + calendar_params_arr.ajx_cleaned_params.resource_id,

							'start_day_of_week' : 1,
							'number_of_months': 12,

							'resource_id'        : calendar_params_arr.ajx_cleaned_params.resource_id,
							'ajx_nonce_calendar' : calendar_params_arr.ajx_data_arr.ajx_nonce_calendar,
							'booked_dates'       : calendar_params_arr.ajx_data_arr.booked_dates,
							'season_availability': calendar_params_arr.ajx_data_arr.season_availability
						};
	wpbc_show_inline_booking_calendar( cal_param_arr );
}

var avalaibility_filters=[];
avalaibility_filters[ 1 ] = [];
is_all_days_available[ 1 ] = 1;


function wpbc_show_inline_booking_calendar( calendar_params_arr ){

        if ( jQuery( '#' + calendar_params_arr.html_id ).hasClass('hasDatepick') == true ) { // If the calendar with the same Booking resource is activated already, then exist.
            return false;
        }

        var cl = document.getElementById( calendar_params_arr.html_id );if (cl === null) return; // Get calendar instance and exit if its not exist

		var isRangeSelect = true;
		var bkMultiDaysSelect = 0;

        var bkMinDate = null;
        var bkMaxDate = '5y';

        // Configure and show calendar
		jQuery( '#' + calendar_params_arr.html_id ).text( '' );
		jQuery( '#' + calendar_params_arr.html_id ).datepick({
					beforeShowDay: function ( date ){
						return wpbc__inline_booking_calendar__apply_css_to_days( date, calendar_params_arr, this );
					},
                    onSelect: 			null,
                    onHover:			null,
                    onChangeMonthYear:	null,
                    showOn: 'both',
                    multiSelect: bkMultiDaysSelect,
                    numberOfMonths: calendar_params_arr.number_of_months,
                    stepMonths: 1,
                    prevText: '&laquo;',
                    nextText: '&raquo;',
                    dateFormat: 'dd.mm.yy',
                    changeMonth: false,
                    changeYear: false,
                    minDate: bkMinDate, maxDate: bkMaxDate, //'1Y',
                    // minDate: new Date(2020, 2, 1), maxDate: new Date(2020, 9, 31),             // Ability to set any  start and end date in calendar
                    showStatus: false,
                    multiSeparator: ', ',
                    closeAtTop: false,
                    firstDay:	calendar_params_arr.start_day_of_week,
                    gotoCurrent: false,
                    hideIfNoPrevNext:true,
                    rangeSelect:isRangeSelect,
                    // showWeeks: true,
                    useThemeRoller :false
                }
        );

        //FixIn: 7.1.2.8
        setTimeout( function ( ) {
            jQuery( '.datepick-days-cell.datepick-today.datepick-days-cell-over' ).removeClass( 'datepick-days-cell-over' );
        }, 500 );

}


	/**
	 * Apply CSS to calendar date cells
	 *
	 * @param date					-  JavaScript Date Obj:  		Mon Dec 11 2023 00:00:00 GMT+0200 (Eastern European Standard Time)
	 * @param calendar_params_arr	-  Calendar Settings Object:  	{
																	  "html_id": "calendar_booking4",
																	  "text_id": "date_booking4",
																	  "start_day_of_week": 1,
																	  "number_of_months": 12,
																	  "resource_id": 4,
																	  "ajx_nonce_calendar": "<input type=\"hidden\" ... />",
																	  "booked_dates": {
																		"12-28-2022": [
																		  {
																			"booking_date": "2022-12-28 00:00:00",
																			"approved": "1",
																			"booking_id": "26"
																		  }
																		], ...
																		}
																		'season_availability':{
																			"2023-01-09": true,
																			"2023-01-10": true,
																			"2023-01-11": true, ...
																		}
																	  }
																	}
	 * @param datepick_this			- this of datepick Obj
	 *
	 * @returns [boolean,string]	- [ {true -available | false - unavailable}, 'CSS classes for calendar day cell' ]
	 */
	function wpbc__inline_booking_calendar__apply_css_to_days( date, calendar_params_arr, datepick_this ){

		var today_date = new Date( wpbc_today[ 0 ], (parseInt( wpbc_today[ 1 ] ) - 1), wpbc_today[ 2 ], 0, 0, 0 );

		var class_day  = ( date.getMonth() + 1 ) + '-' + date.getDate() + '-' + date.getFullYear();						// '1-9-2023'
		var sql_class_day = date.getFullYear() + '-';
			sql_class_day += ( (date.getMonth() + 1) < 10 ) ? '0' : '';
			sql_class_day += (date.getMonth() + 1)+ '-'
			sql_class_day += ( date.getDate() < 10 ) ? '0' : '';
			sql_class_day += date.getDate();																			// '2023-01-09'

		var css_date__standard   =  'cal4date-' + class_day;
		var css_date__additional = ' wpbc_weekday_' + date.getDay() + ' ';

		//--------------------------------------------------------------------------------------------------------------

		// Set unavailable days Before / After the Today date
		if ( 	( (days_between( date, today_date )) < block_some_dates_from_today )
			 || (
					   ( typeof( wpbc_available_days_num_from_today ) !== 'undefined' )
					&& ( parseInt( '0' + wpbc_available_days_num_from_today ) > 0 )
					&& ( (days_between( date, today_date )) > parseInt( '0' + wpbc_available_days_num_from_today ) )
				)
		){
			return [ false, css_date__standard + ' date_user_unavailable' ];
		}

		//--------------------------------------------------------------------------------------------------------------

		var    is_date_available = calendar_params_arr.season_availability[ sql_class_day ];
		if ( ! is_date_available ){
			return [ false, css_date__standard
												+ ' date_user_unavailable'
												+ ' season_unavailable'
				   ];
		}

				//TODO:  Need to  execute this at  server side:
				// and probably need to send JSON array  instead of JS variables, as before:
				// $js_script_code = apply_filters('wpdev_booking_availability_filter', '', $request_params['resource_id']);

				// Is this date available depends on seasons availability at Booking > Resources > Availability page.
				if ( 'function' == typeof( is_this_day_available ) ){

					var is_day_available_arr = is_this_day_available( date, calendar_params_arr.resource_id );					// [ true|false , 'id_of_season' ]

					if (
						   (   is_day_available_arr instanceof Array )
						&& ( ! is_day_available_arr[ 0 ] )
					){
						return [  false, css_date__standard
																+ ' date_user_unavailable'
																+ ' season_unavailable'
																+ ' season_filter_id_' + is_day_available_arr[ 1 ]
							  ];
					}
				}

		//--------------------------------------------------------------------------------------------------------------

		css_date__additional += wpbc__inline_booking_calendar__days_css__get_rate( class_day, calendar_params_arr.resource_id );                // ' rate_100'
		css_date__additional += wpbc__inline_booking_calendar__days_css__get_season_names( class_day, calendar_params_arr.resource_id );        // ' weekend_season high_season'

		//--------------------------------------------------------------------------------------------------------------

		
		// Is any bookings in this date ?
		if ( 'undefined' !== typeof( calendar_params_arr.booked_dates[ class_day ] ) ) {

			var bookings_in_date = calendar_params_arr.booked_dates[ class_day ];


			// Loop in Object
			_.each( bookings_in_date, function ( p_val, p_key, p_data ) {
				// console.log( 'p_val, p_key, p_data',p_val, p_key, p_data);
			});

			// 			for ( var key of Object.keys( bookings_in_date ) ){
			// 				console.log( key + " -> " + bookings_in_date[ key ] );
			// 			}
			//
			// console.log( 'bookings_in_date', bookings_in_date );


			// Is this "Full day" booking ? (seconds == 0)
			if ( 'undefined' !== typeof( bookings_in_date[ 'sec_0' ] ) ) {

				css_date__additional += ( '0' === bookings_in_date[ 'sec_0' ].approved ) ? ' date2approve ' : ' date_approved ';				// Pending = '0' |  Approved = '1'

				return [ !false, css_date__standard + css_date__additional ];
			}

		}

		//--------------------------------------------------------------------------------------------------------------

		return [ true, css_date__standard + css_date__additional + ' date_available' ];
	}





/**
 *   Ajax  ------------------------------------------------------------------------------------------------------ */

/**
 * Send Ajax show request
 */
function wpbc_ajx_availability__ajax_request(){

console.groupCollapsed( 'WPBC_AJX_AVAILABILITY' ); console.log( ' == Before Ajax Send - search_get_all_params() == ' , wpbc_ajx_availability.search_get_all_params() );

	wpbc_availability_reload_button__spin_start();

	// Start Ajax
	jQuery.post( wpbc_global1.wpbc_ajaxurl,
				{
					action          : 'WPBC_AJX_AVAILABILITY',
					wpbc_ajx_user_id: wpbc_ajx_availability.get_secure_param( 'user_id' ),
					nonce           : wpbc_ajx_availability.get_secure_param( 'nonce' ),
					wpbc_ajx_locale : wpbc_ajx_availability.get_secure_param( 'locale' ),

					search_params	: wpbc_ajx_availability.search_get_all_params()
				},
				/**
				 * S u c c e s s
				 *
				 * @param response_data		-	its object returned from  Ajax - class-live-searcg.php
				 * @param textStatus		-	'success'
				 * @param jqXHR				-	Object
				 */
				function ( response_data, textStatus, jqXHR ) {

console.log( ' == Response WPBC_AJX_AVAILABILITY == ', response_data ); console.groupEnd();

					// Probably Error
					if ( (typeof response_data !== 'object') || (response_data === null) ){

						wpbc_ajx_availability__show_message( response_data );

						return;
					}

					// Reload page, after filter toolbar has been reset
					if (       (     undefined != response_data[ 'ajx_cleaned_params' ])
							&& ( 'reset_done' === response_data[ 'ajx_cleaned_params' ][ 'ui_reset' ])
					){
						location.reload();
						return;
					}

					// Show listing
					wpbc_ajx_availability__show( response_data[ 'ajx_data' ], response_data[ 'ajx_search_params' ] , response_data[ 'ajx_cleaned_params' ] );

					//wpbc_ajx_availability__define_ui_hooks();						// Redefine Hooks, because we show new DOM elements



					wpbc_availability_reload_button__spin_pause();

					jQuery( '#ajax_respond' ).html( response_data );		// For ability to show response, add such DIV element to page
				}
			  ).fail( function ( jqXHR, textStatus, errorThrown ) {    if ( window.console && window.console.log ){ console.log( 'Ajax_Error', jqXHR, textStatus, errorThrown ); }

					var error_message = '<strong>' + 'Error!' + '</strong> ' + errorThrown ;
					if ( jqXHR.status ){
						error_message += ' (<b>' + jqXHR.status + '</b>)';
						if (403 == jqXHR.status ){
							error_message += ' Probably nonce for this page has been expired. Please <a href="javascript:void(0)" onclick="javascript:location.reload();">reload the page</a>.';
						}
					}
					if ( jqXHR.responseText ){
						error_message += ' ' + jqXHR.responseText;
					}
					error_message = error_message.replace( /\n/g, "<br />" );

					wpbc_ajx_availability__show_message( error_message );
			  })
	          // .done(   function ( data, textStatus, jqXHR ) {   if ( window.console && window.console.log ){ console.log( 'second success', data, textStatus, jqXHR ); }    })
			  // .always( function ( data_jqXHR, textStatus, jqXHR_errorThrown ) {   if ( window.console && window.console.log ){ console.log( 'always finished', data_jqXHR, textStatus, jqXHR_errorThrown ); }     })
			  ;  // End Ajax

}



/**
 *   H o o k s  -  its Action/Times when need to re-Render Views  ----------------------------------------------- */

/**
 * Send Ajax Search Request after Updating search request parameters
 *
 * @param params_arr
 */
function wpbc_ajx_availability__send_request_with_params ( params_arr ){

	// Define different Search  parameters for request
	_.each( params_arr, function ( p_val, p_key, p_data ) {
		//console.log( 'Request for: ', p_key, p_val );
		wpbc_ajx_availability.search_set_param( p_key, p_val );
	});

	// Send Ajax Request
	wpbc_ajx_availability__ajax_request();
}


	/**
	 * Search request for "Page Number"
	 * @param page_number	int
	 */
	function wpbc_ajx_availability__pagination_click( page_number ){

		wpbc_ajx_availability__send_request_with_params( {
											'page_num': page_number
										} );
	}



/**
 *   Show / Hide Content  --------------------------------------------------------------------------------------- */

/**
 *  Show Listing Content 	- 	Sending Ajax Request	-	with parameters that  we early  defined
 */
function wpbc_ajx_availability__actual_content__show(){

	wpbc_ajx_availability__ajax_request();			// Send Ajax Request	-	with parameters that  we early  defined in "wpbc_ajx_booking_listing" Obj.
}

/**
 * Hide Listing Content
 */
function wpbc_ajx_availability__actual_content__hide(){

	jQuery(  wpbc_ajx_availability.get_other_param( 'listing_container' )  ).html( '' );
}



/**
 *   M e s s a g e  --------------------------------------------------------------------------------------------- */

/**
 * Show just message instead of content
 */
function wpbc_ajx_availability__show_message( message ){

	wpbc_ajx_availability__actual_content__hide();

	jQuery( wpbc_ajx_availability.get_other_param( 'listing_container' ) ).html(
												'<div class="wpbc-settings-notice notice-warning" style="text-align:left">' +
													message +
												'</div>'
										);
}



/**
 *   Support Functions - Spin Icon in Buttons  ------------------------------------------------------------------ */

/**
 * Spin button in Filter toolbar  -  Start
 */
function wpbc_availability_reload_button__spin_start(){
	jQuery( '#wpbc_availability_reload_button .menu_icon.wpbc_spin').removeClass( 'wpbc_animation_pause' );
}

/**
 * Spin button in Filter toolbar  -  Pause
 */
function wpbc_availability_reload_button__spin_pause(){
	jQuery( '#wpbc_availability_reload_button .menu_icon.wpbc_spin' ).addClass( 'wpbc_animation_pause' );
}

/**
 * Spin button in Filter toolbar  -  is Spinning ?
 *
 * @returns {boolean}
 */
function wpbc_availability_reload_button__is_spin(){
    if ( jQuery( '#wpbc_availability_reload_button .menu_icon.wpbc_spin' ).hasClass( 'wpbc_animation_pause' ) ){
		return true;
	} else {
		return false;
	}
}