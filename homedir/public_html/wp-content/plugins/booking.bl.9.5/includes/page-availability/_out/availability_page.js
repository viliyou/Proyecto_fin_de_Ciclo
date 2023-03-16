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

var wpbc_ajx_bookings = [];
/**
 *   Show Content  ---------------------------------------------------------------------------------------------- */

/**
 * Show Content - Calendar and UI elements
 *
 * @param ajx_data_arr
 * @param ajx_search_params
 * @param ajx_cleaned_params
 */

function wpbc_ajx_availability__page_content__show(ajx_data_arr, ajx_search_params, ajx_cleaned_params) {
  var template__availability_main_page_content = wp.template('wpbc_ajx_availability_main_page_content'); // Content

  jQuery(wpbc_ajx_availability.get_other_param('listing_container')).html(template__availability_main_page_content({
    'ajx_data': ajx_data_arr,
    'ajx_search_params': ajx_search_params,
    // $_REQUEST[ 'search_params' ]
    'ajx_cleaned_params': ajx_cleaned_params
  }));
  jQuery('.wpbc_processing.wpbc_spin').parent().parent().parent().parent('[id^="wpbc_notice_"]').hide(); // Load calendar

  wpbc_ajx_availability__calendar__show({
    'resource_id': ajx_cleaned_params.resource_id,
    'ajx_nonce_calendar': ajx_data_arr.ajx_nonce_calendar,
    'ajx_data_arr': ajx_data_arr,
    'ajx_cleaned_params': ajx_cleaned_params
  });
  /**
   * Trigger for dates selection in the booking form
   *
   * jQuery( wpbc_ajx_availability.get_other_param( 'listing_container' ) ).on('wpbc_page_content_loaded', function(event, ajx_data_arr, ajx_search_params , ajx_cleaned_params) { ... } );
   */

  jQuery(wpbc_ajx_availability.get_other_param('listing_container')).trigger('wpbc_page_content_loaded', [ajx_data_arr, ajx_search_params, ajx_cleaned_params]);
}
/**
 * Show inline month view calendar              with all predefined CSS (sizes and check in/out,  times containers)
 * @param {obj} calendar_params_arr
			{
				'resource_id'       	: ajx_cleaned_params.resource_id,
				'ajx_nonce_calendar'	: ajx_data_arr.ajx_nonce_calendar,
				'ajx_data_arr'          : ajx_data_arr = { ajx_booking_resources:[], booked_dates: {}, resource_unavailable_dates:[], season_availability:{},.... }
				'ajx_cleaned_params'    : {
											calendar__days_selection_mode: "dynamic"
											calendar__start_week_day: "0"
											calendar__timeslot_day_bg_as_available: ""
											calendar__view__cell_height: ""
											calendar__view__months_in_row: 4
											calendar__view__visible_months: 12
											calendar__view__width: "100%"

											dates_availability: "unavailable"
											dates_selection: "2023-03-14 ~ 2023-03-16"
											do_action: "set_availability"
											resource_id: 1
											ui_clicked_element_id: "wpbc_availability_apply_btn"
											ui_usr__availability_selected_toolbar: "info"
								  		 }
			}
*/


function wpbc_ajx_availability__calendar__show(calendar_params_arr) {
  // Update nonce
  jQuery('#ajx_nonce_calendar_section').html(calendar_params_arr.ajx_nonce_calendar); //------------------------------------------------------------------------------------------------------------------
  // Update bookings

  if ('undefined' == typeof wpbc_ajx_bookings[calendar_params_arr.resource_id]) {
    wpbc_ajx_bookings[calendar_params_arr.resource_id] = [];
  }

  wpbc_ajx_bookings[calendar_params_arr.resource_id] = calendar_params_arr['ajx_data_arr']['booked_dates']; //------------------------------------------------------------------------------------------------------------------

  /**
   * Define showing mouse over tooltip on unavailable dates
   * It's defined, when calendar REFRESHED (change months or days selection) loaded in jquery.datepick.wpbc.9.0.js :
   * 		$( 'body' ).trigger( 'wpbc_datepick_inline_calendar_refresh', ...		//FixIn: 9.4.4.13
   */

  jQuery('body').on('wpbc_datepick_inline_calendar_refresh', function (event, resource_id, inst) {
    // inst.dpDiv  it's:  <div class="datepick-inline datepick-multi" style="width: 17712px;">....</div>
    inst.dpDiv.find('.season_unavailable,.before_after_unavailable,.weekdays_unavailable').on('mouseover', function (this_event) {
      // also available these vars: 	resource_id, jCalContainer, inst
      var jCell = jQuery(this_event.currentTarget);
      wpbc_avy__show_tooltip__for_element(jCell, calendar_params_arr['ajx_data_arr']['popover_hints']);
    });
  }); //------------------------------------------------------------------------------------------------------------------

  /**
   * Define height of the calendar  cells, 	and  mouse over tooltips at  some unavailable dates
   * It's defined, when calendar loaded in jquery.datepick.wpbc.9.0.js :
   * 		$( 'body' ).trigger( 'wpbc_datepick_inline_calendar_loaded', ...		//FixIn: 9.4.4.12
   */

  jQuery('body').on('wpbc_datepick_inline_calendar_loaded', function (event, resource_id, jCalContainer, inst) {
    // Remove highlight day for today  date
    jQuery('.datepick-days-cell.datepick-today.datepick-days-cell-over').removeClass('datepick-days-cell-over'); // Set height of calendar  cells if defined this option

    if ('' !== calendar_params_arr.ajx_cleaned_params.calendar__view__cell_height) {
      jQuery('head').append('<style type="text/css">' + '.hasDatepick .datepick-inline .datepick-title-row th, ' + '.hasDatepick .datepick-inline .datepick-days-cell {' + 'height: ' + calendar_params_arr.ajx_cleaned_params.calendar__view__cell_height + ' !important;' + '}' + '</style>');
    } // Define showing mouse over tooltip on unavailable dates


    jCalContainer.find('.season_unavailable,.before_after_unavailable,.weekdays_unavailable').on('mouseover', function (this_event) {
      // also available these vars: 	resource_id, jCalContainer, inst
      var jCell = jQuery(this_event.currentTarget);
      wpbc_avy__show_tooltip__for_element(jCell, calendar_params_arr['ajx_data_arr']['popover_hints']);
    });
  }); //------------------------------------------------------------------------------------------------------------------
  // Define width of entire calendar

  var width = 'width:' + calendar_params_arr.ajx_cleaned_params.calendar__view__width + ';' // var width = 'width:100%;max-width:100%;';
  + 'max-width:' + calendar_params_arr.ajx_cleaned_params.calendar__view__months_in_row * 284 + 'px;'; //------------------------------------------------------------------------------------------------------------------
  // Add calendar container: "Calendar is loading..."  and textarea

  jQuery('.wpbc_ajx_avy__calendar').html('<div class="' + ' bk_calendar_frame' + ' months_num_in_row_' + calendar_params_arr.ajx_cleaned_params.calendar__view__months_in_row + ' cal_month_num_' + calendar_params_arr.ajx_cleaned_params.calendar__view__visible_months + ' ' + calendar_params_arr.ajx_cleaned_params.calendar__timeslot_day_bg_as_available // 'wpbc_timeslot_day_bg_as_available' || ''
  + '" ' + 'style="' + width + '">' + '<div id="calendar_booking' + calendar_params_arr.resource_id + '">' + 'Calendar is loading...' + '</div>' + '</div>' + '<textarea      id="date_booking' + calendar_params_arr.resource_id + '"' + ' name="date_booking' + calendar_params_arr.resource_id + '"' + ' autocomplete="off"' + ' style="display:none;width:100%;height:10em;margin:2em 0 0;"></textarea>'); //------------------------------------------------------------------------------------------------------------------

  var cal_param_arr = {
    'html_id': 'calendar_booking' + calendar_params_arr.ajx_cleaned_params.resource_id,
    'text_id': 'date_booking' + calendar_params_arr.ajx_cleaned_params.resource_id,
    'calendar__start_week_day': calendar_params_arr.ajx_cleaned_params.calendar__start_week_day,
    'calendar__view__visible_months': calendar_params_arr.ajx_cleaned_params.calendar__view__visible_months,
    'calendar__days_selection_mode': calendar_params_arr.ajx_cleaned_params.calendar__days_selection_mode,
    'resource_id': calendar_params_arr.ajx_cleaned_params.resource_id,
    'ajx_nonce_calendar': calendar_params_arr.ajx_data_arr.ajx_nonce_calendar,
    'booked_dates': calendar_params_arr.ajx_data_arr.booked_dates,
    'season_availability': calendar_params_arr.ajx_data_arr.season_availability,
    'resource_unavailable_dates': calendar_params_arr.ajx_data_arr.resource_unavailable_dates,
    'popover_hints': calendar_params_arr['ajx_data_arr']['popover_hints'] // {'season_unavailable':'...','weekdays_unavailable':'...','before_after_unavailable':'...',}

  };
  wpbc_show_inline_booking_calendar(cal_param_arr); //------------------------------------------------------------------------------------------------------------------

  /**
   * On click AVAILABLE |  UNAVAILABLE button  in widget	-	need to  change help dates text
   */

  jQuery('.wpbc_radio__set_days_availability').on('change', function (event, resource_id, inst) {
    wpbc__inline_booking_calendar__on_days_select(jQuery('#' + cal_param_arr.text_id).val(), cal_param_arr);
  }); // Show 	'Select days  in calendar then select Available  /  Unavailable status and click Apply availability button.'

  jQuery('#wpbc_toolbar_dates_hint').html('<div class="ui_element"><span class="wpbc_ui_control wpbc_ui_addon wpbc_help_text" >' + cal_param_arr.popover_hints.toolbar_text + '</span></div>');
}
/**
 * 	Load Datepick Inline calendar
 *
 * @param calendar_params_arr		example:{
											'html_id'           : 'calendar_booking' + calendar_params_arr.ajx_cleaned_params.resource_id,
											'text_id'           : 'date_booking' + calendar_params_arr.ajx_cleaned_params.resource_id,

											'calendar__start_week_day': 	  calendar_params_arr.ajx_cleaned_params.calendar__start_week_day,
											'calendar__view__visible_months': calendar_params_arr.ajx_cleaned_params.calendar__view__visible_months,
											'calendar__days_selection_mode':  calendar_params_arr.ajx_cleaned_params.calendar__days_selection_mode,

											'resource_id'        : calendar_params_arr.ajx_cleaned_params.resource_id,
											'ajx_nonce_calendar' : calendar_params_arr.ajx_data_arr.ajx_nonce_calendar,
											'booked_dates'       : calendar_params_arr.ajx_data_arr.booked_dates,
											'season_availability': calendar_params_arr.ajx_data_arr.season_availability,

											'resource_unavailable_dates' : calendar_params_arr.ajx_data_arr.resource_unavailable_dates
										}
 * @returns {boolean}
 */


function wpbc_show_inline_booking_calendar(calendar_params_arr) {
  if (0 === jQuery('#' + calendar_params_arr.html_id).length // If calendar DOM element not exist then exist
  || true === jQuery('#' + calendar_params_arr.html_id).hasClass('hasDatepick') // If the calendar with the same Booking resource already  has been activated, then exist.
  ) {
    return false;
  } //------------------------------------------------------------------------------------------------------------------
  // Configure and show calendar


  jQuery('#' + calendar_params_arr.html_id).text('');
  jQuery('#' + calendar_params_arr.html_id).datepick({
    beforeShowDay: function beforeShowDay(date) {
      return wpbc__inline_booking_calendar__apply_css_to_days(date, calendar_params_arr, this);
    },
    onSelect: function onSelect(date) {
      jQuery('#' + calendar_params_arr.text_id).val(date); //wpbc_blink_element('.wpbc_widget_available_unavailable', 3, 220);

      return wpbc__inline_booking_calendar__on_days_select(date, calendar_params_arr, this);
    },
    onHover: function onHover(value, date) {
      //wpbc_avy__prepare_tooltip__in_calendar( value, date, calendar_params_arr, this );
      return wpbc__inline_booking_calendar__on_days_hover(value, date, calendar_params_arr, this);
    },
    onChangeMonthYear: null,
    showOn: 'both',
    numberOfMonths: calendar_params_arr.calendar__view__visible_months,
    stepMonths: 1,
    prevText: '&laquo;',
    nextText: '&raquo;',
    dateFormat: 'yy-mm-dd',
    // 'dd.mm.yy',
    changeMonth: false,
    changeYear: false,
    minDate: 0,
    //null,  //Scroll as long as you need
    maxDate: '10y',
    // minDate: new Date(2020, 2, 1), maxDate: new Date(2020, 9, 31), 	// Ability to set any  start and end date in calendar
    showStatus: false,
    closeAtTop: false,
    firstDay: calendar_params_arr.calendar__start_week_day,
    gotoCurrent: false,
    hideIfNoPrevNext: true,
    multiSeparator: ', ',
    multiSelect: 'dynamic' == calendar_params_arr.calendar__days_selection_mode ? 0 : 365,
    // Maximum number of selectable dates:	 Single day = 0,  multi days = 365
    rangeSelect: 'dynamic' == calendar_params_arr.calendar__days_selection_mode,
    rangeSeparator: ' ~ ',
    //' - ',
    // showWeeks: true,
    useThemeRoller: false
  });
  return true;
}
/**
 * Apply CSS to calendar date cells
 *
 * @param date					-  JavaScript Date Obj:  		Mon Dec 11 2023 00:00:00 GMT+0200 (Eastern European Standard Time)
 * @param calendar_params_arr	-  Calendar Settings Object:  	{
																  "html_id": "calendar_booking4",
																  "text_id": "date_booking4",
																  "calendar__start_week_day": 1,
																  "calendar__view__visible_months": 12,
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
  // WEEKDAYS :: Set unavailable week days from - Settings General page in "Availability" section

  for (var i = 0; i < user_unavilable_days.length; i++) {
    if (date.getDay() == user_unavilable_days[i]) {
      return [!!false, css_date__standard + ' date_user_unavailable' + ' weekdays_unavailable'];
    }
  } // BEFORE_AFTER :: Set unavailable days Before / After the Today date


  if (days_between(date, today_date) < block_some_dates_from_today || typeof wpbc_available_days_num_from_today !== 'undefined' && parseInt('0' + wpbc_available_days_num_from_today) > 0 && days_between(date, today_date) > parseInt('0' + wpbc_available_days_num_from_today)) {
    return [!!false, css_date__standard + ' date_user_unavailable' + ' before_after_unavailable'];
  } // SEASONS ::  					Booking > Resources > Availability page


  var is_date_available = calendar_params_arr.season_availability[sql_class_day];

  if (!is_date_available) {
    return [!!false, css_date__standard + ' date_user_unavailable' + ' season_unavailable'];
  } // RESOURCE_UNAVAILABLE ::   	Booking > Availability page


  if (wpdev_in_array(calendar_params_arr.resource_unavailable_dates, sql_class_day)) {
    is_date_available = false;
  }

  if (!is_date_available) {
    return [!false, css_date__standard + ' date_user_unavailable' + ' resource_unavailable'];
  } //--------------------------------------------------------------------------------------------------------------


  css_date__additional += wpbc__inline_booking_calendar__days_css__get_rate(class_day, calendar_params_arr.resource_id); // ' rate_100'

  css_date__additional += wpbc__inline_booking_calendar__days_css__get_season_names(class_day, calendar_params_arr.resource_id); // ' weekend_season high_season'
  //--------------------------------------------------------------------------------------------------------------
  // Is any bookings in this date ?

  if ('undefined' !== typeof calendar_params_arr.booked_dates[class_day]) {
    var bookings_in_date = calendar_params_arr.booked_dates[class_day];

    if ('undefined' !== typeof bookings_in_date['sec_0']) {
      // "Full day" booking  -> (seconds == 0)
      css_date__additional += '0' === bookings_in_date['sec_0'].approved ? ' date2approve ' : ' date_approved '; // Pending = '0' |  Approved = '1'

      css_date__additional += ' full_day_booking';
      return [!false, css_date__standard + css_date__additional];
    } else if (Object.keys(bookings_in_date).length > 0) {
      // "Time slots" Bookings
      var is_approved = true;

      _.each(bookings_in_date, function (p_val, p_key, p_data) {
        if (!parseInt(p_val.approved)) {
          is_approved = false;
        }

        var ts = p_val.booking_date.substring(p_val.booking_date.length - 1);

        if (true === is_booking_used_check_in_out_time) {
          if (ts == '1') {
            css_date__additional += ' check_in_time' + (parseInt(p_val.approved) ? ' check_in_time_date_approved' : ' check_in_time_date2approve');
          }

          if (ts == '2') {
            css_date__additional += ' check_out_time' + (parseInt(p_val.approved) ? ' check_out_time_date_approved' : ' check_out_time_date2approve');
          }
        }
      });

      if (!is_approved) {
        css_date__additional += ' date2approve timespartly';
      } else {
        css_date__additional += ' date_approved timespartly';
      }

      if (!is_booking_used_check_in_out_time) {
        css_date__additional += ' times_clock';
      }
    }
  } //--------------------------------------------------------------------------------------------------------------


  return [true, css_date__standard + css_date__additional + ' date_available'];
}
/**
 * Apply some CSS classes, when we mouse over specific dates in calendar
 * @param value
 * @param date					-  JavaScript Date Obj:  		Mon Dec 11 2023 00:00:00 GMT+0200 (Eastern European Standard Time)
 * @param calendar_params_arr	-  Calendar Settings Object:  	{
																  "html_id": "calendar_booking4",
																  "text_id": "date_booking4",
																  "calendar__start_week_day": 1,
																  "calendar__view__visible_months": 12,
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
 * @returns {boolean}
 */


function wpbc__inline_booking_calendar__on_days_hover(value, date, calendar_params_arr, datepick_this) {
  if (null === date) {
    jQuery('.datepick-days-cell-over').removeClass('datepick-days-cell-over'); // clear all highlight days selections

    return false;
  }

  var inst = jQuery.datepick._getInst(document.getElementById('calendar_booking' + calendar_params_arr.resource_id));

  if (1 == inst.dates.length // If we have one selected date
  && 'dynamic' === calendar_params_arr.calendar__days_selection_mode // while have range days selection mode
  ) {
    var td_class;
    var td_overs = [];
    var is_check = true;
    var selceted_first_day = new Date();
    selceted_first_day.setFullYear(inst.dates[0].getFullYear(), inst.dates[0].getMonth(), inst.dates[0].getDate()); //Get first Date

    while (is_check) {
      td_class = selceted_first_day.getMonth() + 1 + '-' + selceted_first_day.getDate() + '-' + selceted_first_day.getFullYear();
      td_overs[td_overs.length] = '#calendar_booking' + calendar_params_arr.resource_id + ' .cal4date-' + td_class; // add to array for later make selection by class

      if (date.getMonth() == selceted_first_day.getMonth() && date.getDate() == selceted_first_day.getDate() && date.getFullYear() == selceted_first_day.getFullYear() || selceted_first_day > date) {
        is_check = false;
      }

      selceted_first_day.setFullYear(selceted_first_day.getFullYear(), selceted_first_day.getMonth(), selceted_first_day.getDate() + 1);
    } // Highlight Days


    for (var i = 0; i < td_overs.length; i++) {
      // add class to all elements
      jQuery(td_overs[i]).addClass('datepick-days-cell-over');
    }

    return true;
  }

  return true;
}
/**
 * On DAYs selection in calendar
 *
 * @param dates_selection		-  string:			 '2023-03-07 ~ 2023-03-07' or '2023-04-10, 2023-04-12, 2023-04-02, 2023-04-04'
 * @param calendar_params_arr	-  Calendar Settings Object:  	{
																  "html_id": "calendar_booking4",
																  "text_id": "date_booking4",
																  "calendar__start_week_day": 1,
																  "calendar__view__visible_months": 12,
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
 * @returns boolean
 */


function wpbc__inline_booking_calendar__on_days_select(dates_selection, calendar_params_arr) {
  var datepick_this = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var inst = jQuery.datepick._getInst(document.getElementById('calendar_booking' + calendar_params_arr.resource_id));

  var dates_arr = []; //  [ "2023-04-09", "2023-04-10", "2023-04-11" ]

  if (-1 !== dates_selection.indexOf('~')) {
    // Range Days
    dates_arr = wpbc_get_dates_arr__from_dates_range_js({
      'dates_separator': ' ~ ',
      //  ' ~ '
      'dates': dates_selection // '2023-04-04 ~ 2023-04-07'

    });
  } else {
    // Multiple Days
    dates_arr = wpbc_get_dates_arr__from_dates_comma_separated_js({
      'dates_separator': ', ',
      //  ', '
      'dates': dates_selection // '2023-04-10, 2023-04-12, 2023-04-02, 2023-04-04'

    });
  }

  wpbc_avy_after_days_selection__show_help_info({
    'calendar__days_selection_mode': calendar_params_arr.calendar__days_selection_mode,
    'dates_arr': dates_arr,
    'dates_click_num': inst.dates.length,
    'popover_hints': calendar_params_arr.popover_hints
  });
  return true;
}
/**
 * Show help info at the top  toolbar about selected dates and future actions
 *
 * @param params
 * 					Example 1:  {
									calendar__days_selection_mode: "dynamic",
									dates_arr:  [ "2023-04-03" ],
									dates_click_num: 1
									'popover_hints'					: calendar_params_arr.popover_hints
								}
 * 					Example 2:  {
									calendar__days_selection_mode: "dynamic"
									dates_arr: Array(10) [ "2023-04-03", "2023-04-04", "2023-04-05", … ]
									dates_click_num: 2
									'popover_hints'					: calendar_params_arr.popover_hints
								}
 */


function wpbc_avy_after_days_selection__show_help_info(params) {
  // console.log( params );	//		[ "2023-04-09", "2023-04-10", "2023-04-11" ]
  var message, color;

  if (jQuery('#ui_btn_avy__set_days_availability__available').is(':checked')) {
    message = params.popover_hints.toolbar_text_available; //'Set dates _DATES_ as _HTML_ available.';

    color = '#11be4c';
  } else {
    message = params.popover_hints.toolbar_text_unavailable; //'Set dates _DATES_ as _HTML_ unavailable.';

    color = '#e43939';
  }

  message = '<span>' + message + '</span>';
  var first_date = params['dates_arr'][0];
  var last_date = 'dynamic' == params.calendar__days_selection_mode ? params['dates_arr'][params['dates_arr'].length - 1] : params['dates_arr'].length > 1 ? params['dates_arr'][1] : '';
  first_date = jQuery.datepick.formatDate('dd M, yy', new Date(first_date + 'T00:00:00'));
  last_date = jQuery.datepick.formatDate('dd M, yy', new Date(last_date + 'T00:00:00'));

  if ('dynamic' == params.calendar__days_selection_mode) {
    if (1 == params.dates_click_num) {
      last_date = '___________';
    } else {
      if ('first_time' == jQuery('.wpbc_ajx_availability_container').attr('wpbc_loaded')) {
        jQuery('.wpbc_ajx_availability_container').attr('wpbc_loaded', 'done');
        wpbc_blink_element('.wpbc_widget_available_unavailable', 3, 220);
      }
    }

    message = message.replace('_DATES_', '</span>' //+ '<div>' + 'from' + '</div>'
    + '<span class="wpbc_big_date">' + first_date + '</span>' + '<span>' + '-' + '</span>' + '<span class="wpbc_big_date">' + last_date + '</span>' + '<span>');
  } else {
    // if ( params[ 'dates_arr' ].length > 1 ){
    // 	last_date = ', ' + last_date;
    // 	last_date += ( params[ 'dates_arr' ].length > 2 ) ? ', ...' : '';
    // } else {
    // 	last_date='';
    // }
    var dates_arr = [];

    for (var i = 0; i < params['dates_arr'].length; i++) {
      dates_arr.push(jQuery.datepick.formatDate('dd M yy', new Date(params['dates_arr'][i] + 'T00:00:00')));
    }

    first_date = dates_arr.join(', ');
    message = message.replace('_DATES_', '</span>' + '<span class="wpbc_big_date">' + first_date + '</span>' + '<span>');
  }

  message = message.replace('_HTML_', '</span><span class="wpbc_big_text" style="color:' + color + ';">') + '<span>'; //message += ' <div style="margin-left: 1em;">' + ' Click on Apply button to apply availability.' + '</div>';

  message = '<div class="wpbc_toolbar_dates_hints">' + message + '</div>';
  jQuery('.wpbc_help_text').html(message);
}
/**
 *   Parse dates  ------------------------------------------------------------------------------------------- */

/**
 * Get dates array,  from comma separated dates
 *
 * @param params       = {
									* 'dates_separator' => ', ',                                        // Dates separator
									* 'dates'           => '2023-04-04, 2023-04-07, 2023-04-05'         // Dates in 'Y-m-d' format: '2023-01-31'
						 }
 *
 * @return array      = [
									* [0] => 2023-04-04
									* [1] => 2023-04-05
									* [2] => 2023-04-06
									* [3] => 2023-04-07
						]
 *
 * Example #1:  wpbc_get_dates_arr__from_dates_comma_separated_js(  {  'dates_separator' : ', ', 'dates' : '2023-04-04, 2023-04-07, 2023-04-05'  }  );
 */


function wpbc_get_dates_arr__from_dates_comma_separated_js(params) {
  var dates_arr = [];

  if ('' !== params['dates']) {
    dates_arr = params['dates'].split(params['dates_separator']);
    dates_arr.sort();
  }

  return dates_arr;
}
/**
 * Get dates array,  from range days selection
 *
 * @param params       =  {
									* 'dates_separator' => ' ~ ',                         // Dates separator
									* 'dates'           => '2023-04-04 ~ 2023-04-07'      // Dates in 'Y-m-d' format: '2023-01-31'
						  }
 *
 * @return array        = [
									* [0] => 2023-04-04
									* [1] => 2023-04-05
									* [2] => 2023-04-06
									* [3] => 2023-04-07
						  ]
 *
 * Example #1:  wpbc_get_dates_arr__from_dates_range_js(  {  'dates_separator' : ' ~ ', 'dates' : '2023-04-04 ~ 2023-04-07'  }  );
 * Example #2:  wpbc_get_dates_arr__from_dates_range_js(  {  'dates_separator' : ' - ', 'dates' : '2023-04-04 - 2023-04-07'  }  );
 */


function wpbc_get_dates_arr__from_dates_range_js(params) {
  var dates_arr = [];

  if ('' !== params['dates']) {
    dates_arr = params['dates'].split(params['dates_separator']);
    var check_in_date_ymd = dates_arr[0];
    var check_out_date_ymd = dates_arr[1];

    if ('' !== check_in_date_ymd && '' !== check_out_date_ymd) {
      dates_arr = wpbc_get_dates_array_from_start_end_days_js(check_in_date_ymd, check_out_date_ymd);
    }
  }

  return dates_arr;
}
/**
 * Get dates array based on start and end dates.
 *
 * @param string sStartDate - start date: 2023-04-09
 * @param string sEndDate   - end date:   2023-04-11
 * @return array             - [ "2023-04-09", "2023-04-10", "2023-04-11" ]
 */


function wpbc_get_dates_array_from_start_end_days_js(sStartDate, sEndDate) {
  sStartDate = new Date(sStartDate + 'T00:00:00');
  sEndDate = new Date(sEndDate + 'T00:00:00');
  var aDays = []; // Start the variable off with the start date

  aDays.push(sStartDate.getTime()); // Set a 'temp' variable, sCurrentDate, with the start date - before beginning the loop

  var sCurrentDate = new Date(sStartDate.getTime());
  var one_day_duration = 24 * 60 * 60 * 1000; // While the current date is less than the end date

  while (sCurrentDate < sEndDate) {
    // Add a day to the current date "+1 day"
    sCurrentDate.setTime(sCurrentDate.getTime() + one_day_duration); // Add this new day to the aDays array

    aDays.push(sCurrentDate.getTime());
  }

  for (var i = 0; i < aDays.length; i++) {
    aDays[i] = new Date(aDays[i]);
    aDays[i] = aDays[i].getFullYear() + '-' + (aDays[i].getMonth() + 1 < 10 ? '0' : '') + (aDays[i].getMonth() + 1) + '-' + (aDays[i].getDate() < 10 ? '0' : '') + aDays[i].getDate();
  } // Once the loop has finished, return the array of days.


  return aDays;
}
/**
 *   Tooltips  ---------------------------------------------------------------------------------------------- */

/**
 * Define showing tooltip,  when  mouse over on  SELECTABLE (available, pending, approved, resource unavailable),  days
 * Can be called directly  from  datepick init function.
 *
 * @param value
 * @param date
 * @param calendar_params_arr
 * @param datepick_this
 * @returns {boolean}
 */


function wpbc_avy__prepare_tooltip__in_calendar(value, date, calendar_params_arr, datepick_this) {
  if (null == date) {
    return false;
  }

  var td_class = date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
  var jCell = jQuery('#calendar_booking' + calendar_params_arr.resource_id + ' td.cal4date-' + td_class);
  wpbc_avy__show_tooltip__for_element(jCell, calendar_params_arr['popover_hints']);
  return true;
}
/**
 * Define tooltip  for showing on UNAVAILABLE days (season, weekday, today_depends unavailable)
 *
 * @param jCell					jQuery of specific day cell
 * @param popover_hints		    Array with tooltip hint texts	 : {'season_unavailable':'...','weekdays_unavailable':'...','before_after_unavailable':'...',}
 */


function wpbc_avy__show_tooltip__for_element(jCell, popover_hints) {
  var tooltip_time = '';

  if (jCell.hasClass('season_unavailable')) {
    tooltip_time = popover_hints['season_unavailable'];
  } else if (jCell.hasClass('weekdays_unavailable')) {
    tooltip_time = popover_hints['weekdays_unavailable'];
  } else if (jCell.hasClass('before_after_unavailable')) {
    tooltip_time = popover_hints['before_after_unavailable'];
  } else if (jCell.hasClass('date2approve')) {} else if (jCell.hasClass('date_approved')) {} else {}

  jCell.attr('data-content', tooltip_time);
  var td_el = jCell.get(0); //jQuery( '#calendar_booking' + calendar_params_arr.resource_id + ' td.cal4date-' + td_class ).get(0);

  if (undefined == td_el._tippy && '' != tooltip_time) {
    wpbc_tippy(td_el, {
      content: function content(reference) {
        var popover_content = reference.getAttribute('data-content');
        return '<div class="popover popover_tippy">' + '<div class="popover-content">' + popover_content + '</div>' + '</div>';
      },
      allowHTML: true,
      trigger: 'mouseenter focus',
      interactive: !true,
      hideOnClick: true,
      interactiveBorder: 10,
      maxWidth: 550,
      theme: 'wpbc-tippy-times',
      placement: 'top',
      delay: [400, 0],
      //FixIn: 9.4.2.2
      ignoreAttributes: true,
      touch: true,
      //['hold', 500], // 500ms delay			//FixIn: 9.2.1.5
      appendTo: function appendTo() {
        return document.body;
      }
    });
  }
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


    if (undefined != response_data['ajx_cleaned_params'] && 'reset_done' === response_data['ajx_cleaned_params']['do_action']) {
      location.reload();
      return;
    } // Show listing


    wpbc_ajx_availability__page_content__show(response_data['ajx_data'], response_data['ajx_search_params'], response_data['ajx_cleaned_params']); //wpbc_ajx_availability__define_ui_hooks();						// Redefine Hooks, because we show new DOM elements

    if ('' != response_data['ajx_data']['ajx_after_action_message'].replace(/\n/g, "<br />")) {
      wpbc_admin_show_message(response_data['ajx_data']['ajx_after_action_message'].replace(/\n/g, "<br />"), '1' == response_data['ajx_data']['ajx_after_action_result'] ? 'success' : 'error', 10000);
    }

    wpbc_availability_reload_button__spin_pause(); // Remove spin icon from  button and Enable this button.

    wpbc_button__remove_spin(response_data['ajx_cleaned_params']['ui_clicked_element_id']);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzL3BhZ2UtYXZhaWxhYmlsaXR5L19zcmMvYXZhaWxhYmlsaXR5X3BhZ2UuanMiXSwibmFtZXMiOlsid3BiY19hanhfYXZhaWxhYmlsaXR5Iiwib2JqIiwiJCIsInBfc2VjdXJlIiwic2VjdXJpdHlfb2JqIiwidXNlcl9pZCIsIm5vbmNlIiwibG9jYWxlIiwic2V0X3NlY3VyZV9wYXJhbSIsInBhcmFtX2tleSIsInBhcmFtX3ZhbCIsImdldF9zZWN1cmVfcGFyYW0iLCJwX2xpc3RpbmciLCJzZWFyY2hfcmVxdWVzdF9vYmoiLCJzZWFyY2hfc2V0X2FsbF9wYXJhbXMiLCJyZXF1ZXN0X3BhcmFtX29iaiIsInNlYXJjaF9nZXRfYWxsX3BhcmFtcyIsInNlYXJjaF9nZXRfcGFyYW0iLCJzZWFyY2hfc2V0X3BhcmFtIiwic2VhcmNoX3NldF9wYXJhbXNfYXJyIiwicGFyYW1zX2FyciIsIl8iLCJlYWNoIiwicF92YWwiLCJwX2tleSIsInBfZGF0YSIsInBfb3RoZXIiLCJvdGhlcl9vYmoiLCJzZXRfb3RoZXJfcGFyYW0iLCJnZXRfb3RoZXJfcGFyYW0iLCJqUXVlcnkiLCJ3cGJjX2FqeF9ib29raW5ncyIsIndwYmNfYWp4X2F2YWlsYWJpbGl0eV9fcGFnZV9jb250ZW50X19zaG93IiwiYWp4X2RhdGFfYXJyIiwiYWp4X3NlYXJjaF9wYXJhbXMiLCJhanhfY2xlYW5lZF9wYXJhbXMiLCJ0ZW1wbGF0ZV9fYXZhaWxhYmlsaXR5X21haW5fcGFnZV9jb250ZW50Iiwid3AiLCJ0ZW1wbGF0ZSIsImh0bWwiLCJwYXJlbnQiLCJoaWRlIiwid3BiY19hanhfYXZhaWxhYmlsaXR5X19jYWxlbmRhcl9fc2hvdyIsInJlc291cmNlX2lkIiwiYWp4X25vbmNlX2NhbGVuZGFyIiwidHJpZ2dlciIsImNhbGVuZGFyX3BhcmFtc19hcnIiLCJvbiIsImV2ZW50IiwiaW5zdCIsImRwRGl2IiwiZmluZCIsInRoaXNfZXZlbnQiLCJqQ2VsbCIsImN1cnJlbnRUYXJnZXQiLCJ3cGJjX2F2eV9fc2hvd190b29sdGlwX19mb3JfZWxlbWVudCIsImpDYWxDb250YWluZXIiLCJyZW1vdmVDbGFzcyIsImNhbGVuZGFyX192aWV3X19jZWxsX2hlaWdodCIsImFwcGVuZCIsIndpZHRoIiwiY2FsZW5kYXJfX3ZpZXdfX3dpZHRoIiwiY2FsZW5kYXJfX3ZpZXdfX21vbnRoc19pbl9yb3ciLCJjYWxlbmRhcl9fdmlld19fdmlzaWJsZV9tb250aHMiLCJjYWxlbmRhcl9fdGltZXNsb3RfZGF5X2JnX2FzX2F2YWlsYWJsZSIsImNhbF9wYXJhbV9hcnIiLCJjYWxlbmRhcl9fc3RhcnRfd2Vla19kYXkiLCJjYWxlbmRhcl9fZGF5c19zZWxlY3Rpb25fbW9kZSIsImJvb2tlZF9kYXRlcyIsInNlYXNvbl9hdmFpbGFiaWxpdHkiLCJyZXNvdXJjZV91bmF2YWlsYWJsZV9kYXRlcyIsIndwYmNfc2hvd19pbmxpbmVfYm9va2luZ19jYWxlbmRhciIsIndwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19vbl9kYXlzX3NlbGVjdCIsInRleHRfaWQiLCJ2YWwiLCJwb3BvdmVyX2hpbnRzIiwidG9vbGJhcl90ZXh0IiwiaHRtbF9pZCIsImxlbmd0aCIsImhhc0NsYXNzIiwidGV4dCIsImRhdGVwaWNrIiwiYmVmb3JlU2hvd0RheSIsImRhdGUiLCJ3cGJjX19pbmxpbmVfYm9va2luZ19jYWxlbmRhcl9fYXBwbHlfY3NzX3RvX2RheXMiLCJvblNlbGVjdCIsIm9uSG92ZXIiLCJ2YWx1ZSIsIndwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19vbl9kYXlzX2hvdmVyIiwib25DaGFuZ2VNb250aFllYXIiLCJzaG93T24iLCJudW1iZXJPZk1vbnRocyIsInN0ZXBNb250aHMiLCJwcmV2VGV4dCIsIm5leHRUZXh0IiwiZGF0ZUZvcm1hdCIsImNoYW5nZU1vbnRoIiwiY2hhbmdlWWVhciIsIm1pbkRhdGUiLCJtYXhEYXRlIiwic2hvd1N0YXR1cyIsImNsb3NlQXRUb3AiLCJmaXJzdERheSIsImdvdG9DdXJyZW50IiwiaGlkZUlmTm9QcmV2TmV4dCIsIm11bHRpU2VwYXJhdG9yIiwibXVsdGlTZWxlY3QiLCJyYW5nZVNlbGVjdCIsInJhbmdlU2VwYXJhdG9yIiwidXNlVGhlbWVSb2xsZXIiLCJkYXRlcGlja190aGlzIiwidG9kYXlfZGF0ZSIsIkRhdGUiLCJ3cGJjX3RvZGF5IiwicGFyc2VJbnQiLCJjbGFzc19kYXkiLCJnZXRNb250aCIsImdldERhdGUiLCJnZXRGdWxsWWVhciIsInNxbF9jbGFzc19kYXkiLCJjc3NfZGF0ZV9fc3RhbmRhcmQiLCJjc3NfZGF0ZV9fYWRkaXRpb25hbCIsImdldERheSIsImkiLCJ1c2VyX3VuYXZpbGFibGVfZGF5cyIsImRheXNfYmV0d2VlbiIsImJsb2NrX3NvbWVfZGF0ZXNfZnJvbV90b2RheSIsIndwYmNfYXZhaWxhYmxlX2RheXNfbnVtX2Zyb21fdG9kYXkiLCJpc19kYXRlX2F2YWlsYWJsZSIsIndwZGV2X2luX2FycmF5Iiwid3BiY19faW5saW5lX2Jvb2tpbmdfY2FsZW5kYXJfX2RheXNfY3NzX19nZXRfcmF0ZSIsIndwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19kYXlzX2Nzc19fZ2V0X3NlYXNvbl9uYW1lcyIsImJvb2tpbmdzX2luX2RhdGUiLCJhcHByb3ZlZCIsIk9iamVjdCIsImtleXMiLCJpc19hcHByb3ZlZCIsInRzIiwiYm9va2luZ19kYXRlIiwic3Vic3RyaW5nIiwiaXNfYm9va2luZ191c2VkX2NoZWNrX2luX291dF90aW1lIiwiX2dldEluc3QiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZGF0ZXMiLCJ0ZF9jbGFzcyIsInRkX292ZXJzIiwiaXNfY2hlY2siLCJzZWxjZXRlZF9maXJzdF9kYXkiLCJzZXRGdWxsWWVhciIsImFkZENsYXNzIiwiZGF0ZXNfc2VsZWN0aW9uIiwiZGF0ZXNfYXJyIiwiaW5kZXhPZiIsIndwYmNfZ2V0X2RhdGVzX2Fycl9fZnJvbV9kYXRlc19yYW5nZV9qcyIsIndwYmNfZ2V0X2RhdGVzX2Fycl9fZnJvbV9kYXRlc19jb21tYV9zZXBhcmF0ZWRfanMiLCJ3cGJjX2F2eV9hZnRlcl9kYXlzX3NlbGVjdGlvbl9fc2hvd19oZWxwX2luZm8iLCJwYXJhbXMiLCJtZXNzYWdlIiwiY29sb3IiLCJpcyIsInRvb2xiYXJfdGV4dF9hdmFpbGFibGUiLCJ0b29sYmFyX3RleHRfdW5hdmFpbGFibGUiLCJmaXJzdF9kYXRlIiwibGFzdF9kYXRlIiwiZm9ybWF0RGF0ZSIsImRhdGVzX2NsaWNrX251bSIsImF0dHIiLCJ3cGJjX2JsaW5rX2VsZW1lbnQiLCJyZXBsYWNlIiwicHVzaCIsImpvaW4iLCJzcGxpdCIsInNvcnQiLCJjaGVja19pbl9kYXRlX3ltZCIsImNoZWNrX291dF9kYXRlX3ltZCIsIndwYmNfZ2V0X2RhdGVzX2FycmF5X2Zyb21fc3RhcnRfZW5kX2RheXNfanMiLCJzU3RhcnREYXRlIiwic0VuZERhdGUiLCJhRGF5cyIsImdldFRpbWUiLCJzQ3VycmVudERhdGUiLCJvbmVfZGF5X2R1cmF0aW9uIiwic2V0VGltZSIsIndwYmNfYXZ5X19wcmVwYXJlX3Rvb2x0aXBfX2luX2NhbGVuZGFyIiwidG9vbHRpcF90aW1lIiwidGRfZWwiLCJnZXQiLCJ1bmRlZmluZWQiLCJfdGlwcHkiLCJ3cGJjX3RpcHB5IiwiY29udGVudCIsInJlZmVyZW5jZSIsInBvcG92ZXJfY29udGVudCIsImdldEF0dHJpYnV0ZSIsImFsbG93SFRNTCIsImludGVyYWN0aXZlIiwiaGlkZU9uQ2xpY2siLCJpbnRlcmFjdGl2ZUJvcmRlciIsIm1heFdpZHRoIiwidGhlbWUiLCJwbGFjZW1lbnQiLCJkZWxheSIsImlnbm9yZUF0dHJpYnV0ZXMiLCJ0b3VjaCIsImFwcGVuZFRvIiwiYm9keSIsIndwYmNfYWp4X2F2YWlsYWJpbGl0eV9fYWpheF9yZXF1ZXN0IiwiY29uc29sZSIsImdyb3VwQ29sbGFwc2VkIiwibG9nIiwid3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbl9fc3Bpbl9zdGFydCIsInBvc3QiLCJ3cGJjX2dsb2JhbDEiLCJ3cGJjX2FqYXh1cmwiLCJhY3Rpb24iLCJ3cGJjX2FqeF91c2VyX2lkIiwid3BiY19hanhfbG9jYWxlIiwic2VhcmNoX3BhcmFtcyIsInJlc3BvbnNlX2RhdGEiLCJ0ZXh0U3RhdHVzIiwianFYSFIiLCJncm91cEVuZCIsIndwYmNfYWp4X2F2YWlsYWJpbGl0eV9fc2hvd19tZXNzYWdlIiwibG9jYXRpb24iLCJyZWxvYWQiLCJ3cGJjX2FkbWluX3Nob3dfbWVzc2FnZSIsIndwYmNfYXZhaWxhYmlsaXR5X3JlbG9hZF9idXR0b25fX3NwaW5fcGF1c2UiLCJ3cGJjX2J1dHRvbl9fcmVtb3ZlX3NwaW4iLCJmYWlsIiwiZXJyb3JUaHJvd24iLCJ3aW5kb3ciLCJlcnJvcl9tZXNzYWdlIiwic3RhdHVzIiwicmVzcG9uc2VUZXh0Iiwid3BiY19hanhfYXZhaWxhYmlsaXR5X19zZW5kX3JlcXVlc3Rfd2l0aF9wYXJhbXMiLCJ3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX3BhZ2luYXRpb25fY2xpY2siLCJwYWdlX251bWJlciIsIndwYmNfYWp4X2F2YWlsYWJpbGl0eV9fYWN0dWFsX2NvbnRlbnRfX3Nob3ciLCJ3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX2FjdHVhbF9jb250ZW50X19oaWRlIiwid3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbl9faXNfc3BpbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBRUEsSUFBSUEscUJBQXFCLEdBQUksVUFBV0MsR0FBWCxFQUFnQkMsQ0FBaEIsRUFBbUI7QUFFL0M7QUFDQSxNQUFJQyxRQUFRLEdBQUdGLEdBQUcsQ0FBQ0csWUFBSixHQUFtQkgsR0FBRyxDQUFDRyxZQUFKLElBQW9CO0FBQ3hDQyxJQUFBQSxPQUFPLEVBQUUsQ0FEK0I7QUFFeENDLElBQUFBLEtBQUssRUFBSSxFQUYrQjtBQUd4Q0MsSUFBQUEsTUFBTSxFQUFHO0FBSCtCLEdBQXREOztBQU1BTixFQUFBQSxHQUFHLENBQUNPLGdCQUFKLEdBQXVCLFVBQVdDLFNBQVgs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QTVFLENBQUwsRUFBMkc7QUFDN0csV0FBTyxJQUFQO0FBQ0EsR0FGRSxNQUVJO0FBQ04sV0FBTyxLQUFQO0FBQ0E7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIFJlcXVlc3QgT2JqZWN0XHJcbiAqIEhlcmUgd2UgY2FuICBkZWZpbmUgU2VhcmNoIHBhcmFtZXRlcnMgYW5kIFVwZGF0ZSBpdCBsYXRlciwgIHdoZW4gIHNvbWUgcGFyYW1ldGVyIHdhcyBjaGFuZ2VkXHJcbiAqXHJcbiAqL1xyXG5cclxudmFyIHdwYmNfYWp4X2F2YWlsYWJpbGl0eSA9IChmdW5jdGlvbiAoIG9iaiwgJCkge1xyXG5cclxuXHQvLyBTZWN1cmUgcGFyYW1ldGVycyBmb3IgQWpheFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0dmFyIHBfc2VjdXJlID0gb2JqLnNlY3VyaXR5X29iaiA9IG9iai5zZWN1cml0eV9vYmogfHwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR1c2VyX2lkOiAwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRub25jZSAgOiAnJyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9jYWxlIDogJydcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgfTtcclxuXHJcblx0b2JqLnNldF9zZWN1cmVfcGFyYW0gPSBmdW5jdGlvbiAoIHBhcmFtX2tleSwgcGFyYW1fdmFsICkge1xyXG5cdFx0cF9zZWN1cmVbIHBhcmFtX2tleSBdID0gcGFyYW1fdmFsO1xyXG5cdH07XHJcblxyXG5cdG9iai5nZXRfc2VjdXJlX3BhcmFtID0gZnVuY3Rpb24gKCBwYXJhbV9rZXkgKSB7XHJcblx0XHRyZXR1cm4gcF9zZWN1cmVbIHBhcmFtX2tleSBdO1xyXG5cdH07XHJcblxyXG5cclxuXHQvLyBMaXN0aW5nIFNlYXJjaCBwYXJhbWV0ZXJzXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR2YXIgcF9saXN0aW5nID0gb2JqLnNlYXJjaF9yZXF1ZXN0X29iaiA9IG9iai5zZWFyY2hfcmVxdWVzdF9vYmogfHwge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBzb3J0ICAgICAgICAgICAgOiBcImJvb2tpbmdfaWRcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gc29ydF90eXBlICAgICAgIDogXCJERVNDXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIHBhZ2VfbnVtICAgICAgICA6IDEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIHBhZ2VfaXRlbXNfY291bnQ6IDEwLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBjcmVhdGVfZGF0ZSAgICAgOiBcIlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBrZXl3b3JkICAgICAgICAgOiBcIlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBzb3VyY2UgICAgICAgICAgOiBcIlwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9O1xyXG5cclxuXHRvYmouc2VhcmNoX3NldF9hbGxfcGFyYW1zID0gZnVuY3Rpb24gKCByZXF1ZXN0X3BhcmFtX29iaiApIHtcclxuXHRcdHBfbGlzdGluZyA9IHJlcXVlc3RfcGFyYW1fb2JqO1xyXG5cdH07XHJcblxyXG5cdG9iai5zZWFyY2hfZ2V0X2FsbF9wYXJhbXMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRyZXR1cm4gcF9saXN0aW5nO1xyXG5cdH07XHJcblxyXG5cdG9iai5zZWFyY2hfZ2V0X3BhcmFtID0gZnVuY3Rpb24gKCBwYXJhbV9rZXkgKSB7XHJcblx0XHRyZXR1cm4gcF9saXN0aW5nWyBwYXJhbV9rZXkgXTtcclxuXHR9O1xyXG5cclxuXHRvYmouc2VhcmNoX3NldF9wYXJhbSA9IGZ1bmN0aW9uICggcGFyYW1fa2V5LCBwYXJhbV92YWwgKSB7XHJcblx0XHQvLyBpZiAoIEFycmF5LmlzQXJyYXkoIHBhcmFtX3ZhbCApICl7XHJcblx0XHQvLyBcdHBhcmFtX3ZhbCA9IEpTT04uc3RyaW5naWZ5KCBwYXJhbV92YWwgKTtcclxuXHRcdC8vIH1cclxuXHRcdHBfbGlzdGluZ1sgcGFyYW1fa2V5IF0gPSBwYXJhbV92YWw7XHJcblx0fTtcclxuXHJcblx0b2JqLnNlYXJjaF9zZXRfcGFyYW1zX2FyciA9IGZ1bmN0aW9uKCBwYXJhbXNfYXJyICl7XHJcblx0XHRfLmVhY2goIHBhcmFtc19hcnIsIGZ1bmN0aW9uICggcF92YWwsIHBfa2V5LCBwX2RhdGEgKXtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBEZWZpbmUgZGlmZmVyZW50IFNlYXJjaCAgcGFyYW1ldGVycyBmb3IgcmVxdWVzdFxyXG5cdFx0XHR0aGlzLnNlYXJjaF9zZXRfcGFyYW0oIHBfa2V5LCBwX3ZhbCApO1xyXG5cdFx0fSApO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIE90aGVyIHBhcmFtZXRlcnMgXHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0dmFyIHBfb3RoZXIgPSBvYmoub3RoZXJfb2JqID0gb2JqLm90aGVyX29iaiB8fCB7IH07XHJcblxyXG5cdG9iai5zZXRfb3RoZXJfcGFyYW0gPSBmdW5jdGlvbiAoIHBhcmFtX2tleSwgcGFyYW1fdmFsICkge1xyXG5cdFx0cF9vdGhlclsgcGFyYW1fa2V5IF0gPSBwYXJhbV92YWw7XHJcblx0fTtcclxuXHJcblx0b2JqLmdldF9vdGhlcl9wYXJhbSA9IGZ1bmN0aW9uICggcGFyYW1fa2V5ICkge1xyXG5cdFx0cmV0dXJuIHBfb3RoZXJbIHBhcmFtX2tleSBdO1xyXG5cdH07XHJcblxyXG5cclxuXHRyZXR1cm4gb2JqO1xyXG59KCB3cGJjX2FqeF9hdmFpbGFiaWxpdHkgfHwge30sIGpRdWVyeSApKTtcclxuXHJcbnZhciB3cGJjX2FqeF9ib29raW5ncyA9IFtdO1xyXG5cclxuLyoqXHJcbiAqICAgU2hvdyBDb250ZW50ICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4vKipcclxuICogU2hvdyBDb250ZW50IC0gQ2FsZW5kYXIgYW5kIFVJIGVsZW1lbnRzXHJcbiAqXHJcbiAqIEBwYXJhbSBhanhfZGF0YV9hcnJcclxuICogQHBhcmFtIGFqeF9zZWFyY2hfcGFyYW1zXHJcbiAqIEBwYXJhbSBhanhfY2xlYW5lZF9wYXJhbXNcclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fcGFnZV9jb250ZW50X19zaG93KCBhanhfZGF0YV9hcnIsIGFqeF9zZWFyY2hfcGFyYW1zICwgYWp4X2NsZWFuZWRfcGFyYW1zICl7XHJcblxyXG5cdHZhciB0ZW1wbGF0ZV9fYXZhaWxhYmlsaXR5X21haW5fcGFnZV9jb250ZW50ID0gd3AudGVtcGxhdGUoICd3cGJjX2FqeF9hdmFpbGFiaWxpdHlfbWFpbl9wYWdlX2NvbnRlbnQnICk7XHJcblxyXG5cdC8vIENvbnRlbnRcclxuXHRqUXVlcnkoIHdwYmNfYWp4X2F2YWlsYWJpbGl0eS5nZXRfb3RoZXJfcGFyYW0oICdsaXN0aW5nX2NvbnRhaW5lcicgKSApLmh0bWwoIHRlbXBsYXRlX19hdmFpbGFiaWxpdHlfbWFpbl9wYWdlX2NvbnRlbnQoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnYWp4X2RhdGEnICAgICAgICAgICAgICA6IGFqeF9kYXRhX2FycixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnYWp4X3NlYXJjaF9wYXJhbXMnICAgICA6IGFqeF9zZWFyY2hfcGFyYW1zLFx0XHRcdFx0XHRcdFx0XHQvLyAkX1JFUVVFU1RbICdzZWFyY2hfcGFyYW1zJyBdXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2FqeF9jbGVhbmVkX3BhcmFtcycgICAgOiBhanhfY2xlYW5lZF9wYXJhbXNcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSApICk7XHJcblxyXG5cdGpRdWVyeSggJy53cGJjX3Byb2Nlc3Npbmcud3BiY19zcGluJykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkucGFyZW50KCAnW2lkXj1cIndwYmNfbm90aWNlX1wiXScgKS5oaWRlKCk7XHJcblx0Ly8gTG9hZCBjYWxlbmRhclxyXG5cdHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fY2FsZW5kYXJfX3Nob3coIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdyZXNvdXJjZV9pZCcgICAgICAgOiBhanhfY2xlYW5lZF9wYXJhbXMucmVzb3VyY2VfaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnYWp4X25vbmNlX2NhbGVuZGFyJzogYWp4X2RhdGFfYXJyLmFqeF9ub25jZV9jYWxlbmRhcixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdhanhfZGF0YV9hcnInICAgICAgICAgIDogYWp4X2RhdGFfYXJyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2FqeF9jbGVhbmVkX3BhcmFtcycgICAgOiBhanhfY2xlYW5lZF9wYXJhbXNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9ICk7XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBUcmlnZ2VyIGZvciBkYXRlcyBzZWxlY3Rpb24gaW4gdGhlIGJvb2tpbmcgZm9ybVxyXG5cdCAqXHJcblx0ICogalF1ZXJ5KCB3cGJjX2FqeF9hdmFpbGFiaWxpdHkuZ2V0X290aGVyX3BhcmFtKCAnbGlzdGluZ19jb250YWluZXInICkgKS5vbignd3BiY19wYWdlX2NvbnRlbnRfbG9hZGVkJywgZnVuY3Rpb24oZXZlbnQsIGFqeF9kYXRhX2FyciwgYWp4X3NlYXJjaF9wYXJhbXMgLCBhanhfY2xlYW5lZF9wYXJhbXMpIHsgLi4uIH0gKTtcclxuXHQgKi9cclxuXHRqUXVlcnkoIHdwYmNfYWp4X2F2YWlsYWJpbGl0eS5nZXRfb3RoZXJfcGFyYW0oICdsaXN0aW5nX2NvbnRhaW5lcicgKSApLnRyaWdnZXIoICd3cGJjX3BhZ2VfY29udGVudF9sb2FkZWQnLCBbIGFqeF9kYXRhX2FyciwgYWp4X3NlYXJjaF9wYXJhbXMgLCBhanhfY2xlYW5lZF9wYXJhbXMgXSApO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFNob3cgaW5saW5lIG1vbnRoIHZpZXcgY2FsZW5kYXIgICAgICAgICAgICAgIHdpdGggYWxsIHByZWRlZmluZWQgQ1NTIChzaXplcyBhbmQgY2hlY2sgaW4vb3V0LCAgdGltZXMgY29udGFpbmVycylcclxuICogQHBhcmFtIHtvYmp9IGNhbGVuZGFyX3BhcmFtc19hcnJcclxuXHRcdFx0e1xyXG5cdFx0XHRcdCdyZXNvdXJjZV9pZCcgICAgICAgXHQ6IGFqeF9jbGVhbmVkX3BhcmFtcy5yZXNvdXJjZV9pZCxcclxuXHRcdFx0XHQnYWp4X25vbmNlX2NhbGVuZGFyJ1x0OiBhanhfZGF0YV9hcnIuYWp4X25vbmNlX2NhbGVuZGFyLFxyXG5cdFx0XHRcdCdhanhfZGF0YV9hcnInICAgICAgICAgIDogYWp4X2RhdGFfYXJyID0geyBhanhfYm9va2luZ19yZXNvdXJjZXM6W10sIGJvb2tlZF9kYXRlczoge30sIHJlc291cmNlX3VuYXZhaWxhYmxlX2RhdGVzOltdLCBzZWFzb25fYXZhaWxhYmlsaXR5Ont9LC4uLi4gfVxyXG5cdFx0XHRcdCdhanhfY2xlYW5lZF9wYXJhbXMnICAgIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FsZW5kYXJfX2RheXNfc2VsZWN0aW9uX21vZGU6IFwiZHluYW1pY1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYWxlbmRhcl9fc3RhcnRfd2Vla19kYXk6IFwiMFwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYWxlbmRhcl9fdGltZXNsb3RfZGF5X2JnX2FzX2F2YWlsYWJsZTogXCJcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FsZW5kYXJfX3ZpZXdfX2NlbGxfaGVpZ2h0OiBcIlwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYWxlbmRhcl9fdmlld19fbW9udGhzX2luX3JvdzogNFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FsZW5kYXJfX3ZpZXdfX3Zpc2libGVfbW9udGhzOiAxMlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FsZW5kYXJfX3ZpZXdfX3dpZHRoOiBcIjEwMCVcIlxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGVzX2F2YWlsYWJpbGl0eTogXCJ1bmF2YWlsYWJsZVwiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRlc19zZWxlY3Rpb246IFwiMjAyMy0wMy0xNCB+IDIwMjMtMDMtMTZcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZG9fYWN0aW9uOiBcInNldF9hdmFpbGFiaWxpdHlcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzb3VyY2VfaWQ6IDFcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVpX2NsaWNrZWRfZWxlbWVudF9pZDogXCJ3cGJjX2F2YWlsYWJpbGl0eV9hcHBseV9idG5cIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dWlfdXNyX19hdmFpbGFiaWxpdHlfc2VsZWN0ZWRfdG9vbGJhcjogXCJpbmZvXCJcclxuXHRcdFx0XHRcdFx0XHRcdCAgXHRcdCB9XHJcblx0XHRcdH1cclxuKi9cclxuZnVuY3Rpb24gd3BiY19hanhfYXZhaWxhYmlsaXR5X19jYWxlbmRhcl9fc2hvdyggY2FsZW5kYXJfcGFyYW1zX2FyciApe1xyXG5cclxuXHQvLyBVcGRhdGUgbm9uY2VcclxuXHRqUXVlcnkoICcjYWp4X25vbmNlX2NhbGVuZGFyX3NlY3Rpb24nICkuaHRtbCggY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfbm9uY2VfY2FsZW5kYXIgKTtcclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvLyBVcGRhdGUgYm9va2luZ3NcclxuXHRpZiAoICd1bmRlZmluZWQnID09IHR5cGVvZiAod3BiY19hanhfYm9va2luZ3NbIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgXSkgKXsgd3BiY19hanhfYm9va2luZ3NbIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgXSA9IFtdOyB9XHJcblx0d3BiY19hanhfYm9va2luZ3NbIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgXSA9IGNhbGVuZGFyX3BhcmFtc19hcnJbICdhanhfZGF0YV9hcnInIF1bICdib29rZWRfZGF0ZXMnIF07XHJcblxyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8qKlxyXG5cdCAqIERlZmluZSBzaG93aW5nIG1vdXNlIG92ZXIgdG9vbHRpcCBvbiB1bmF2YWlsYWJsZSBkYXRlc1xyXG5cdCAqIEl0J3MgZGVmaW5lZCwgd2hlbiBjYWxlbmRhciBSRUZSRVNIRUQgKGNoYW5nZSBtb250aHMgb3IgZGF5cyBzZWxlY3Rpb24pIGxvYWRlZCBpbiBqcXVlcnkuZGF0ZXBpY2sud3BiYy45LjAuanMgOlxyXG5cdCAqIFx0XHQkKCAnYm9keScgKS50cmlnZ2VyKCAnd3BiY19kYXRlcGlja19pbmxpbmVfY2FsZW5kYXJfcmVmcmVzaCcsIC4uLlx0XHQvL0ZpeEluOiA5LjQuNC4xM1xyXG5cdCAqL1xyXG5cdGpRdWVyeSggJ2JvZHknICkub24oICd3cGJjX2RhdGVwaWNrX2lubGluZV9jYWxlbmRhcl9yZWZyZXNoJywgZnVuY3Rpb24gKCBldmVudCwgcmVzb3VyY2VfaWQsIGluc3QgKXtcclxuXHRcdC8vIGluc3QuZHBEaXYgIGl0J3M6ICA8ZGl2IGNsYXNzPVwiZGF0ZXBpY2staW5saW5lIGRhdGVwaWNrLW11bHRpXCIgc3R5bGU9XCJ3aWR0aDogMTc3MTJweDtcIj4uLi4uPC9kaXY+XHJcblx0XHRpbnN0LmRwRGl2LmZpbmQoICcuc2Vhc29uX3VuYXZhaWxhYmxlLC5iZWZvcmVfYWZ0ZXJfdW5hdmFpbGFibGUsLndlZWtkYXlzX3VuYXZhaWxhYmxlJyApLm9uKCAnbW91c2VvdmVyJywgZnVuY3Rpb24gKCB0aGlzX2V2ZW50ICl7XHJcblx0XHRcdC8vIGFsc28gYXZhaWxhYmxlIHRoZXNlIHZhcnM6IFx0cmVzb3VyY2VfaWQsIGpDYWxDb250YWluZXIsIGluc3RcclxuXHRcdFx0dmFyIGpDZWxsID0galF1ZXJ5KCB0aGlzX2V2ZW50LmN1cnJlbnRUYXJnZXQgKTtcclxuXHRcdFx0d3BiY19hdnlfX3Nob3dfdG9vbHRpcF9fZm9yX2VsZW1lbnQoIGpDZWxsLCBjYWxlbmRhcl9wYXJhbXNfYXJyWyAnYWp4X2RhdGFfYXJyJyBdWydwb3BvdmVyX2hpbnRzJ10gKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHQpO1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8qKlxyXG5cdCAqIERlZmluZSBoZWlnaHQgb2YgdGhlIGNhbGVuZGFyICBjZWxscywgXHRhbmQgIG1vdXNlIG92ZXIgdG9vbHRpcHMgYXQgIHNvbWUgdW5hdmFpbGFibGUgZGF0ZXNcclxuXHQgKiBJdCdzIGRlZmluZWQsIHdoZW4gY2FsZW5kYXIgbG9hZGVkIGluIGpxdWVyeS5kYXRlcGljay53cGJjLjkuMC5qcyA6XHJcblx0ICogXHRcdCQoICdib2R5JyApLnRyaWdnZXIoICd3cGJjX2RhdGVwaWNrX2lubGluZV9jYWxlbmRhcl9sb2FkZWQnLCAuLi5cdFx0Ly9GaXhJbjogOS40LjQuMTJcclxuXHQgKi9cclxuXHRqUXVlcnkoICdib2R5JyApLm9uKCAnd3BiY19kYXRlcGlja19pbmxpbmVfY2FsZW5kYXJfbG9hZGVkJywgZnVuY3Rpb24gKCBldmVudCwgcmVzb3VyY2VfaWQsIGpDYWxDb250YWluZXIsIGluc3QgKXtcclxuXHJcblx0XHQvLyBSZW1vdmUgaGlnaGxpZ2h0IGRheSBmb3IgdG9kYXkgIGRhdGVcclxuXHRcdGpRdWVyeSggJy5kYXRlcGljay1kYXlzLWNlbGwuZGF0ZXBpY2stdG9kYXkuZGF0ZXBpY2stZGF5cy1jZWxsLW92ZXInICkucmVtb3ZlQ2xhc3MoICdkYXRlcGljay1kYXlzLWNlbGwtb3ZlcicgKTtcclxuXHJcblx0XHQvLyBTZXQgaGVpZ2h0IG9mIGNhbGVuZGFyICBjZWxscyBpZiBkZWZpbmVkIHRoaXMgb3B0aW9uXHJcblx0XHRpZiAoICcnICE9PSBjYWxlbmRhcl9wYXJhbXNfYXJyLmFqeF9jbGVhbmVkX3BhcmFtcy5jYWxlbmRhcl9fdmlld19fY2VsbF9oZWlnaHQgKXtcclxuXHRcdFx0alF1ZXJ5KCAnaGVhZCcgKS5hcHBlbmQoICc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgJy5oYXNEYXRlcGljayAuZGF0ZXBpY2staW5saW5lIC5kYXRlcGljay10aXRsZS1yb3cgdGgsICdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrICcuaGFzRGF0ZXBpY2sgLmRhdGVwaWNrLWlubGluZSAuZGF0ZXBpY2stZGF5cy1jZWxsIHsnXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQrICdoZWlnaHQ6ICcgKyBjYWxlbmRhcl9wYXJhbXNfYXJyLmFqeF9jbGVhbmVkX3BhcmFtcy5jYWxlbmRhcl9fdmlld19fY2VsbF9oZWlnaHQgKyAnICFpbXBvcnRhbnQ7J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCsgJ30nXHJcblx0XHRcdFx0XHRcdFx0XHRcdCsnPC9zdHlsZT4nICk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRGVmaW5lIHNob3dpbmcgbW91c2Ugb3ZlciB0b29sdGlwIG9uIHVuYXZhaWxhYmxlIGRhdGVzXHJcblx0XHRqQ2FsQ29udGFpbmVyLmZpbmQoICcuc2Vhc29uX3VuYXZhaWxhYmxlLC5iZWZvcmVfYWZ0ZXJfdW5hdmFpbGFibGUsLndlZWtkYXlzX3VuYXZhaWxhYmxlJyApLm9uKCAnbW91c2VvdmVyJywgZnVuY3Rpb24gKCB0aGlzX2V2ZW50ICl7XHJcblx0XHRcdC8vIGFsc28gYXZhaWxhYmxlIHRoZXNlIHZhcnM6IFx0cmVzb3VyY2VfaWQsIGpDYWxDb250YWluZXIsIGluc3RcclxuXHRcdFx0dmFyIGpDZWxsID0galF1ZXJ5KCB0aGlzX2V2ZW50LmN1cnJlbnRUYXJnZXQgKTtcclxuXHRcdFx0d3BiY19hdnlfX3Nob3dfdG9vbHRpcF9fZm9yX2VsZW1lbnQoIGpDZWxsLCBjYWxlbmRhcl9wYXJhbXNfYXJyWyAnYWp4X2RhdGFfYXJyJyBdWydwb3BvdmVyX2hpbnRzJ10gKTtcclxuXHRcdH0pO1xyXG5cdH0gKTtcclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvLyBEZWZpbmUgd2lkdGggb2YgZW50aXJlIGNhbGVuZGFyXHJcblx0dmFyIHdpZHRoID0gICAnd2lkdGg6J1x0XHQrICAgY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfY2xlYW5lZF9wYXJhbXMuY2FsZW5kYXJfX3ZpZXdfX3dpZHRoICsgJzsnXHRcdFx0XHRcdC8vIHZhciB3aWR0aCA9ICd3aWR0aDoxMDAlO21heC13aWR0aDoxMDAlOyc7XHJcblx0XHRcdFx0KyAnbWF4LXdpZHRoOicgXHQrICggY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfY2xlYW5lZF9wYXJhbXMuY2FsZW5kYXJfX3ZpZXdfX21vbnRoc19pbl9yb3cgKiAyODQgKSArICdweDsnO1xyXG5cclxuXHQvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vIEFkZCBjYWxlbmRhciBjb250YWluZXI6IFwiQ2FsZW5kYXIgaXMgbG9hZGluZy4uLlwiICBhbmQgdGV4dGFyZWFcclxuXHRqUXVlcnkoICcud3BiY19hanhfYXZ5X19jYWxlbmRhcicgKS5odG1sKFxyXG5cclxuXHRcdCc8ZGl2IGNsYXNzPVwiJ1x0KyAnIGJrX2NhbGVuZGFyX2ZyYW1lJ1xyXG5cdFx0XHRcdFx0XHQrICcgbW9udGhzX251bV9pbl9yb3dfJyArIGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLmNhbGVuZGFyX192aWV3X19tb250aHNfaW5fcm93XHJcblx0XHRcdFx0XHRcdCsgJyBjYWxfbW9udGhfbnVtXycgXHQrIGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLmNhbGVuZGFyX192aWV3X192aXNpYmxlX21vbnRoc1xyXG5cdFx0XHRcdFx0XHQrICcgJyBcdFx0XHRcdFx0KyBjYWxlbmRhcl9wYXJhbXNfYXJyLmFqeF9jbGVhbmVkX3BhcmFtcy5jYWxlbmRhcl9fdGltZXNsb3RfZGF5X2JnX2FzX2F2YWlsYWJsZSBcdFx0XHRcdC8vICd3cGJjX3RpbWVzbG90X2RheV9iZ19hc19hdmFpbGFibGUnIHx8ICcnXHJcblx0XHRcdFx0KyAnXCIgJ1xyXG5cdFx0XHQrICdzdHlsZT1cIicgKyB3aWR0aCArICdcIj4nXHJcblxyXG5cdFx0XHRcdCsgJzxkaXYgaWQ9XCJjYWxlbmRhcl9ib29raW5nJyArIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgKyAnXCI+JyArICdDYWxlbmRhciBpcyBsb2FkaW5nLi4uJyArICc8L2Rpdj4nXHJcblxyXG5cdFx0KyAnPC9kaXY+J1xyXG5cclxuXHRcdCsgJzx0ZXh0YXJlYSAgICAgIGlkPVwiZGF0ZV9ib29raW5nJyArIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgKyAnXCInXHJcblx0XHRcdFx0XHQrICcgbmFtZT1cImRhdGVfYm9va2luZycgKyBjYWxlbmRhcl9wYXJhbXNfYXJyLnJlc291cmNlX2lkICsgJ1wiJ1xyXG5cdFx0XHRcdFx0KyAnIGF1dG9jb21wbGV0ZT1cIm9mZlwiJ1xyXG5cdFx0XHRcdFx0KyAnIHN0eWxlPVwiZGlzcGxheTpub25lO3dpZHRoOjEwMCU7aGVpZ2h0OjEwZW07bWFyZ2luOjJlbSAwIDA7XCI+PC90ZXh0YXJlYT4nXHJcblx0KTtcclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR2YXIgY2FsX3BhcmFtX2FyciA9IHtcclxuXHRcdFx0XHRcdFx0XHQnaHRtbF9pZCcgICAgICAgICAgIDogJ2NhbGVuZGFyX2Jvb2tpbmcnICsgY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfY2xlYW5lZF9wYXJhbXMucmVzb3VyY2VfaWQsXHJcblx0XHRcdFx0XHRcdFx0J3RleHRfaWQnICAgICAgICAgICA6ICdkYXRlX2Jvb2tpbmcnICsgY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfY2xlYW5lZF9wYXJhbXMucmVzb3VyY2VfaWQsXHJcblxyXG5cdFx0XHRcdFx0XHRcdCdjYWxlbmRhcl9fc3RhcnRfd2Vla19kYXknOiBcdCAgY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfY2xlYW5lZF9wYXJhbXMuY2FsZW5kYXJfX3N0YXJ0X3dlZWtfZGF5LFxyXG5cdFx0XHRcdFx0XHRcdCdjYWxlbmRhcl9fdmlld19fdmlzaWJsZV9tb250aHMnOiBjYWxlbmRhcl9wYXJhbXNfYXJyLmFqeF9jbGVhbmVkX3BhcmFtcy5jYWxlbmRhcl9fdmlld19fdmlzaWJsZV9tb250aHMsXHJcblx0XHRcdFx0XHRcdFx0J2NhbGVuZGFyX19kYXlzX3NlbGVjdGlvbl9tb2RlJzogIGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLmNhbGVuZGFyX19kYXlzX3NlbGVjdGlvbl9tb2RlLFxyXG5cclxuXHRcdFx0XHRcdFx0XHQncmVzb3VyY2VfaWQnICAgICAgICA6IGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLnJlc291cmNlX2lkLFxyXG5cdFx0XHRcdFx0XHRcdCdhanhfbm9uY2VfY2FsZW5kYXInIDogY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfZGF0YV9hcnIuYWp4X25vbmNlX2NhbGVuZGFyLFxyXG5cdFx0XHRcdFx0XHRcdCdib29rZWRfZGF0ZXMnICAgICAgIDogY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfZGF0YV9hcnIuYm9va2VkX2RhdGVzLFxyXG5cdFx0XHRcdFx0XHRcdCdzZWFzb25fYXZhaWxhYmlsaXR5JzogY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfZGF0YV9hcnIuc2Vhc29uX2F2YWlsYWJpbGl0eSxcclxuXHJcblx0XHRcdFx0XHRcdFx0J3Jlc291cmNlX3VuYXZhaWxhYmxlX2RhdGVzJyA6IGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2RhdGFfYXJyLnJlc291cmNlX3VuYXZhaWxhYmxlX2RhdGVzLFxyXG5cclxuXHRcdFx0XHRcdFx0XHQncG9wb3Zlcl9oaW50cyc6IGNhbGVuZGFyX3BhcmFtc19hcnJbICdhanhfZGF0YV9hcnInIF1bJ3BvcG92ZXJfaGludHMnXVx0XHQvLyB7J3NlYXNvbl91bmF2YWlsYWJsZSc6Jy4uLicsJ3dlZWtkYXlzX3VuYXZhaWxhYmxlJzonLi4uJywnYmVmb3JlX2FmdGVyX3VuYXZhaWxhYmxlJzonLi4uJyx9XHJcblx0XHRcdFx0XHRcdH07XHJcblx0d3BiY19zaG93X2lubGluZV9ib29raW5nX2NhbGVuZGFyKCBjYWxfcGFyYW1fYXJyICk7XHJcblxyXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0LyoqXHJcblx0ICogT24gY2xpY2sgQVZBSUxBQkxFIHwgIFVOQVZBSUxBQkxFIGJ1dHRvbiAgaW4gd2lkZ2V0XHQtXHRuZWVkIHRvICBjaGFuZ2UgaGVscCBkYXRlcyB0ZXh0XHJcblx0ICovXHJcblx0alF1ZXJ5KCAnLndwYmNfcmFkaW9fX3NldF9kYXlzX2F2YWlsYWJpbGl0eScgKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCBldmVudCwgcmVzb3VyY2VfaWQsIGluc3QgKXtcclxuXHRcdHdwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19vbl9kYXlzX3NlbGVjdCggalF1ZXJ5KCAnIycgKyBjYWxfcGFyYW1fYXJyLnRleHRfaWQgKS52YWwoKSAsIGNhbF9wYXJhbV9hcnIgKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gU2hvdyBcdCdTZWxlY3QgZGF5cyAgaW4gY2FsZW5kYXIgdGhlbiBzZWxlY3QgQXZhaWxhYmxlICAvICBVbmF2YWlsYWJsZSBzdGF0dXMgYW5kIGNsaWNrIEFwcGx5IGF2YWlsYWJpbGl0eSBidXR0b24uJ1xyXG5cdGpRdWVyeSggJyN3cGJjX3Rvb2xiYXJfZGF0ZXNfaGludCcpLmh0bWwoICAgICAnPGRpdiBjbGFzcz1cInVpX2VsZW1lbnRcIj48c3BhbiBjbGFzcz1cIndwYmNfdWlfY29udHJvbCB3cGJjX3VpX2FkZG9uIHdwYmNfaGVscF90ZXh0XCIgPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQrIGNhbF9wYXJhbV9hcnIucG9wb3Zlcl9oaW50cy50b29sYmFyX3RleHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KyAnPC9zcGFuPjwvZGl2PidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogXHRMb2FkIERhdGVwaWNrIElubGluZSBjYWxlbmRhclxyXG4gKlxyXG4gKiBAcGFyYW0gY2FsZW5kYXJfcGFyYW1zX2Fyclx0XHRleGFtcGxlOntcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdodG1sX2lkJyAgICAgICAgICAgOiAnY2FsZW5kYXJfYm9va2luZycgKyBjYWxlbmRhcl9wYXJhbXNfYXJyLmFqeF9jbGVhbmVkX3BhcmFtcy5yZXNvdXJjZV9pZCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCd0ZXh0X2lkJyAgICAgICAgICAgOiAnZGF0ZV9ib29raW5nJyArIGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLnJlc291cmNlX2lkLFxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdjYWxlbmRhcl9fc3RhcnRfd2Vla19kYXknOiBcdCAgY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfY2xlYW5lZF9wYXJhbXMuY2FsZW5kYXJfX3N0YXJ0X3dlZWtfZGF5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2NhbGVuZGFyX192aWV3X192aXNpYmxlX21vbnRocyc6IGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLmNhbGVuZGFyX192aWV3X192aXNpYmxlX21vbnRocyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdjYWxlbmRhcl9fZGF5c19zZWxlY3Rpb25fbW9kZSc6ICBjYWxlbmRhcl9wYXJhbXNfYXJyLmFqeF9jbGVhbmVkX3BhcmFtcy5jYWxlbmRhcl9fZGF5c19zZWxlY3Rpb25fbW9kZSxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQncmVzb3VyY2VfaWQnICAgICAgICA6IGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2NsZWFuZWRfcGFyYW1zLnJlc291cmNlX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2FqeF9ub25jZV9jYWxlbmRhcicgOiBjYWxlbmRhcl9wYXJhbXNfYXJyLmFqeF9kYXRhX2Fyci5hanhfbm9uY2VfY2FsZW5kYXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnYm9va2VkX2RhdGVzJyAgICAgICA6IGNhbGVuZGFyX3BhcmFtc19hcnIuYWp4X2RhdGFfYXJyLmJvb2tlZF9kYXRlcyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdzZWFzb25fYXZhaWxhYmlsaXR5JzogY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfZGF0YV9hcnIuc2Vhc29uX2F2YWlsYWJpbGl0eSxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQncmVzb3VyY2VfdW5hdmFpbGFibGVfZGF0ZXMnIDogY2FsZW5kYXJfcGFyYW1zX2Fyci5hanhfZGF0YV9hcnIucmVzb3VyY2VfdW5hdmFpbGFibGVfZGF0ZXNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19zaG93X2lubGluZV9ib29raW5nX2NhbGVuZGFyKCBjYWxlbmRhcl9wYXJhbXNfYXJyICl7XHJcblxyXG5cdGlmIChcclxuXHRcdCAgICggMCA9PT0galF1ZXJ5KCAnIycgKyBjYWxlbmRhcl9wYXJhbXNfYXJyLmh0bWxfaWQgKS5sZW5ndGggKVx0XHRcdFx0XHRcdFx0Ly8gSWYgY2FsZW5kYXIgRE9NIGVsZW1lbnQgbm90IGV4aXN0IHRoZW4gZXhpc3RcclxuXHRcdHx8ICggdHJ1ZSA9PT0galF1ZXJ5KCAnIycgKyBjYWxlbmRhcl9wYXJhbXNfYXJyLmh0bWxfaWQgKS5oYXNDbGFzcyggJ2hhc0RhdGVwaWNrJyApIClcdC8vIElmIHRoZSBjYWxlbmRhciB3aXRoIHRoZSBzYW1lIEJvb2tpbmcgcmVzb3VyY2UgYWxyZWFkeSAgaGFzIGJlZW4gYWN0aXZhdGVkLCB0aGVuIGV4aXN0LlxyXG5cdCl7XHJcblx0ICAgcmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvLyBDb25maWd1cmUgYW5kIHNob3cgY2FsZW5kYXJcclxuXHRqUXVlcnkoICcjJyArIGNhbGVuZGFyX3BhcmFtc19hcnIuaHRtbF9pZCApLnRleHQoICcnICk7XHJcblx0alF1ZXJ5KCAnIycgKyBjYWxlbmRhcl9wYXJhbXNfYXJyLmh0bWxfaWQgKS5kYXRlcGljayh7XHJcblx0XHRcdFx0XHRiZWZvcmVTaG93RGF5OiBcdGZ1bmN0aW9uICggZGF0ZSApe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB3cGJjX19pbmxpbmVfYm9va2luZ19jYWxlbmRhcl9fYXBwbHlfY3NzX3RvX2RheXMoIGRhdGUsIGNhbGVuZGFyX3BhcmFtc19hcnIsIHRoaXMgKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSxcclxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdDogXHQgIFx0ZnVuY3Rpb24gKCBkYXRlICl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0alF1ZXJ5KCAnIycgKyBjYWxlbmRhcl9wYXJhbXNfYXJyLnRleHRfaWQgKS52YWwoIGRhdGUgKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvL3dwYmNfYmxpbmtfZWxlbWVudCgnLndwYmNfd2lkZ2V0X2F2YWlsYWJsZV91bmF2YWlsYWJsZScsIDMsIDIyMCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIHdwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19vbl9kYXlzX3NlbGVjdCggZGF0ZSwgY2FsZW5kYXJfcGFyYW1zX2FyciwgdGhpcyApO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uSG92ZXI6IFx0XHRmdW5jdGlvbiAoIHZhbHVlLCBkYXRlICl7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vd3BiY19hdnlfX3ByZXBhcmVfdG9vbHRpcF9faW5fY2FsZW5kYXIoIHZhbHVlLCBkYXRlLCBjYWxlbmRhcl9wYXJhbXNfYXJyLCB0aGlzICk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiB3cGJjX19pbmxpbmVfYm9va2luZ19jYWxlbmRhcl9fb25fZGF5c19ob3ZlciggdmFsdWUsIGRhdGUsIGNhbGVuZGFyX3BhcmFtc19hcnIsIHRoaXMgKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSxcclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZU1vbnRoWWVhcjpcdG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd09uOiBcdFx0XHQnYm90aCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyT2ZNb250aHM6IFx0Y2FsZW5kYXJfcGFyYW1zX2Fyci5jYWxlbmRhcl9fdmlld19fdmlzaWJsZV9tb250aHMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlcE1vbnRoczpcdFx0XHQxLFxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZUZXh0OiBcdFx0XHQnJmxhcXVvOycsXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dFRleHQ6IFx0XHRcdCcmcmFxdW87JyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRlRm9ybWF0OiBcdFx0J3l5LW1tLWRkJywvLyAnZGQubW0ueXknLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZU1vbnRoOiBcdFx0ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlWWVhcjogXHRcdGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbkRhdGU6IFx0XHRcdFx0XHQgMCxcdFx0Ly9udWxsLCAgLy9TY3JvbGwgYXMgbG9uZyBhcyB5b3UgbmVlZFxyXG5cdFx0XHRcdFx0bWF4RGF0ZTogXHRcdFx0XHRcdCcxMHknLFx0Ly8gbWluRGF0ZTogbmV3IERhdGUoMjAyMCwgMiwgMSksIG1heERhdGU6IG5ldyBEYXRlKDIwMjAsIDksIDMxKSwgXHQvLyBBYmlsaXR5IHRvIHNldCBhbnkgIHN0YXJ0IGFuZCBlbmQgZGF0ZSBpbiBjYWxlbmRhclxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dTdGF0dXM6IFx0XHRmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZUF0VG9wOiBcdFx0ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3REYXk6XHRcdFx0Y2FsZW5kYXJfcGFyYW1zX2Fyci5jYWxlbmRhcl9fc3RhcnRfd2Vla19kYXksXHJcbiAgICAgICAgICAgICAgICAgICAgZ290b0N1cnJlbnQ6IFx0XHRmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBoaWRlSWZOb1ByZXZOZXh0Olx0dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aVNlcGFyYXRvcjogXHQnLCAnLFxyXG5cdFx0XHRcdFx0bXVsdGlTZWxlY3Q6ICgoJ2R5bmFtaWMnID09IGNhbGVuZGFyX3BhcmFtc19hcnIuY2FsZW5kYXJfX2RheXNfc2VsZWN0aW9uX21vZGUpID8gMCA6IDM2NSksXHRcdFx0Ly8gTWF4aW11bSBudW1iZXIgb2Ygc2VsZWN0YWJsZSBkYXRlczpcdCBTaW5nbGUgZGF5ID0gMCwgIG11bHRpIGRheXMgPSAzNjVcclxuXHRcdFx0XHRcdHJhbmdlU2VsZWN0OiAgKCdkeW5hbWljJyA9PSBjYWxlbmRhcl9wYXJhbXNfYXJyLmNhbGVuZGFyX19kYXlzX3NlbGVjdGlvbl9tb2RlKSxcclxuXHRcdFx0XHRcdHJhbmdlU2VwYXJhdG9yOiBcdCcgfiAnLFx0XHRcdFx0XHQvLycgLSAnLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3dXZWVrczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB1c2VUaGVtZVJvbGxlcjpcdFx0ZmFsc2VcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuXHRyZXR1cm4gIHRydWU7XHJcbn1cclxuXHJcblxyXG5cdC8qKlxyXG5cdCAqIEFwcGx5IENTUyB0byBjYWxlbmRhciBkYXRlIGNlbGxzXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gZGF0ZVx0XHRcdFx0XHQtICBKYXZhU2NyaXB0IERhdGUgT2JqOiAgXHRcdE1vbiBEZWMgMTEgMjAyMyAwMDowMDowMCBHTVQrMDIwMCAoRWFzdGVybiBFdXJvcGVhbiBTdGFuZGFyZCBUaW1lKVxyXG5cdCAqIEBwYXJhbSBjYWxlbmRhcl9wYXJhbXNfYXJyXHQtICBDYWxlbmRhciBTZXR0aW5ncyBPYmplY3Q6ICBcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJodG1sX2lkXCI6IFwiY2FsZW5kYXJfYm9va2luZzRcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJ0ZXh0X2lkXCI6IFwiZGF0ZV9ib29raW5nNFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImNhbGVuZGFyX19zdGFydF93ZWVrX2RheVwiOiAxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImNhbGVuZGFyX192aWV3X192aXNpYmxlX21vbnRoc1wiOiAxMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJyZXNvdXJjZV9pZFwiOiA0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImFqeF9ub25jZV9jYWxlbmRhclwiOiBcIjxpbnB1dCB0eXBlPVxcXCJoaWRkZW5cXFwiIC4uLiAvPlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImJvb2tlZF9kYXRlc1wiOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiMTItMjgtMjAyMlwiOiBbXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiYm9va2luZ19kYXRlXCI6IFwiMjAyMi0xMi0yOCAwMDowMDowMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiYXBwcm92ZWRcIjogXCIxXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJib29raW5nX2lkXCI6IFwiMjZcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XSwgLi4uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3NlYXNvbl9hdmFpbGFiaWxpdHknOntcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMDlcIjogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMTBcIjogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMTFcIjogdHJ1ZSwgLi4uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdCAqIEBwYXJhbSBkYXRlcGlja190aGlzXHRcdFx0LSB0aGlzIG9mIGRhdGVwaWNrIE9ialxyXG5cdCAqXHJcblx0ICogQHJldHVybnMgW2Jvb2xlYW4sc3RyaW5nXVx0LSBbIHt0cnVlIC1hdmFpbGFibGUgfCBmYWxzZSAtIHVuYXZhaWxhYmxlfSwgJ0NTUyBjbGFzc2VzIGZvciBjYWxlbmRhciBkYXkgY2VsbCcgXVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIHdwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19hcHBseV9jc3NfdG9fZGF5cyggZGF0ZSwgY2FsZW5kYXJfcGFyYW1zX2FyciwgZGF0ZXBpY2tfdGhpcyApe1xyXG5cclxuXHRcdHZhciB0b2RheV9kYXRlID0gbmV3IERhdGUoIHdwYmNfdG9kYXlbIDAgXSwgKHBhcnNlSW50KCB3cGJjX3RvZGF5WyAxIF0gKSAtIDEpLCB3cGJjX3RvZGF5WyAyIF0sIDAsIDAsIDAgKTtcclxuXHJcblx0XHR2YXIgY2xhc3NfZGF5ICA9ICggZGF0ZS5nZXRNb250aCgpICsgMSApICsgJy0nICsgZGF0ZS5nZXREYXRlKCkgKyAnLScgKyBkYXRlLmdldEZ1bGxZZWFyKCk7XHRcdFx0XHRcdFx0Ly8gJzEtOS0yMDIzJ1xyXG5cdFx0dmFyIHNxbF9jbGFzc19kYXkgPSBkYXRlLmdldEZ1bGxZZWFyKCkgKyAnLSc7XHJcblx0XHRcdHNxbF9jbGFzc19kYXkgKz0gKCAoZGF0ZS5nZXRNb250aCgpICsgMSkgPCAxMCApID8gJzAnIDogJyc7XHJcblx0XHRcdHNxbF9jbGFzc19kYXkgKz0gKGRhdGUuZ2V0TW9udGgoKSArIDEpKyAnLSdcclxuXHRcdFx0c3FsX2NsYXNzX2RheSArPSAoIGRhdGUuZ2V0RGF0ZSgpIDwgMTAgKSA/ICcwJyA6ICcnO1xyXG5cdFx0XHRzcWxfY2xhc3NfZGF5ICs9IGRhdGUuZ2V0RGF0ZSgpO1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gJzIwMjMtMDEtMDknXHJcblxyXG5cdFx0dmFyIGNzc19kYXRlX19zdGFuZGFyZCAgID0gICdjYWw0ZGF0ZS0nICsgY2xhc3NfZGF5O1xyXG5cdFx0dmFyIGNzc19kYXRlX19hZGRpdGlvbmFsID0gJyB3cGJjX3dlZWtkYXlfJyArIGRhdGUuZ2V0RGF5KCkgKyAnICc7XHJcblxyXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdC8vIFdFRUtEQVlTIDo6IFNldCB1bmF2YWlsYWJsZSB3ZWVrIGRheXMgZnJvbSAtIFNldHRpbmdzIEdlbmVyYWwgcGFnZSBpbiBcIkF2YWlsYWJpbGl0eVwiIHNlY3Rpb25cclxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHVzZXJfdW5hdmlsYWJsZV9kYXlzLmxlbmd0aDsgaSsrICl7XHJcblx0XHRcdGlmICggZGF0ZS5nZXREYXkoKSA9PSB1c2VyX3VuYXZpbGFibGVfZGF5c1sgaSBdICkge1xyXG5cdFx0XHRcdHJldHVybiBbICEhZmFsc2UsIGNzc19kYXRlX19zdGFuZGFyZCArICcgZGF0ZV91c2VyX3VuYXZhaWxhYmxlJyBcdCsgJyB3ZWVrZGF5c191bmF2YWlsYWJsZScgXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEJFRk9SRV9BRlRFUiA6OiBTZXQgdW5hdmFpbGFibGUgZGF5cyBCZWZvcmUgLyBBZnRlciB0aGUgVG9kYXkgZGF0ZVxyXG5cdFx0aWYgKCBcdCggKGRheXNfYmV0d2VlbiggZGF0ZSwgdG9kYXlfZGF0ZSApKSA8IGJsb2NrX3NvbWVfZGF0ZXNfZnJvbV90b2RheSApXHJcblx0XHRcdCB8fCAoXHJcblx0XHRcdFx0ICAgKCB0eXBlb2YoIHdwYmNfYXZhaWxhYmxlX2RheXNfbnVtX2Zyb21fdG9kYXkgKSAhPT0gJ3VuZGVmaW5lZCcgKVxyXG5cdFx0XHRcdCYmICggcGFyc2VJbnQoICcwJyArIHdwYmNfYXZhaWxhYmxlX2RheXNfbnVtX2Zyb21fdG9kYXkgKSA+IDAgKVxyXG5cdFx0XHRcdCYmICggZGF5c19iZXR3ZWVuKCBkYXRlLCB0b2RheV9kYXRlICkgPiBwYXJzZUludCggJzAnICsgd3BiY19hdmFpbGFibGVfZGF5c19udW1fZnJvbV90b2RheSApIClcclxuXHRcdFx0XHQpXHJcblx0XHQpe1xyXG5cdFx0XHRyZXR1cm4gWyAhIWZhbHNlLCBjc3NfZGF0ZV9fc3RhbmRhcmQgKyAnIGRhdGVfdXNlcl91bmF2YWlsYWJsZScgXHRcdCsgJyBiZWZvcmVfYWZ0ZXJfdW5hdmFpbGFibGUnIF07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU0VBU09OUyA6OiAgXHRcdFx0XHRcdEJvb2tpbmcgPiBSZXNvdXJjZXMgPiBBdmFpbGFiaWxpdHkgcGFnZVxyXG5cdFx0dmFyICAgIGlzX2RhdGVfYXZhaWxhYmxlID0gY2FsZW5kYXJfcGFyYW1zX2Fyci5zZWFzb25fYXZhaWxhYmlsaXR5WyBzcWxfY2xhc3NfZGF5IF07XHJcblx0XHRpZiAoICEgaXNfZGF0ZV9hdmFpbGFibGUgKXtcclxuXHRcdFx0cmV0dXJuIFsgISFmYWxzZSwgY3NzX2RhdGVfX3N0YW5kYXJkICsgJyBkYXRlX3VzZXJfdW5hdmFpbGFibGUnXHRcdCsgJyBzZWFzb25fdW5hdmFpbGFibGUnIF07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUkVTT1VSQ0VfVU5BVkFJTEFCTEUgOjogICBcdEJvb2tpbmcgPiBBdmFpbGFiaWxpdHkgcGFnZVxyXG5cdFx0aWYgKCB3cGRldl9pbl9hcnJheShjYWxlbmRhcl9wYXJhbXNfYXJyLnJlc291cmNlX3VuYXZhaWxhYmxlX2RhdGVzLCBzcWxfY2xhc3NfZGF5ICkgKXtcclxuXHRcdFx0aXNfZGF0ZV9hdmFpbGFibGUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGlmICggISBpc19kYXRlX2F2YWlsYWJsZSApe1xyXG5cdFx0XHRyZXR1cm4gWyAhZmFsc2UsIGNzc19kYXRlX19zdGFuZGFyZCArICcgZGF0ZV91c2VyX3VuYXZhaWxhYmxlJ1x0XHQrICcgcmVzb3VyY2VfdW5hdmFpbGFibGUnIF07XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdGNzc19kYXRlX19hZGRpdGlvbmFsICs9IHdwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19kYXlzX2Nzc19fZ2V0X3JhdGUoIGNsYXNzX2RheSwgY2FsZW5kYXJfcGFyYW1zX2Fyci5yZXNvdXJjZV9pZCApOyAgICAgICAgICAgICAgICAvLyAnIHJhdGVfMTAwJ1xyXG5cdFx0Y3NzX2RhdGVfX2FkZGl0aW9uYWwgKz0gd3BiY19faW5saW5lX2Jvb2tpbmdfY2FsZW5kYXJfX2RheXNfY3NzX19nZXRfc2Vhc29uX25hbWVzKCBjbGFzc19kYXksIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgKTsgICAgICAgIC8vICcgd2Vla2VuZF9zZWFzb24gaGlnaF9zZWFzb24nXHJcblxyXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHJcblx0XHQvLyBJcyBhbnkgYm9va2luZ3MgaW4gdGhpcyBkYXRlID9cclxuXHRcdGlmICggJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiggY2FsZW5kYXJfcGFyYW1zX2Fyci5ib29rZWRfZGF0ZXNbIGNsYXNzX2RheSBdICkgKSB7XHJcblxyXG5cdFx0XHR2YXIgYm9va2luZ3NfaW5fZGF0ZSA9IGNhbGVuZGFyX3BhcmFtc19hcnIuYm9va2VkX2RhdGVzWyBjbGFzc19kYXkgXTtcclxuXHJcblxyXG5cdFx0XHRpZiAoICd1bmRlZmluZWQnICE9PSB0eXBlb2YoIGJvb2tpbmdzX2luX2RhdGVbICdzZWNfMCcgXSApICkge1x0XHRcdC8vIFwiRnVsbCBkYXlcIiBib29raW5nICAtPiAoc2Vjb25kcyA9PSAwKVxyXG5cclxuXHRcdFx0XHRjc3NfZGF0ZV9fYWRkaXRpb25hbCArPSAoICcwJyA9PT0gYm9va2luZ3NfaW5fZGF0ZVsgJ3NlY18wJyBdLmFwcHJvdmVkICkgPyAnIGRhdGUyYXBwcm92ZSAnIDogJyBkYXRlX2FwcHJvdmVkICc7XHRcdFx0XHQvLyBQZW5kaW5nID0gJzAnIHwgIEFwcHJvdmVkID0gJzEnXHJcblx0XHRcdFx0Y3NzX2RhdGVfX2FkZGl0aW9uYWwgKz0gJyBmdWxsX2RheV9ib29raW5nJztcclxuXHJcblx0XHRcdFx0cmV0dXJuIFsgIWZhbHNlLCBjc3NfZGF0ZV9fc3RhbmRhcmQgKyBjc3NfZGF0ZV9fYWRkaXRpb25hbCBdO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggT2JqZWN0LmtleXMoIGJvb2tpbmdzX2luX2RhdGUgKS5sZW5ndGggPiAwICl7XHRcdFx0XHQvLyBcIlRpbWUgc2xvdHNcIiBCb29raW5nc1xyXG5cclxuXHRcdFx0XHR2YXIgaXNfYXBwcm92ZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHRfLmVhY2goIGJvb2tpbmdzX2luX2RhdGUsIGZ1bmN0aW9uICggcF92YWwsIHBfa2V5LCBwX2RhdGEgKSB7XHJcblx0XHRcdFx0XHRpZiAoICFwYXJzZUludCggcF92YWwuYXBwcm92ZWQgKSApe1xyXG5cdFx0XHRcdFx0XHRpc19hcHByb3ZlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIHRzID0gcF92YWwuYm9va2luZ19kYXRlLnN1YnN0cmluZyggcF92YWwuYm9va2luZ19kYXRlLmxlbmd0aCAtIDEgKTtcclxuXHRcdFx0XHRcdGlmICggdHJ1ZSA9PT0gaXNfYm9va2luZ191c2VkX2NoZWNrX2luX291dF90aW1lICl7XHJcblx0XHRcdFx0XHRcdGlmICggdHMgPT0gJzEnICkgeyBjc3NfZGF0ZV9fYWRkaXRpb25hbCArPSAnIGNoZWNrX2luX3RpbWUnICsgKChwYXJzZUludChwX3ZhbC5hcHByb3ZlZCkpID8gJyBjaGVja19pbl90aW1lX2RhdGVfYXBwcm92ZWQnIDogJyBjaGVja19pbl90aW1lX2RhdGUyYXBwcm92ZScpOyB9XHJcblx0XHRcdFx0XHRcdGlmICggdHMgPT0gJzInICkgeyBjc3NfZGF0ZV9fYWRkaXRpb25hbCArPSAnIGNoZWNrX291dF90aW1lJyArICgocGFyc2VJbnQocF92YWwuYXBwcm92ZWQpKSA/ICcgY2hlY2tfb3V0X3RpbWVfZGF0ZV9hcHByb3ZlZCcgOiAnIGNoZWNrX291dF90aW1lX2RhdGUyYXBwcm92ZScpOyB9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRpZiAoICEgaXNfYXBwcm92ZWQgKXtcclxuXHRcdFx0XHRcdGNzc19kYXRlX19hZGRpdGlvbmFsICs9ICcgZGF0ZTJhcHByb3ZlIHRpbWVzcGFydGx5J1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjc3NfZGF0ZV9fYWRkaXRpb25hbCArPSAnIGRhdGVfYXBwcm92ZWQgdGltZXNwYXJ0bHknXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoICEgaXNfYm9va2luZ191c2VkX2NoZWNrX2luX291dF90aW1lICl7XHJcblx0XHRcdFx0XHRjc3NfZGF0ZV9fYWRkaXRpb25hbCArPSAnIHRpbWVzX2Nsb2NrJ1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdHJldHVybiBbIHRydWUsIGNzc19kYXRlX19zdGFuZGFyZCArIGNzc19kYXRlX19hZGRpdGlvbmFsICsgJyBkYXRlX2F2YWlsYWJsZScgXTtcclxuXHR9XHJcblxyXG5cclxuXHQvKipcclxuXHQgKiBBcHBseSBzb21lIENTUyBjbGFzc2VzLCB3aGVuIHdlIG1vdXNlIG92ZXIgc3BlY2lmaWMgZGF0ZXMgaW4gY2FsZW5kYXJcclxuXHQgKiBAcGFyYW0gdmFsdWVcclxuXHQgKiBAcGFyYW0gZGF0ZVx0XHRcdFx0XHQtICBKYXZhU2NyaXB0IERhdGUgT2JqOiAgXHRcdE1vbiBEZWMgMTEgMjAyMyAwMDowMDowMCBHTVQrMDIwMCAoRWFzdGVybiBFdXJvcGVhbiBTdGFuZGFyZCBUaW1lKVxyXG5cdCAqIEBwYXJhbSBjYWxlbmRhcl9wYXJhbXNfYXJyXHQtICBDYWxlbmRhciBTZXR0aW5ncyBPYmplY3Q6ICBcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJodG1sX2lkXCI6IFwiY2FsZW5kYXJfYm9va2luZzRcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJ0ZXh0X2lkXCI6IFwiZGF0ZV9ib29raW5nNFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImNhbGVuZGFyX19zdGFydF93ZWVrX2RheVwiOiAxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImNhbGVuZGFyX192aWV3X192aXNpYmxlX21vbnRoc1wiOiAxMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJyZXNvdXJjZV9pZFwiOiA0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImFqeF9ub25jZV9jYWxlbmRhclwiOiBcIjxpbnB1dCB0eXBlPVxcXCJoaWRkZW5cXFwiIC4uLiAvPlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImJvb2tlZF9kYXRlc1wiOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiMTItMjgtMjAyMlwiOiBbXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiYm9va2luZ19kYXRlXCI6IFwiMjAyMi0xMi0yOCAwMDowMDowMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiYXBwcm92ZWRcIjogXCIxXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJib29raW5nX2lkXCI6IFwiMjZcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XSwgLi4uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3NlYXNvbl9hdmFpbGFiaWxpdHknOntcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMDlcIjogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMTBcIjogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMTFcIjogdHJ1ZSwgLi4uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdCAqIEBwYXJhbSBkYXRlcGlja190aGlzXHRcdFx0LSB0aGlzIG9mIGRhdGVwaWNrIE9ialxyXG5cdCAqXHJcblx0ICogQHJldHVybnMge2Jvb2xlYW59XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gd3BiY19faW5saW5lX2Jvb2tpbmdfY2FsZW5kYXJfX29uX2RheXNfaG92ZXIoIHZhbHVlLCBkYXRlLCBjYWxlbmRhcl9wYXJhbXNfYXJyLCBkYXRlcGlja190aGlzICl7XHJcblxyXG5cdFx0aWYgKCBudWxsID09PSBkYXRlICl7XHJcblx0XHRcdGpRdWVyeSggJy5kYXRlcGljay1kYXlzLWNlbGwtb3ZlcicgKS5yZW1vdmVDbGFzcyggJ2RhdGVwaWNrLWRheXMtY2VsbC1vdmVyJyApOyAgIFx0ICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2xlYXIgYWxsIGhpZ2hsaWdodCBkYXlzIHNlbGVjdGlvbnNcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpbnN0ID0galF1ZXJ5LmRhdGVwaWNrLl9nZXRJbnN0KCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2NhbGVuZGFyX2Jvb2tpbmcnICsgY2FsZW5kYXJfcGFyYW1zX2Fyci5yZXNvdXJjZV9pZCApICk7XHJcblxyXG5cdFx0aWYgKFxyXG5cdFx0XHQgICAoIDEgPT0gaW5zdC5kYXRlcy5sZW5ndGgpXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gSWYgd2UgaGF2ZSBvbmUgc2VsZWN0ZWQgZGF0ZVxyXG5cdFx0XHQmJiAoJ2R5bmFtaWMnID09PSBjYWxlbmRhcl9wYXJhbXNfYXJyLmNhbGVuZGFyX19kYXlzX3NlbGVjdGlvbl9tb2RlKSBcdFx0XHRcdFx0Ly8gd2hpbGUgaGF2ZSByYW5nZSBkYXlzIHNlbGVjdGlvbiBtb2RlXHJcblx0XHQpe1xyXG5cclxuXHRcdFx0dmFyIHRkX2NsYXNzO1xyXG5cdFx0XHR2YXIgdGRfb3ZlcnMgPSBbXTtcclxuXHRcdFx0dmFyIGlzX2NoZWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIHNlbGNldGVkX2ZpcnN0X2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIHNlbGNldGVkX2ZpcnN0X2RheS5zZXRGdWxsWWVhcihpbnN0LmRhdGVzWzBdLmdldEZ1bGxZZWFyKCksKGluc3QuZGF0ZXNbMF0uZ2V0TW9udGgoKSksIChpbnN0LmRhdGVzWzBdLmdldERhdGUoKSApICk7IC8vR2V0IGZpcnN0IERhdGVcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKCAgaXNfY2hlY2sgKXtcclxuXHJcblx0XHRcdFx0dGRfY2xhc3MgPSAoc2VsY2V0ZWRfZmlyc3RfZGF5LmdldE1vbnRoKCkgKyAxKSArICctJyArIHNlbGNldGVkX2ZpcnN0X2RheS5nZXREYXRlKCkgKyAnLScgKyBzZWxjZXRlZF9maXJzdF9kYXkuZ2V0RnVsbFllYXIoKTtcclxuXHJcblx0XHRcdFx0dGRfb3ZlcnNbIHRkX292ZXJzLmxlbmd0aCBdID0gJyNjYWxlbmRhcl9ib29raW5nJyArIGNhbGVuZGFyX3BhcmFtc19hcnIucmVzb3VyY2VfaWQgKyAnIC5jYWw0ZGF0ZS0nICsgdGRfY2xhc3M7ICAgICAgICAgICAgICAvLyBhZGQgdG8gYXJyYXkgZm9yIGxhdGVyIG1ha2Ugc2VsZWN0aW9uIGJ5IGNsYXNzXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG5cdFx0XHRcdFx0KCAgKCBkYXRlLmdldE1vbnRoKCkgPT0gc2VsY2V0ZWRfZmlyc3RfZGF5LmdldE1vbnRoKCkgKSAgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAoIGRhdGUuZ2V0RGF0ZSgpID09IHNlbGNldGVkX2ZpcnN0X2RheS5nZXREYXRlKCkgKSAgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAoIGRhdGUuZ2V0RnVsbFllYXIoKSA9PSBzZWxjZXRlZF9maXJzdF9kYXkuZ2V0RnVsbFllYXIoKSApXHJcblx0XHRcdFx0XHQpIHx8ICggc2VsY2V0ZWRfZmlyc3RfZGF5ID4gZGF0ZSApXHJcblx0XHRcdFx0KXtcclxuXHRcdFx0XHRcdGlzX2NoZWNrID0gIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c2VsY2V0ZWRfZmlyc3RfZGF5LnNldEZ1bGxZZWFyKCBzZWxjZXRlZF9maXJzdF9kYXkuZ2V0RnVsbFllYXIoKSwgKHNlbGNldGVkX2ZpcnN0X2RheS5nZXRNb250aCgpKSwgKHNlbGNldGVkX2ZpcnN0X2RheS5nZXREYXRlKCkgKyAxKSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBIaWdobGlnaHQgRGF5c1xyXG5cdFx0XHRmb3IgKCB2YXIgaT0wOyBpIDwgdGRfb3ZlcnMubGVuZ3RoIDsgaSsrKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZCBjbGFzcyB0byBhbGwgZWxlbWVudHNcclxuXHRcdFx0XHRqUXVlcnkoIHRkX292ZXJzW2ldICkuYWRkQ2xhc3MoJ2RhdGVwaWNrLWRheXMtY2VsbC1vdmVyJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblxyXG5cdFx0fVxyXG5cclxuXHQgICAgcmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogT24gREFZcyBzZWxlY3Rpb24gaW4gY2FsZW5kYXJcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBkYXRlc19zZWxlY3Rpb25cdFx0LSAgc3RyaW5nOlx0XHRcdCAnMjAyMy0wMy0wNyB+IDIwMjMtMDMtMDcnIG9yICcyMDIzLTA0LTEwLCAyMDIzLTA0LTEyLCAyMDIzLTA0LTAyLCAyMDIzLTA0LTA0J1xyXG5cdCAqIEBwYXJhbSBjYWxlbmRhcl9wYXJhbXNfYXJyXHQtICBDYWxlbmRhciBTZXR0aW5ncyBPYmplY3Q6ICBcdHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJodG1sX2lkXCI6IFwiY2FsZW5kYXJfYm9va2luZzRcIixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJ0ZXh0X2lkXCI6IFwiZGF0ZV9ib29raW5nNFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImNhbGVuZGFyX19zdGFydF93ZWVrX2RheVwiOiAxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImNhbGVuZGFyX192aWV3X192aXNpYmxlX21vbnRoc1wiOiAxMixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgXCJyZXNvdXJjZV9pZFwiOiA0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImFqeF9ub25jZV9jYWxlbmRhclwiOiBcIjxpbnB1dCB0eXBlPVxcXCJoaWRkZW5cXFwiIC4uLiAvPlwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICBcImJvb2tlZF9kYXRlc1wiOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiMTItMjgtMjAyMlwiOiBbXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiYm9va2luZ19kYXRlXCI6IFwiMjAyMi0xMi0yOCAwMDowMDowMFwiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiYXBwcm92ZWRcIjogXCIxXCIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XCJib29raW5nX2lkXCI6IFwiMjZcIlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XSwgLi4uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3NlYXNvbl9hdmFpbGFiaWxpdHknOntcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMDlcIjogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMTBcIjogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcIjIwMjMtMDEtMTFcIjogdHJ1ZSwgLi4uXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdCAqIEBwYXJhbSBkYXRlcGlja190aGlzXHRcdFx0LSB0aGlzIG9mIGRhdGVwaWNrIE9ialxyXG5cdCAqXHJcblx0ICogQHJldHVybnMgYm9vbGVhblxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIHdwYmNfX2lubGluZV9ib29raW5nX2NhbGVuZGFyX19vbl9kYXlzX3NlbGVjdCggZGF0ZXNfc2VsZWN0aW9uLCBjYWxlbmRhcl9wYXJhbXNfYXJyLCBkYXRlcGlja190aGlzID0gbnVsbCApe1xyXG5cclxuXHRcdHZhciBpbnN0ID0galF1ZXJ5LmRhdGVwaWNrLl9nZXRJbnN0KCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2NhbGVuZGFyX2Jvb2tpbmcnICsgY2FsZW5kYXJfcGFyYW1zX2Fyci5yZXNvdXJjZV9pZCApICk7XHJcblxyXG5cdFx0dmFyIGRhdGVzX2FyciA9IFtdO1x0Ly8gIFsgXCIyMDIzLTA0LTA5XCIsIFwiMjAyMy0wNC0xMFwiLCBcIjIwMjMtMDQtMTFcIiBdXHJcblxyXG5cdFx0aWYgKCAtMSAhPT0gZGF0ZXNfc2VsZWN0aW9uLmluZGV4T2YoICd+JyApICkgeyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSYW5nZSBEYXlzXHJcblxyXG5cdFx0XHRkYXRlc19hcnIgPSB3cGJjX2dldF9kYXRlc19hcnJfX2Zyb21fZGF0ZXNfcmFuZ2VfanMoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdkYXRlc19zZXBhcmF0b3InIDogJyB+ICcsICAgICAgICAgICAgICAgICAgICAgICAgIC8vICAnIH4gJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2RhdGVzJyAgICAgICAgICAgOiBkYXRlc19zZWxlY3Rpb24sICAgIFx0XHQgICAvLyAnMjAyMy0wNC0wNCB+IDIwMjMtMDQtMDcnXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSApO1xyXG5cclxuXHRcdH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBNdWx0aXBsZSBEYXlzXHJcblx0XHRcdGRhdGVzX2FyciA9IHdwYmNfZ2V0X2RhdGVzX2Fycl9fZnJvbV9kYXRlc19jb21tYV9zZXBhcmF0ZWRfanMoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdkYXRlc19zZXBhcmF0b3InIDogJywgJywgICAgICAgICAgICAgICAgICAgICAgICAgXHQvLyAgJywgJ1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2RhdGVzJyAgICAgICAgICAgOiBkYXRlc19zZWxlY3Rpb24sICAgIFx0XHRcdC8vICcyMDIzLTA0LTEwLCAyMDIzLTA0LTEyLCAyMDIzLTA0LTAyLCAyMDIzLTA0LTA0J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gKTtcclxuXHRcdH1cclxuXHJcblx0XHR3cGJjX2F2eV9hZnRlcl9kYXlzX3NlbGVjdGlvbl9fc2hvd19oZWxwX2luZm8oe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2NhbGVuZGFyX19kYXlzX3NlbGVjdGlvbl9tb2RlJzogY2FsZW5kYXJfcGFyYW1zX2Fyci5jYWxlbmRhcl9fZGF5c19zZWxlY3Rpb25fbW9kZSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdkYXRlc19hcnInICAgICAgICAgICAgICAgICAgICA6IGRhdGVzX2FycixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdkYXRlc19jbGlja19udW0nICAgICAgICAgICAgICA6IGluc3QuZGF0ZXMubGVuZ3RoLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3BvcG92ZXJfaGludHMnXHRcdFx0XHRcdDogY2FsZW5kYXJfcGFyYW1zX2Fyci5wb3BvdmVyX2hpbnRzXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSApO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU2hvdyBoZWxwIGluZm8gYXQgdGhlIHRvcCAgdG9vbGJhciBhYm91dCBzZWxlY3RlZCBkYXRlcyBhbmQgZnV0dXJlIGFjdGlvbnNcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0gcGFyYW1zXHJcblx0XHQgKiBcdFx0XHRcdFx0RXhhbXBsZSAxOiAge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FsZW5kYXJfX2RheXNfc2VsZWN0aW9uX21vZGU6IFwiZHluYW1pY1wiLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0ZXNfYXJyOiAgWyBcIjIwMjMtMDQtMDNcIiBdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0ZXNfY2xpY2tfbnVtOiAxXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQncG9wb3Zlcl9oaW50cydcdFx0XHRcdFx0OiBjYWxlbmRhcl9wYXJhbXNfYXJyLnBvcG92ZXJfaGludHNcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHQgKiBcdFx0XHRcdFx0RXhhbXBsZSAyOiAge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FsZW5kYXJfX2RheXNfc2VsZWN0aW9uX21vZGU6IFwiZHluYW1pY1wiXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRlc19hcnI6IEFycmF5KDEwKSBbIFwiMjAyMy0wNC0wM1wiLCBcIjIwMjMtMDQtMDRcIiwgXCIyMDIzLTA0LTA1XCIsIOKApiBdXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRlc19jbGlja19udW06IDJcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdwb3BvdmVyX2hpbnRzJ1x0XHRcdFx0XHQ6IGNhbGVuZGFyX3BhcmFtc19hcnIucG9wb3Zlcl9oaW50c1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gd3BiY19hdnlfYWZ0ZXJfZGF5c19zZWxlY3Rpb25fX3Nob3dfaGVscF9pbmZvKCBwYXJhbXMgKXtcclxuLy8gY29uc29sZS5sb2coIHBhcmFtcyApO1x0Ly9cdFx0WyBcIjIwMjMtMDQtMDlcIiwgXCIyMDIzLTA0LTEwXCIsIFwiMjAyMy0wNC0xMVwiIF1cclxuXHJcblx0XHRcdHZhciBtZXNzYWdlLCBjb2xvcjtcclxuXHRcdFx0aWYgKGpRdWVyeSggJyN1aV9idG5fYXZ5X19zZXRfZGF5c19hdmFpbGFiaWxpdHlfX2F2YWlsYWJsZScpLmlzKCc6Y2hlY2tlZCcpKXtcclxuXHRcdFx0XHQgbWVzc2FnZSA9IHBhcmFtcy5wb3BvdmVyX2hpbnRzLnRvb2xiYXJfdGV4dF9hdmFpbGFibGU7Ly8nU2V0IGRhdGVzIF9EQVRFU18gYXMgX0hUTUxfIGF2YWlsYWJsZS4nO1xyXG5cdFx0XHRcdCBjb2xvciA9ICcjMTFiZTRjJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRtZXNzYWdlID0gcGFyYW1zLnBvcG92ZXJfaGludHMudG9vbGJhcl90ZXh0X3VuYXZhaWxhYmxlOy8vJ1NldCBkYXRlcyBfREFURVNfIGFzIF9IVE1MXyB1bmF2YWlsYWJsZS4nO1xyXG5cdFx0XHRcdGNvbG9yID0gJyNlNDM5MzknO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtZXNzYWdlID0gJzxzcGFuPicgKyBtZXNzYWdlICsgJzwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0dmFyIGZpcnN0X2RhdGUgPSBwYXJhbXNbICdkYXRlc19hcnInIF1bIDAgXTtcclxuXHRcdFx0dmFyIGxhc3RfZGF0ZSAgPSAoICdkeW5hbWljJyA9PSBwYXJhbXMuY2FsZW5kYXJfX2RheXNfc2VsZWN0aW9uX21vZGUgKVxyXG5cdFx0XHRcdFx0XHRcdD8gcGFyYW1zWyAnZGF0ZXNfYXJyJyBdWyAocGFyYW1zWyAnZGF0ZXNfYXJyJyBdLmxlbmd0aCAtIDEpIF1cclxuXHRcdFx0XHRcdFx0XHQ6ICggcGFyYW1zWyAnZGF0ZXNfYXJyJyBdLmxlbmd0aCA+IDEgKSA/IHBhcmFtc1sgJ2RhdGVzX2FycicgXVsgMSBdIDogJyc7XHJcblxyXG5cdFx0XHRmaXJzdF9kYXRlID0galF1ZXJ5LmRhdGVwaWNrLmZvcm1hdERhdGUoICdkZCBNLCB5eScsIG5ldyBEYXRlKCBmaXJzdF9kYXRlICsgJ1QwMDowMDowMCcgKSApO1xyXG5cdFx0XHRsYXN0X2RhdGUgPSBqUXVlcnkuZGF0ZXBpY2suZm9ybWF0RGF0ZSggJ2RkIE0sIHl5JywgIG5ldyBEYXRlKCBsYXN0X2RhdGUgKyAnVDAwOjAwOjAwJyApICk7XHJcblxyXG5cclxuXHRcdFx0aWYgKCAnZHluYW1pYycgPT0gcGFyYW1zLmNhbGVuZGFyX19kYXlzX3NlbGVjdGlvbl9tb2RlICl7XHJcblx0XHRcdFx0aWYgKCAxID09IHBhcmFtcy5kYXRlc19jbGlja19udW0gKXtcclxuXHRcdFx0XHRcdGxhc3RfZGF0ZSA9ICdfX19fX19fX19fXydcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKCAnZmlyc3RfdGltZScgPT0galF1ZXJ5KCAnLndwYmNfYWp4X2F2YWlsYWJpbGl0eV9jb250YWluZXInICkuYXR0ciggJ3dwYmNfbG9hZGVkJyApICl7XHJcblx0XHRcdFx0XHRcdGpRdWVyeSggJy53cGJjX2FqeF9hdmFpbGFiaWxpdHlfY29udGFpbmVyJyApLmF0dHIoICd3cGJjX2xvYWRlZCcsICdkb25lJyApXHJcblx0XHRcdFx0XHRcdHdwYmNfYmxpbmtfZWxlbWVudCggJy53cGJjX3dpZGdldF9hdmFpbGFibGVfdW5hdmFpbGFibGUnLCAzLCAyMjAgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSggJ19EQVRFU18nLCAgICAnPC9zcGFuPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vKyAnPGRpdj4nICsgJ2Zyb20nICsgJzwvZGl2PidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCsgJzxzcGFuIGNsYXNzPVwid3BiY19iaWdfZGF0ZVwiPicgKyBmaXJzdF9kYXRlICsgJzwvc3Bhbj4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQrICc8c3Bhbj4nICsgJy0nICsgJzwvc3Bhbj4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQrICc8c3BhbiBjbGFzcz1cIndwYmNfYmlnX2RhdGVcIj4nICsgbGFzdF9kYXRlICsgJzwvc3Bhbj4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQrICc8c3Bhbj4nICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gaWYgKCBwYXJhbXNbICdkYXRlc19hcnInIF0ubGVuZ3RoID4gMSApe1xyXG5cdFx0XHRcdC8vIFx0bGFzdF9kYXRlID0gJywgJyArIGxhc3RfZGF0ZTtcclxuXHRcdFx0XHQvLyBcdGxhc3RfZGF0ZSArPSAoIHBhcmFtc1sgJ2RhdGVzX2FycicgXS5sZW5ndGggPiAyICkgPyAnLCAuLi4nIDogJyc7XHJcblx0XHRcdFx0Ly8gfSBlbHNlIHtcclxuXHRcdFx0XHQvLyBcdGxhc3RfZGF0ZT0nJztcclxuXHRcdFx0XHQvLyB9XHJcblx0XHRcdFx0dmFyIGRhdGVzX2FyciA9IFtdO1xyXG5cdFx0XHRcdGZvciggdmFyIGkgPSAwOyBpIDwgcGFyYW1zWyAnZGF0ZXNfYXJyJyBdLmxlbmd0aDsgaSsrICl7XHJcblx0XHRcdFx0XHRkYXRlc19hcnIucHVzaCggIGpRdWVyeS5kYXRlcGljay5mb3JtYXREYXRlKCAnZGQgTSB5eScsICBuZXcgRGF0ZSggcGFyYW1zWyAnZGF0ZXNfYXJyJyBdWyBpIF0gKyAnVDAwOjAwOjAwJyApICkgICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZpcnN0X2RhdGUgPSBkYXRlc19hcnIuam9pbiggJywgJyApO1xyXG5cdFx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoICdfREFURVNfJywgICAgJzwvc3Bhbj4nXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQrICc8c3BhbiBjbGFzcz1cIndwYmNfYmlnX2RhdGVcIj4nICsgZmlyc3RfZGF0ZSArICc8L3NwYW4+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KyAnPHNwYW4+JyApO1xyXG5cdFx0XHR9XHJcblx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlLnJlcGxhY2UoICdfSFRNTF8nICwgJzwvc3Bhbj48c3BhbiBjbGFzcz1cIndwYmNfYmlnX3RleHRcIiBzdHlsZT1cImNvbG9yOicrY29sb3IrJztcIj4nKSArICc8c3Bhbj4nO1xyXG5cclxuXHRcdFx0Ly9tZXNzYWdlICs9ICcgPGRpdiBzdHlsZT1cIm1hcmdpbi1sZWZ0OiAxZW07XCI+JyArICcgQ2xpY2sgb24gQXBwbHkgYnV0dG9uIHRvIGFwcGx5IGF2YWlsYWJpbGl0eS4nICsgJzwvZGl2Pic7XHJcblxyXG5cdFx0XHRtZXNzYWdlID0gJzxkaXYgY2xhc3M9XCJ3cGJjX3Rvb2xiYXJfZGF0ZXNfaGludHNcIj4nICsgbWVzc2FnZSArICc8L2Rpdj4nO1xyXG5cclxuXHRcdFx0alF1ZXJ5KCAnLndwYmNfaGVscF90ZXh0JyApLmh0bWwoXHRtZXNzYWdlICk7XHJcblx0XHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqICAgUGFyc2UgZGF0ZXMgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEdldCBkYXRlcyBhcnJheSwgIGZyb20gY29tbWEgc2VwYXJhdGVkIGRhdGVzXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHBhcmFtcyAgICAgICA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCogJ2RhdGVzX3NlcGFyYXRvcicgPT4gJywgJywgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGF0ZXMgc2VwYXJhdG9yXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQqICdkYXRlcycgICAgICAgICAgID0+ICcyMDIzLTA0LTA0LCAyMDIzLTA0LTA3LCAyMDIzLTA0LTA1JyAgICAgICAgIC8vIERhdGVzIGluICdZLW0tZCcgZm9ybWF0OiAnMjAyMy0wMS0zMSdcclxuXHRcdFx0XHRcdFx0XHRcdCB9XHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybiBhcnJheSAgICAgID0gW1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KiBbMF0gPT4gMjAyMy0wNC0wNFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KiBbMV0gPT4gMjAyMy0wNC0wNVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KiBbMl0gPT4gMjAyMy0wNC0wNlxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KiBbM10gPT4gMjAyMy0wNC0wN1xyXG5cdFx0XHRcdFx0XHRcdFx0XVxyXG5cdFx0ICpcclxuXHRcdCAqIEV4YW1wbGUgIzE6ICB3cGJjX2dldF9kYXRlc19hcnJfX2Zyb21fZGF0ZXNfY29tbWFfc2VwYXJhdGVkX2pzKCAgeyAgJ2RhdGVzX3NlcGFyYXRvcicgOiAnLCAnLCAnZGF0ZXMnIDogJzIwMjMtMDQtMDQsIDIwMjMtMDQtMDcsIDIwMjMtMDQtMDUnICB9ICApO1xyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiB3cGJjX2dldF9kYXRlc19hcnJfX2Zyb21fZGF0ZXNfY29tbWFfc2VwYXJhdGVkX2pzKCBwYXJhbXMgKXtcclxuXHJcblx0XHRcdHZhciBkYXRlc19hcnIgPSBbXTtcclxuXHJcblx0XHRcdGlmICggJycgIT09IHBhcmFtc1sgJ2RhdGVzJyBdICl7XHJcblxyXG5cdFx0XHRcdGRhdGVzX2FyciA9IHBhcmFtc1sgJ2RhdGVzJyBdLnNwbGl0KCBwYXJhbXNbICdkYXRlc19zZXBhcmF0b3InIF0gKTtcclxuXHJcblx0XHRcdFx0ZGF0ZXNfYXJyLnNvcnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZGF0ZXNfYXJyO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogR2V0IGRhdGVzIGFycmF5LCAgZnJvbSByYW5nZSBkYXlzIHNlbGVjdGlvblxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSBwYXJhbXMgICAgICAgPSAge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KiAnZGF0ZXNfc2VwYXJhdG9yJyA9PiAnIH4gJywgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGF0ZXMgc2VwYXJhdG9yXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQqICdkYXRlcycgICAgICAgICAgID0+ICcyMDIzLTA0LTA0IH4gMjAyMy0wNC0wNycgICAgICAvLyBEYXRlcyBpbiAnWS1tLWQnIGZvcm1hdDogJzIwMjMtMDEtMzEnXHJcblx0XHRcdFx0XHRcdFx0XHQgIH1cclxuXHRcdCAqXHJcblx0XHQgKiBAcmV0dXJuIGFycmF5ICAgICAgICA9IFtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCogWzBdID0+IDIwMjMtMDQtMDRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCogWzFdID0+IDIwMjMtMDQtMDVcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCogWzJdID0+IDIwMjMtMDQtMDZcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCogWzNdID0+IDIwMjMtMDQtMDdcclxuXHRcdFx0XHRcdFx0XHRcdCAgXVxyXG5cdFx0ICpcclxuXHRcdCAqIEV4YW1wbGUgIzE6ICB3cGJjX2dldF9kYXRlc19hcnJfX2Zyb21fZGF0ZXNfcmFuZ2VfanMoICB7ICAnZGF0ZXNfc2VwYXJhdG9yJyA6ICcgfiAnLCAnZGF0ZXMnIDogJzIwMjMtMDQtMDQgfiAyMDIzLTA0LTA3JyAgfSAgKTtcclxuXHRcdCAqIEV4YW1wbGUgIzI6ICB3cGJjX2dldF9kYXRlc19hcnJfX2Zyb21fZGF0ZXNfcmFuZ2VfanMoICB7ICAnZGF0ZXNfc2VwYXJhdG9yJyA6ICcgLSAnLCAnZGF0ZXMnIDogJzIwMjMtMDQtMDQgLSAyMDIzLTA0LTA3JyAgfSAgKTtcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gd3BiY19nZXRfZGF0ZXNfYXJyX19mcm9tX2RhdGVzX3JhbmdlX2pzKCBwYXJhbXMgKXtcclxuXHJcblx0XHRcdHZhciBkYXRlc19hcnIgPSBbXTtcclxuXHJcblx0XHRcdGlmICggJycgIT09IHBhcmFtc1snZGF0ZXMnXSApIHtcclxuXHJcblx0XHRcdFx0ZGF0ZXNfYXJyID0gcGFyYW1zWyAnZGF0ZXMnIF0uc3BsaXQoIHBhcmFtc1sgJ2RhdGVzX3NlcGFyYXRvcicgXSApO1xyXG5cdFx0XHRcdHZhciBjaGVja19pbl9kYXRlX3ltZCAgPSBkYXRlc19hcnJbMF07XHJcblx0XHRcdFx0dmFyIGNoZWNrX291dF9kYXRlX3ltZCA9IGRhdGVzX2FyclsxXTtcclxuXHJcblx0XHRcdFx0aWYgKCAoJycgIT09IGNoZWNrX2luX2RhdGVfeW1kKSAmJiAoJycgIT09IGNoZWNrX291dF9kYXRlX3ltZCkgKXtcclxuXHJcblx0XHRcdFx0XHRkYXRlc19hcnIgPSB3cGJjX2dldF9kYXRlc19hcnJheV9mcm9tX3N0YXJ0X2VuZF9kYXlzX2pzKCBjaGVja19pbl9kYXRlX3ltZCwgY2hlY2tfb3V0X2RhdGVfeW1kICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBkYXRlc19hcnI7XHJcblx0XHR9XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogR2V0IGRhdGVzIGFycmF5IGJhc2VkIG9uIHN0YXJ0IGFuZCBlbmQgZGF0ZXMuXHJcblx0XHRcdCAqXHJcblx0XHRcdCAqIEBwYXJhbSBzdHJpbmcgc1N0YXJ0RGF0ZSAtIHN0YXJ0IGRhdGU6IDIwMjMtMDQtMDlcclxuXHRcdFx0ICogQHBhcmFtIHN0cmluZyBzRW5kRGF0ZSAgIC0gZW5kIGRhdGU6ICAgMjAyMy0wNC0xMVxyXG5cdFx0XHQgKiBAcmV0dXJuIGFycmF5ICAgICAgICAgICAgIC0gWyBcIjIwMjMtMDQtMDlcIiwgXCIyMDIzLTA0LTEwXCIsIFwiMjAyMy0wNC0xMVwiIF1cclxuXHRcdFx0ICovXHJcblx0XHRcdGZ1bmN0aW9uIHdwYmNfZ2V0X2RhdGVzX2FycmF5X2Zyb21fc3RhcnRfZW5kX2RheXNfanMoIHNTdGFydERhdGUsIHNFbmREYXRlICl7XHJcblxyXG5cdFx0XHRcdHNTdGFydERhdGUgPSBuZXcgRGF0ZSggc1N0YXJ0RGF0ZSArICdUMDA6MDA6MDAnICk7XHJcblx0XHRcdFx0c0VuZERhdGUgPSBuZXcgRGF0ZSggc0VuZERhdGUgKyAnVDAwOjAwOjAwJyApO1xyXG5cclxuXHRcdFx0XHR2YXIgYURheXM9W107XHJcblxyXG5cdFx0XHRcdC8vIFN0YXJ0IHRoZSB2YXJpYWJsZSBvZmYgd2l0aCB0aGUgc3RhcnQgZGF0ZVxyXG5cdFx0XHRcdGFEYXlzLnB1c2goIHNTdGFydERhdGUuZ2V0VGltZSgpICk7XHJcblxyXG5cdFx0XHRcdC8vIFNldCBhICd0ZW1wJyB2YXJpYWJsZSwgc0N1cnJlbnREYXRlLCB3aXRoIHRoZSBzdGFydCBkYXRlIC0gYmVmb3JlIGJlZ2lubmluZyB0aGUgbG9vcFxyXG5cdFx0XHRcdHZhciBzQ3VycmVudERhdGUgPSBuZXcgRGF0ZSggc1N0YXJ0RGF0ZS5nZXRUaW1lKCkgKTtcclxuXHRcdFx0XHR2YXIgb25lX2RheV9kdXJhdGlvbiA9IDI0KjYwKjYwKjEwMDA7XHJcblxyXG5cdFx0XHRcdC8vIFdoaWxlIHRoZSBjdXJyZW50IGRhdGUgaXMgbGVzcyB0aGFuIHRoZSBlbmQgZGF0ZVxyXG5cdFx0XHRcdHdoaWxlKHNDdXJyZW50RGF0ZSA8IHNFbmREYXRlKXtcclxuXHRcdFx0XHRcdC8vIEFkZCBhIGRheSB0byB0aGUgY3VycmVudCBkYXRlIFwiKzEgZGF5XCJcclxuXHRcdFx0XHRcdHNDdXJyZW50RGF0ZS5zZXRUaW1lKCBzQ3VycmVudERhdGUuZ2V0VGltZSgpICsgb25lX2RheV9kdXJhdGlvbiApO1xyXG5cclxuXHRcdFx0XHRcdC8vIEFkZCB0aGlzIG5ldyBkYXkgdG8gdGhlIGFEYXlzIGFycmF5XHJcblx0XHRcdFx0XHRhRGF5cy5wdXNoKCBzQ3VycmVudERhdGUuZ2V0VGltZSgpICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFEYXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRhRGF5c1sgaSBdID0gbmV3IERhdGUoIGFEYXlzW2ldICk7XHJcblx0XHRcdFx0XHRhRGF5c1sgaSBdID0gYURheXNbIGkgXS5nZXRGdWxsWWVhcigpXHJcblx0XHRcdFx0XHRcdFx0XHQrICctJyArICgoIChhRGF5c1sgaSBdLmdldE1vbnRoKCkgKyAxKSA8IDEwKSA/ICcwJyA6ICcnKSArIChhRGF5c1sgaSBdLmdldE1vbnRoKCkgKyAxKVxyXG5cdFx0XHRcdFx0XHRcdFx0KyAnLScgKyAoKCAgICAgICAgYURheXNbIGkgXS5nZXREYXRlKCkgPCAxMCkgPyAnMCcgOiAnJykgKyAgYURheXNbIGkgXS5nZXREYXRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIE9uY2UgdGhlIGxvb3AgaGFzIGZpbmlzaGVkLCByZXR1cm4gdGhlIGFycmF5IG9mIGRheXMuXHJcblx0XHRcdFx0cmV0dXJuIGFEYXlzO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogICBUb29sdGlwcyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHQvKipcclxuXHQgKiBEZWZpbmUgc2hvd2luZyB0b29sdGlwLCAgd2hlbiAgbW91c2Ugb3ZlciBvbiAgU0VMRUNUQUJMRSAoYXZhaWxhYmxlLCBwZW5kaW5nLCBhcHByb3ZlZCwgcmVzb3VyY2UgdW5hdmFpbGFibGUpLCAgZGF5c1xyXG5cdCAqIENhbiBiZSBjYWxsZWQgZGlyZWN0bHkgIGZyb20gIGRhdGVwaWNrIGluaXQgZnVuY3Rpb24uXHJcblx0ICpcclxuXHQgKiBAcGFyYW0gdmFsdWVcclxuXHQgKiBAcGFyYW0gZGF0ZVxyXG5cdCAqIEBwYXJhbSBjYWxlbmRhcl9wYXJhbXNfYXJyXHJcblx0ICogQHBhcmFtIGRhdGVwaWNrX3RoaXNcclxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuXHQgKi9cclxuXHRmdW5jdGlvbiB3cGJjX2F2eV9fcHJlcGFyZV90b29sdGlwX19pbl9jYWxlbmRhciggdmFsdWUsIGRhdGUsIGNhbGVuZGFyX3BhcmFtc19hcnIsIGRhdGVwaWNrX3RoaXMgKXtcclxuXHJcblx0XHRpZiAoIG51bGwgPT0gZGF0ZSApeyAgcmV0dXJuIGZhbHNlOyAgfVxyXG5cclxuXHRcdHZhciB0ZF9jbGFzcyA9ICggZGF0ZS5nZXRNb250aCgpICsgMSApICsgJy0nICsgZGF0ZS5nZXREYXRlKCkgKyAnLScgKyBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcblxyXG5cdFx0dmFyIGpDZWxsID0galF1ZXJ5KCAnI2NhbGVuZGFyX2Jvb2tpbmcnICsgY2FsZW5kYXJfcGFyYW1zX2Fyci5yZXNvdXJjZV9pZCArICcgdGQuY2FsNGRhdGUtJyArIHRkX2NsYXNzICk7XHJcblxyXG5cdFx0d3BiY19hdnlfX3Nob3dfdG9vbHRpcF9fZm9yX2VsZW1lbnQoIGpDZWxsLCBjYWxlbmRhcl9wYXJhbXNfYXJyWyAncG9wb3Zlcl9oaW50cycgXSApO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogRGVmaW5lIHRvb2x0aXAgIGZvciBzaG93aW5nIG9uIFVOQVZBSUxBQkxFIGRheXMgKHNlYXNvbiwgd2Vla2RheSwgdG9kYXlfZGVwZW5kcyB1bmF2YWlsYWJsZSlcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSBqQ2VsbFx0XHRcdFx0XHRqUXVlcnkgb2Ygc3BlY2lmaWMgZGF5IGNlbGxcclxuXHQgKiBAcGFyYW0gcG9wb3Zlcl9oaW50c1x0XHQgICAgQXJyYXkgd2l0aCB0b29sdGlwIGhpbnQgdGV4dHNcdCA6IHsnc2Vhc29uX3VuYXZhaWxhYmxlJzonLi4uJywnd2Vla2RheXNfdW5hdmFpbGFibGUnOicuLi4nLCdiZWZvcmVfYWZ0ZXJfdW5hdmFpbGFibGUnOicuLi4nLH1cclxuXHQgKi9cclxuXHRmdW5jdGlvbiB3cGJjX2F2eV9fc2hvd190b29sdGlwX19mb3JfZWxlbWVudCggakNlbGwsIHBvcG92ZXJfaGludHMgKXtcclxuXHJcblx0XHR2YXIgdG9vbHRpcF90aW1lID0gJyc7XHJcblxyXG5cdFx0aWYgKCBqQ2VsbC5oYXNDbGFzcyggJ3NlYXNvbl91bmF2YWlsYWJsZScgKSApe1xyXG5cdFx0XHR0b29sdGlwX3RpbWUgPSBwb3BvdmVyX2hpbnRzWyAnc2Vhc29uX3VuYXZhaWxhYmxlJyBdO1xyXG5cdFx0fSBlbHNlIGlmICggakNlbGwuaGFzQ2xhc3MoICd3ZWVrZGF5c191bmF2YWlsYWJsZScgKSApe1xyXG5cdFx0XHR0b29sdGlwX3RpbWUgPSBwb3BvdmVyX2hpbnRzWyAnd2Vla2RheXNfdW5hdmFpbGFibGUnIF07XHJcblx0XHR9IGVsc2UgaWYgKCBqQ2VsbC5oYXNDbGFzcyggJ2JlZm9yZV9hZnRlcl91bmF2YWlsYWJsZScgKSApe1xyXG5cdFx0XHR0b29sdGlwX3RpbWUgPSBwb3BvdmVyX2hpbnRzWyAnYmVmb3JlX2FmdGVyX3VuYXZhaWxhYmxlJyBdO1xyXG5cdFx0fSBlbHNlIGlmICggakNlbGwuaGFzQ2xhc3MoICdkYXRlMmFwcHJvdmUnICkgKXtcclxuXHJcblx0XHR9IGVsc2UgaWYgKCBqQ2VsbC5oYXNDbGFzcyggJ2RhdGVfYXBwcm92ZWQnICkgKXtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRqQ2VsbC5hdHRyKCAnZGF0YS1jb250ZW50JywgdG9vbHRpcF90aW1lICk7XHJcblxyXG5cdFx0dmFyIHRkX2VsID0gakNlbGwuZ2V0KDApO1x0Ly9qUXVlcnkoICcjY2FsZW5kYXJfYm9va2luZycgKyBjYWxlbmRhcl9wYXJhbXNfYXJyLnJlc291cmNlX2lkICsgJyB0ZC5jYWw0ZGF0ZS0nICsgdGRfY2xhc3MgKS5nZXQoMCk7XHJcblxyXG5cdFx0aWYgKCAoIHVuZGVmaW5lZCA9PSB0ZF9lbC5fdGlwcHkgKSAmJiAoICcnICE9IHRvb2x0aXBfdGltZSApICl7XHJcblxyXG5cdFx0XHRcdHdwYmNfdGlwcHkoIHRkX2VsICwge1xyXG5cdFx0XHRcdFx0Y29udGVudCggcmVmZXJlbmNlICl7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgcG9wb3Zlcl9jb250ZW50ID0gcmVmZXJlbmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtY29udGVudCcgKTtcclxuXHJcblx0XHRcdFx0XHRcdHJldHVybiAnPGRpdiBjbGFzcz1cInBvcG92ZXIgcG9wb3Zlcl90aXBweVwiPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0KyAnPGRpdiBjbGFzcz1cInBvcG92ZXItY29udGVudFwiPidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQrIHBvcG92ZXJfY29udGVudFxyXG5cdFx0XHRcdFx0XHRcdFx0XHQrICc8L2Rpdj4nXHJcblx0XHRcdFx0XHRcdFx0ICsgJzwvZGl2Pic7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0YWxsb3dIVE1MICAgICAgICA6IHRydWUsXHJcblx0XHRcdFx0XHR0cmlnZ2VyXHRcdFx0IDogJ21vdXNlZW50ZXIgZm9jdXMnLFxyXG5cdFx0XHRcdFx0aW50ZXJhY3RpdmUgICAgICA6ICEgdHJ1ZSxcclxuXHRcdFx0XHRcdGhpZGVPbkNsaWNrICAgICAgOiB0cnVlLFxyXG5cdFx0XHRcdFx0aW50ZXJhY3RpdmVCb3JkZXI6IDEwLFxyXG5cdFx0XHRcdFx0bWF4V2lkdGggICAgICAgICA6IDU1MCxcclxuXHRcdFx0XHRcdHRoZW1lICAgICAgICAgICAgOiAnd3BiYy10aXBweS10aW1lcycsXHJcblx0XHRcdFx0XHRwbGFjZW1lbnQgICAgICAgIDogJ3RvcCcsXHJcblx0XHRcdFx0XHRkZWxheVx0XHRcdCA6IFs0MDAsIDBdLFx0XHRcdC8vRml4SW46IDkuNC4yLjJcclxuXHRcdFx0XHRcdGlnbm9yZUF0dHJpYnV0ZXMgOiB0cnVlLFxyXG5cdFx0XHRcdFx0dG91Y2hcdFx0XHQgOiB0cnVlLFx0XHRcdFx0Ly9bJ2hvbGQnLCA1MDBdLCAvLyA1MDBtcyBkZWxheVx0XHRcdC8vRml4SW46IDkuMi4xLjVcclxuXHRcdFx0XHRcdGFwcGVuZFRvOiAoKSA9PiBkb2N1bWVudC5ib2R5LFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4vKipcclxuICogICBBamF4ICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbi8qKlxyXG4gKiBTZW5kIEFqYXggc2hvdyByZXF1ZXN0XHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX2FqYXhfcmVxdWVzdCgpe1xyXG5cclxuY29uc29sZS5ncm91cENvbGxhcHNlZCggJ1dQQkNfQUpYX0FWQUlMQUJJTElUWScgKTsgY29uc29sZS5sb2coICcgPT0gQmVmb3JlIEFqYXggU2VuZCAtIHNlYXJjaF9nZXRfYWxsX3BhcmFtcygpID09ICcgLCB3cGJjX2FqeF9hdmFpbGFiaWxpdHkuc2VhcmNoX2dldF9hbGxfcGFyYW1zKCkgKTtcclxuXHJcblx0d3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbl9fc3Bpbl9zdGFydCgpO1xyXG5cclxuXHQvLyBTdGFydCBBamF4XHJcblx0alF1ZXJ5LnBvc3QoIHdwYmNfZ2xvYmFsMS53cGJjX2FqYXh1cmwsXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YWN0aW9uICAgICAgICAgIDogJ1dQQkNfQUpYX0FWQUlMQUJJTElUWScsXHJcblx0XHRcdFx0XHR3cGJjX2FqeF91c2VyX2lkOiB3cGJjX2FqeF9hdmFpbGFiaWxpdHkuZ2V0X3NlY3VyZV9wYXJhbSggJ3VzZXJfaWQnICksXHJcblx0XHRcdFx0XHRub25jZSAgICAgICAgICAgOiB3cGJjX2FqeF9hdmFpbGFiaWxpdHkuZ2V0X3NlY3VyZV9wYXJhbSggJ25vbmNlJyApLFxyXG5cdFx0XHRcdFx0d3BiY19hanhfbG9jYWxlIDogd3BiY19hanhfYXZhaWxhYmlsaXR5LmdldF9zZWN1cmVfcGFyYW0oICdsb2NhbGUnICksXHJcblxyXG5cdFx0XHRcdFx0c2VhcmNoX3BhcmFtc1x0OiB3cGJjX2FqeF9hdmFpbGFiaWxpdHkuc2VhcmNoX2dldF9hbGxfcGFyYW1zKClcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdC8qKlxyXG5cdFx0XHRcdCAqIFMgdSBjIGMgZSBzIHNcclxuXHRcdFx0XHQgKlxyXG5cdFx0XHRcdCAqIEBwYXJhbSByZXNwb25zZV9kYXRhXHRcdC1cdGl0cyBvYmplY3QgcmV0dXJuZWQgZnJvbSAgQWpheCAtIGNsYXNzLWxpdmUtc2VhcmNnLnBocFxyXG5cdFx0XHRcdCAqIEBwYXJhbSB0ZXh0U3RhdHVzXHRcdC1cdCdzdWNjZXNzJ1xyXG5cdFx0XHRcdCAqIEBwYXJhbSBqcVhIUlx0XHRcdFx0LVx0T2JqZWN0XHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0ZnVuY3Rpb24gKCByZXNwb25zZV9kYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUiApIHtcclxuXHJcbmNvbnNvbGUubG9nKCAnID09IFJlc3BvbnNlIFdQQkNfQUpYX0FWQUlMQUJJTElUWSA9PSAnLCByZXNwb25zZV9kYXRhICk7IGNvbnNvbGUuZ3JvdXBFbmQoKTtcclxuXHJcblx0XHRcdFx0XHQvLyBQcm9iYWJseSBFcnJvclxyXG5cdFx0XHRcdFx0aWYgKCAodHlwZW9mIHJlc3BvbnNlX2RhdGEgIT09ICdvYmplY3QnKSB8fCAocmVzcG9uc2VfZGF0YSA9PT0gbnVsbCkgKXtcclxuXHJcblx0XHRcdFx0XHRcdHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fc2hvd19tZXNzYWdlKCByZXNwb25zZV9kYXRhICk7XHJcblxyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gUmVsb2FkIHBhZ2UsIGFmdGVyIGZpbHRlciB0b29sYmFyIGhhcyBiZWVuIHJlc2V0XHJcblx0XHRcdFx0XHRpZiAoICAgICAgICggICAgIHVuZGVmaW5lZCAhPSByZXNwb25zZV9kYXRhWyAnYWp4X2NsZWFuZWRfcGFyYW1zJyBdKVxyXG5cdFx0XHRcdFx0XHRcdCYmICggJ3Jlc2V0X2RvbmUnID09PSByZXNwb25zZV9kYXRhWyAnYWp4X2NsZWFuZWRfcGFyYW1zJyBdWyAnZG9fYWN0aW9uJyBdKVxyXG5cdFx0XHRcdFx0KXtcclxuXHRcdFx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBTaG93IGxpc3RpbmdcclxuXHRcdFx0XHRcdHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fcGFnZV9jb250ZW50X19zaG93KCByZXNwb25zZV9kYXRhWyAnYWp4X2RhdGEnIF0sIHJlc3BvbnNlX2RhdGFbICdhanhfc2VhcmNoX3BhcmFtcycgXSAsIHJlc3BvbnNlX2RhdGFbICdhanhfY2xlYW5lZF9wYXJhbXMnIF0gKTtcclxuXHJcblx0XHRcdFx0XHQvL3dwYmNfYWp4X2F2YWlsYWJpbGl0eV9fZGVmaW5lX3VpX2hvb2tzKCk7XHRcdFx0XHRcdFx0Ly8gUmVkZWZpbmUgSG9va3MsIGJlY2F1c2Ugd2Ugc2hvdyBuZXcgRE9NIGVsZW1lbnRzXHJcblx0XHRcdFx0XHRpZiAoICcnICE9IHJlc3BvbnNlX2RhdGFbICdhanhfZGF0YScgXVsgJ2FqeF9hZnRlcl9hY3Rpb25fbWVzc2FnZScgXS5yZXBsYWNlKCAvXFxuL2csIFwiPGJyIC8+XCIgKSApe1xyXG5cdFx0XHRcdFx0XHR3cGJjX2FkbWluX3Nob3dfbWVzc2FnZShcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgIHJlc3BvbnNlX2RhdGFbICdhanhfZGF0YScgXVsgJ2FqeF9hZnRlcl9hY3Rpb25fbWVzc2FnZScgXS5yZXBsYWNlKCAvXFxuL2csIFwiPGJyIC8+XCIgKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCwgKCAnMScgPT0gcmVzcG9uc2VfZGF0YVsgJ2FqeF9kYXRhJyBdWyAnYWp4X2FmdGVyX2FjdGlvbl9yZXN1bHQnIF0gKSA/ICdzdWNjZXNzJyA6ICdlcnJvcidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQsIDEwMDAwXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0d3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbl9fc3Bpbl9wYXVzZSgpO1xyXG5cdFx0XHRcdFx0Ly8gUmVtb3ZlIHNwaW4gaWNvbiBmcm9tICBidXR0b24gYW5kIEVuYWJsZSB0aGlzIGJ1dHRvbi5cclxuXHRcdFx0XHRcdHdwYmNfYnV0dG9uX19yZW1vdmVfc3BpbiggcmVzcG9uc2VfZGF0YVsgJ2FqeF9jbGVhbmVkX3BhcmFtcycgXVsgJ3VpX2NsaWNrZWRfZWxlbWVudF9pZCcgXSApXHJcblxyXG5cdFx0XHRcdFx0alF1ZXJ5KCAnI2FqYXhfcmVzcG9uZCcgKS5odG1sKCByZXNwb25zZV9kYXRhICk7XHRcdC8vIEZvciBhYmlsaXR5IHRvIHNob3cgcmVzcG9uc2UsIGFkZCBzdWNoIERJViBlbGVtZW50IHRvIHBhZ2VcclxuXHRcdFx0XHR9XHJcblx0XHRcdCAgKS5mYWlsKCBmdW5jdGlvbiAoIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93biApIHsgICAgaWYgKCB3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS5sb2cgKXsgY29uc29sZS5sb2coICdBamF4X0Vycm9yJywganFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duICk7IH1cclxuXHJcblx0XHRcdFx0XHR2YXIgZXJyb3JfbWVzc2FnZSA9ICc8c3Ryb25nPicgKyAnRXJyb3IhJyArICc8L3N0cm9uZz4gJyArIGVycm9yVGhyb3duIDtcclxuXHRcdFx0XHRcdGlmICgganFYSFIuc3RhdHVzICl7XHJcblx0XHRcdFx0XHRcdGVycm9yX21lc3NhZ2UgKz0gJyAoPGI+JyArIGpxWEhSLnN0YXR1cyArICc8L2I+KSc7XHJcblx0XHRcdFx0XHRcdGlmICg0MDMgPT0ganFYSFIuc3RhdHVzICl7XHJcblx0XHRcdFx0XHRcdFx0ZXJyb3JfbWVzc2FnZSArPSAnIFByb2JhYmx5IG5vbmNlIGZvciB0aGlzIHBhZ2UgaGFzIGJlZW4gZXhwaXJlZC4gUGxlYXNlIDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBvbmNsaWNrPVwiamF2YXNjcmlwdDpsb2NhdGlvbi5yZWxvYWQoKTtcIj5yZWxvYWQgdGhlIHBhZ2U8L2E+Lic7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICgganFYSFIucmVzcG9uc2VUZXh0ICl7XHJcblx0XHRcdFx0XHRcdGVycm9yX21lc3NhZ2UgKz0gJyAnICsganFYSFIucmVzcG9uc2VUZXh0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXJyb3JfbWVzc2FnZSA9IGVycm9yX21lc3NhZ2UucmVwbGFjZSggL1xcbi9nLCBcIjxiciAvPlwiICk7XHJcblxyXG5cdFx0XHRcdFx0d3BiY19hanhfYXZhaWxhYmlsaXR5X19zaG93X21lc3NhZ2UoIGVycm9yX21lc3NhZ2UgKTtcclxuXHRcdFx0ICB9KVxyXG5cdCAgICAgICAgICAvLyAuZG9uZSggICBmdW5jdGlvbiAoIGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSICkgeyAgIGlmICggd2luZG93LmNvbnNvbGUgJiYgd2luZG93LmNvbnNvbGUubG9nICl7IGNvbnNvbGUubG9nKCAnc2Vjb25kIHN1Y2Nlc3MnLCBkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUiApOyB9ICAgIH0pXHJcblx0XHRcdCAgLy8gLmFsd2F5cyggZnVuY3Rpb24gKCBkYXRhX2pxWEhSLCB0ZXh0U3RhdHVzLCBqcVhIUl9lcnJvclRocm93biApIHsgICBpZiAoIHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLmxvZyApeyBjb25zb2xlLmxvZyggJ2Fsd2F5cyBmaW5pc2hlZCcsIGRhdGFfanFYSFIsIHRleHRTdGF0dXMsIGpxWEhSX2Vycm9yVGhyb3duICk7IH0gICAgIH0pXHJcblx0XHRcdCAgOyAgLy8gRW5kIEFqYXhcclxuXHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqICAgSCBvIG8gayBzICAtICBpdHMgQWN0aW9uL1RpbWVzIHdoZW4gbmVlZCB0byByZS1SZW5kZXIgVmlld3MgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4vKipcclxuICogU2VuZCBBamF4IFNlYXJjaCBSZXF1ZXN0IGFmdGVyIFVwZGF0aW5nIHNlYXJjaCByZXF1ZXN0IHBhcmFtZXRlcnNcclxuICpcclxuICogQHBhcmFtIHBhcmFtc19hcnJcclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fc2VuZF9yZXF1ZXN0X3dpdGhfcGFyYW1zICggcGFyYW1zX2FyciApe1xyXG5cclxuXHQvLyBEZWZpbmUgZGlmZmVyZW50IFNlYXJjaCAgcGFyYW1ldGVycyBmb3IgcmVxdWVzdFxyXG5cdF8uZWFjaCggcGFyYW1zX2FyciwgZnVuY3Rpb24gKCBwX3ZhbCwgcF9rZXksIHBfZGF0YSApIHtcclxuXHRcdC8vY29uc29sZS5sb2coICdSZXF1ZXN0IGZvcjogJywgcF9rZXksIHBfdmFsICk7XHJcblx0XHR3cGJjX2FqeF9hdmFpbGFiaWxpdHkuc2VhcmNoX3NldF9wYXJhbSggcF9rZXksIHBfdmFsICk7XHJcblx0fSk7XHJcblxyXG5cdC8vIFNlbmQgQWpheCBSZXF1ZXN0XHJcblx0d3BiY19hanhfYXZhaWxhYmlsaXR5X19hamF4X3JlcXVlc3QoKTtcclxufVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogU2VhcmNoIHJlcXVlc3QgZm9yIFwiUGFnZSBOdW1iZXJcIlxyXG5cdCAqIEBwYXJhbSBwYWdlX251bWJlclx0aW50XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gd3BiY19hanhfYXZhaWxhYmlsaXR5X19wYWdpbmF0aW9uX2NsaWNrKCBwYWdlX251bWJlciApe1xyXG5cclxuXHRcdHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fc2VuZF9yZXF1ZXN0X3dpdGhfcGFyYW1zKCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQncGFnZV9udW0nOiBwYWdlX251bWJlclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gKTtcclxuXHR9XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiAgIFNob3cgLyBIaWRlIENvbnRlbnQgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuLyoqXHJcbiAqICBTaG93IExpc3RpbmcgQ29udGVudCBcdC0gXHRTZW5kaW5nIEFqYXggUmVxdWVzdFx0LVx0d2l0aCBwYXJhbWV0ZXJzIHRoYXQgIHdlIGVhcmx5ICBkZWZpbmVkXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX2FjdHVhbF9jb250ZW50X19zaG93KCl7XHJcblxyXG5cdHdwYmNfYWp4X2F2YWlsYWJpbGl0eV9fYWpheF9yZXF1ZXN0KCk7XHRcdFx0Ly8gU2VuZCBBamF4IFJlcXVlc3RcdC1cdHdpdGggcGFyYW1ldGVycyB0aGF0ICB3ZSBlYXJseSAgZGVmaW5lZCBpbiBcIndwYmNfYWp4X2Jvb2tpbmdfbGlzdGluZ1wiIE9iai5cclxufVxyXG5cclxuLyoqXHJcbiAqIEhpZGUgTGlzdGluZyBDb250ZW50XHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FqeF9hdmFpbGFiaWxpdHlfX2FjdHVhbF9jb250ZW50X19oaWRlKCl7XHJcblxyXG5cdGpRdWVyeSggIHdwYmNfYWp4X2F2YWlsYWJpbGl0eS5nZXRfb3RoZXJfcGFyYW0oICdsaXN0aW5nX2NvbnRhaW5lcicgKSAgKS5odG1sKCAnJyApO1xyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiAgIE0gZSBzIHMgYSBnIGUgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuLyoqXHJcbiAqIFNob3cganVzdCBtZXNzYWdlIGluc3RlYWQgb2YgY29udGVudFxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hanhfYXZhaWxhYmlsaXR5X19zaG93X21lc3NhZ2UoIG1lc3NhZ2UgKXtcclxuXHJcblx0d3BiY19hanhfYXZhaWxhYmlsaXR5X19hY3R1YWxfY29udGVudF9faGlkZSgpO1xyXG5cclxuXHRqUXVlcnkoIHdwYmNfYWp4X2F2YWlsYWJpbGl0eS5nZXRfb3RoZXJfcGFyYW0oICdsaXN0aW5nX2NvbnRhaW5lcicgKSApLmh0bWwoXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwid3BiYy1zZXR0aW5ncy1ub3RpY2Ugbm90aWNlLXdhcm5pbmdcIiBzdHlsZT1cInRleHQtYWxpZ246bGVmdFwiPicgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2UgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPC9kaXY+J1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCk7XHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqICAgU3VwcG9ydCBGdW5jdGlvbnMgLSBTcGluIEljb24gaW4gQnV0dG9ucyAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG4vKipcclxuICogU3BpbiBidXR0b24gaW4gRmlsdGVyIHRvb2xiYXIgIC0gIFN0YXJ0XHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2F2YWlsYWJpbGl0eV9yZWxvYWRfYnV0dG9uX19zcGluX3N0YXJ0KCl7XHJcblx0alF1ZXJ5KCAnI3dwYmNfYXZhaWxhYmlsaXR5X3JlbG9hZF9idXR0b24gLm1lbnVfaWNvbi53cGJjX3NwaW4nKS5yZW1vdmVDbGFzcyggJ3dwYmNfYW5pbWF0aW9uX3BhdXNlJyApO1xyXG59XHJcblxyXG4vKipcclxuICogU3BpbiBidXR0b24gaW4gRmlsdGVyIHRvb2xiYXIgIC0gIFBhdXNlXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2F2YWlsYWJpbGl0eV9yZWxvYWRfYnV0dG9uX19zcGluX3BhdXNlKCl7XHJcblx0alF1ZXJ5KCAnI3dwYmNfYXZhaWxhYmlsaXR5X3JlbG9hZF9idXR0b24gLm1lbnVfaWNvbi53cGJjX3NwaW4nICkuYWRkQ2xhc3MoICd3cGJjX2FuaW1hdGlvbl9wYXVzZScgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNwaW4gYnV0dG9uIGluIEZpbHRlciB0b29sYmFyICAtICBpcyBTcGlubmluZyA/XHJcbiAqXHJcbiAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbl9faXNfc3Bpbigpe1xyXG4gICAgaWYgKCBqUXVlcnkoICcjd3BiY19hdmFpbGFiaWxpdHlfcmVsb2FkX2J1dHRvbiAubWVudV9pY29uLndwYmNfc3BpbicgKS5oYXNDbGFzcyggJ3dwYmNfYW5pbWF0aW9uX3BhdXNlJyApICl7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxufVxyXG4iXSwiZmlsZSI6ImluY2x1ZGVzL3BhZ2UtYXZhaWxhYmlsaXR5L19vdXQvYXZhaWxhYmlsaXR5X3BhZ2UuanMifQ==
