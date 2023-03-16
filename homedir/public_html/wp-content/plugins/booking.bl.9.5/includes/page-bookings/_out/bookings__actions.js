"use strict";
/**
 *   Ajax   ----------------------------------------------------------------------------------------------------- */
//var is_this_action = false;

/**
 * Send Ajax action request,  like approving or cancellation
 *
 * @param action_param
 */

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function wpbc_ajx_booking_ajax_action_request() {
  var action_param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  console.groupCollapsed('WPBC_AJX_BOOKING_ACTIONS');
  console.log(' == Ajax Actions :: Params == ', action_param); //is_this_action = true;

  wpbc_booking_listing_reload_button__spin_start(); // Get redefined Locale,  if action on single booking !

  if (undefined != action_param['booking_id'] && !Array.isArray(action_param['booking_id'])) {
    // Not array
    action_param['locale'] = wpbc_get_selected_locale(action_param['booking_id'], wpbc_ajx_booking_listing.get_secure_param('locale'));
  }

  var action_post_params = {
    action: 'WPBC_AJX_BOOKING_ACTIONS',
    nonce: wpbc_ajx_booking_listing.get_secure_param('nonce'),
    wpbc_ajx_user_id: undefined == action_param['user_id'] ? wpbc_ajx_booking_listing.get_secure_param('user_id') : action_param['user_id'],
    wpbc_ajx_locale: undefined == action_param['locale'] ? wpbc_ajx_booking_listing.get_secure_param('locale') : action_param['locale'],
    action_params: action_param
  }; // It's required for CSV export - getting the same list  of bookings

  if (typeof action_param.search_params !== 'undefined') {
    action_post_params['search_params'] = action_param.search_params;
    delete action_post_params.action_params.search_params;
  } // Start Ajax


  jQuery.post(wpbc_global1.wpbc_ajaxurl, action_post_params,
  /**
   * S u c c e s s
   *
   * @param response_data		-	its object returned from  Ajax - class-live-searcg.php
   * @param textStatus		-	'success'
   * @param jqXHR				-	Object
   */
  function (response_data, textStatus, jqXHR) {
    console.log(' == Ajax Actions :: Response WPBC_AJX_BOOKING_ACTIONS == ', response_data);
    console.groupEnd(); // Probably Error

    if (_typeof(response_data) !== 'object' || response_data === null) {
      jQuery('#wh_sort_selector').hide();
      jQuery(wpbc_ajx_booking_listing.get_other_param('listing_container')).html('<div class="wpbc-settings-notice notice-warning" style="text-align:left">' + response_data + '</div>');
      return;
    }

    wpbc_booking_listing_reload_button__spin_pause();
    wpbc_admin_show_message(response_data['ajx_after_action_message'].replace(/\n/g, "<br />"), '1' == response_data['ajx_after_action_result'] ? 'success' : 'error', 10000); // Success response

    if ('1' == response_data['ajx_after_action_result']) {
      var is_reload_ajax_listing = true; // After Google Calendar import show imported bookings and reload the page for toolbar parameters update

      if (false !== response_data['ajx_after_action_result_all_params_arr']['new_listing_params']) {
        wpbc_ajx_booking_send_search_request_with_params(response_data['ajx_after_action_result_all_params_arr']['new_listing_params']);
        var closed_timer = setTimeout(function () {
          if (wpbc_booking_listing_reload_button__is_spin()) {
            if (undefined != response_data['ajx_after_action_result_all_params_arr']['new_listing_params']['reload_url_params']) {
              document.location.href = response_data['ajx_after_action_result_all_params_arr']['new_listing_params']['reload_url_params'];
            } else {
              document.location.reload();
            }
          }
        }, 2000);
        is_reload_ajax_listing = false;
      } // Start download exported CSV file


      if (undefined != response_data['ajx_after_action_result_all_params_arr']['export_csv_url']) {
        wpbc_ajx_booking__export_csv_url__download(response_data['ajx_after_action_result_all_params_arr']['export_csv_url']);
        is_reload_ajax_listing = false;
      }

      if (is_reload_ajax_listing) {
        wpbc_ajx_booking__actual_listing__show(); //	Sending Ajax Request	-	with parameters that  we early  defined in "wpbc_ajx_booking_listing" Obj.
      }
    } // Remove spin icon from  button and Enable this button.


    wpbc_button__remove_spin(response_data['ajx_cleaned_params']['ui_clicked_element_id']); // Hide modals

    wpbc_popup_modals__hide();
    jQuery('#ajax_respond').html(response_data); // For ability to show response, add such DIV element to page
  }).fail(function (jqXHR, textStatus, errorThrown) {
    if (window.console && window.console.log) {
      console.log('Ajax_Error', jqXHR, textStatus, errorThrown);
    }

    jQuery('#wh_sort_selector').hide();
    var error_message = '<strong>' + 'Error!' + '</strong> ' + errorThrown;

    if (jqXHR.responseText) {
      error_message += jqXHR.responseText;
    }

    error_message = error_message.replace(/\n/g, "<br />");
    wpbc_ajx_booking_show_message(error_message);
  }) // .done(   function ( data, textStatus, jqXHR ) {   if ( window.console && window.console.log ){ console.log( 'second success', data, textStatus, jqXHR ); }    })
  // .always( function ( data_jqXHR, textStatus, jqXHR_errorThrown ) {   if ( window.console && window.console.log ){ console.log( 'always finished', data_jqXHR, textStatus, jqXHR_errorThrown ); }     })
  ; // End Ajax
}
/**
 * Hide all open modal popups windows
 */


function wpbc_popup_modals__hide() {
  // Hide modals
  if ('function' === typeof jQuery('.wpbc_popup_modal').wpbc_my_modal) {
    jQuery('.wpbc_popup_modal').wpbc_my_modal('hide');
  }
}
/**
 *   Dates  Short <-> Wide    ----------------------------------------------------------------------------------- */


function wpbc_ajx_click_on_dates_short() {
  jQuery('#booking_dates_small,.booking_dates_full').hide();
  jQuery('#booking_dates_full,.booking_dates_small').show();
  wpbc_ajx_booking_send_search_request_with_params({
    'ui_usr__dates_short_wide': 'short'
  });
}

function wpbc_ajx_click_on_dates_wide() {
  jQuery('#booking_dates_full,.booking_dates_small').hide();
  jQuery('#booking_dates_small,.booking_dates_full').show();
  wpbc_ajx_booking_send_search_request_with_params({
    'ui_usr__dates_short_wide': 'wide'
  });
}

function wpbc_ajx_click_on_dates_toggle(this_date) {
  jQuery(this_date).parents('.wpbc_col_dates').find('.booking_dates_small').toggle();
  jQuery(this_date).parents('.wpbc_col_dates').find('.booking_dates_full').toggle();
  /*
  var visible_section = jQuery( this_date ).parents( '.booking_dates_expand_section' );
  visible_section.hide();
  if ( visible_section.hasClass( 'booking_dates_full' ) ){
  	visible_section.parents( '.wpbc_col_dates' ).find( '.booking_dates_small' ).show();
  } else {
  	visible_section.parents( '.wpbc_col_dates' ).find( '.booking_dates_full' ).show();
  }*/

  console.log('wpbc_ajx_click_on_dates_toggle', this_date);
}
/**
 *   Locale   --------------------------------------------------------------------------------------------------- */

/**
 * 	Select options in select boxes based on attribute "value_of_selected_option" and RED color and hint for LOCALE button   --  It's called from 	wpbc_ajx_booking_define_ui_hooks()  	each  time after Listing loading.
 */


function wpbc_ajx_booking__ui_define__locale() {
  jQuery('.wpbc_listing_container select').each(function (index) {
    var selection = jQuery(this).attr("value_of_selected_option"); // Define selected select boxes

    if (undefined !== selection) {
      jQuery(this).find('option[value="' + selection + '"]').prop('selected', true);

      if ('' != selection && jQuery(this).hasClass('set_booking_locale_selectbox')) {
        // Locale
        var booking_locale_button = jQuery(this).parents('.ui_element_locale').find('.set_booking_locale_button'); //booking_locale_button.css( 'color', '#db4800' );		// Set button  red

        booking_locale_button.addClass('wpbc_ui_red'); // Set button  red

        if ('function' === typeof wpbc_tippy) {
          booking_locale_button.get(0)._tippy.setContent(selection);
        }
      }
    }
  });
}
/**
 *   Remark   --------------------------------------------------------------------------------------------------- */

/**
 * Define content of remark "booking note" button and textarea.  -- It's called from 	wpbc_ajx_booking_define_ui_hooks()  	each  time after Listing loading.
 */


function wpbc_ajx_booking__ui_define__remark() {
  jQuery('.wpbc_listing_container .ui_remark_section textarea').each(function (index) {
    var text_val = jQuery(this).val();

    if (undefined !== text_val && '' != text_val) {
      var remark_button = jQuery(this).parents('.ui_group').find('.set_booking_note_button');

      if (remark_button.length > 0) {
        remark_button.addClass('wpbc_ui_red'); // Set button  red

        if ('function' === typeof wpbc_tippy) {
          //remark_button.get( 0 )._tippy.allowHTML = true;
          //remark_button.get( 0 )._tippy.setContent( text_val.replace(/[\n\r]/g, '<br>') );
          remark_button.get(0)._tippy.setProps({
            allowHTML: true,
            content: text_val.replace(/[\n\r]/g, '<br>')
          });
        }
      }
    }
  });
}
/**
 * Actions ,when we click on "Remark" button.
 *
 * @param jq_button  -	this jQuery button  object
 */


function wpbc_ajx_booking__ui_click__remark(jq_button) {
  jq_button.parents('.ui_group').find('.ui_remark_section').toggle();
}
/**
 *   Change booking resource   ---------------------------------------------------------------------------------- */


function wpbc_ajx_booking__ui_click_show__change_resource(booking_id, resource_id) {
  // Define ID of booking to hidden input
  jQuery('#change_booking_resource__booking_id').val(booking_id); // Select booking resource  that belong to  booking

  jQuery('#change_booking_resource__resource_select').val(resource_id).trigger('change');
  var cbr; // Get Resource section

  cbr = jQuery("#change_booking_resource__section").detach(); // Append it to booking ROW

  cbr.appendTo(jQuery("#ui__change_booking_resource__section_in_booking_" + booking_id));
  cbr = null; // Hide sections of "Change booking resource" in all other bookings ROWs
  //jQuery( ".ui__change_booking_resource__section_in_booking" ).hide();

  if (!jQuery("#ui__change_booking_resource__section_in_booking_" + booking_id).is(':visible')) {
    jQuery(".ui__under_actions_row__section_in_booking").hide();
  } // Show only "change booking resource" section  for current booking


  jQuery("#ui__change_booking_resource__section_in_booking_" + booking_id).toggle();
}

function wpbc_ajx_booking__ui_click_save__change_resource(this_el, booking_action, el_id) {
  wpbc_ajx_booking_ajax_action_request({
    'booking_action': booking_action,
    'booking_id': jQuery('#change_booking_resource__booking_id').val(),
    'selected_resource_id': jQuery('#change_booking_resource__resource_select').val(),
    'ui_clicked_element_id': el_id
  });
  wpbc_button_enable_loading_icon(this_el); // wpbc_ajx_booking__ui_click_close__change_resource();
}

function wpbc_ajx_booking__ui_click_close__change_resource() {
  var cbrce; // Get Resource section

  cbrce = jQuery("#change_booking_resource__section").detach(); // Append it to hidden HTML template section  at  the bottom  of the page

  cbrce.appendTo(jQuery("#wpbc_hidden_template__change_booking_resource"));
  cbrce = null; // Hide all change booking resources sections

  jQuery(".ui__change_booking_resource__section_in_booking").hide();
}
/**
 *   Duplicate booking in other resource   ---------------------------------------------------------------------- */


function wpbc_ajx_booking__ui_click_show__duplicate_booking(booking_id, resource_id) {
  // Define ID of booking to hidden input
  jQuery('#duplicate_booking_to_other_resource__booking_id').val(booking_id); // Select booking resource  that belong to  booking

  jQuery('#duplicate_booking_to_other_resource__resource_select').val(resource_id).trigger('change');
  var cbr; // Get Resource section

  cbr = jQuery("#duplicate_booking_to_other_resource__section").detach(); // Append it to booking ROW

  cbr.appendTo(jQuery("#ui__duplicate_booking_to_other_resource__section_in_booking_" + booking_id));
  cbr = null; // Hide sections of "Duplicate booking" in all other bookings ROWs

  if (!jQuery("#ui__duplicate_booking_to_other_resource__section_in_booking_" + booking_id).is(':visible')) {
    jQuery(".ui__under_actions_row__section_in_booking").hide();
  } // Show only "Duplicate booking" section  for current booking ROW


  jQuery("#ui__duplicate_booking_to_other_resource__section_in_booking_" + booking_id).toggle();
}

function wpbc_ajx_booking__ui_click_save__duplicate_booking(this_el, booking_action, el_id) {
  wpbc_ajx_booking_ajax_action_request({
    'booking_action': booking_action,
    'booking_id': jQuery('#duplicate_booking_to_other_resource__booking_id').val(),
    'selected_resource_id': jQuery('#duplicate_booking_to_other_resource__resource_select').val(),
    'ui_clicked_element_id': el_id
  });
  wpbc_button_enable_loading_icon(this_el); // wpbc_ajx_booking__ui_click_close__change_resource();
}

function wpbc_ajx_booking__ui_click_close__duplicate_booking() {
  var cbrce; // Get Resource section

  cbrce = jQuery("#duplicate_booking_to_other_resource__section").detach(); // Append it to hidden HTML template section  at  the bottom  of the page

  cbrce.appendTo(jQuery("#wpbc_hidden_template__duplicate_booking_to_other_resource"));
  cbrce = null; // Hide all change booking resources sections

  jQuery(".ui__duplicate_booking_to_other_resource__section_in_booking").hide();
}
/**
 *   Change payment status   ------------------------------------------------------------------------------------ */


function wpbc_ajx_booking__ui_click_show__set_payment_status(booking_id) {
  var jSelect = jQuery('#ui__set_payment_status__section_in_booking_' + booking_id).find('select');
  var selected_pay_status = jSelect.attr("ajx-selected-value"); // Is it float - then  it's unknown

  if (!isNaN(parseFloat(selected_pay_status))) {
    jSelect.find('option[value="1"]').prop('selected', true); // Unknown  value is '1' in select box
  } else {
    jSelect.find('option[value="' + selected_pay_status + '"]').prop('selected', true); // Otherwise known payment status
  } // Hide sections of "Change booking resource" in all other bookings ROWs


  if (!jQuery("#ui__set_payment_status__section_in_booking_" + booking_id).is(':visible')) {
    jQuery(".ui__under_actions_row__section_in_booking").hide();
  } // Show only "change booking resource" section  for current booking


  jQuery("#ui__set_payment_status__section_in_booking_" + booking_id).toggle();
}

function wpbc_ajx_booking__ui_click_save__set_payment_status(booking_id, this_el, booking_action, el_id) {
  wpbc_ajx_booking_ajax_action_request({
    'booking_action': booking_action,
    'booking_id': booking_id,
    'selected_payment_status': jQuery('#ui_btn_set_payment_status' + booking_id).val(),
    'ui_clicked_element_id': el_id + '_save'
  });
  wpbc_button_enable_loading_icon(this_el);
  jQuery('#' + el_id + '_cancel').hide(); //wpbc_button_enable_loading_icon( jQuery( '#' + el_id + '_cancel').get(0) );
}

function wpbc_ajx_booking__ui_click_close__set_payment_status() {
  // Hide all change  payment status for booking
  jQuery(".ui__set_payment_status__section_in_booking").hide();
}
/**
 *   Change booking cost   -------------------------------------------------------------------------------------- */


function wpbc_ajx_booking__ui_click_save__set_booking_cost(booking_id, this_el, booking_action, el_id) {
  wpbc_ajx_booking_ajax_action_request({
    'booking_action': booking_action,
    'booking_id': booking_id,
    'booking_cost': jQuery('#ui_btn_set_booking_cost' + booking_id + '_cost').val(),
    'ui_clicked_element_id': el_id + '_save'
  });
  wpbc_button_enable_loading_icon(this_el);
  jQuery('#' + el_id + '_cancel').hide(); //wpbc_button_enable_loading_icon( jQuery( '#' + el_id + '_cancel').get(0) );
}

function wpbc_ajx_booking__ui_click_close__set_booking_cost() {
  // Hide all change  payment status for booking
  jQuery(".ui__set_booking_cost__section_in_booking").hide();
}
/**
 *   Send Payment request   -------------------------------------------------------------------------------------- */


function wpbc_ajx_booking__ui_click__send_payment_request() {
  wpbc_ajx_booking_ajax_action_request({
    'booking_action': 'send_payment_request',
    'booking_id': jQuery('#wpbc_modal__payment_request__booking_id').val(),
    'reason_of_action': jQuery('#wpbc_modal__payment_request__reason_of_action').val(),
    'ui_clicked_element_id': 'wpbc_modal__payment_request__button_send'
  });
  wpbc_button_enable_loading_icon(jQuery('#wpbc_modal__payment_request__button_send').get(0));
}
/**
 *   Import Google Calendar  ------------------------------------------------------------------------------------ */


function wpbc_ajx_booking__ui_click__import_google_calendar() {
  wpbc_ajx_booking_ajax_action_request({
    'booking_action': 'import_google_calendar',
    'ui_clicked_element_id': 'wpbc_modal__import_google_calendar__button_send',
    'booking_gcal_events_from': jQuery('#wpbc_modal__import_google_calendar__section #booking_gcal_events_from option:selected').val(),
    'booking_gcal_events_from_offset': jQuery('#wpbc_modal__import_google_calendar__section #booking_gcal_events_from_offset').val(),
    'booking_gcal_events_from_offset_type': jQuery('#wpbc_modal__import_google_calendar__section #booking_gcal_events_from_offset_type option:selected').val(),
    'booking_gcal_events_until': jQuery('#wpbc_modal__import_google_calendar__section #booking_gcal_events_until option:selected').val(),
    'booking_gcal_events_until_offset': jQuery('#wpbc_modal__import_google_calendar__section #booking_gcal_events_until_offset').val(),
    'booking_gcal_events_until_offset_type': jQuery('#wpbc_modal__import_google_calendar__section #booking_gcal_events_until_offset_type option:selected').val(),
    'booking_gcal_events_max': jQuery('#wpbc_modal__import_google_calendar__section #booking_gcal_events_max').val(),
    'booking_gcal_resource': jQuery('#wpbc_modal__import_google_calendar__section #wpbc_booking_resource option:selected').val()
  });
  wpbc_button_enable_loading_icon(jQuery('#wpbc_modal__import_google_calendar__section #wpbc_modal__import_google_calendar__button_send').get(0));
}
/**
 *   Export bookings to CSV  ------------------------------------------------------------------------------------ */


function wpbc_ajx_booking__ui_click__export_csv(params) {
  var selected_booking_id_arr = wpbc_get_selected_row_id();
  wpbc_ajx_booking_ajax_action_request({
    'booking_action': params['booking_action'],
    'ui_clicked_element_id': params['ui_clicked_element_id'],
    'export_type': params['export_type'],
    'csv_export_separator': params['csv_export_separator'],
    'csv_export_skip_fields': params['csv_export_skip_fields'],
    'booking_id': selected_booking_id_arr.join(','),
    'search_params': wpbc_ajx_booking_listing.search_get_all_params()
  });
  var this_el = jQuery('#' + params['ui_clicked_element_id']).get(0);
  wpbc_button_enable_loading_icon(this_el);
}
/**
 * Open URL in new tab - mainly  it's used for open CSV link  for downloaded exported bookings as CSV
 *
 * @param export_csv_url
 */


function wpbc_ajx_booking__export_csv_url__download(export_csv_url) {
  //var selected_booking_id_arr = wpbc_get_selected_row_id();
  document.location.href = export_csv_url; // + '&selected_id=' + selected_booking_id_arr.join(',');
  // It's open additional dialog for asking opening ulr in new tab
  // window.open( export_csv_url, '_blank').focus();
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluY2x1ZGVzL3BhZ2UtYm9va2luZ3MvX3NyYy9ib29raW5nc19fYWN0aW9ucy5qcyJdLCJuYW1lcyI6WyJ3cGJjX2FqeF9ib29raW5nX2FqYXhfYWN0aW9uX3JlcXVlc3QiLCJhY3Rpb25fcGFyYW0iLCJjb25zb2xlIiwiZ3JvdXBDb2xsYXBzZWQiLCJsb2ciLCJ3cGJjX2Jvb2tpbmdfbGlzdGluZ19yZWxvYWRfYnV0dG9uX19zcGluX3N0YXJ0IiwidW5kZWZpbmVkIiwiQXJyYXkiLCJpc0FycmF5Iiwid3BiY19nZXRfc2VsZWN0ZWRfbG9jYWxlIiwid3BiY19hanhfYm9va2luZ19saXN0aW5nIiwiZ2V0X3NlY3VyZV9wYXJhbSIsImFjdGlvbl9wb3N0X3BhcmFtcyIsImFjdGlvbiIsIm5vbmNlIiwid3BiY19hanhfdXNlcl9pZCIsIndwYmNfYWp4X2xvY2FsZSIsImFjdGlvbl9wYXJhbXMiLCJzZWFyY2hfcGFyYW1zIiwialF1ZXJ5IiwicG9zdCIsIndwYmNfZ2xvYmFsMSIsIndwYmNfYWpheHVybCIsInJlc3BvbnNlX2RhdGEiLCJ0ZXh0U3RhdHVzIiwianFYSFIiLCJncm91cEVuZCIsImhpZGUiLCJnZXRfb3RoZXJfcGFyYW0iLCJodG1sIiwid3BiY19ib29raW5nX2xpc3RpbmdfcmVsb2FkX2J1dHRvbl9fc3Bpbl9wYXVzZSIsIndwYmNfYWRtaW5fc2hvd19tZXNzYWdlIiwicmVwbGFjZSIsImlzX3JlbG9hZF9hamF4X2xpc3RpbmciLCJ3cGJjX2FqeF9ib29raW5nX3NlbmRfc2VhcmNoX3JlcXVlc3Rfd2l0aF9wYXJhbXMiLCJjbG9zZWRfdGltZXIiLCJzZXRUaW1lb3V0Iiwid3BiY19ib29raW5nX2xpc3RpbmdfcmVsb2FkX2J1dHRvbl9faXNfc3BpbiIsImRvY3VtZW50IiwibG9jYXRpb24iLCJocmVmIiwicmVsb2FkIiwid3BiY19hanhfYm9va2luZ19fZXhwb3J0X2Nzdl91cmxfX2Rvd25sb2FkIiwid3BiY19hanhfYm9va2luZ19fYWN0dWFsX2xpc3RpbmdfX3Nob3ciLCJ3cGJjX2J1dHRvbl9fcmVtb3ZlX3NwaW4iLCJ3cGJjX3BvcHVwX21vZGFsc19faGlkZSIsImZhaWwiLCJlcnJvclRocm93biIsIndpbmRvdyIsImVycm9yX21lc3NhZ2UiLCJyZXNwb25zZVRleHQiLCJ3cGJjX2FqeF9ib29raW5nX3Nob3dfbWVzc2FnZSIsIndwYmNfbXlfbW9kYWwiLCJ3cGJjX2FqeF9jbGlja19vbl9kYXRlc19zaG9ydCIsInNob3ciLCJ3cGJjX2FqeF9jbGlja19vbl9kYXRlc193aWRlIiwid3BiY19hanhfY2xpY2tfb25fZGF0ZXNfdG9nZ2xlIiwidGhpc19kYXRlIiwicGFyZW50cyIsImZpbmQiLCJ0b2dnbGUiLCJ3cGJjX2FqeF9ib29raW5nX191aV9kZWZpbmVfX2xvY2FsZSIsImVhY2giLCJpbmRleCIsInNlbGVjdGlvbiIsImF0dHIiLCJwcm9wIiwiaGFzQ2xhc3MiLCJib29raW5nX2xvY2FsZV9idXR0b24iLCJhZGRDbGFzcyIsIndwYmNfdGlwcHkiLCJnZXQiLCJfdGlwcHkiLCJzZXRDb250ZW50Iiwid3BiY19hanhfYm9va2luZ19fdWlfZGVmaW5lX19yZW1hcmsiLCJ0ZXh0X3ZhbCIsInZhbCIsInJlbWFya19idXR0b24iLCJsZW5ndGgiLCJzZXRQcm9wcyIsImFsbG93SFRNTCIsImNvbnRlbnQiLCJ3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19fcmVtYXJrIiwianFfYnV0dG9uIiwid3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfc2hvd19fY2hhbmdlX3Jlc291cmNlIiwiYm9va2luZ19pZCIsInJlc291cmNlX2lkIiwidHJpZ2dlciIsImNiciIsImRldGFjaCIsImFwcGVuZFRvIiwiaXMiLCJ3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19zYXZlX19jaGFuZ2VfcmVzb3VyY2UiLCJ0aGlzX2VsIiwiYm9va2luZ19hY3Rpb24iLCJlbF9pZCIsIndwYmNfYnV0dG9uX2VuYWJsZV9sb2FkaW5nX2ljb24iLCJ3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19jbG9zZV9fY2hhbmdlX3Jlc291cmNlIiwiY2JyY2UiLCJ3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19zaG93X19kdXBsaWNhdGVfYm9va2luZyIsIndwYmNfYWp4X2Jvb2tpbmdfX3VpX2NsaWNrX3NhdmVfX2R1cGxpY2F0ZV9ib29raW5nIiwid3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfY2xvc2VfX2R1cGxpY2F0ZV9ib29raW5nIiwid3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfc2hvd19fc2V0X3BheW1lbnRfc3RhdHVzIiwialNlbGVjdCIsInNlbGVjdGVkX3BheV9zdGF0dXMiLCJpc05hTiIsInBhcnNlRmxvYXQiLCJ3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19zYXZlX19zZXRfcGF5bWVudF9zdGF0dXMiLCJ3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19jbG9zZV9fc2V0X3BheW1lbnRfc3RhdHVzIiwid3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfc2F2ZV9fc2V0X2Jvb2tpbmdfY29zdCIsIndwYmNfYWp4X2Jvb2tpbmdfX3VpX2NsaWNrX2Nsb3NlX19zZXRfYm9va2luZ19jb3N0Iiwid3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfX3NlbmRfcGF5bWVudF9yZXF1ZXN0Iiwid3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfX2ltcG9ydF9nb29nbGVfY2FsZW5kYXIiLCJ3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19fZXhwb3J0X2NzdiIsInBhcmFtcyIsInNlbGVjdGVkX2Jvb2tpbmdfaWRfYXJyIiwid3BiY19nZXRfc2VsZWN0ZWRfcm93X2lkIiwiam9pbiIsInNlYXJjaF9nZXRfYWxsX3BhcmFtcyIsImV4cG9ydF9jc3ZfdXJsIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUVBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBQ0EsU0FBU0Esb0NBQVQsR0FBa0U7QUFBQSxNQUFuQkMsWUFBbUIsdUVBQUosRUFBSTtBQUVs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RSxNQUFNLENBQUUsK0ZBQUYsQ0FBTixDQUEwR29ELEdBQTFHLENBQStHLENBQS9HLENBQUYsQ0FBL0I7QUFDQTtBQUdEO0FBQ0E7OztBQUNBLFNBQVMwQyxzQ0FBVCxDQUFpREMsTUFBakQsRUFBeUQ7QUFFeEQsTUFBSUMsdUJBQXVCLEdBQUdDLHdCQUF3QixFQUF0RDtBQUVBcEgsRUFBQUEsb0NBQW9DLENBQUU7QUFDNUIsc0JBQTBCa0gsTUFBTSxDQUFFLGdCQUFGLENBREo7QUFFNUIsNkJBQTBCQSxNQUFNLENBQUUsdUJBQUYsQ0FGSjtBQUk1QixtQkFBMEJBLE1BQU0sQ0FBRSxhQUFGLENBSko7QUFLNUIsNEJBQTBCQSxNQUFNLENBQUUsc0JBQUYsQ0FMSjtBQU01Qiw4QkFBMEJBLE1BQU0sQ0FBRSx3QkFBRixDQU5KO0FBUTVCLGtCQUFlQyx1QkFBdUIsQ0FBQ0UsSUFBeEIsQ0FBNkIsR0FBN0IsQ0FSYTtBQVM1QixxQkFBa0IzRyx3QkFBd0IsQ0FBQzRHLHFCQUF6QjtBQVRVLEdBQUYsQ0FBcEM7QUFZQSxNQUFJekIsT0FBTyxHQUFHMUUsTUFBTSxDQUFFLE1BQU0rRixNQUFNLENBQUUsdUJBQUYsQ0FBZCxDQUFOLENBQWtEM0MsR0FBbEQsQ0FBdUQsQ0FBdkQsQ0FBZDtBQUVBeUIsRUFBQUEsK0JBQStCLENBQUVILE9BQUYsQ0FBL0I7QUFDQTtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNBLFNBQVNuRCwwQ0FBVCxDQUFxRDZFLGNBQXJELEVBQXFFO0FBRXBFO0FBRUFqRixFQUFBQSxRQUFRLENBQUNDLFFBQVQsQ0FBa0JDLElBQWxCLEdBQXlCK0UsY0FBekIsQ0FKb0UsQ0FJNUI7QUFFeEM7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogICBBamF4ICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuLy92YXIgaXNfdGhpc19hY3Rpb24gPSBmYWxzZTtcclxuLyoqXHJcbiAqIFNlbmQgQWpheCBhY3Rpb24gcmVxdWVzdCwgIGxpa2UgYXBwcm92aW5nIG9yIGNhbmNlbGxhdGlvblxyXG4gKlxyXG4gKiBAcGFyYW0gYWN0aW9uX3BhcmFtXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX2FqYXhfYWN0aW9uX3JlcXVlc3QoIGFjdGlvbl9wYXJhbSA9IHt9ICl7XHJcblxyXG5jb25zb2xlLmdyb3VwQ29sbGFwc2VkKCAnV1BCQ19BSlhfQk9PS0lOR19BQ1RJT05TJyApOyBjb25zb2xlLmxvZyggJyA9PSBBamF4IEFjdGlvbnMgOjogUGFyYW1zID09ICcsIGFjdGlvbl9wYXJhbSApO1xyXG4vL2lzX3RoaXNfYWN0aW9uID0gdHJ1ZTtcclxuXHJcblx0d3BiY19ib29raW5nX2xpc3RpbmdfcmVsb2FkX2J1dHRvbl9fc3Bpbl9zdGFydCgpO1xyXG5cclxuXHQvLyBHZXQgcmVkZWZpbmVkIExvY2FsZSwgIGlmIGFjdGlvbiBvbiBzaW5nbGUgYm9va2luZyAhXHJcblx0aWYgKCAgKCB1bmRlZmluZWQgIT0gYWN0aW9uX3BhcmFtWyAnYm9va2luZ19pZCcgXSApICYmICggISBBcnJheS5pc0FycmF5KCBhY3Rpb25fcGFyYW1bICdib29raW5nX2lkJyBdICkgKSApe1x0XHRcdFx0Ly8gTm90IGFycmF5XHJcblxyXG5cdFx0YWN0aW9uX3BhcmFtWyAnbG9jYWxlJyBdID0gd3BiY19nZXRfc2VsZWN0ZWRfbG9jYWxlKCBhY3Rpb25fcGFyYW1bICdib29raW5nX2lkJyBdLCB3cGJjX2FqeF9ib29raW5nX2xpc3RpbmcuZ2V0X3NlY3VyZV9wYXJhbSggJ2xvY2FsZScgKSApO1xyXG5cdH1cclxuXHJcblx0dmFyIGFjdGlvbl9wb3N0X3BhcmFtcyA9IHtcclxuXHRcdFx0XHRcdFx0XHRcdGFjdGlvbiAgICAgICAgICA6ICdXUEJDX0FKWF9CT09LSU5HX0FDVElPTlMnLFxyXG5cdFx0XHRcdFx0XHRcdFx0bm9uY2UgICAgICAgICAgIDogd3BiY19hanhfYm9va2luZ19saXN0aW5nLmdldF9zZWN1cmVfcGFyYW0oICdub25jZScgKSxcclxuXHRcdFx0XHRcdFx0XHRcdHdwYmNfYWp4X3VzZXJfaWQ6ICggKCB1bmRlZmluZWQgPT0gYWN0aW9uX3BhcmFtWyAndXNlcl9pZCcgXSApID8gd3BiY19hanhfYm9va2luZ19saXN0aW5nLmdldF9zZWN1cmVfcGFyYW0oICd1c2VyX2lkJyApIDogYWN0aW9uX3BhcmFtWyAndXNlcl9pZCcgXSApLFxyXG5cdFx0XHRcdFx0XHRcdFx0d3BiY19hanhfbG9jYWxlOiAgKCAoIHVuZGVmaW5lZCA9PSBhY3Rpb25fcGFyYW1bICdsb2NhbGUnIF0gKSAgPyB3cGJjX2FqeF9ib29raW5nX2xpc3RpbmcuZ2V0X3NlY3VyZV9wYXJhbSggJ2xvY2FsZScgKSAgOiBhY3Rpb25fcGFyYW1bICdsb2NhbGUnIF0gKSxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRhY3Rpb25fcGFyYW1zXHQ6IGFjdGlvbl9wYXJhbVxyXG5cdFx0XHRcdFx0XHRcdH07XHJcblxyXG5cdC8vIEl0J3MgcmVxdWlyZWQgZm9yIENTViBleHBvcnQgLSBnZXR0aW5nIHRoZSBzYW1lIGxpc3QgIG9mIGJvb2tpbmdzXHJcblx0aWYgKCB0eXBlb2YgYWN0aW9uX3BhcmFtLnNlYXJjaF9wYXJhbXMgIT09ICd1bmRlZmluZWQnICl7XHJcblx0XHRhY3Rpb25fcG9zdF9wYXJhbXNbICdzZWFyY2hfcGFyYW1zJyBdID0gYWN0aW9uX3BhcmFtLnNlYXJjaF9wYXJhbXM7XHJcblx0XHRkZWxldGUgYWN0aW9uX3Bvc3RfcGFyYW1zLmFjdGlvbl9wYXJhbXMuc2VhcmNoX3BhcmFtcztcclxuXHR9XHJcblxyXG5cdC8vIFN0YXJ0IEFqYXhcclxuXHRqUXVlcnkucG9zdCggd3BiY19nbG9iYWwxLndwYmNfYWpheHVybCAsXHJcblxyXG5cdFx0XHRcdGFjdGlvbl9wb3N0X3BhcmFtcyAsXHJcblxyXG5cdFx0XHRcdC8qKlxyXG5cdFx0XHRcdCAqIFMgdSBjIGMgZSBzIHNcclxuXHRcdFx0XHQgKlxyXG5cdFx0XHRcdCAqIEBwYXJhbSByZXNwb25zZV9kYXRhXHRcdC1cdGl0cyBvYmplY3QgcmV0dXJuZWQgZnJvbSAgQWpheCAtIGNsYXNzLWxpdmUtc2VhcmNnLnBocFxyXG5cdFx0XHRcdCAqIEBwYXJhbSB0ZXh0U3RhdHVzXHRcdC1cdCdzdWNjZXNzJ1xyXG5cdFx0XHRcdCAqIEBwYXJhbSBqcVhIUlx0XHRcdFx0LVx0T2JqZWN0XHJcblx0XHRcdFx0ICovXHJcblx0XHRcdFx0ZnVuY3Rpb24gKCByZXNwb25zZV9kYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUiApIHtcclxuXHJcbmNvbnNvbGUubG9nKCAnID09IEFqYXggQWN0aW9ucyA6OiBSZXNwb25zZSBXUEJDX0FKWF9CT09LSU5HX0FDVElPTlMgPT0gJywgcmVzcG9uc2VfZGF0YSApOyBjb25zb2xlLmdyb3VwRW5kKCk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gUHJvYmFibHkgRXJyb3JcclxuXHRcdFx0XHRcdGlmICggKHR5cGVvZiByZXNwb25zZV9kYXRhICE9PSAnb2JqZWN0JykgfHwgKHJlc3BvbnNlX2RhdGEgPT09IG51bGwpICl7XHJcblx0XHRcdFx0XHRcdGpRdWVyeSggJyN3aF9zb3J0X3NlbGVjdG9yJyApLmhpZGUoKTtcclxuXHRcdFx0XHRcdFx0alF1ZXJ5KCB3cGJjX2FqeF9ib29raW5nX2xpc3RpbmcuZ2V0X290aGVyX3BhcmFtKCAnbGlzdGluZ19jb250YWluZXInICkgKS5odG1sKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJ3cGJjLXNldHRpbmdzLW5vdGljZSBub3RpY2Utd2FybmluZ1wiIHN0eWxlPVwidGV4dC1hbGlnbjpsZWZ0XCI+JyArXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlc3BvbnNlX2RhdGEgK1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzwvZGl2PidcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHdwYmNfYm9va2luZ19saXN0aW5nX3JlbG9hZF9idXR0b25fX3NwaW5fcGF1c2UoKTtcclxuXHJcblx0XHRcdFx0XHR3cGJjX2FkbWluX3Nob3dfbWVzc2FnZShcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICByZXNwb25zZV9kYXRhWyAnYWp4X2FmdGVyX2FjdGlvbl9tZXNzYWdlJyBdLnJlcGxhY2UoIC9cXG4vZywgXCI8YnIgLz5cIiApXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCwgKCAnMScgPT0gcmVzcG9uc2VfZGF0YVsgJ2FqeF9hZnRlcl9hY3Rpb25fcmVzdWx0JyBdICkgPyAnc3VjY2VzcycgOiAnZXJyb3InXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCwgMTAwMDBcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gU3VjY2VzcyByZXNwb25zZVxyXG5cdFx0XHRcdFx0aWYgKCAnMScgPT0gcmVzcG9uc2VfZGF0YVsgJ2FqeF9hZnRlcl9hY3Rpb25fcmVzdWx0JyBdICl7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgaXNfcmVsb2FkX2FqYXhfbGlzdGluZyA9IHRydWU7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBBZnRlciBHb29nbGUgQ2FsZW5kYXIgaW1wb3J0IHNob3cgaW1wb3J0ZWQgYm9va2luZ3MgYW5kIHJlbG9hZCB0aGUgcGFnZSBmb3IgdG9vbGJhciBwYXJhbWV0ZXJzIHVwZGF0ZVxyXG5cdFx0XHRcdFx0XHRpZiAoIGZhbHNlICE9PSByZXNwb25zZV9kYXRhWyAnYWp4X2FmdGVyX2FjdGlvbl9yZXN1bHRfYWxsX3BhcmFtc19hcnInIF1bICduZXdfbGlzdGluZ19wYXJhbXMnIF0gKXtcclxuXHJcblx0XHRcdFx0XHRcdFx0d3BiY19hanhfYm9va2luZ19zZW5kX3NlYXJjaF9yZXF1ZXN0X3dpdGhfcGFyYW1zKCByZXNwb25zZV9kYXRhWyAnYWp4X2FmdGVyX2FjdGlvbl9yZXN1bHRfYWxsX3BhcmFtc19hcnInIF1bICduZXdfbGlzdGluZ19wYXJhbXMnIF0gKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0dmFyIGNsb3NlZF90aW1lciA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpe1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCB3cGJjX2Jvb2tpbmdfbGlzdGluZ19yZWxvYWRfYnV0dG9uX19pc19zcGluKCkgKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoIHVuZGVmaW5lZCAhPSByZXNwb25zZV9kYXRhWyAnYWp4X2FmdGVyX2FjdGlvbl9yZXN1bHRfYWxsX3BhcmFtc19hcnInIF1bICduZXdfbGlzdGluZ19wYXJhbXMnIF1bICdyZWxvYWRfdXJsX3BhcmFtcycgXSApe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZiA9IHJlc3BvbnNlX2RhdGFbICdhanhfYWZ0ZXJfYWN0aW9uX3Jlc3VsdF9hbGxfcGFyYW1zX2FycicgXVsgJ25ld19saXN0aW5nX3BhcmFtcycgXVsgJ3JlbG9hZF91cmxfcGFyYW1zJyBdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0LCAyMDAwICk7XHJcblx0XHRcdFx0XHRcdFx0aXNfcmVsb2FkX2FqYXhfbGlzdGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBTdGFydCBkb3dubG9hZCBleHBvcnRlZCBDU1YgZmlsZVxyXG5cdFx0XHRcdFx0XHRpZiAoIHVuZGVmaW5lZCAhPSByZXNwb25zZV9kYXRhWyAnYWp4X2FmdGVyX2FjdGlvbl9yZXN1bHRfYWxsX3BhcmFtc19hcnInIF1bICdleHBvcnRfY3N2X3VybCcgXSApe1xyXG5cdFx0XHRcdFx0XHRcdHdwYmNfYWp4X2Jvb2tpbmdfX2V4cG9ydF9jc3ZfdXJsX19kb3dubG9hZCggcmVzcG9uc2VfZGF0YVsgJ2FqeF9hZnRlcl9hY3Rpb25fcmVzdWx0X2FsbF9wYXJhbXNfYXJyJyBdWyAnZXhwb3J0X2Nzdl91cmwnIF0gKTtcclxuXHRcdFx0XHRcdFx0XHRpc19yZWxvYWRfYWpheF9saXN0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmICggaXNfcmVsb2FkX2FqYXhfbGlzdGluZyApe1xyXG5cdFx0XHRcdFx0XHRcdHdwYmNfYWp4X2Jvb2tpbmdfX2FjdHVhbF9saXN0aW5nX19zaG93KCk7XHQvL1x0U2VuZGluZyBBamF4IFJlcXVlc3RcdC1cdHdpdGggcGFyYW1ldGVycyB0aGF0ICB3ZSBlYXJseSAgZGVmaW5lZCBpbiBcIndwYmNfYWp4X2Jvb2tpbmdfbGlzdGluZ1wiIE9iai5cclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBSZW1vdmUgc3BpbiBpY29uIGZyb20gIGJ1dHRvbiBhbmQgRW5hYmxlIHRoaXMgYnV0dG9uLlxyXG5cdFx0XHRcdFx0d3BiY19idXR0b25fX3JlbW92ZV9zcGluKCByZXNwb25zZV9kYXRhWyAnYWp4X2NsZWFuZWRfcGFyYW1zJyBdWyAndWlfY2xpY2tlZF9lbGVtZW50X2lkJyBdIClcclxuXHJcblx0XHRcdFx0XHQvLyBIaWRlIG1vZGFsc1xyXG5cdFx0XHRcdFx0d3BiY19wb3B1cF9tb2RhbHNfX2hpZGUoKTtcclxuXHJcblx0XHRcdFx0XHRqUXVlcnkoICcjYWpheF9yZXNwb25kJyApLmh0bWwoIHJlc3BvbnNlX2RhdGEgKTtcdFx0Ly8gRm9yIGFiaWxpdHkgdG8gc2hvdyByZXNwb25zZSwgYWRkIHN1Y2ggRElWIGVsZW1lbnQgdG8gcGFnZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0ICApLmZhaWwoIGZ1bmN0aW9uICgganFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duICkgeyAgICBpZiAoIHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLmxvZyApeyBjb25zb2xlLmxvZyggJ0FqYXhfRXJyb3InLCBqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24gKTsgfVxyXG5cdFx0XHRcdFx0alF1ZXJ5KCAnI3doX3NvcnRfc2VsZWN0b3InICkuaGlkZSgpO1xyXG5cdFx0XHRcdFx0dmFyIGVycm9yX21lc3NhZ2UgPSAnPHN0cm9uZz4nICsgJ0Vycm9yIScgKyAnPC9zdHJvbmc+ICcgKyBlcnJvclRocm93biA7XHJcblx0XHRcdFx0XHRpZiAoIGpxWEhSLnJlc3BvbnNlVGV4dCApe1xyXG5cdFx0XHRcdFx0XHRlcnJvcl9tZXNzYWdlICs9IGpxWEhSLnJlc3BvbnNlVGV4dDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVycm9yX21lc3NhZ2UgPSBlcnJvcl9tZXNzYWdlLnJlcGxhY2UoIC9cXG4vZywgXCI8YnIgLz5cIiApO1xyXG5cclxuXHRcdFx0XHRcdHdwYmNfYWp4X2Jvb2tpbmdfc2hvd19tZXNzYWdlKCBlcnJvcl9tZXNzYWdlICk7XHJcblx0XHRcdCAgfSlcclxuXHQgICAgICAgICAgLy8gLmRvbmUoICAgZnVuY3Rpb24gKCBkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUiApIHsgICBpZiAoIHdpbmRvdy5jb25zb2xlICYmIHdpbmRvdy5jb25zb2xlLmxvZyApeyBjb25zb2xlLmxvZyggJ3NlY29uZCBzdWNjZXNzJywgZGF0YSwgdGV4dFN0YXR1cywganFYSFIgKTsgfSAgICB9KVxyXG5cdFx0XHQgIC8vIC5hbHdheXMoIGZ1bmN0aW9uICggZGF0YV9qcVhIUiwgdGV4dFN0YXR1cywganFYSFJfZXJyb3JUaHJvd24gKSB7ICAgaWYgKCB3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cuY29uc29sZS5sb2cgKXsgY29uc29sZS5sb2coICdhbHdheXMgZmluaXNoZWQnLCBkYXRhX2pxWEhSLCB0ZXh0U3RhdHVzLCBqcVhIUl9lcnJvclRocm93biApOyB9ICAgICB9KVxyXG5cdFx0XHQgIDsgIC8vIEVuZCBBamF4XHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIEhpZGUgYWxsIG9wZW4gbW9kYWwgcG9wdXBzIHdpbmRvd3NcclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfcG9wdXBfbW9kYWxzX19oaWRlKCl7XHJcblxyXG5cdC8vIEhpZGUgbW9kYWxzXHJcblx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgKGpRdWVyeSggJy53cGJjX3BvcHVwX21vZGFsJyApLndwYmNfbXlfbW9kYWwpICl7XHJcblx0XHRqUXVlcnkoICcud3BiY19wb3B1cF9tb2RhbCcgKS53cGJjX215X21vZGFsKCAnaGlkZScgKTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogICBEYXRlcyAgU2hvcnQgPC0+IFdpZGUgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2NsaWNrX29uX2RhdGVzX3Nob3J0KCl7XHJcblx0alF1ZXJ5KCAnI2Jvb2tpbmdfZGF0ZXNfc21hbGwsLmJvb2tpbmdfZGF0ZXNfZnVsbCcgKS5oaWRlKCk7XHJcblx0alF1ZXJ5KCAnI2Jvb2tpbmdfZGF0ZXNfZnVsbCwuYm9va2luZ19kYXRlc19zbWFsbCcgKS5zaG93KCk7XHJcblx0d3BiY19hanhfYm9va2luZ19zZW5kX3NlYXJjaF9yZXF1ZXN0X3dpdGhfcGFyYW1zKCB7J3VpX3Vzcl9fZGF0ZXNfc2hvcnRfd2lkZSc6ICdzaG9ydCd9ICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2NsaWNrX29uX2RhdGVzX3dpZGUoKXtcclxuXHRqUXVlcnkoICcjYm9va2luZ19kYXRlc19mdWxsLC5ib29raW5nX2RhdGVzX3NtYWxsJyApLmhpZGUoKTtcclxuXHRqUXVlcnkoICcjYm9va2luZ19kYXRlc19zbWFsbCwuYm9va2luZ19kYXRlc19mdWxsJyApLnNob3coKTtcclxuXHR3cGJjX2FqeF9ib29raW5nX3NlbmRfc2VhcmNoX3JlcXVlc3Rfd2l0aF9wYXJhbXMoIHsndWlfdXNyX19kYXRlc19zaG9ydF93aWRlJzogJ3dpZGUnfSApO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cGJjX2FqeF9jbGlja19vbl9kYXRlc190b2dnbGUodGhpc19kYXRlKXtcclxuXHJcblx0alF1ZXJ5KCB0aGlzX2RhdGUgKS5wYXJlbnRzKCAnLndwYmNfY29sX2RhdGVzJyApLmZpbmQoICcuYm9va2luZ19kYXRlc19zbWFsbCcgKS50b2dnbGUoKTtcclxuXHRqUXVlcnkoIHRoaXNfZGF0ZSApLnBhcmVudHMoICcud3BiY19jb2xfZGF0ZXMnICkuZmluZCggJy5ib29raW5nX2RhdGVzX2Z1bGwnICkudG9nZ2xlKCk7XHJcblxyXG5cdC8qXHJcblx0dmFyIHZpc2libGVfc2VjdGlvbiA9IGpRdWVyeSggdGhpc19kYXRlICkucGFyZW50cyggJy5ib29raW5nX2RhdGVzX2V4cGFuZF9zZWN0aW9uJyApO1xyXG5cdHZpc2libGVfc2VjdGlvbi5oaWRlKCk7XHJcblx0aWYgKCB2aXNpYmxlX3NlY3Rpb24uaGFzQ2xhc3MoICdib29raW5nX2RhdGVzX2Z1bGwnICkgKXtcclxuXHRcdHZpc2libGVfc2VjdGlvbi5wYXJlbnRzKCAnLndwYmNfY29sX2RhdGVzJyApLmZpbmQoICcuYm9va2luZ19kYXRlc19zbWFsbCcgKS5zaG93KCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZpc2libGVfc2VjdGlvbi5wYXJlbnRzKCAnLndwYmNfY29sX2RhdGVzJyApLmZpbmQoICcuYm9va2luZ19kYXRlc19mdWxsJyApLnNob3coKTtcclxuXHR9Ki9cclxuXHRjb25zb2xlLmxvZyggJ3dwYmNfYWp4X2NsaWNrX29uX2RhdGVzX3RvZ2dsZScsIHRoaXNfZGF0ZSApO1xyXG59XHJcblxyXG4vKipcclxuICogICBMb2NhbGUgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbi8qKlxyXG4gKiBcdFNlbGVjdCBvcHRpb25zIGluIHNlbGVjdCBib3hlcyBiYXNlZCBvbiBhdHRyaWJ1dGUgXCJ2YWx1ZV9vZl9zZWxlY3RlZF9vcHRpb25cIiBhbmQgUkVEIGNvbG9yIGFuZCBoaW50IGZvciBMT0NBTEUgYnV0dG9uICAgLS0gIEl0J3MgY2FsbGVkIGZyb20gXHR3cGJjX2FqeF9ib29raW5nX2RlZmluZV91aV9ob29rcygpICBcdGVhY2ggIHRpbWUgYWZ0ZXIgTGlzdGluZyBsb2FkaW5nLlxyXG4gKi9cclxuZnVuY3Rpb24gd3BiY19hanhfYm9va2luZ19fdWlfZGVmaW5lX19sb2NhbGUoKXtcclxuXHJcblx0alF1ZXJ5KCAnLndwYmNfbGlzdGluZ19jb250YWluZXIgc2VsZWN0JyApLmVhY2goIGZ1bmN0aW9uICggaW5kZXggKXtcclxuXHJcblx0XHR2YXIgc2VsZWN0aW9uID0galF1ZXJ5KCB0aGlzICkuYXR0ciggXCJ2YWx1ZV9vZl9zZWxlY3RlZF9vcHRpb25cIiApO1x0XHRcdC8vIERlZmluZSBzZWxlY3RlZCBzZWxlY3QgYm94ZXNcclxuXHJcblx0XHRpZiAoIHVuZGVmaW5lZCAhPT0gc2VsZWN0aW9uICl7XHJcblx0XHRcdGpRdWVyeSggdGhpcyApLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgc2VsZWN0aW9uICsgJ1wiXScgKS5wcm9wKCAnc2VsZWN0ZWQnLCB0cnVlICk7XHJcblxyXG5cdFx0XHRpZiAoICgnJyAhPSBzZWxlY3Rpb24pICYmIChqUXVlcnkoIHRoaXMgKS5oYXNDbGFzcyggJ3NldF9ib29raW5nX2xvY2FsZV9zZWxlY3Rib3gnICkpICl7XHRcdFx0XHRcdFx0XHRcdC8vIExvY2FsZVxyXG5cclxuXHRcdFx0XHR2YXIgYm9va2luZ19sb2NhbGVfYnV0dG9uID0galF1ZXJ5KCB0aGlzICkucGFyZW50cyggJy51aV9lbGVtZW50X2xvY2FsZScgKS5maW5kKCAnLnNldF9ib29raW5nX2xvY2FsZV9idXR0b24nIClcclxuXHJcblx0XHRcdFx0Ly9ib29raW5nX2xvY2FsZV9idXR0b24uY3NzKCAnY29sb3InLCAnI2RiNDgwMCcgKTtcdFx0Ly8gU2V0IGJ1dHRvbiAgcmVkXHJcblx0XHRcdFx0Ym9va2luZ19sb2NhbGVfYnV0dG9uLmFkZENsYXNzKCAnd3BiY191aV9yZWQnICk7XHRcdC8vIFNldCBidXR0b24gIHJlZFxyXG5cdFx0XHRcdCBpZiAoICdmdW5jdGlvbicgPT09IHR5cGVvZiggd3BiY190aXBweSApICl7XHJcblx0XHRcdFx0XHRib29raW5nX2xvY2FsZV9idXR0b24uZ2V0KDApLl90aXBweS5zZXRDb250ZW50KCBzZWxlY3Rpb24gKTtcclxuXHRcdFx0XHQgfVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSApO1xyXG59XHJcblxyXG4vKipcclxuICogICBSZW1hcmsgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbi8qKlxyXG4gKiBEZWZpbmUgY29udGVudCBvZiByZW1hcmsgXCJib29raW5nIG5vdGVcIiBidXR0b24gYW5kIHRleHRhcmVhLiAgLS0gSXQncyBjYWxsZWQgZnJvbSBcdHdwYmNfYWp4X2Jvb2tpbmdfZGVmaW5lX3VpX2hvb2tzKCkgIFx0ZWFjaCAgdGltZSBhZnRlciBMaXN0aW5nIGxvYWRpbmcuXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX191aV9kZWZpbmVfX3JlbWFyaygpe1xyXG5cclxuXHRqUXVlcnkoICcud3BiY19saXN0aW5nX2NvbnRhaW5lciAudWlfcmVtYXJrX3NlY3Rpb24gdGV4dGFyZWEnICkuZWFjaCggZnVuY3Rpb24gKCBpbmRleCApe1xyXG5cdFx0dmFyIHRleHRfdmFsID0galF1ZXJ5KCB0aGlzICkudmFsKCk7XHJcblx0XHRpZiAoICh1bmRlZmluZWQgIT09IHRleHRfdmFsKSAmJiAoJycgIT0gdGV4dF92YWwpICl7XHJcblxyXG5cdFx0XHR2YXIgcmVtYXJrX2J1dHRvbiA9IGpRdWVyeSggdGhpcyApLnBhcmVudHMoICcudWlfZ3JvdXAnICkuZmluZCggJy5zZXRfYm9va2luZ19ub3RlX2J1dHRvbicgKTtcclxuXHJcblx0XHRcdGlmICggcmVtYXJrX2J1dHRvbi5sZW5ndGggPiAwICl7XHJcblxyXG5cdFx0XHRcdHJlbWFya19idXR0b24uYWRkQ2xhc3MoICd3cGJjX3VpX3JlZCcgKTtcdFx0Ly8gU2V0IGJ1dHRvbiAgcmVkXHJcblx0XHRcdFx0aWYgKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgKHdwYmNfdGlwcHkpICl7XHJcblx0XHRcdFx0XHQvL3JlbWFya19idXR0b24uZ2V0KCAwICkuX3RpcHB5LmFsbG93SFRNTCA9IHRydWU7XHJcblx0XHRcdFx0XHQvL3JlbWFya19idXR0b24uZ2V0KCAwICkuX3RpcHB5LnNldENvbnRlbnQoIHRleHRfdmFsLnJlcGxhY2UoL1tcXG5cXHJdL2csICc8YnI+JykgKTtcclxuXHJcblx0XHRcdFx0XHRyZW1hcmtfYnV0dG9uLmdldCggMCApLl90aXBweS5zZXRQcm9wcygge1xyXG5cdFx0XHRcdFx0XHRhbGxvd0hUTUw6IHRydWUsXHJcblx0XHRcdFx0XHRcdGNvbnRlbnQgIDogdGV4dF92YWwucmVwbGFjZSggL1tcXG5cXHJdL2csICc8YnI+JyApXHJcblx0XHRcdFx0XHR9ICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSApO1xyXG59XHJcblxyXG4vKipcclxuICogQWN0aW9ucyAsd2hlbiB3ZSBjbGljayBvbiBcIlJlbWFya1wiIGJ1dHRvbi5cclxuICpcclxuICogQHBhcmFtIGpxX2J1dHRvbiAgLVx0dGhpcyBqUXVlcnkgYnV0dG9uICBvYmplY3RcclxuICovXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2Jvb2tpbmdfX3VpX2NsaWNrX19yZW1hcmsoIGpxX2J1dHRvbiApe1xyXG5cclxuXHRqcV9idXR0b24ucGFyZW50cygnLnVpX2dyb3VwJykuZmluZCgnLnVpX3JlbWFya19zZWN0aW9uJykudG9nZ2xlKCk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogICBDaGFuZ2UgYm9va2luZyByZXNvdXJjZSAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2Jvb2tpbmdfX3VpX2NsaWNrX3Nob3dfX2NoYW5nZV9yZXNvdXJjZSggYm9va2luZ19pZCwgcmVzb3VyY2VfaWQgKXtcclxuXHJcblx0Ly8gRGVmaW5lIElEIG9mIGJvb2tpbmcgdG8gaGlkZGVuIGlucHV0XHJcblx0alF1ZXJ5KCAnI2NoYW5nZV9ib29raW5nX3Jlc291cmNlX19ib29raW5nX2lkJyApLnZhbCggYm9va2luZ19pZCApO1xyXG5cclxuXHQvLyBTZWxlY3QgYm9va2luZyByZXNvdXJjZSAgdGhhdCBiZWxvbmcgdG8gIGJvb2tpbmdcclxuXHRqUXVlcnkoICcjY2hhbmdlX2Jvb2tpbmdfcmVzb3VyY2VfX3Jlc291cmNlX3NlbGVjdCcgKS52YWwoIHJlc291cmNlX2lkICkudHJpZ2dlciggJ2NoYW5nZScgKTtcclxuXHR2YXIgY2JyO1xyXG5cclxuXHQvLyBHZXQgUmVzb3VyY2Ugc2VjdGlvblxyXG5cdGNiciA9IGpRdWVyeSggXCIjY2hhbmdlX2Jvb2tpbmdfcmVzb3VyY2VfX3NlY3Rpb25cIiApLmRldGFjaCgpO1xyXG5cclxuXHQvLyBBcHBlbmQgaXQgdG8gYm9va2luZyBST1dcclxuXHRjYnIuYXBwZW5kVG8oIGpRdWVyeSggXCIjdWlfX2NoYW5nZV9ib29raW5nX3Jlc291cmNlX19zZWN0aW9uX2luX2Jvb2tpbmdfXCIgKyBib29raW5nX2lkICkgKTtcclxuXHRjYnIgPSBudWxsO1xyXG5cclxuXHQvLyBIaWRlIHNlY3Rpb25zIG9mIFwiQ2hhbmdlIGJvb2tpbmcgcmVzb3VyY2VcIiBpbiBhbGwgb3RoZXIgYm9va2luZ3MgUk9Xc1xyXG5cdC8valF1ZXJ5KCBcIi51aV9fY2hhbmdlX2Jvb2tpbmdfcmVzb3VyY2VfX3NlY3Rpb25faW5fYm9va2luZ1wiICkuaGlkZSgpO1xyXG5cdGlmICggISBqUXVlcnkoIFwiI3VpX19jaGFuZ2VfYm9va2luZ19yZXNvdXJjZV9fc2VjdGlvbl9pbl9ib29raW5nX1wiICsgYm9va2luZ19pZCApLmlzKCc6dmlzaWJsZScpICl7XHJcblx0XHRqUXVlcnkoIFwiLnVpX191bmRlcl9hY3Rpb25zX3Jvd19fc2VjdGlvbl9pbl9ib29raW5nXCIgKS5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHQvLyBTaG93IG9ubHkgXCJjaGFuZ2UgYm9va2luZyByZXNvdXJjZVwiIHNlY3Rpb24gIGZvciBjdXJyZW50IGJvb2tpbmdcclxuXHRqUXVlcnkoIFwiI3VpX19jaGFuZ2VfYm9va2luZ19yZXNvdXJjZV9fc2VjdGlvbl9pbl9ib29raW5nX1wiICsgYm9va2luZ19pZCApLnRvZ2dsZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19zYXZlX19jaGFuZ2VfcmVzb3VyY2UoIHRoaXNfZWwsIGJvb2tpbmdfYWN0aW9uLCBlbF9pZCApe1xyXG5cclxuXHR3cGJjX2FqeF9ib29raW5nX2FqYXhfYWN0aW9uX3JlcXVlc3QoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdib29raW5nX2FjdGlvbicgICAgICAgOiBib29raW5nX2FjdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdib29raW5nX2lkJyAgICAgICAgICAgOiBqUXVlcnkoICcjY2hhbmdlX2Jvb2tpbmdfcmVzb3VyY2VfX2Jvb2tpbmdfaWQnICkudmFsKCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnc2VsZWN0ZWRfcmVzb3VyY2VfaWQnIDogalF1ZXJ5KCAnI2NoYW5nZV9ib29raW5nX3Jlc291cmNlX19yZXNvdXJjZV9zZWxlY3QnICkudmFsKCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQndWlfY2xpY2tlZF9lbGVtZW50X2lkJzogZWxfaWRcclxuXHR9ICk7XHJcblxyXG5cdHdwYmNfYnV0dG9uX2VuYWJsZV9sb2FkaW5nX2ljb24oIHRoaXNfZWwgKTtcclxuXHJcblx0Ly8gd3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfY2xvc2VfX2NoYW5nZV9yZXNvdXJjZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19jbG9zZV9fY2hhbmdlX3Jlc291cmNlKCl7XHJcblxyXG5cdHZhciBjYnJjZTtcclxuXHJcblx0Ly8gR2V0IFJlc291cmNlIHNlY3Rpb25cclxuXHRjYnJjZSA9IGpRdWVyeShcIiNjaGFuZ2VfYm9va2luZ19yZXNvdXJjZV9fc2VjdGlvblwiKS5kZXRhY2goKTtcclxuXHJcblx0Ly8gQXBwZW5kIGl0IHRvIGhpZGRlbiBIVE1MIHRlbXBsYXRlIHNlY3Rpb24gIGF0ICB0aGUgYm90dG9tICBvZiB0aGUgcGFnZVxyXG5cdGNicmNlLmFwcGVuZFRvKGpRdWVyeShcIiN3cGJjX2hpZGRlbl90ZW1wbGF0ZV9fY2hhbmdlX2Jvb2tpbmdfcmVzb3VyY2VcIikpO1xyXG5cdGNicmNlID0gbnVsbDtcclxuXHJcblx0Ly8gSGlkZSBhbGwgY2hhbmdlIGJvb2tpbmcgcmVzb3VyY2VzIHNlY3Rpb25zXHJcblx0alF1ZXJ5KFwiLnVpX19jaGFuZ2VfYm9va2luZ19yZXNvdXJjZV9fc2VjdGlvbl9pbl9ib29raW5nXCIpLmhpZGUoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqICAgRHVwbGljYXRlIGJvb2tpbmcgaW4gb3RoZXIgcmVzb3VyY2UgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19zaG93X19kdXBsaWNhdGVfYm9va2luZyggYm9va2luZ19pZCwgcmVzb3VyY2VfaWQgKXtcclxuXHJcblx0Ly8gRGVmaW5lIElEIG9mIGJvb2tpbmcgdG8gaGlkZGVuIGlucHV0XHJcblx0alF1ZXJ5KCAnI2R1cGxpY2F0ZV9ib29raW5nX3RvX290aGVyX3Jlc291cmNlX19ib29raW5nX2lkJyApLnZhbCggYm9va2luZ19pZCApO1xyXG5cclxuXHQvLyBTZWxlY3QgYm9va2luZyByZXNvdXJjZSAgdGhhdCBiZWxvbmcgdG8gIGJvb2tpbmdcclxuXHRqUXVlcnkoICcjZHVwbGljYXRlX2Jvb2tpbmdfdG9fb3RoZXJfcmVzb3VyY2VfX3Jlc291cmNlX3NlbGVjdCcgKS52YWwoIHJlc291cmNlX2lkICkudHJpZ2dlciggJ2NoYW5nZScgKTtcclxuXHR2YXIgY2JyO1xyXG5cclxuXHQvLyBHZXQgUmVzb3VyY2Ugc2VjdGlvblxyXG5cdGNiciA9IGpRdWVyeSggXCIjZHVwbGljYXRlX2Jvb2tpbmdfdG9fb3RoZXJfcmVzb3VyY2VfX3NlY3Rpb25cIiApLmRldGFjaCgpO1xyXG5cclxuXHQvLyBBcHBlbmQgaXQgdG8gYm9va2luZyBST1dcclxuXHRjYnIuYXBwZW5kVG8oIGpRdWVyeSggXCIjdWlfX2R1cGxpY2F0ZV9ib29raW5nX3RvX290aGVyX3Jlc291cmNlX19zZWN0aW9uX2luX2Jvb2tpbmdfXCIgKyBib29raW5nX2lkICkgKTtcclxuXHRjYnIgPSBudWxsO1xyXG5cclxuXHQvLyBIaWRlIHNlY3Rpb25zIG9mIFwiRHVwbGljYXRlIGJvb2tpbmdcIiBpbiBhbGwgb3RoZXIgYm9va2luZ3MgUk9Xc1xyXG5cdGlmICggISBqUXVlcnkoIFwiI3VpX19kdXBsaWNhdGVfYm9va2luZ190b19vdGhlcl9yZXNvdXJjZV9fc2VjdGlvbl9pbl9ib29raW5nX1wiICsgYm9va2luZ19pZCApLmlzKCc6dmlzaWJsZScpICl7XHJcblx0XHRqUXVlcnkoIFwiLnVpX191bmRlcl9hY3Rpb25zX3Jvd19fc2VjdGlvbl9pbl9ib29raW5nXCIgKS5oaWRlKCk7XHJcblx0fVxyXG5cclxuXHQvLyBTaG93IG9ubHkgXCJEdXBsaWNhdGUgYm9va2luZ1wiIHNlY3Rpb24gIGZvciBjdXJyZW50IGJvb2tpbmcgUk9XXHJcblx0alF1ZXJ5KCBcIiN1aV9fZHVwbGljYXRlX2Jvb2tpbmdfdG9fb3RoZXJfcmVzb3VyY2VfX3NlY3Rpb25faW5fYm9va2luZ19cIiArIGJvb2tpbmdfaWQgKS50b2dnbGUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfc2F2ZV9fZHVwbGljYXRlX2Jvb2tpbmcoIHRoaXNfZWwsIGJvb2tpbmdfYWN0aW9uLCBlbF9pZCApe1xyXG5cclxuXHR3cGJjX2FqeF9ib29raW5nX2FqYXhfYWN0aW9uX3JlcXVlc3QoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdib29raW5nX2FjdGlvbicgICAgICAgOiBib29raW5nX2FjdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdib29raW5nX2lkJyAgICAgICAgICAgOiBqUXVlcnkoICcjZHVwbGljYXRlX2Jvb2tpbmdfdG9fb3RoZXJfcmVzb3VyY2VfX2Jvb2tpbmdfaWQnICkudmFsKCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnc2VsZWN0ZWRfcmVzb3VyY2VfaWQnIDogalF1ZXJ5KCAnI2R1cGxpY2F0ZV9ib29raW5nX3RvX290aGVyX3Jlc291cmNlX19yZXNvdXJjZV9zZWxlY3QnICkudmFsKCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQndWlfY2xpY2tlZF9lbGVtZW50X2lkJzogZWxfaWRcclxuXHR9ICk7XHJcblxyXG5cdHdwYmNfYnV0dG9uX2VuYWJsZV9sb2FkaW5nX2ljb24oIHRoaXNfZWwgKTtcclxuXHJcblx0Ly8gd3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfY2xvc2VfX2NoYW5nZV9yZXNvdXJjZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19jbG9zZV9fZHVwbGljYXRlX2Jvb2tpbmcoKXtcclxuXHJcblx0dmFyIGNicmNlO1xyXG5cclxuXHQvLyBHZXQgUmVzb3VyY2Ugc2VjdGlvblxyXG5cdGNicmNlID0galF1ZXJ5KFwiI2R1cGxpY2F0ZV9ib29raW5nX3RvX290aGVyX3Jlc291cmNlX19zZWN0aW9uXCIpLmRldGFjaCgpO1xyXG5cclxuXHQvLyBBcHBlbmQgaXQgdG8gaGlkZGVuIEhUTUwgdGVtcGxhdGUgc2VjdGlvbiAgYXQgIHRoZSBib3R0b20gIG9mIHRoZSBwYWdlXHJcblx0Y2JyY2UuYXBwZW5kVG8oalF1ZXJ5KFwiI3dwYmNfaGlkZGVuX3RlbXBsYXRlX19kdXBsaWNhdGVfYm9va2luZ190b19vdGhlcl9yZXNvdXJjZVwiKSk7XHJcblx0Y2JyY2UgPSBudWxsO1xyXG5cclxuXHQvLyBIaWRlIGFsbCBjaGFuZ2UgYm9va2luZyByZXNvdXJjZXMgc2VjdGlvbnNcclxuXHRqUXVlcnkoXCIudWlfX2R1cGxpY2F0ZV9ib29raW5nX3RvX290aGVyX3Jlc291cmNlX19zZWN0aW9uX2luX2Jvb2tpbmdcIikuaGlkZSgpO1xyXG59XHJcblxyXG4vKipcclxuICogICBDaGFuZ2UgcGF5bWVudCBzdGF0dXMgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2Jvb2tpbmdfX3VpX2NsaWNrX3Nob3dfX3NldF9wYXltZW50X3N0YXR1cyggYm9va2luZ19pZCApe1xyXG5cclxuXHR2YXIgalNlbGVjdCA9IGpRdWVyeSggJyN1aV9fc2V0X3BheW1lbnRfc3RhdHVzX19zZWN0aW9uX2luX2Jvb2tpbmdfJyArIGJvb2tpbmdfaWQgKS5maW5kKCAnc2VsZWN0JyApXHJcblxyXG5cdHZhciBzZWxlY3RlZF9wYXlfc3RhdHVzID0galNlbGVjdC5hdHRyKCBcImFqeC1zZWxlY3RlZC12YWx1ZVwiICk7XHJcblxyXG5cdC8vIElzIGl0IGZsb2F0IC0gdGhlbiAgaXQncyB1bmtub3duXHJcblx0aWYgKCAhaXNOYU4oIHBhcnNlRmxvYXQoIHNlbGVjdGVkX3BheV9zdGF0dXMgKSApICl7XHJcblx0XHRqU2VsZWN0LmZpbmQoICdvcHRpb25bdmFsdWU9XCIxXCJdJyApLnByb3AoICdzZWxlY3RlZCcsIHRydWUgKTtcdFx0XHRcdFx0XHRcdFx0Ly8gVW5rbm93biAgdmFsdWUgaXMgJzEnIGluIHNlbGVjdCBib3hcclxuXHR9IGVsc2Uge1xyXG5cdFx0alNlbGVjdC5maW5kKCAnb3B0aW9uW3ZhbHVlPVwiJyArIHNlbGVjdGVkX3BheV9zdGF0dXMgKyAnXCJdJyApLnByb3AoICdzZWxlY3RlZCcsIHRydWUgKTtcdFx0Ly8gT3RoZXJ3aXNlIGtub3duIHBheW1lbnQgc3RhdHVzXHJcblx0fVxyXG5cclxuXHQvLyBIaWRlIHNlY3Rpb25zIG9mIFwiQ2hhbmdlIGJvb2tpbmcgcmVzb3VyY2VcIiBpbiBhbGwgb3RoZXIgYm9va2luZ3MgUk9Xc1xyXG5cdGlmICggISBqUXVlcnkoIFwiI3VpX19zZXRfcGF5bWVudF9zdGF0dXNfX3NlY3Rpb25faW5fYm9va2luZ19cIiArIGJvb2tpbmdfaWQgKS5pcygnOnZpc2libGUnKSApe1xyXG5cdFx0alF1ZXJ5KCBcIi51aV9fdW5kZXJfYWN0aW9uc19yb3dfX3NlY3Rpb25faW5fYm9va2luZ1wiICkuaGlkZSgpO1xyXG5cdH1cclxuXHJcblx0Ly8gU2hvdyBvbmx5IFwiY2hhbmdlIGJvb2tpbmcgcmVzb3VyY2VcIiBzZWN0aW9uICBmb3IgY3VycmVudCBib29raW5nXHJcblx0alF1ZXJ5KCBcIiN1aV9fc2V0X3BheW1lbnRfc3RhdHVzX19zZWN0aW9uX2luX2Jvb2tpbmdfXCIgKyBib29raW5nX2lkICkudG9nZ2xlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2Jvb2tpbmdfX3VpX2NsaWNrX3NhdmVfX3NldF9wYXltZW50X3N0YXR1cyggYm9va2luZ19pZCwgdGhpc19lbCwgYm9va2luZ19hY3Rpb24sIGVsX2lkICl7XHJcblxyXG5cdHdwYmNfYWp4X2Jvb2tpbmdfYWpheF9hY3Rpb25fcmVxdWVzdCgge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2Jvb2tpbmdfYWN0aW9uJyAgICAgICA6IGJvb2tpbmdfYWN0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2Jvb2tpbmdfaWQnICAgICAgICAgICA6IGJvb2tpbmdfaWQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnc2VsZWN0ZWRfcGF5bWVudF9zdGF0dXMnIDogalF1ZXJ5KCAnI3VpX2J0bl9zZXRfcGF5bWVudF9zdGF0dXMnICsgYm9va2luZ19pZCApLnZhbCgpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3VpX2NsaWNrZWRfZWxlbWVudF9pZCc6IGVsX2lkICsgJ19zYXZlJ1xyXG5cdH0gKTtcclxuXHJcblx0d3BiY19idXR0b25fZW5hYmxlX2xvYWRpbmdfaWNvbiggdGhpc19lbCApO1xyXG5cclxuXHRqUXVlcnkoICcjJyArIGVsX2lkICsgJ19jYW5jZWwnKS5oaWRlKCk7XHJcblx0Ly93cGJjX2J1dHRvbl9lbmFibGVfbG9hZGluZ19pY29uKCBqUXVlcnkoICcjJyArIGVsX2lkICsgJ19jYW5jZWwnKS5nZXQoMCkgKTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2Jvb2tpbmdfX3VpX2NsaWNrX2Nsb3NlX19zZXRfcGF5bWVudF9zdGF0dXMoKXtcclxuXHQvLyBIaWRlIGFsbCBjaGFuZ2UgIHBheW1lbnQgc3RhdHVzIGZvciBib29raW5nXHJcblx0alF1ZXJ5KFwiLnVpX19zZXRfcGF5bWVudF9zdGF0dXNfX3NlY3Rpb25faW5fYm9va2luZ1wiKS5oaWRlKCk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogICBDaGFuZ2UgYm9va2luZyBjb3N0ICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcbmZ1bmN0aW9uIHdwYmNfYWp4X2Jvb2tpbmdfX3VpX2NsaWNrX3NhdmVfX3NldF9ib29raW5nX2Nvc3QoIGJvb2tpbmdfaWQsIHRoaXNfZWwsIGJvb2tpbmdfYWN0aW9uLCBlbF9pZCApe1xyXG5cclxuXHR3cGJjX2FqeF9ib29raW5nX2FqYXhfYWN0aW9uX3JlcXVlc3QoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdib29raW5nX2FjdGlvbicgICAgICAgOiBib29raW5nX2FjdGlvbixcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdib29raW5nX2lkJyAgICAgICAgICAgOiBib29raW5nX2lkLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2Jvb2tpbmdfY29zdCcgXHRcdCAgIDogalF1ZXJ5KCAnI3VpX2J0bl9zZXRfYm9va2luZ19jb3N0JyArIGJvb2tpbmdfaWQgKyAnX2Nvc3QnKS52YWwoKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCd1aV9jbGlja2VkX2VsZW1lbnRfaWQnOiBlbF9pZCArICdfc2F2ZSdcclxuXHR9ICk7XHJcblxyXG5cdHdwYmNfYnV0dG9uX2VuYWJsZV9sb2FkaW5nX2ljb24oIHRoaXNfZWwgKTtcclxuXHJcblx0alF1ZXJ5KCAnIycgKyBlbF9pZCArICdfY2FuY2VsJykuaGlkZSgpO1xyXG5cdC8vd3BiY19idXR0b25fZW5hYmxlX2xvYWRpbmdfaWNvbiggalF1ZXJ5KCAnIycgKyBlbF9pZCArICdfY2FuY2VsJykuZ2V0KDApICk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19jbG9zZV9fc2V0X2Jvb2tpbmdfY29zdCgpe1xyXG5cdC8vIEhpZGUgYWxsIGNoYW5nZSAgcGF5bWVudCBzdGF0dXMgZm9yIGJvb2tpbmdcclxuXHRqUXVlcnkoXCIudWlfX3NldF9ib29raW5nX2Nvc3RfX3NlY3Rpb25faW5fYm9va2luZ1wiKS5oaWRlKCk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogICBTZW5kIFBheW1lbnQgcmVxdWVzdCAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19fc2VuZF9wYXltZW50X3JlcXVlc3QoKXtcclxuXHJcblx0d3BiY19hanhfYm9va2luZ19hamF4X2FjdGlvbl9yZXF1ZXN0KCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnYm9va2luZ19hY3Rpb24nICAgICAgIDogJ3NlbmRfcGF5bWVudF9yZXF1ZXN0JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdib29raW5nX2lkJyAgICAgICAgICAgOiBqUXVlcnkoICcjd3BiY19tb2RhbF9fcGF5bWVudF9yZXF1ZXN0X19ib29raW5nX2lkJykudmFsKCksXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQncmVhc29uX29mX2FjdGlvbicgXHQgICA6IGpRdWVyeSggJyN3cGJjX21vZGFsX19wYXltZW50X3JlcXVlc3RfX3JlYXNvbl9vZl9hY3Rpb24nKS52YWwoKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCd1aV9jbGlja2VkX2VsZW1lbnRfaWQnOiAnd3BiY19tb2RhbF9fcGF5bWVudF9yZXF1ZXN0X19idXR0b25fc2VuZCdcclxuXHR9ICk7XHJcblx0d3BiY19idXR0b25fZW5hYmxlX2xvYWRpbmdfaWNvbiggalF1ZXJ5KCAnI3dwYmNfbW9kYWxfX3BheW1lbnRfcmVxdWVzdF9fYnV0dG9uX3NlbmQnICkuZ2V0KCAwICkgKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiAgIEltcG9ydCBHb29nbGUgQ2FsZW5kYXIgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuZnVuY3Rpb24gd3BiY19hanhfYm9va2luZ19fdWlfY2xpY2tfX2ltcG9ydF9nb29nbGVfY2FsZW5kYXIoKXtcclxuXHJcblx0d3BiY19hanhfYm9va2luZ19hamF4X2FjdGlvbl9yZXF1ZXN0KCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnYm9va2luZ19hY3Rpb24nICAgICAgIDogJ2ltcG9ydF9nb29nbGVfY2FsZW5kYXInLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3VpX2NsaWNrZWRfZWxlbWVudF9pZCc6ICd3cGJjX21vZGFsX19pbXBvcnRfZ29vZ2xlX2NhbGVuZGFyX19idXR0b25fc2VuZCdcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQsICdib29raW5nX2djYWxfZXZlbnRzX2Zyb20nIDogXHRcdFx0XHRqUXVlcnkoICcjd3BiY19tb2RhbF9faW1wb3J0X2dvb2dsZV9jYWxlbmRhcl9fc2VjdGlvbiAjYm9va2luZ19nY2FsX2V2ZW50c19mcm9tIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQsICdib29raW5nX2djYWxfZXZlbnRzX2Zyb21fb2Zmc2V0JyA6IFx0XHRqUXVlcnkoICcjd3BiY19tb2RhbF9faW1wb3J0X2dvb2dsZV9jYWxlbmRhcl9fc2VjdGlvbiAjYm9va2luZ19nY2FsX2V2ZW50c19mcm9tX29mZnNldCcgKS52YWwoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LCAnYm9va2luZ19nY2FsX2V2ZW50c19mcm9tX29mZnNldF90eXBlJyA6IFx0alF1ZXJ5KCAnI3dwYmNfbW9kYWxfX2ltcG9ydF9nb29nbGVfY2FsZW5kYXJfX3NlY3Rpb24gI2Jvb2tpbmdfZ2NhbF9ldmVudHNfZnJvbV9vZmZzZXRfdHlwZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKVxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCwgJ2Jvb2tpbmdfZ2NhbF9ldmVudHNfdW50aWwnIDogXHRcdFx0alF1ZXJ5KCAnI3dwYmNfbW9kYWxfX2ltcG9ydF9nb29nbGVfY2FsZW5kYXJfX3NlY3Rpb24gI2Jvb2tpbmdfZ2NhbF9ldmVudHNfdW50aWwgb3B0aW9uOnNlbGVjdGVkJykudmFsKClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCwgJ2Jvb2tpbmdfZ2NhbF9ldmVudHNfdW50aWxfb2Zmc2V0JyA6IFx0XHRqUXVlcnkoICcjd3BiY19tb2RhbF9faW1wb3J0X2dvb2dsZV9jYWxlbmRhcl9fc2VjdGlvbiAjYm9va2luZ19nY2FsX2V2ZW50c191bnRpbF9vZmZzZXQnICkudmFsKClcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCwgJ2Jvb2tpbmdfZ2NhbF9ldmVudHNfdW50aWxfb2Zmc2V0X3R5cGUnIDogalF1ZXJ5KCAnI3dwYmNfbW9kYWxfX2ltcG9ydF9nb29nbGVfY2FsZW5kYXJfX3NlY3Rpb24gI2Jvb2tpbmdfZ2NhbF9ldmVudHNfdW50aWxfb2Zmc2V0X3R5cGUgb3B0aW9uOnNlbGVjdGVkJykudmFsKClcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQsICdib29raW5nX2djYWxfZXZlbnRzX21heCcgOiBcdGpRdWVyeSggJyN3cGJjX21vZGFsX19pbXBvcnRfZ29vZ2xlX2NhbGVuZGFyX19zZWN0aW9uICNib29raW5nX2djYWxfZXZlbnRzX21heCcgKS52YWwoKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0LCAnYm9va2luZ19nY2FsX3Jlc291cmNlJyA6IFx0alF1ZXJ5KCAnI3dwYmNfbW9kYWxfX2ltcG9ydF9nb29nbGVfY2FsZW5kYXJfX3NlY3Rpb24gI3dwYmNfYm9va2luZ19yZXNvdXJjZSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKVxyXG5cdH0gKTtcclxuXHR3cGJjX2J1dHRvbl9lbmFibGVfbG9hZGluZ19pY29uKCBqUXVlcnkoICcjd3BiY19tb2RhbF9faW1wb3J0X2dvb2dsZV9jYWxlbmRhcl9fc2VjdGlvbiAjd3BiY19tb2RhbF9faW1wb3J0X2dvb2dsZV9jYWxlbmRhcl9fYnV0dG9uX3NlbmQnICkuZ2V0KCAwICkgKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiAgIEV4cG9ydCBib29raW5ncyB0byBDU1YgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX191aV9jbGlja19fZXhwb3J0X2NzdiggcGFyYW1zICl7XHJcblxyXG5cdHZhciBzZWxlY3RlZF9ib29raW5nX2lkX2FyciA9IHdwYmNfZ2V0X3NlbGVjdGVkX3Jvd19pZCgpO1xyXG5cclxuXHR3cGJjX2FqeF9ib29raW5nX2FqYXhfYWN0aW9uX3JlcXVlc3QoIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdib29raW5nX2FjdGlvbicgICAgICAgIDogcGFyYW1zWyAnYm9va2luZ19hY3Rpb24nIF0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQndWlfY2xpY2tlZF9lbGVtZW50X2lkJyA6IHBhcmFtc1sgJ3VpX2NsaWNrZWRfZWxlbWVudF9pZCcgXSxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnZXhwb3J0X3R5cGUnICAgICAgICAgICA6IHBhcmFtc1sgJ2V4cG9ydF90eXBlJyBdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J2Nzdl9leHBvcnRfc2VwYXJhdG9yJyAgOiBwYXJhbXNbICdjc3ZfZXhwb3J0X3NlcGFyYXRvcicgXSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdjc3ZfZXhwb3J0X3NraXBfZmllbGRzJzogcGFyYW1zWyAnY3N2X2V4cG9ydF9za2lwX2ZpZWxkcycgXSxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnYm9va2luZ19pZCdcdDogc2VsZWN0ZWRfYm9va2luZ19pZF9hcnIuam9pbignLCcpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0J3NlYXJjaF9wYXJhbXMnIDogd3BiY19hanhfYm9va2luZ19saXN0aW5nLnNlYXJjaF9nZXRfYWxsX3BhcmFtcygpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSApO1xyXG5cclxuXHR2YXIgdGhpc19lbCA9IGpRdWVyeSggJyMnICsgcGFyYW1zWyAndWlfY2xpY2tlZF9lbGVtZW50X2lkJyBdICkuZ2V0KCAwIClcclxuXHJcblx0d3BiY19idXR0b25fZW5hYmxlX2xvYWRpbmdfaWNvbiggdGhpc19lbCApO1xyXG59XHJcblxyXG4vKipcclxuICogT3BlbiBVUkwgaW4gbmV3IHRhYiAtIG1haW5seSAgaXQncyB1c2VkIGZvciBvcGVuIENTViBsaW5rICBmb3IgZG93bmxvYWRlZCBleHBvcnRlZCBib29raW5ncyBhcyBDU1ZcclxuICpcclxuICogQHBhcmFtIGV4cG9ydF9jc3ZfdXJsXHJcbiAqL1xyXG5mdW5jdGlvbiB3cGJjX2FqeF9ib29raW5nX19leHBvcnRfY3N2X3VybF9fZG93bmxvYWQoIGV4cG9ydF9jc3ZfdXJsICl7XHJcblxyXG5cdC8vdmFyIHNlbGVjdGVkX2Jvb2tpbmdfaWRfYXJyID0gd3BiY19nZXRfc2VsZWN0ZWRfcm93X2lkKCk7XHJcblxyXG5cdGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBleHBvcnRfY3N2X3VybDsvLyArICcmc2VsZWN0ZWRfaWQ9JyArIHNlbGVjdGVkX2Jvb2tpbmdfaWRfYXJyLmpvaW4oJywnKTtcclxuXHJcblx0Ly8gSXQncyBvcGVuIGFkZGl0aW9uYWwgZGlhbG9nIGZvciBhc2tpbmcgb3BlbmluZyB1bHIgaW4gbmV3IHRhYlxyXG5cdC8vIHdpbmRvdy5vcGVuKCBleHBvcnRfY3N2X3VybCwgJ19ibGFuaycpLmZvY3VzKCk7XHJcbn0iXSwiZmlsZSI6ImluY2x1ZGVzL3BhZ2UtYm9va2luZ3MvX291dC9ib29raW5nc19fYWN0aW9ucy5qcyJ9
