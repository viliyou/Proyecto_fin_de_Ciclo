"use strict";
/**
 * Request Object
 * Here we can  define Search parameters and Update it later,  when  some parameter was changed
 *
 */

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var wpbc_ajx_availability = function (obj, $) {
  // Secure parameters for Ajax	------------------------------------------------------------------------------------
  var p_secure = obj.security_obj = obj.security_obj || {
    user_id: 0,
    nonce: '',
    locale: ''
  };

  obj.set_secure_param = function (param_key, param_val) {
    p_secure[param_key] = param_val;
  };

  obj.get_secure_param = function (param_key) {
    return p_secure[param_key];
  }; // Listing Search parameters	------------------------------------------------------------------------------------


  var p_listing = obj.search_request_obj = obj.search_request_obj || {// sort            : "booking_id",
    // sort_type       : "DESC",
    // page_num        : 1,
    // page_items_count: 10,
    // create_date     : "",
    // keyword         : "",
    // source          : ""
  };

  obj.search_set_all_params = function (request_param_obj) {
    p_listing = request_param_obj;
  };

  obj.search_get_all_params = function () {
    return p_listing;
  };

  obj.search_get_param = function (param_key) {
    return p_listing[param_key];
  };

  obj.search_set_param = function (param_key, param_val) {
    // if ( Array.isArray( param_val ) ){
    // 	param_val = JSON.stringify( param_val );
    // }
    p_listing[param_key] = param_val;
  };

  obj.search_set_params_arr = function (params_arr) {
    _.each(params_arr, function (p_val, p_key, p_data) {
      // Define different Search  parameters for request
      this.search_set_param(p_key, p_val);
    });
  }; // Other parameters 			------------------------------------------------------------------------------------


  var p_other = obj.other_obj = obj.other_obj || {};

  obj.set_other_param = function (param_key, param_val) {
    p_other[param_key] = param_val;
  };

  obj.get_other_param = function (param_key) {
    return p_other[param_key];
  };

  return obj;
}(wpbc_ajx_availability || {}, jQuery);
/**
 *   Show Content  ---------------------------------------------------------------------------------------------- */

/**
 * Show Content - Calendar and UI
 *
 * @param ajx_data
 * @param ajx_search_params
 */


function wpbc_ajx_availability__show(ajx_data_arr, ajx_search_params, ajx_cleaned_params) {
  var template__availability_main_page_content = wp.template('wpbc_ajx_availability_main_page_content'); // Content

  jQuery(wpbc_ajx_availability.get_other_param('listing_container')).html(template__availability_main_page_content({
    'ajx_data': ajx_data_arr,
    'ajx_search_params': ajx_search_params,
    // $_REQUEST[ 'search_params' ]
    'ajx_cleaned_params': ajx_cleaned_params
  }));
  wpbc_ajx_availability__calendar_show({
    'resource_id': ajx_cleaned_params.resource_id,
    'ajx_nonce_calendar': ajx_data_arr.ajx_nonce_calendar,
    'ajx_data_arr': ajx_data_arr,
    'ajx_cleaned_params': ajx_cleaned_params
  });
}

function wpbc_ajx_availability__calendar_show(calendar_params_arr) {
  // Update nonce
  jQuery('#ajx_nonce_calendar_section').html(calendar_params_arr.ajx_nonce_calendar);
  var months_num_in_row = 4;
  var cal_count = 12;
  var booking_timeslot_day_bg_as_available = '';
  var width = 'width:100%;max-width:100%;'; //var width = 'width:100%;max-width:' + ( months_num_in_row * 284 ) + 'px;';

  jQuery('.wpbc_ajx_avy__calendar').html('<div class="bk_calendar_frame months_num_in_row_' + months_num_in_row + ' cal_month_num_' + cal_count + booking_timeslot_day_bg_as_available + '" style="' + width + '">' + '<div id="calendar_booking' + calendar_params_arr.resource_id + '">' + 'Calendar is loading...' + '</div>' + '</div>' + '<textarea id="date_booking' + calendar_params_arr.resource_id + '" name="date_booking' + calendar_params_arr.resource_id + '" autocomplete="off" style="display:none0;width:100%;height:10em;margin:2em 0 0;"></textarea>');
  var date_approved_par = [];
  var my_num_month = 12;
  var start_day_of_week = 1;
  var start_bk_month = false;
  avalaibility_filters[calendar_params_arr.resource_id] = [];
  is_all_days_available[calendar_params_arr.resource_id] = 1; //init_datepick_cal( calendar_params_arr.resource_id, date_approved_par, my_num_month, start_day_of_week, start_bk_month );

  var cal_param_arr = {
    'html_id': 'calendar_booking' + calendar_params_arr.ajx_cleaned_params.resource_id,
    'text_id': 'date_booking' + calendar_params_arr.ajx_cleaned_params.resource_id,
    'start_day_of_week': 1,
    'number_of_months': 12,
    'resource_id': calendar_params_arr.ajx_cleaned_params.resource_id,
    'ajx_nonce_calendar': calendar_params_arr.ajx_data_arr.ajx_nonce_calendar,
    'booked_dates': calendar_params_arr.ajx_data_arr.booked_dates,
    'season_availability': calendar_params_arr.ajx_data_arr.season_availability
  };
  wpbc_show_inline_booking_calendar(cal_param_arr);
}

var avalaibility_filters = [];
avalaibility_filters[1] = [];
is_all_days_available[1] = 1;

function wpbc_show_inline_booking_calendar(calendar_params_arr) {
  if (jQuery('#' + calendar_params_arr.html_id).hasClass('hasDatepick') == true) {
    // If the calendar with the same Booking resource is activated already, then exist.
    return false;
  }

  var cl = document.getElementById(calendar_params_arr.html_id);
  if (cl === null) return; // Get calendar instance and exit if its not exist

  var isRangeSelect = true;
  var bkMultiDaysSelect = 0;
  var bkMinDate = null;
  var bkMaxDate = '5y'; // Configure and show calendar

  jQuery('#' + calendar_params_arr.html_id).text('');
  jQuery('#' + calendar_params_arr.html_id).datepick({
    beforeShowDay: function beforeShowDay(date) {
      return wpbc__inline_booking_calendar__apply_css_to_days(date, calendar_params_arr, this);
    },
    onSelect: null,
    onHover: null,
    onChangeMonthYear: null,
    showOn: 'both',
    multiSelect: bkMultiDaysSelect,
    numberOfMonths: calendar_params_arr.number_of_months,
    stepMonths: 1,
    prevText: '&laquo;',
    nextText: '&raquo;',
    dateFormat: 'dd.mm.yy',
    changeMonth: false,
    changeYear: false,
    minDate: bkMinDate,
    maxDate: bkMaxDate,
    //'1Y',
    // minDate: new Date(2020, 2, 1), maxDate: new Date(2020, 9, 31),             // Ability to set any  start and end date in calendar
    showStatus: false,
    multiSeparator: ', ',
    closeAtTop: false,
    firstDay: calendar_params_arr.start_day_of_week,
    gotoCurrent: false,
    hideIfNoPrevNext: true,
    rangeSelect: isRangeSelect,
    // showWeeks: true,
    useThemeRoller: false
  }); //FixIn: 7.1.2.8

  setTimeout(function () {
    jQuery('.datepick-days-cell.datepick-today.datepick-days-cell-over').removeClass('datepick-days-cell-over');
  }, 500);
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


function wpbc__inline_booking_calendar__apply_css_to_days(date, calendar_params_arr, datepick_this) {
  var today_date = new Date(wpbc_today[0], parseInt(wpbc_today[1]) - 1, wpbc_today[2], 0, 0, 0);
  var class_day = date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear(); // '1-9-2023'

  var sql_class_day = date.getFullYear() + '-';
  sql_class_day += date.getMonth() + 1 < 10 ? '0' : '';
  sql_class_day += date.getMonth() + 1 + '-';
  sql_class_day += date.getDate() < 10 ? '0' : '';
  sql_class_day += date.getDate(); // '2023-01-09'

  var css_date__standard = 'cal4date-' + class_day;
  var css_date__additional = ' wpbc_weekday_' + date.getDay() + ' '; //--------------------------------------------------------------------------------------------------------------
  // Set unavailable days Before / After the Today date

  if (days_between(date, today_date) < block_some_dates_from_today || typeof wpbc_available_days_num_from_today !== 'undefined' && parseInt('0' + wpbc_available_days_num_from_today) > 0 && days_between(date, today_date) > parseInt('0' + wpbc_available_days_num_from_today)) {
    return [false, css_date__standard + ' date_user_unavailable'];
  } //--------------------------------------------------------------------------------------------------------------


  var is_date_available = calendar_params_arr.season_availability[sql_class_day];

  if (!is_date_available) {
    return [false, css_date__standard + ' date_user_unavailable' + ' season_unavailable'];
  } //TODO:  Need to  execute this at  server side:
  // and probably need to send JSON array  instead of JS variables, as before:
  // $js_script_code = apply_filters('wpdev_booking_availability_filter', '', $request_params['resource_id']);
  // Is this date available depends on seasons availability at Booking > Resources > Availability page.


  if ('function' == typeof is_this_day_available) {
    var is_day_available_arr = is_this_day_available(date, calendar_params_arr.resource_id); // [ true|false , 'id_of_season' ]

    if (is_day_available_arr instanceof Array && !is_day_available_arr[0]) {
      return [false, css_date__standard + ' date_user_unavailable' + ' season_unavailable' + ' season_filter_id_' + is_day_available_arr[1]];
    }
  } //--------------------------------------------------------------------------------------------------------------


  css_date__additional += wpbc__inline_booking_calendar__days_css__get_rate(class_day, calendar_params_arr.resource_id); // ' rate_100'

  css_date__additional += wpbc__inline_booking_calendar__days_css__get_season_names(class_day, calendar_params_arr.resource_id); // ' weekend_season high_season'
  //--------------------------------------------------------------------------------------------------------------
  // Is any bookings in this date ?

  if ('undefined' !== typeof calendar_params_arr.booked_dates[class_day]) {
    var bookings_in_date = calendar_params_arr.booked_dates[class_day]; // Loop in Object

    _.each(bookings_in_date, function (p_val, p_key, p_data) {// console.log( 'p_val, p_key, p_data',p_val, p_key, p_data);
    }); // 			for ( var key of Object.keys( bookings_in_date ) ){
    // 				console.log( key + " -> " + bookings_in_date[ key ] );
    // 			}
    //
    // console.log( 'bookings_in_date', bookings_in_date );
    // Is this "Full day" booking ? (seconds == 0)


    if ('undefined' !== typeof bookings_in_date['sec_0']) {
      css_date__additional += '0' === bookings_in_date['sec_0'].approved ? ' date2approve ' : ' date_approved '; // Pending = '0' |  Approved = '1'

      return [!false, css_date__standard + css_date__additional];
    }
  } //--------------------------------------------------------------------------------------------------------------


  return [true, css_date__standard + css_date__additional + ' date_available'];
}
/**
 *   Ajax  ------------------------------------------------------------------------------------------------------ */

/**
 * Send Ajax show request
 */


function wpbc_ajx_availability__ajax_request() {
  console.groupCollapsed('WPBC_AJX_AVAILABILITY');
  console.log(' == Before Ajax Send - search_get_all_params() == ', wpbc_ajx_availability.search_get_all_params());
  wpbc_availability_reload_button__spin_start(); // Start Ajax

  jQuery.post(wpbc_global1.wpbc_ajaxurl, {
    action: 'WPBC_AJX_AVAILABILITY',
    wpbc_ajx_user_id: wpbc_ajx_availability.get_secure_param('user_id'),
    nonce: wpbc_ajx_availability.get_secure_param('nonce'),
    wpbc_ajx_locale: wpbc_ajx_availability.get_secure_param('locale'),
    search_params: wpbc_ajx_availability.search_get_all_params()
  },
  /**
   * S u c c e s s
   *
   * @param response_data		-	its object returned from  Ajax - class-live-searcg.php
   * @param textStatus		-	'success'
   * @param jqXHR				-	Object
   */
  function (response_data, textStatus, jqXHR) {
    console.log(' == Response WPBC_AJX_AVAILABILITY == ', response_data);
    console.groupEnd(); // Probably Error

    if (_typeof(response_data) !== 'object' || response_data === null) {
      wpbc_ajx_availability__show_message(response_data);
      return;
    } // Reload page, after filter toolbar has been reset


    if (undefined != response_data['ajx_cleaned_params'] && 'reset_done' === response_data['ajx_cleaned_params']['ui_reset']) {
      location.reload();
      return;
    } // Show listing


    wpbc_ajx_availability__show(response_data['ajx_data'], response_data['ajx_search_params'], response_data['ajx_cleaned_params']); //wpbc_ajx_availability__define_ui_hooks();						// Redefine Hooks, because we show new DOM elements

    wpbc_availability_reload_button__spin_pause();
    jQuery('#ajax_respond').html(response_data); // For ability to show response, add such DIV element to page
  }).fail(function (jqXHR, textStatus, errorThrown) {
    if (window.console && window.console.log) {
      console.log('Ajax_Error', jqXHR, textStatus, errorThrown);
    }

    var error_message = '<strong>' + 'Error!' + '</strong> ' + errorThrown;

    if (jqXHR.status) {
      error_message += ' (<b>' + jqXHR.status + '</b>)';

      if (403 == jqXHR.status) {
        error_message += ' Probably nonce for this page has been expired. Please <a href="javascript:void(0)" onclick="javascript:location.reload();">reload the page</a>.';
      }
    }

    if (jqXHR.responseText) {
      error_message += ' ' + jqXHR.responseText;
    }

    error_message = error_message.replace(/\n/g, "<br />");
    wpbc_ajx_availability__show_message(error_message);
  }) // .done(   function ( data, textStatus, jqXHR ) {   if ( window.console && window.console.log ){ console.log( 'second success', data, textStatus, jqXHR ); }    })
  // .always( function ( data_jqXHR, textStatus, jqXHR_errorThrown ) {   if ( window.console && window.console.log ){ console.log( 'always finished', data_jqXHR, textStatus, jqXHR_errorThrown ); }     })
  ; // End Ajax
}
/**
 *   H o o k s  -  its Action/Times when need to re-Render Views  ----------------------------------------------- */

/**
 * Send Ajax Search Request after Updating search request parameters
 *
 * @param params_arr
 */


function wpbc_ajx_availability__send_request_with_params(params_arr) {
  // Define different Search  parameters for request
  _.each(params_arr, function (p_val, p_key, p_data) {
    //console.log( 'Request for: ', p_key, p_val );
    wpbc_ajx_availability.search_set_param(p_key, p_val);
  }); // Send Ajax Request


  wpbc_ajx_availability__ajax_request();
}
/**
 * Search request for "Page Number"
 * @param page_number	int
 */


function wpbc_ajx_availability__pagination_click(page_number) {
  wpbc_ajx_availability__send_request_with_params({
    'page_num': page_number
  });
}
/**
 *   Show / Hide Content  --------------------------------------------------------------------------------------- */

/**
 *  Show Listing Content 	- 	Sending Ajax Request	-	with parameters that  we early  defined
 */


function wpbc_ajx_availability__actual_content__show() {
  wpbc_ajx_availability__ajax_request(); // Send Ajax Request	-	with parameters that  we early  defined in "wpbc_ajx_booking_listing" Obj.
}
/**
 * Hide Listing Content
 */


function wpbc_ajx_availability__actual_content__hide() {
  jQuery(wpbc_ajx_availability.get_other_param('listing_container')).html('');
}
/**
 *   M e s s a g e  --------------------------------------------------------------------------------------------- */

/**
 * Show just message instead of content
 */


function wpbc_ajx_availability__show_message(message) {
  wpbc_ajx_availability__actual_content__hide();
  jQuery(wpbc_ajx_availability.get_other_param('listing_container')).html('<div class="wpbc-settings-notice notice-warning" style="text-align:left">' + message + '</div>');
}
/**
 *   Support Functions - Spin Icon in Buttons  ------------------------------------------------------------------ */

/**
 * Spin button in Filter toolbar  -  Start
 */


function wpbc_availability_reload_button__spin_start() {
  jQuery('#wpbc_availability_reload_button .menu_icon.wpbc_spin').removeClass('wpbc_animation_pause');
}
/**
 * Spin button in Filter toolbar  -  Pause
 */


function wpbc_availability_reload_button__spin_pause() {
  jQuery('#wpbc_availability_reload_button .menu_icon.wpbc_spin').addClass('wpbc_animation_pause');
}
/**
 * Spin button in Filter toolbar  -  is Spinning ?
 *
 * @returns {boolean}
 */


function wpbc_availability_reload_button__is_spin() {
  if (jQuery('#wpbc_availability_reload_button .menu_icon.wpbc_spin').hasClass('wpbc_animation_pause')) {
    return true;
  } else {
    return false;
  }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzL3BhZ2UtYXZhaWxhYmlsaXR5L19zcmMvYXZhaWxhYmlsaXR5X3BhZ2UuanMiXSwibmFtZXMiOlsid3BiY19hanhfYXZhaWxhYmlsaXR5Iiwib2JqIiwiJCIsInBfc2VjdXJlIiwic2VjdXJpdHlfb2JqIiwidXNlcl9pZCIsIm5vbmNlIiwibG9jYWxlIiwic2V0X3NlY3VyZV9wYXJhbSIsInBhcmFtX2tleSIsInBhcmFtX3ZhbCIsImdldF9zZWN1cmVfcGFyYW0iLCJwX2xpc3RpbmciLCJzZWFyY2hfcmVxdWVzdF9vYmoiLCJzZWFyY2hfc2V0X2FsbF9wYXJhbXMiLCJyZXF1ZXN0X3BhcmFtX29iaiIsInNlYXJjaF9nZXRfYWxsX3BhcmFtcyIsInNlYXJjaF9nZXRfcGFyYW0iLCJzZWFyY2hfc2V0X3BhcmFtIiwic2VhcmNoX3NldF9wYXJhbXNfYXJyIiwicGFyYW1zX2FyciIsIl8iLCJlYWNoIiwicF92YWwiLCJwX2tleSIsInBfZGF0YSIsInBfb3RoZXIiLCJvdGhlcl9vYmoiLCJzZXRfb3RoZXJfcGFyYW0iLCJnZXRfb3RoZXJfcGFyYW0iLCJqUXVlcnkiLCJ3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX3Nob3ciLCJhanhfZGF0YV9hcnIiLCJhanhfc2VhcmNoX3BhcmFtcyIsImFqeF9jbGVhbmVkX3BhcmFtcyIsInRlbXBsYXRlX19hdmFpbGFiaWxpdHlfbWFpbl9wYWdlX2NvbnRlbnQiLCJ3cCIsInRlbXBsYXRlIiwiaHRtbCIsIndwYmNfYWp4X2F2YWlsYWJpbGl0eV9fY2FsZW5kYXJfc2hvdyIsInJlc291cmNlX2lkIiwiYWp4X25vbmNlX2NhbGVuZGFyIiwiY2FsZW5kYXJfcGFyYW1zX2FyciIsIm1vbnRoc19udW1faW5fcm93IiwiY2FsX2NvdW50IiwiYm9va2luZ190aW1lc2xvdF9kYXlfYmdfYXNfYXZhaWxhYmxlIiwid2lkdGgiLCJkYXRlX2FwcHJvdmVkX3BhciIsIm15X251bV9tb250aCIsInN0YXJ0X2RheV9vZl93ZWVrIiwic3RhcnRfYmtfbW9udGgiLCJhdmFsYWliaWxpdHlfZmlsdGVycyIsImlzX2FsbF9kYXlzX2F2YWlsYWJsZSIsImNhbF9wYXJhbV9hcnIiLCJib29rZWRfZGF0ZXMiLCJzZWFzb25fYXZhaWxhYmlsaXR5Iiwid3BiY19zaG93X2lubGluZV9ib29raW5nX2NhbGVuZGFyIiwiaHRtbF9pZCIsImhhc0NsYXNzIiwiY2wiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiaXNSYW5nZVNlbGVjdCIsImJrTXVsdGlEYXlzU2VsZWN0IiwiYmtNaW5EYXRlIiwiYmtNYXhEYXRlIiwidGV4dCIsImRhdGVwaWNrIiwiYmVmb3JlU2hvd0RheSIsImRhdGUiLCJ3cGJjX19pbmxpbmVfYm9va2luZ19jYWxlbmRhcl9fYXBwbHlfY3NzX3RvX2RheXMiLCJvblNlbGVjdCIsIm9uSG92ZXIiLCJvbkNoYW5nZU1vbnRoWWVhciIsInNob3dPbiIsIm11bHRpU2VsZWN0IiwibnVtYmVyT2ZNb250aHMiLCJudW1iZXJfb2ZfbW9udGhzIiwic3RlcE1vbnRocyIsInByZXZUZXh0IiwibmV4dFRleHQiLCJkYXRlRm9ybWF0IiwiY2hhbmdlTW9udGgiLCJjaGFuZ2VZZWFyIiwibWluRGF0ZSIsIm1heERhdGUiLCJzaG93U3RhdHVzIiwibXVsdGlTZXBhcmF0b3IiLCJjbG9zZUF0VG9wIiwiZmlyc3REYXkiLCJnb3RvQ3VycmVudCIsImhpZGVJZk5vUHJldk5leHQiLCJyYW5nZVNlbGVjdCIsInVzZVRoZW1lUm9sbGVyIiwic2V0VGltZW91dCIsInJlbW92ZUNsYXNzIiwiZGF0ZXBpY2tfdGhpcyIsInRvZGF5X2RhdGUiLCJEYXRlIiwid3BiY190b2RheSIsInBhcnNlSW50IiwiY2xhc3NfZGF5IiwiZ2V0TW9udGgiLCJnZXREYXRlIiwiZ2V0RnVsbFllYXIiLCJzcWxfY2xhc3NfZGF5IiwiY3NzX2RhdGVfX3N0YW5kYXJkIiwiY3NzX2RhdGVfX2FkZGl0aW9uYWwiLCJnZXREYXkiLCJkYXlzX2JldHdlZW4iLCJibG9ja19zb21lX2RhdGVzX2Zyb21fdG9kYXkiLCJ3cGJjX2F2YWlsYWJsZV9kYXlzX251bV9mcm9tX3RvZGF5IiwiaXNfZGF0ZV9hdmFpbGFibGUiLCJpc190aGlzX2RheV9hdmFpbGFibGUiLCJpc19kYXlfYXZhaWxhYmxlX2FyciIsIkFycmF5Iiwid3BiY19faW5saW5lX2Jvb2tpbmdfY2FsZW5kYXJfX2RheXNfY3NzX19nZXRfcmF0ZSIsIndwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19kYXlzX2Nzc19fZ2V0X3NlYXNvbl9uYW1lcyIsImJvb2tpbmdzX2luX2RhdGUiLCJhcHByb3ZlZCIsIndwYmNfYWp4X2F2YWlsYWJpbGl0eV9fYWpheF9yZXF1ZXN0IiwiY29uc29sZSIsImdyb3VwQ29sbGFwc2VkIiwibG9nIiwid3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbl9fc3Bpbl9zdGFydCIsInBvc3QiLCJ3cGJjX2dsb2JhbDEiLCJ3cGJjX2FqYXh1cmwiLCJhY3Rpb24iLCJ3cGJjX2FqeF91c2VyX2lkIiwid3BiY19hanhfbG9jYWxlIiwic2VhcmNoX3BhcmFtcyIsInJlc3BvbnNlX2RhdGEiLCJ0ZXh0U3RhdHVzIiwianFYSFIiLCJncm91cEVuZCIsIndwYmNfYWp4X2F2YWlsYWJpbGl0eV9fc2hvd19tZXNzYWdlIiwidW5kZWZpbmVkIiwibG9jYXRpb24iLCJyZWxvYWQiLCJ3cGJjX2F2YWlsYWJpbGl0eV9yZWxvYWRfYnV0dG9uX19zcGluX3BhdXNlIiwiZmFpbCIsImVycm9yVGhyb3duIiwid2luZG93IiwiZXJyb3JfbWVzc2FnZSIsInN0YXR1cyIsInJlc3BvbnNlVGV4dCIsInJlcGxhY2UiLCJ3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX3NlbmRfcmVxdWVzdF93aXRoX3BhcmFtcyIsIndwYmNfYWp4X2F2YWlsYWJpbGl0eV9fcGFnaW5hdGlvbl9jbGljayIsInBhZ2VfbnVtYmVyIiwid3BiY19hanhfYXZhaWxhYmlsaXR5X19hY3R1YWxfY29udGVudF9fc2hvdyIsIndwYmNfYWp4X2F2YWlsYWJpbGl0eV9fYWN0dWFsX2NvbnRlbnRfX2hpZGUiLCJtZXNzYWdlIiwiYWRkQ2xhc3MiLCJ3cGJjX2F2YWlsYWJpbGl0eV9yZWxvYWRfYnV0dG9uX19pc19zcGluIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFFQSxJQUFJQSxxQkFBcUIsR0FBSSxVQUFXQyxHQUFYLEVBQWdCQyxDQUFoQixFQUFtQjtBQUUvQztBQUNBLE1BQUlDLFFBQVEsR0FBR0YsR0FBRyxDQUFDRyxZQUFKLEdBQW1CSCxHQUFHLENBQUNHLFlBQUosSUFBb0I7QUFDeENDLElBQUFBLE9BQU8sRUFBRSxDQUQrQjtBQUV4Q0MsSUFBQUEsS0FBSyxFQUFJLEVBRitCO0FBR3hDQyxJQUFBQSxNQUFNLEVBQUc7QUFIK0IsR0FBdEQ7O0FBTUFOLEVBQUFBLEdBQUcsQ0FBQ08sZ0JBQUosR0FBdUIsVUFBV0MsU0FBWCxFQUFzQkMsU0FBdEIsRUFBa0M7QUFDeERQLElBQUFBLFFBQVEsQ0FBRU0sU0FBRixDQUFSLEdBQXdCQyxTQUF4QjtBQUNBLEdBRkQ7O0FBSUFULEVBQUFBLEdBQUcsQ0FBQ1UsZ0JBQUosR0FBdUIsVUFBV0YsU0FBWCxFQUF1QjtBQUM3QyxXQUFPTixRQUFRLENBQUVNLFNBQUYsQ0FBZjtBQUNBLEdBRkQsQ0FiK0MsQ0FrQi9DOzs7QUFDQSxNQUFJRyxTQUFTLEdBQUdYLEdBQUcsQ0FBQ1ksa0JBQUosR0FBeUJaLEdBQUcsQ0FBQ1ksa0JBQUosSUFBMEIsQ0FDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQa0QsR0FBbkU7O0FBVUFaLEVBQUFBLEdBQUcsQ0FBQ2EscUJBQUosR0FBNEIsVUFBV0MsaUJBQVgsRUFBK0I7QUFDMURILElBQUFBLFNBQVMsR0FBR0csaUJBQVo7QUFDQSxHQUZEOztBQUlBZCxFQUFBQSxHQUFHLENBQUNlLHFCQUFKLEdBQTRCLFlBQVk7QUFDdkMsV0FBT0osU0FBUDtBQUNBLEdBRkQ7O0FBSUFYLEVBQUFBLEdBQUcsQ0FBQ2dCLGdC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QVA7QUFDQTtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogUmVxdWVzdCBPYmplY3RcclxuICogSGVyZSB3ZSBjYW4gIGRlZmluZSBTZWFyY2ggcGFyYW1ldGVycyBhbmQgVXBkYXRlIGl0IGxhdGVyLCAgd2hlbiAgc29tZSBwYXJhbWV0ZXIgd2FzIGNoYW5nZWRcclxuICpcclxuICovXHJcblxyXG52YXIgd3BiY19hanhfYXZhaWxhYmlsaXR5ID0gKGZ1bmN0aW9uICggb2JqLCAkKSB7XHJcblxyXG5cdC8vIFNlY3VyZSBwYXJhbWV0ZXJzIGZvciBBamF4XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR2YXIgcF9zZWN1cmUgPSBvYmouc2VjdXJpdHlfb2JqID0gb2JqLnNlY3VyaXR5X29iaiB8fCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVzZXJfaWQ6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG5vbmNlICA6ICcnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb2NhbGUgOiAnJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICB9O1xyXG5cclxuXHRvYmouc2V0X3NlY3VyZV9wYXJhbSA9IGZ1bmN0aW9uICggcGFyYW1fa2V5LCBwYXJhbV92YWwgKSB7XHJcblx0XHRwX3NlY3VyZVsgcGFyYW1fa2V5IF0gPSBwYXJhbV92YWw7XHJcblx0fTtcclxuXHJcblx0b2JqLmdldF9zZWN1cmVfcGFyYW0gPSBmdW5jdGlvbiAoIHBhcmFtX2tleSApIHtcclxuXHRcdHJldHVybiBwX3NlY3VyZVsgcGFyYW1fa2V5IF07XHJcblx0fTtcclxuXHJcblxyXG5cdC8vIExpc3RpbmcgU2VhcmNoIHBhcmFtZXRlcnNcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdHZhciBwX2xpc3RpbmcgPSBvYmouc2VhcmNoX3JlcXVlc3Rfb2JqID0gb2JqLnNlYXJjaF9yZXF1ZXN0X29iaiB8fCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIHNvcnQgICAgICAgICAgICA6IFwiYm9va2luZ19pZFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBzb3J0X3R5cGUgICAgICAgOiBcIkRFU0NcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gcGFnZV9udW0gICAgICAgIDogMSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gcGFnZV9pdGVtc19jb3VudDogMTAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNyZWF0ZV9kYXRlICAgICA6IFwiXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGtleXdvcmQgICAgICAgICA6IFwiXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIHNvdXJjZSAgICAgICAgICA6IFwiXCJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdG9iai5zZWFyY2hfc2V0X2FsbF9wYXJhbXMgPSBmdW5jdGlvbiAoIHJlcXVlc3RfcGFyYW1fb2JqICkge1xyXG5cdFx0cF9saXN0aW5nID0gcmVxdWVzdF9wYXJhbV9vYmo7XHJcblx0fTtcclxuXHJcblx0b2JqLnNlYXJjaF9nZXRfYWxsX3BhcmFtcyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdHJldHVybiBwX2xpc3Rpbmc7XHJcblx0fTtcclxuXHJcblx0b2JqLnNlYXJjaF9nZXRfcGFyYW0gPSBmdW5jdGlvbiAoIHBhcmFtX2tleSApIHtcclxuXHRcdHJldHVybiBwX2xpc3RpbmdbIHBhcmFtX2tleSBdO1xyXG5cdH07XHJcblxyXG5cdG9iai5zZWFyY2hfc2V0X3BhcmFtID0gZnVuY3Rpb24gKCBwYXJhbV9rZXksIHBhcmFtX3ZhbCApIHtcclxuXHRcdC8vIGlmICggQXJyYXkuaXNBcnJheSggcGFyYW1fdmFsICkgKXtcclxuXHRcdC8vIFx0cGFyYW1fdmFsID0gSlNPTi5zdHJpbmdpZnkoIHBhcmFtX3ZhbCApO1xyXG5cdFx0Ly8gfVxyXG5cdFx0cF9saXN0aW5nWyBwYXJhbV9rZXkgXSA9IHBhcmFtX3ZhbDtcclxuXHR9O1xyXG5cclxuXHRvYmouc2VhcmNoX3NldF9wYXJhbXNfYXJyID0gZnVuY3Rpb24oIHBhcmFtc19hcnIgKXtcclxuXHRcdF8uZWFjaCggcGFyYW1zX2FyciwgZnVuY3Rpb24gKCBwX3ZhbCwgcF9rZXksIHBfZGF0YSApe1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIERlZmluZSBkaWZmZXJlbnQgU2VhcmNoICBwYXJhbWV0ZXJzIGZvciByZXF1ZXN0XHJcblx0XHRcdHRoaXMuc2VhcmNoX3NldF9wYXJhbSggcF9rZXksIHBfdmFsICk7XHJcblx0XHR9ICk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gT3RoZXIgcGFyYW1ldGVycyBcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR2YXIgcF9vdGhlciA9IG9iai5vdGhlcl9vYmogPSBvYmoub3RoZXJfb2JqIHx8IHsgfTtcclxuXHJcblx0b2JqLnNldF9vdGhlcl9wYXJhbSA9IGZ1bmN0aW9uICggcGFyYW1fa2V5LCBwYXJhbV92YWwgKSB7XHJcblx0XHRwX290aGVyWyBwYXJhbV9rZXkgXSA9IHBhcmFtX3ZhbDtcclxuXHR9O1xyXG5cclxuXHRvYmouZ2V0X290aGVyX3BhcmFtID0gZnVuY3Rpb24gKCBwYXJhbV9rZXkgKSB7XHJcblx0XHRyZXR1cm4gcF9vdGhlclsgcGFyYW1fa2V5IF07XHJcblx0fTtcclxuXHJcblxyXG5cdHJldHVybiBvYmo7XHJcbn0oIHdwYmNfYWp4X2F2YWlsYWJpbGl0eSB8fCB7fSwgalF1ZXJ5ICkpO1xyXG5cclxuXHJcblxyXG4vKipcclxuICogICBTaG93IENvbnRlbnQgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbi8qKlxyXG4gKiBTaG93IENvbnRlbnQgLSBDYWxlbmRhciBhbmQgVUlcclxuICpcclxuICogQHBhcmFtIGFqeF9kYXRhXHJcbiAqIEBwYXJhbSBhanhfc2VhcmNoX3BhcmFtc1xyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hanhfYXZhaWxhYmlsaXR5X19zaG93KCBhanhfZGF0YV9hcnIsIGFqeF9zZWFyY2hfcGFyYW1zICwgYWp4X2NsZWFuZWRfcGFyYW1zICl7XHJcblxyXG5cclxuXHR2YXIgdGVtcGxhdGVfX2F2YWlsYWJpbGl0eV9tYWluX3BhZ2VfY29udGVudCA9IHdwLnRlbXBsYXRlKCAnd3BiY19hanhfYXZhaWxhYmlsaXR5X21haW5fcGFnZV9jb250ZW50JyApO1xyXG5cclxuXHQvLyBDb250ZW50XHJcblx0alF1ZXJ5KCB3cGJjX2FqeF9hdmFpbGFiaWxpdHkuZ2V0X290aGVyX3BhcmFtKCAnbGlzdGluZ19jb250YWluZXInICkgKS5odG1sKCB0ZW1wbGF0ZV9fYXZhaWxhYmlsaXR5X21haW5fcGFnZV9jb250ZW50KCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2FqeF9kYXRhJyAgICAgICAgICAgICAgOiBhanhfZGF0YV9hcnIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2FqeF9zZWFyY2hfcGFyYW1zJyAgICAgOiBhanhfc2VhcmNoX3BhcmFtcyxcdFx0XHRcdFx0XHRcdFx0Ly8gJF9SRVFVRVNUWyAnc2VhcmNoX3BhcmFtcycgXVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdhanhfY2xlYW5lZF9wYXJhbXMnICAgIDogYWp4X2NsZWFuZWRfcGFyYW1zXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gKSApO1xyXG5cclxuXHJcblx0d3BiY19hanhfYXZhaWxhYmlsaXR5X19jYWxlbmRhcl9zaG93KCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQncmVzb3VyY2VfaWQnICAgICAgIDogYWp4X2NsZWFuZWRfcGFyYW1zLnJlc291cmNlX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2FqeF9ub25jZV9jYWxlbmRhcic6IGFqeF9kYXRhX2Fyci5hanhfbm9uY2VfY2FsZW5kYXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnYWp4X2RhdGFfYXJyJyAgICAgICAgICA6IGFqeF9kYXRhX2FycixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdhanhfY2xlYW5lZF9wYXJhbXMnICAgIDogYWp4X2NsZWFuZWRfcGFyYW1zXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSApO1xyXG5cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fY2FsZW5kYXJfc2hvdyggY2FsZW5kYXJfcGFyYW1zX2FyciApe1xyXG5cclxuXHQvLyBVcGRhdGUgbm9uY2VcclxuXHRqUXVlcnkoICcjYWp4X25vbmNlX2NhbGVuZGFyX3NlY3Rpb24nICkuaHRtbCggY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfbm9uY2VfY2FsZW5kYXIgKTtcclxuXHJcblx0dmFyIG1vbnRoc19udW1faW5fcm93ID0gNDtcclxuXHR2YXIgY2FsX2NvdW50ID0gMTI7XHJcblx0dmFyIGJvb2tpbmdfdGltZXNsb3RfZGF5X2JnX2FzX2F2YWlsYWJsZSA9ICcnO1xyXG5cdHZhciB3aWR0aCA9ICd3aWR0aDoxMDAlO21heC13aWR0aDoxMDAlOyc7XHRcdFx0XHQvL3ZhciB3aWR0aCA9ICd3aWR0aDoxMDAlO21heC13aWR0aDonICsgKCBtb250aHNfbnVtX2luX3JvdyAqIDI4NCApICsgJ3B4Oyc7XHJcblxyXG5cdGpRdWVyeSggJy53cGJjX2FqeF9hdnlfX2NhbGVuZGFyJyApLmh0bWwoXHJcblxyXG5cdFx0JzxkaXYgY2xhc3M9XCJia19jYWxlbmRhcl9mcmFtZSBtb250aHNfbnVtX2luX3Jvd18nICsgbW9udGhzX251bV9pbl9yb3cgKyAnIGNhbF9tb250aF9udW1fJyArIGNhbF9jb3VudCAgKyBib29raW5nX3RpbWVzbG90X2RheV9iZ19hc19hdmFpbGFibGUgKyAnXCIgc3R5bGU9XCInICsgd2lkdGggKyAnXCI+J1xyXG5cclxuXHRcdFx0KyAnPGRpdiBpZD1cImNhbGVuZGFyX2Jvb2tpbmcnICsgY2FsZW5kYXJfcGFyYW1zX2Fyci5yZXNvdXJjZV9pZCArICdcIj4nICsgJ0NhbGVuZGFyIGlzIGxvYWRpbmcuLi4nICsgJzwvZGl2PidcclxuXHJcblx0XHQrICc8L2Rpdj4nXHJcblxyXG5cdFx0KyAnPHRleHRhcmVhIGlkPVwiZGF0ZV9ib29raW5nJyAgKyBjYWxlbmRhcl9wYXJhbXNfYXJyLnJlc291cmNlX2lkICsgICdcIiBuYW1lPVwiZGF0ZV9ib29raW5nJyArIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgKyAnXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmUwO3dpZHRoOjEwMCU7aGVpZ2h0OjEwZW07bWFyZ2luOjJlbSAwIDA7XCI+PC90ZXh0YXJlYT4nXHJcblx0KTtcclxuXHJcblxyXG5cdHZhciBkYXRlX2FwcHJvdmVkX3BhciA9IFtdO1xyXG5cdHZhciBteV9udW1fbW9udGggPSAxMjtcclxuXHR2YXIgc3RhcnRfZGF5X29mX3dlZWsgPSAxO1xyXG5cdHZhciBzdGFydF9ia19tb250aCA9IGZhbHNlO1xyXG5cdGF2YWxhaWJpbGl0eV9maWx0ZXJzWyBjYWxlbmRhcl9wYXJhbXNfYXJyLnJlc291cmNlX2lkIF0gPSBbXTtcclxuXHRpc19hbGxfZGF5c19hdmFpbGFibGVbIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgXSA9IDE7XHJcblxyXG5cclxuXHQvL2luaXRfZGF0ZXBpY2tfY2FsKCBjYWxlbmRhcl9wYXJhbXNfYXJyLnJlc291cmNlX2lkLCBkYXRlX2FwcHJvdmVkX3BhciwgbXlfbnVtX21vbnRoLCBzdGFydF9kYXlfb2Zfd2Vlaywgc3RhcnRfYmtfbW9udGggKTtcclxuXHJcblx0dmFyIGNhbF9wYXJhbV9hcnIgPSB7XHJcblx0XHRcdFx0XHRcdFx0J2h0bWxfaWQnICAgICAgICAgICA6ICdjYWxlbmRhcl9ib29raW5nJyArIGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLnJlc291cmNlX2lkLFxyXG5cdFx0XHRcdFx0XHRcdCd0ZXh0X2lkJyAgICAgICAgICAgOiAnZGF0ZV9ib29raW5nJyArIGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLnJlc291cmNlX2lkLFxyXG5cclxuXHRcdFx0XHRcdFx0XHQnc3RhcnRfZGF5X29mX3dlZWsnIDogMSxcclxuXHRcdFx0XHRcdFx0XHQnbnVtYmVyX29mX21vbnRocyc6IDEyLFxyXG5cclxuXHRcdFx0XHRcdFx0XHQncmVzb3VyY2VfaWQnICAgICAgICA6IGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLnJlc291cmNlX2lkLFxyXG5cdFx0XHRcdFx0XHRcdCdhanhfbm9uY2VfY2FsZW5kYXInIDogY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfZGF0YV9hcnIuYWp4X25vbmNlX2NhbGVuZGFyLFxyXG5cdFx0XHRcdFx0XHRcdCdib29rZWRfZGF0ZXMnICAgICAgIDogY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfZGF0YV9hcnIuYm9va2VkX2RhdGVzLFxyXG5cdFx0XHRcdFx0XHRcdCdzZWFzb25fYXZhaWxhYmlsaXR5JzogY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfZGF0YV9hcnIuc2Vhc29uX2F2YWlsYWJpbGl0eVxyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdHdwYmNfc2hvd19pbmxpbmVfYm9va2luZ19jYWxlbmRhciggY2FsX3BhcmFtX2FyciApO1xyXG59XHJcblxyXG52YXIgYXZhbGFpYmlsaXR5X2ZpbHRlcnM9W107XHJcbmF2YWxhaWJpbGl0eV9maWx0ZXJzWyAxIF0gPSBbXTtcclxuaXNfYWxsX2RheXNfYXZhaWxhYmxlWyAxIF0gPSAxO1xyXG5cclxuXHJcbmZ1bmN0aW9uIHdwYmNfc2hvd19pbmxpbmVfYm9va2luZ19jYWxlbmRhciggY2FsZW5kYXJfcGFyYW1zX2FyciApe1xyXG5cclxuICAgICAgICBpZiAoIGpRdWVyeSggJyMnICsgY2FsZW5kYXJfcGFyYW1zX2Fyci5odG1sX2lkICkuaGFzQ2xhc3MoJ2hhc0RhdGVwaWNrJykgPT0gdHJ1ZSApIHsgLy8gSWYgdGhlIGNhbGVuZGFyIHdpdGggdGhlIHNhbWUgQm9va2luZyByZXNvdXJjZSBpcyBhY3RpdmF0ZWQgYWxyZWFkeSwgdGhlbiBleGlzdC5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGNsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIGNhbGVuZGFyX3BhcmFtc19hcnIuaHRtbF9pZCApO2lmIChjbCA9PT0gbnVsbCkgcmV0dXJuOyAvLyBHZXQgY2FsZW5kYXIgaW5zdGFuY2UgYW5kIGV4aXQgaWYgaXRzIG5vdCBleGlzdFxyXG5cclxuXHRcdHZhciBpc1JhbmdlU2VsZWN0ID0gdHJ1ZTtcclxuXHRcdHZhciBia011bHRpRGF5c1NlbGVjdCA9IDA7XHJcblxyXG4gICAgICAgIHZhciBia01pbkRhdGUgPSBudWxsO1xyXG4gICAgICAgIHZhciBia01heERhdGUgPSAnNXknO1xyXG5cclxuICAgICAgICAvLyBDb25maWd1cmUgYW5kIHNob3cgY2FsZW5kYXJcclxuXHRcdGpRdWVyeSggJyMnICsgY2FsZW5kYXJfcGFyYW1zX2Fyci5odG1sX2lkICkudGV4dCggJycgKTtcclxuXHRcdGpRdWVyeSggJyMnICsgY2FsZW5kYXJfcGFyYW1zX2Fyci5odG1sX2lkICkuZGF0ZXBpY2soe1xyXG5cdFx0XHRcdFx0YmVmb3JlU2hvd0RheTogZnVuY3Rpb24gKCBkYXRlICl7XHJcblx0XHRcdFx0XHRcdHJldHVybiB3cGJjX19pbmxpbmVfYm9va2luZ19jYWxlbmRhcl9fYXBwbHlfY3NzX3RvX2RheXMoIGRhdGUsIGNhbGVuZGFyX3BhcmFtc19hcnIsIHRoaXMgKTtcclxuXHRcdFx0XHRcdH0sXHJcbiAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Q6IFx0XHRcdG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgb25Ib3ZlcjpcdFx0XHRudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlTW9udGhZZWFyOlx0bnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBzaG93T246ICdib3RoJyxcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aVNlbGVjdDogYmtNdWx0aURheXNTZWxlY3QsXHJcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyT2ZNb250aHM6IGNhbGVuZGFyX3BhcmFtc19hcnIubnVtYmVyX29mX21vbnRocyxcclxuICAgICAgICAgICAgICAgICAgICBzdGVwTW9udGhzOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZUZXh0OiAnJmxhcXVvOycsXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFRleHQ6ICcmcmFxdW87JyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRlRm9ybWF0OiAnZGQubW0ueXknLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZU1vbnRoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VZZWFyOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBtaW5EYXRlOiBia01pbkRhdGUsIG1heERhdGU6IGJrTWF4RGF0ZSwgLy8nMVknLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1pbkRhdGU6IG5ldyBEYXRlKDIwMjAsIDIsIDEpLCBtYXhEYXRlOiBuZXcgRGF0ZSgyMDIwLCA5LCAzMSksICAgICAgICAgICAgIC8vIEFiaWxpdHkgdG8gc2V0IGFueSAgc3RhcnQgYW5kIGVuZCBkYXRlIGluIGNhbGVuZGFyXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd1N0YXR1czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlTZXBhcmF0b3I6ICcsICcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xvc2VBdFRvcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3REYXk6XHRjYWxlbmRhcl9wYXJhbXNfYXJyLnN0YXJ0X2RheV9vZl93ZWVrLFxyXG4gICAgICAgICAgICAgICAgICAgIGdvdG9DdXJyZW50OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBoaWRlSWZOb1ByZXZOZXh0OnRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2VTZWxlY3Q6aXNSYW5nZVNlbGVjdCxcclxuICAgICAgICAgICAgICAgICAgICAvLyBzaG93V2Vla3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdXNlVGhlbWVSb2xsZXIgOmZhbHNlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy9GaXhJbjogNy4xLjIuOFxyXG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uICggKSB7XHJcbiAgICAgICAgICAgIGpRdWVyeSggJy5kYXRlcGljay1kYXlzLWNlbGwuZGF0ZXBpY2stdG9kYXkuZGF0ZXBpY2stZGF5cy1jZWxsLW92ZXInICkucmVtb3ZlQ2xhc3MoICdkYXRlcGljay1kYXlzLWNlbGwtb3ZlcicgKTtcclxuICAgICAgICB9LCA1MDAgKTtcclxuXHJcbn1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEFwcGx5IENTUyB0byBjYWxlbmRhciBkYXRlIGNlbGxzXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gZGF0ZVx0XHRcdFx0XHQtICBKYXZhU2NyaXB0IERhdGUgT2JqOiAgXHRcdE1vbiBEZWMgMTEgMjAyMyAwMDowMDowMCBHTVQrMDIwMCAoRWFzdGVybiBFdXJvcGVhbiBTdGFuZGFyZCBUaW1lKVxyXG5cdCAqIEBwYXJhbSBjYWxlbmRhcl9wYXJhbXNfYXJyXHQtICBDYWxlbmRhciBTZXR0aW5ncyBPYmplY3Q6ICBcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJodG1sX2lkXCI6IFwiY2FsZW5kYXJfYm9va2luZzRcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJ0ZXh0X2lkXCI6IFwiZGF0ZV9ib29raW5nNFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcInN0YXJ0X2RheV9vZl93ZWVrXCI6IDEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIFwibnVtYmVyX29mX21vbnRoc1wiOiAxMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJyZXNvdXJjZV9pZFwiOiA0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImFqeF9ub25jZV9jYWxlbmRhclwiOiBcIjxpbnB1dCB0eXBlPVxcXCJoaWRkZW5cXFwiIC4uLiAvPlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImJvb2tlZF9kYXRlc1wiOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiMTItMjgtMjAyMlwiOiBbXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiYm9va2luZ19kYXRlXCI6IFwiMjAyMi0xMi0yOCAwMDowMDowMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiYXBwcm92ZWRcIjogXCIxXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJib29raW5nX2lkXCI6IFwiMjZcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XSwgLi4uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3NlYXNvbl9hdmFpbGFiaWxpdHknOntcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMDlcIjogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMTBcIjogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMTFcIjogdHJ1ZSwgLi4uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdCAqIEBwYXJhbSBkYXRlcGlja190aGlzXHRcdFx0LSB0aGlzIG9mIGRhdGVwaWNrIE9ialxyXG5cdCAqXHJcblx0ICogQHJldHVybnMgW2Jvb2xlYW4sc3RyaW5nXVx0LSBbIHt0cnVlIC1hdmFpbGFibGUgfCBmYWxzZSAtIHVuYXZhaWxhYmxlfSwgJ0NTUyBjbGFzc2VzIGZvciBjYWxlbmRhciBkYXkgY2VsbCcgXVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIHdwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19hcHBseV9jc3NfdG9fZGF5cyggZGF0ZSwgY2FsZW5kYXJfcGFyYW1zX2FyciwgZGF0ZXBpY2tfdGhpcyApe1xyXG5cclxuXHRcdHZhciB0b2RheV9kYXRlID0gbmV3IERhdGUoIHdwYmNfdG9kYXlbIDAgXSwgKHBhcnNlSW50KCB3cGJjX3RvZGF5WyAxIF0gKSAtIDEpLCB3cGJjX3RvZGF5WyAyIF0sIDAsIDAsIDAgKTtcclxuXHJcblx0XHR2YXIgY2xhc3NfZGF5ICA9ICggZGF0ZS5nZXRNb250aCgpICsgMSApICsgJy0nICsgZGF0ZS5nZXREYXRlKCkgKyAnLScgKyBkYXRlLmdldEZ1bGxZZWFyKCk7XHRcdFx0XHRcdFx0Ly8gJzEtOS0yMDIzJ1xyXG5cdFx0dmFyIHNxbF9jbGFzc19kYXkgPSBkYXRlLmdldEZ1bGxZZWFyKCkgKyAnLSc7XHJcblx0XHRcdHNxbF9jbGFzc19kYXkgKz0gKCAoZGF0ZS5nZXRNb250aCgpICsgMSkgPCAxMCApID8gJzAnIDogJyc7XHJcblx0XHRcdHNxbF9jbGFzc19kYXkgKz0gKGRhdGUuZ2V0TW9udGgoKSArIDEpKyAnLSdcclxuXHRcdFx0c3FsX2NsYXNzX2RheSArPSAoIGRhdGUuZ2V0RGF0ZSgpIDwgMTAgKSA/ICcwJyA6ICcnO1xyXG5cdFx0XHRzcWxfY2xhc3NfZGF5ICs9IGRhdGUuZ2V0RGF0ZSgpO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gJzIwMjMtMDEtMDknXHJcblxyXG5cdFx0dmFyIGNzc19kYXRlX19zdGFuZGFyZCAgID0gICdjYWw0ZGF0ZS0nICsgY2xhc3NfZGF5O1xyXG5cdFx0dmFyIGNzc19kYXRlX19hZGRpdGlvbmFsID0gJyB3cGJjX3dlZWtkYXlfJyArIGRhdGUuZ2V0RGF5KCkgKyAnICc7XHJcblxyXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdC8vIFNldCB1bmF2YWlsYWJsZSBkYXlzIEJlZm9yZSAvIEFmdGVyIHRoZSBUb2RheSBkYXRlXHJcblx0XHRpZiAoIFx0KCAoZGF5c19iZXR3ZWVuKCBkYXRlLCB0b2RheV9kYXRlICkpIDwgYmxvY2tfc29tZV9kYXRlc19mcm9tX3RvZGF5IClcclxuXHRcdFx0IHx8IChcclxuXHRcdFx0XHRcdCAgICggdHlwZW9mKCB3cGJjX2F2YWlsYWJsZV9kYXlzX251bV9mcm9tX3RvZGF5ICkgIT09ICd1bmRlZmluZWQnIClcclxuXHRcdFx0XHRcdCYmICggcGFyc2VJbnQoICcwJyArIHdwYmNfYXZhaWxhYmxlX2RheXNfbnVtX2Zyb21fdG9kYXkgKSA+IDAgKVxyXG5cdFx0XHRcdFx0JiYgKCAoZGF5c19iZXR3ZWVuKCBkYXRlLCB0b2RheV9kYXRlICkpID4gcGFyc2VJbnQoICcwJyArIHdwYmNfYXZhaWxhYmxlX2RheXNfbnVtX2Zyb21fdG9kYXkgKSApXHJcblx0XHRcdFx0KVxyXG5cdFx0KXtcclxuXHRcdFx0cmV0dXJuIFsgZmFsc2UsIGNzc19kYXRlX19zdGFuZGFyZCArICcgZGF0ZV91c2VyX3VuYXZhaWxhYmxlJyBdO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0XHR2YXIgICAgaXNfZGF0ZV9hdmFpbGFibGUgPSBjYWxlbmRhcl9wYXJhbXNfYXJyLnNlYXNvbl9hdmFpbGFiaWxpdHlbIHNxbF9jbGFzc19kYXkgXTtcclxuXHRcdGlmICggISBpc19kYXRlX2F2YWlsYWJsZSApe1xyXG5cdFx0XHRyZXR1cm4gWyBmYWxzZSwgY3NzX2RhdGVfX3N0YW5kYXJkXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCsgJyBkYXRlX3VzZXJfdW5hdmFpbGFibGUnXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCsgJyBzZWFzb25fdW5hdmFpbGFibGUnXHJcblx0XHRcdFx0ICAgXTtcclxuXHRcdH1cclxuXHJcblx0XHRcdFx0Ly9UT0RPOiAgTmVlZCB0byAgZXhlY3V0ZSB0aGlzIGF0ICBzZXJ2ZXIgc2lkZTpcclxuXHRcdFx0XHQvLyBhbmQgcHJvYmFibHkgbmVlZCB0byBzZW5kIEpTT04gYXJyYXkgIGluc3RlYWQgb2YgSlMgdmFyaWFibGVzLCBhcyBiZWZvcmU6XHJcblx0XHRcdFx0Ly8gJGpzX3NjcmlwdF9jb2RlID0gYXBwbHlfZmlsdGVycygnd3BkZXZfYm9va2luZ19hdmFpbGFiaWxpdHlfZmlsdGVyJywgJycsICRyZXF1ZXN0X3BhcmFtc1sncmVzb3VyY2VfaWQnXSk7XHJcblxyXG5cdFx0XHRcdC8vIElzIHRoaXMgZGF0ZSBhdmFpbGFibGUgZGVwZW5kcyBvbiBzZWFzb25zIGF2YWlsYWJpbGl0eSBhdCBCb29raW5nID4gUmVzb3VyY2VzID4gQXZhaWxhYmlsaXR5IHBhZ2UuXHJcblx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09IHR5cGVvZiggaXNfdGhpc19kYXlfYXZhaWxhYmxlICkgKXtcclxuXHJcblx0XHRcdFx0XHR2YXIgaXNfZGF5X2F2YWlsYWJsZV9hcnIgPSBpc190aGlzX2RheV9hdmFpbGFibGUoIGRhdGUsIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgKTtcdFx0XHRcdFx0Ly8gWyB0cnVlfGZhbHNlICwgJ2lkX29mX3NlYXNvbicgXVxyXG5cclxuXHRcdFx0XHRcdGlmIChcclxuXHRcdFx0XHRcdFx0ICAgKCAgIGlzX2RheV9hdmFpbGFibGVfYXJyIGluc3RhbmNlb2YgQXJyYXkgKVxyXG5cdFx0XHRcdFx0XHQmJiAoICEgaXNfZGF5X2F2YWlsYWJsZV9hcnJbIDAgXSApXHJcblx0XHRcdFx0XHQpe1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gWyAgZmFsc2UsIGNzc19kYXRlX19zdGFuZGFyZFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCsgJyBkYXRlX3VzZXJfdW5hdmFpbGFibGUnXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KyAnIHNlYXNvbl91bmF2YWlsYWJsZSdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQrICcgc2Vhc29uX2ZpbHRlcl9pZF8nICsgaXNfZGF5X2F2YWlsYWJsZV9hcnJbIDEgXVxyXG5cdFx0XHRcdFx0XHRcdCAgXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdGNzc19kYXRlX19hZGRpdGlvbmFsICs9IHdwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19kYXlzX2Nzc19fZ2V0X3JhdGUoIGNsYXNzX2RheSwgY2FsZW5kYXJfcGFyYW1zX2Fyci5yZXNvdXJjZV9pZCApOyAgICAgICAgICAgICAgICAvLyAnIHJhdGVfMTAwJ1xyXG5cdFx0Y3NzX2RhdGVfX2FkZGl0aW9uYWwgKz0gd3BiY19faW5saW5lX2Jvb2tpbmdfY2FsZW5kYXJfX2RheXNfY3NzX19nZXRfc2Vhc29uX25hbWVzKCBjbGFzc19kYXksIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgKTsgICAgICAgIC8vICcgd2Vla2VuZF9zZWFzb24gaGlnaF9zZWFzb24nXHJcblxyXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdFxyXG5cdFx0Ly8gSXMgYW55IGJvb2tpbmdzIGluIHRoaXMgZGF0ZSA/XHJcblx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YoIGNhbGVuZGFyX3BhcmFtc19hcnIuYm9va2VkX2RhdGVzWyBjbGFzc19kYXkgXSApICkge1xyXG5cclxuXHRcdFx0dmFyIGJvb2tpbmdzX2luX2RhdGUgPSBjYWxlbmRhcl9wYXJhbXNfYXJyLmJvb2tlZF9kYXRlc1sgY2xhc3NfZGF5IF07XHJcblxyXG5cclxuXHRcdFx0Ly8gTG9vcCBpbiBPYmplY3RcclxuXHRcdFx0Xy5lYWNoKCBib29raW5nc19pbl9kYXRlLCBmdW5jdGlvbiAoIHBfdmFsLCBwX2tleSwgcF9kYXRhICkge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCAncF92YWwsIHBfa2V5LCBwX2RhdGEnLHBfdmFsLCBwX2tleSwgcF9kYXRhKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBcdFx0XHRmb3IgKCB2YXIga2V5IG9mIE9iamVjdC5rZXlzKCBib29raW5nc19pbl9kYXRlICkgKXtcclxuXHRcdFx0Ly8gXHRcdFx0XHRjb25zb2xlLmxvZygga2V5ICsgXCIgLT4gXCIgKyBib29raW5nc19pbl9kYXRlWyBrZXkgXSApO1xyXG5cdFx0XHQvLyBcdFx0XHR9XHJcblx0XHRcdC8vXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCAnYm9va2luZ3NfaW5fZGF0ZScsIGJvb2tpbmdzX2luX2RhdGUgKTtcclxuXHJcblxyXG5cdFx0XHQvLyBJcyB0aGlzIFwiRnVsbCBkYXlcIiBib29raW5nID8gKHNlY29uZHMgPT0gMClcclxuXHRcdFx0aWYgKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mKCBib29raW5nc19pbl9kYXRlWyAnc2VjXzAnIF0gKSApIHtcclxuXHJcblx0XHRcdFx0Y3NzX2RhdGVfX2FkZGl0aW9uYWwgKz0gKCAnMCcgPT09IGJvb2tpbmdzX2luX2RhdGVbICdzZWNfMCcgXS5hcHByb3ZlZCApID8gJyBkYXRlMmFwcHJvdmUgJyA6ICcgZGF0ZV9hcHByb3ZlZCAnO1x0XHRcdFx0Ly8gUGVuZGluZyA9ICcwJyB8ICBBcHByb3ZlZCA9ICcxJ1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gWyAhZmFsc2UsIGNzc19kYXRlX19zdGFuZGFyZCArIGNzc19kYXRlX19hZGRpdGlvbmFsIF07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdHJldHVybiBbIHRydWUsIGNzc19kYXRlX19zdGFuZGFyZCArIGNzc19kYXRlX19hZGRpdGlvbmFsICsgJyBkYXRlX2F2YWlsYWJsZScgXTtcclxuXHR9XHJcblxyXG5cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqICAgQWpheCAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4vKipcclxuICogU2VuZCBBamF4IHNob3cgcmVxdWVzdFxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hanhfYXZhaWxhYmlsaXR5X19hamF4X3JlcXVlc3QoKXtcclxuXHJcbmNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoICdXUEJDX0FKWF9BVkFJTEFCSUxJVFknICk7IGNvbnNvbGUubG9nKCAnID09IEJlZm9yZSBBamF4IFNlbmQgLSBzZWFyY2hfZ2V0X2FsbF9wYXJhbXMoKSA9PSAnICwgd3BiY19hanhfYXZhaWxhYmlsaXR5LnNlYXJjaF9nZXRfYWxsX3BhcmFtcygpICk7XHJcblxyXG5cdHdwYmNfYXZhaWxhYmlsaXR5X3JlbG9hZF9idXR0b25fX3NwaW5fc3RhcnQoKTtcclxuXHJcblx0Ly8gU3RhcnQgQWpheFxyXG5cdGpRdWVyeS5wb3N0KCB3cGJjX2dsb2JhbDEud3BiY19hamF4dXJsLFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGFjdGlvbiAgICAgICAgICA6ICdXUEJDX0FKWF9BVkFJTEFCSUxJVFknLFxyXG5cdFx0XHRcdFx0d3BiY19hanhfdXNlcl9pZDogd3BiY19hanhfYXZhaWxhYmlsaXR5LmdldF9zZWN1cmVfcGFyYW0oICd1c2VyX2lkJyApLFxyXG5cdFx0XHRcdFx0bm9uY2UgICAgICAgICAgIDogd3BiY19hanhfYXZhaWxhYmlsaXR5LmdldF9zZWN1cmVfcGFyYW0oICdub25jZScgKSxcclxuXHRcdFx0XHRcdHdwYmNfYWp4X2xvY2FsZSA6IHdwYmNfYWp4X2F2YWlsYWJpbGl0eS5nZXRfc2VjdXJlX3BhcmFtKCAnbG9jYWxlJyApLFxyXG5cclxuXHRcdFx0XHRcdHNlYXJjaF9wYXJhbXNcdDogd3BiY19hanhfYXZhaWxhYmlsaXR5LnNlYXJjaF9nZXRfYWxsX3BhcmFtcygpXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHQvKipcclxuXHRcdFx0XHQgKiBTIHUgYyBjIGUgcyBzXHJcblx0XHRcdFx0ICpcclxuXHRcdFx0XHQgKiBAcGFyYW0gcmVzcG9uc2VfZGF0YVx0XHQtXHRpdHMgb2JqZWN0IHJldHVybmVkIGZyb20gIEFqYXggLSBjbGFzcy1saXZlLXNlYXJjZy5waHBcclxuXHRcdFx0XHQgKiBAcGFyYW0gdGV4dFN0YXR1c1x0XHQtXHQnc3VjY2VzcydcclxuXHRcdFx0XHQgKiBAcGFyYW0ganFYSFJcdFx0XHRcdC1cdE9iamVjdFxyXG5cdFx0XHRcdCAqL1xyXG5cdFx0XHRcdGZ1bmN0aW9uICggcmVzcG9uc2VfZGF0YSwgdGV4dFN0YXR1cywganFYSFIgKSB7XHJcblxyXG5jb25zb2xlLmxvZyggJyA9PSBSZXNwb25zZSBXUEJDX0FKWF9BVkFJTEFCSUxJVFkgPT0gJywgcmVzcG9uc2VfZGF0YSApOyBjb25zb2xlLmdyb3VwRW5kKCk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gUHJvYmFibHkgRXJyb3JcclxuXHRcdFx0XHRcdGlmICggKHR5cGVvZiByZXNwb25zZV9kYXRhICE9PSAnb2JqZWN0JykgfHwgKHJlc3BvbnNlX2RhdGEgPT09IG51bGwpICl7XHJcblxyXG5cdFx0XHRcdFx0XHR3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX3Nob3dfbWVzc2FnZSggcmVzcG9uc2VfZGF0YSApO1xyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIFJlbG9hZCBwYWdlLCBhZnRlciBmaWx0ZXIgdG9vbGJhciBoYXMgYmVlbiByZXNldFxyXG5cdFx0XHRcdFx0aWYgKCAgICAgICAoICAgICB1bmRlZmluZWQgIT0gcmVzcG9uc2VfZGF0YVsgJ2FqeF9jbGVhbmVkX3BhcmFtcycgXSlcclxuXHRcdFx0XHRcdFx0XHQmJiAoICdyZXNldF9kb25lJyA9PT0gcmVzcG9uc2VfZGF0YVsgJ2FqeF9jbGVhbmVkX3BhcmFtcycgXVsgJ3VpX3Jlc2V0JyBdKVxyXG5cdFx0XHRcdFx0KXtcclxuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBTaG93IGxpc3RpbmdcclxuXHRcdFx0XHRcdHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fc2hvdyggcmVzcG9uc2VfZGF0YVsgJ2FqeF9kYXRhJyBdLCByZXNwb25zZV9kYXRhWyAnYWp4X3NlYXJjaF9wYXJhbXMnIF0gLCByZXNwb25zZV9kYXRhWyAnYWp4X2NsZWFuZWRfcGFyYW1zJyBdICk7XHJcblxyXG5cdFx0XHRcdFx0Ly93cGJjX2FqeF9hdmFpbGFiaWxpdHlfX2RlZmluZV91aV9ob29rcygpO1x0XHRcdFx0XHRcdC8vIFJlZGVmaW5lIEhvb2tzLCBiZWNhdXNlIHdlIHNob3cgbmV3IERPTSBlbGVtZW50c1xyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0d3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbl9fc3Bpbl9wYXVzZSgpO1xyXG5cclxuXHRcdFx0XHRcdGpRdWVyeSggJyNhamF4X3Jlc3BvbmQnICkuaHRtbCggcmVzcG9uc2VfZGF0YSApO1x0XHQvLyBGb3IgYWJpbGl0eSB0byBzaG93IHJlc3BvbnNlLCBhZGQgc3VjaCBESVYgZWxlbWVudCB0byBwYWdlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHQgICkuZmFpbCggZnVuY3Rpb24gKCBqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24gKSB7ICAgIGlmICggd2luZG93LmNvbnNvbGUgJiYgd2luZG93LmNvbnNvbGUubG9nICl7IGNvbnNvbGUubG9nKCAnQWpheF9FcnJvcicsIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93biApOyB9XHJcblxyXG5cdFx0XHRcdFx0dmFyIGVycm9yX21lc3NhZ2UgPSAnPHN0cm9uZz4nICsgJ0Vycm9yIScgKyAnPC9zdHJvbmc+ICcgKyBlcnJvclRocm93biA7XHJcblx0XHRcdFx0XHRpZiAoIGpxWEhSLnN0YXR1cyApe1xyXG5cdFx0XHRcdFx0XHRlcnJvcl9tZXNzYWdlICs9ICcgKDxiPicgKyBqcVhIUi5zdGF0dXMgKyAnPC9iPiknO1xyXG5cdFx0XHRcdFx0XHRpZiAoNDAzID09IGpxWEhSLnN0YXR1cyApe1xyXG5cdFx0XHRcdFx0XHRcdGVycm9yX21lc3NhZ2UgKz0gJyBQcm9iYWJseSBub25jZSBmb3IgdGhpcyBwYWdlIGhhcyBiZWVuIGV4cGlyZWQuIFBsZWFzZSA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgb25jbGljaz1cImphdmFzY3JpcHQ6bG9jYXRpb24ucmVsb2FkKCk7XCI+cmVsb2FkIHRoZSBwYWdlPC9hPi4nO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIGpxWEhSLnJlc3BvbnNlVGV4dCApe1xyXG5cdFx0XHRcdFx0XHRlcnJvcl9tZXNzYWdlICs9ICcgJyArIGpxWEhSLnJlc3BvbnNlVGV4dDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlLnJlcGxhY2UoIC9cXG4vZywgXCI8YnIgLz5cIiApO1xyXG5cclxuXHRcdFx0XHRcdHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fc2hvd19tZXNzYWdlKCBlcnJvcl9tZXNzYWdlICk7XHJcblx0XHRcdCAgfSlcclxuXHQgICAgICAgICAgLy8gLmRvbmUoICAgZnVuY3Rpb24gKCBkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUiApIHsgICBpZiAoIHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLmxvZyApeyBjb25zb2xlLmxvZyggJ3NlY29uZCBzdWNjZXNzJywgZGF0YSwgdGV4dFN0YXR1cywganFYSFIgKTsgfSAgICB9KVxyXG5cdFx0XHQgIC8vIC5hbHdheXMoIGZ1bmN0aW9uICggZGF0YV9qcVhIUiwgdGV4dFN0YXR1cywganFYSFJfZXJyb3JUaHJvd24gKSB7ICAgaWYgKCB3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS5sb2cgKXsgY29uc29sZS5sb2coICdhbHdheXMgZmluaXNoZWQnLCBkYXRhX2pxWEhSLCB0ZXh0U3RhdHVzLCBqcVhIUl9lcnJvclRocm93biApOyB9ICAgICB9KVxyXG5cdFx0XHQgIDsgIC8vIEVuZCBBamF4XHJcblxyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiAgIEggbyBvIGsgcyAgLSAgaXRzIEFjdGlvbi9UaW1lcyB3aGVuIG5lZWQgdG8gcmUtUmVuZGVyIFZpZXdzICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuLyoqXHJcbiAqIFNlbmQgQWpheCBTZWFyY2ggUmVxdWVzdCBhZnRlciBVcGRhdGluZyBzZWFyY2ggcmVxdWVzdCBwYXJhbWV0ZXJzXHJcbiAqXHJcbiAqIEBwYXJhbSBwYXJhbXNfYXJyXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX3NlbmRfcmVxdWVzdF93aXRoX3BhcmFtcyAoIHBhcmFtc19hcnIgKXtcclxuXHJcblx0Ly8gRGVmaW5lIGRpZmZlcmVudCBTZWFyY2ggIHBhcmFtZXRlcnMgZm9yIHJlcXVlc3RcclxuXHRfLmVhY2goIHBhcmFtc19hcnIsIGZ1bmN0aW9uICggcF92YWwsIHBfa2V5LCBwX2RhdGEgKSB7XHJcblx0XHQvL2NvbnNvbGUubG9nKCAnUmVxdWVzdCBmb3I6ICcsIHBfa2V5LCBwX3ZhbCApO1xyXG5cdFx0d3BiY19hanhfYXZhaWxhYmlsaXR5LnNlYXJjaF9zZXRfcGFyYW0oIHBfa2V5LCBwX3ZhbCApO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBTZW5kIEFqYXggUmVxdWVzdFxyXG5cdHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fYWpheF9yZXF1ZXN0KCk7XHJcbn1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIFNlYXJjaCByZXF1ZXN0IGZvciBcIlBhZ2UgTnVtYmVyXCJcclxuXHQgKiBAcGFyYW0gcGFnZV9udW1iZXJcdGludFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fcGFnaW5hdGlvbl9jbGljayggcGFnZV9udW1iZXIgKXtcclxuXHJcblx0XHR3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX3NlbmRfcmVxdWVzdF93aXRoX3BhcmFtcygge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3BhZ2VfbnVtJzogcGFnZV9udW1iZXJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9ICk7XHJcblx0fVxyXG5cclxuXHJcblxyXG4vKipcclxuICogICBTaG93IC8gSGlkZSBDb250ZW50ICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbi8qKlxyXG4gKiAgU2hvdyBMaXN0aW5nIENvbnRlbnQgXHQtIFx0U2VuZGluZyBBamF4IFJlcXVlc3RcdC1cdHdpdGggcGFyYW1ldGVycyB0aGF0ICB3ZSBlYXJseSAgZGVmaW5lZFxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hanhfYXZhaWxhYmlsaXR5X19hY3R1YWxfY29udGVudF9fc2hvdygpe1xyXG5cclxuXHR3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX2FqYXhfcmVxdWVzdCgpO1x0XHRcdC8vIFNlbmQgQWpheCBSZXF1ZXN0XHQtXHR3aXRoIHBhcmFtZXRlcnMgdGhhdCAgd2UgZWFybHkgIGRlZmluZWQgaW4gXCJ3cGJjX2FqeF9ib29raW5nX2xpc3RpbmdcIiBPYmouXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBIaWRlIExpc3RpbmcgQ29udGVudFxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hanhfYXZhaWxhYmlsaXR5X19hY3R1YWxfY29udGVudF9faGlkZSgpe1xyXG5cclxuXHRqUXVlcnkoICB3cGJjX2FqeF9hdmFpbGFiaWxpdHkuZ2V0X290aGVyX3BhcmFtKCAnbGlzdGluZ19jb250YWluZXInICkgICkuaHRtbCggJycgKTtcclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogICBNIGUgcyBzIGEgZyBlICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbi8qKlxyXG4gKiBTaG93IGp1c3QgbWVzc2FnZSBpbnN0ZWFkIG9mIGNvbnRlbnRcclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fc2hvd19tZXNzYWdlKCBtZXNzYWdlICl7XHJcblxyXG5cdHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fYWN0dWFsX2NvbnRlbnRfX2hpZGUoKTtcclxuXHJcblx0alF1ZXJ5KCB3cGJjX2FqeF9hdmFpbGFiaWxpdHkuZ2V0X290aGVyX3BhcmFtKCAnbGlzdGluZ19jb250YWluZXInICkgKS5odG1sKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIndwYmMtc2V0dGluZ3Mtbm90aWNlIG5vdGljZS13YXJuaW5nXCIgc3R5bGU9XCJ0ZXh0LWFsaWduOmxlZnRcIj4nICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlICtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzwvZGl2PidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiAgIFN1cHBvcnQgRnVuY3Rpb25zIC0gU3BpbiBJY29uIGluIEJ1dHRvbnMgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuLyoqXHJcbiAqIFNwaW4gYnV0dG9uIGluIEZpbHRlciB0b29sYmFyICAtICBTdGFydFxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbl9fc3Bpbl9zdGFydCgpe1xyXG5cdGpRdWVyeSggJyN3cGJjX2F2YWlsYWJpbGl0eV9yZWxvYWRfYnV0dG9uIC5tZW51X2ljb24ud3BiY19zcGluJykucmVtb3ZlQ2xhc3MoICd3cGJjX2FuaW1hdGlvbl9wYXVzZScgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNwaW4gYnV0dG9uIGluIEZpbHRlciB0b29sYmFyICAtICBQYXVzZVxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbl9fc3Bpbl9wYXVzZSgpe1xyXG5cdGpRdWVyeSggJyN3cGJjX2F2YWlsYWJpbGl0eV9yZWxvYWRfYnV0dG9uIC5tZW51X2ljb24ud3BiY19zcGluJyApLmFkZENsYXNzKCAnd3BiY19hbmltYXRpb25fcGF1c2UnICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTcGluIGJ1dHRvbiBpbiBGaWx0ZXIgdG9vbGJhciAgLSAgaXMgU3Bpbm5pbmcgP1xyXG4gKlxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYXZhaWxhYmlsaXR5X3JlbG9hZF9idXR0b25fX2lzX3NwaW4oKXtcclxuICAgIGlmICggalF1ZXJ5KCAnI3dwYmNfYXZhaWxhYmlsaXR5X3JlbG9hZF9idXR0b24gLm1lbnVfaWNvbi53cGJjX3NwaW4nICkuaGFzQ2xhc3MoICd3cGJjX2FuaW1hdGlvbl9wYXVzZScgKSApe1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcbn0iXSwiZmlsZSI6ImluY2x1ZGVzL3BhZ2UtYXZhaWxhYmlsaXR5L19vdXQvYXZhaWxhYmlsaXR5X3BhZ2UuanMifQ==
