var availability_per_day = [];
var wpbc_check_in_dates  = [];
var wpbc_check_out_dates = [];
var wpbc_check_in_out_closed_dates = [];
var highlight_availability_word = '';
var wpbc_search_form_dates_format = 'yy-mm-dd';     //FixIn: 8.6.1.21

function getDayAvailability4Show(bk_type, tooltip_time, td_class){

    if (  wpdev_in_array( parent_booking_resources, bk_type ) )
        if (is_show_availability_in_tooltips) {
           if(typeof(  availability_per_day[bk_type] ) !== 'undefined')
               if(typeof(  availability_per_day[bk_type][td_class] ) !== 'undefined') {
                    if (tooltip_time!== '') tooltip_time = tooltip_time + '<br/>';
                
                    var both_check_in_out_num = getNumberClosedCheckInOutDays( bk_type, td_class ) ;    
                    
                    return  tooltip_time + highlight_availability_word + parseInt( availability_per_day[bk_type][td_class] - both_check_in_out_num ) ;
               }
        }
    return  tooltip_time;
}


function getNumberClosedCheckInOutDays( bk_type, td_class ){
    var both_check_in_out_num = 0;    
    if(typeof(wpbc_check_in_out_closed_dates) !== 'undefined')
        if(typeof(wpbc_check_in_out_closed_dates[ bk_type ]) !== 'undefined')
            if(typeof(wpbc_check_in_out_closed_dates[ bk_type ][ td_class ]) !== 'undefined') {
                // [ Number of check In / Out bookings both  in the same child resource ]
                both_check_in_out_num =  wpbc_check_in_out_closed_dates[ bk_type ][ td_class ] ;
            }
    return both_check_in_out_num;
}


function checkDayAvailability4Visitors(bk_type, inp_value, my_dates_array) {
    
    if ( ( is_use_visitors_number_for_availability ) && (my_dates_array != '') ) {

        var my_single_data = '';
        var td_class1 = '';

        if (  (availability_based_on == 'visitors') && ( wpdev_in_array( parent_booking_resources, bk_type ) )  ) {                              // Visitors

                my_dates_array = my_dates_array.split(',');

                for (var i = 0;  i < my_dates_array.length; i++) {
                    if (my_dates_array[i]== '') return true;
                    my_single_data = my_dates_array[i].split('.');

                    my_single_data[0] = my_single_data[0].replace(/(^\s+)|(\s+$)/g, ""); // TRim
                    my_single_data[1] = my_single_data[1].replace(/(^\s+)|(\s+$)/g, ""); // TRim
                    my_single_data[2] = my_single_data[2].replace(/(^\s+)|(\s+$)/g, ""); // TRim
                    my_single_data[0] = my_single_data[0].replace(/(^0+)|(\s+$)/g, ""); // TRim
                    my_single_data[1] = my_single_data[1].replace(/(^0+)|(\s+$)/g, ""); // TRim
                    my_single_data[2] = my_single_data[2].replace(/(^0+)|(\s+$)/g, ""); // TRim
                    td_class1 =  parseInt(my_single_data[1]) + '-' + parseInt(my_single_data[0]) + '-' + parseInt(my_single_data[2]);
                    if ( parseInt( availability_per_day[bk_type][td_class1] ) < parseInt( inp_value ) )
                        return true;

                }
        // availability based on items, so we will check visitors for maximum support of them for specific item
        } else {                                                                // Items

            if ( parseInt( max_visitors_4_bk_res[bk_type] ) < parseInt( inp_value ) )
                return true;

                my_dates_array = my_dates_array.split(',');

                for (var i = 0;  i < my_dates_array.length; i++) {
                    if (my_dates_array[i]== '') return true;
                    my_single_data = my_dates_array[i].split('.');

                    my_single_data[0] = my_single_data[0].replace(/(^\s+)|(\s+$)/g, ""); // TRim
                    my_single_data[1] = my_single_data[1].replace(/(^\s+)|(\s+$)/g, ""); // TRim
                    my_single_data[2] = my_single_data[2].replace(/(^\s+)|(\s+$)/g, ""); // TRim
                    my_single_data[0] = my_single_data[0].replace(/(^0+)|(\s+$)/g, ""); // TRim
                    my_single_data[1] = my_single_data[1].replace(/(^0+)|(\s+$)/g, ""); // TRim
                    my_single_data[2] = my_single_data[2].replace(/(^0+)|(\s+$)/g, ""); // TRim
                    td_class1 =  parseInt(my_single_data[1]) + '-' + parseInt(my_single_data[0]) + '-' + parseInt(my_single_data[2]);
                    if ( parseInt( availability_per_day[bk_type][td_class1] ) < 1  ) //parseInt( inp_value ) )
                        return true;

                }

        }




        return false;

    } else {                                                                    // No apply of visitors
        return false;
    }
}

    ////////////////////////////////////////////////////////////////////////////
    // Booking Search functionality

    //FixIn: 8.6.1.21
    function wpbc_search_form_click_new_page( my_form ){

        if (
               ( '' == jQuery( '#booking_search_check_in' ).val() )
            || ( '' == jQuery( '#booking_search_check_out' ).val() )
        ){
            alert( search_emty_days_warning );
            return false;
        }

	    var search_check_in_date = jQuery.datepick.parseDate( wpbc_search_form_dates_format , jQuery( '#booking_search_check_in' ).val() );         // Parse a string value into a date object
        var string_check_in_date = jQuery.datepick.formatDate( 'yy-mm-dd', search_check_in_date );                                                  // Format a date object into a string value.
        jQuery( '#booking_search_check_in' ).val( string_check_in_date );

	    var search_check_out_date = jQuery.datepick.parseDate( wpbc_search_form_dates_format , jQuery( '#booking_search_check_out' ).val() );       // Parse a string value into a date object
        var string_check_out_date = jQuery.datepick.formatDate( 'yy-mm-dd', search_check_out_date );                                                // Format a date object into a string value.
        jQuery( '#booking_search_check_out' ).val( string_check_out_date );

        return  true;
    }


    function searchFormClck( search_form, wpdev_active_locale ){

        if ( (search_form.check_in.value == '') || (search_form.check_out.value == '') ) {
            alert(search_emty_days_warning);
            return;
        }
        document.getElementById('booking_search_results' ).innerHTML = '<div style="height:20px;width:100%;text-align:center;margin:15px auto;"><img  style="vertical-align:middle;box-shadow:none;width:14px;" src="'+wpdev_bk_plugin_url+'/assets/img/ajax-loader.gif"><//div>';
        ajax_search_submit( search_form, wpdev_active_locale );

    }


    //<![CDATA[
    function ajax_search_submit( search_form, wpdev_active_locale ) {           //FixIn: 6.0.1.1

        //FixIn: 8.6.1.21
	    var search_check_in_date = jQuery.datepick.parseDate( wpbc_search_form_dates_format , search_form.check_in.value );     // Parse a string value into a date object
        var string_check_in_date = jQuery.datepick.formatDate( 'yy-mm-dd', search_check_in_date );                              // Format a date object into a string value.

	    var search_check_out_date = jQuery.datepick.parseDate( wpbc_search_form_dates_format , search_form.check_out.value );     // Parse a string value into a date object
        var string_check_out_date = jQuery.datepick.formatDate( 'yy-mm-dd', search_check_out_date );                              // Format a date object into a string value.

//console.log( 'search_check_in_date, string_check_out_date',string_check_in_date, string_check_out_date );

            // Ajax POST here
            var my_bk_category = '';
            var my_bk_tag = '';
            var my_bk_users = '';
            var my_bk_advanced = '';

            var elm1 = document.getElementById("booking_search_category");
            if( elm1 !== null) my_bk_category = search_form.category.value

            var elm2 = document.getElementById("booking_search_tag");
            if( elm2 !== null) my_bk_tag = search_form.tag.value

            var elm3 = document.getElementById("booking_bk_users");
            if( elm3 !== null) my_bk_users = search_form.bk_users.value
                        
            if ( jQuery("input[name='additional_search']:checked").length > 0 )
                my_bk_advanced = jQuery("input[name='additional_search']").val();

//            var all_paramas = '';
//            for(var i = 0; i < search_form.length; i++) {                       //FixIn:6.0.1
//                if ( ( search_form[i].type == 'checkbox' ) && ( ! search_form[i].checked ) )
//                    continue;
//                all_paramas += search_form[i].type + "^";
//                all_paramas += search_form[i].name + "^";
//                all_paramas += search_form[i].value + "~";
//            }

            //FixIn: 7.1.2.9
            var all_paramas = '';
            var inp_el;
            var inp_val
//console.log(search_form);            
//console.log(jQuery( search_form ));
            for( var i = 0; i < search_form.length; i++ ) {                       
                if ( ( search_form[i].type == 'checkbox' ) && ( ! search_form[i].checked ) )
                    continue;
                
                inp_el = search_form[i].type + "^" + search_form[i].name + "^";
                                 
                inp_val = jQuery( search_form[i] ).val();
//console.log(inp_el, inp_val);                
                if ( Array.isArray( inp_val ) ) {
                    jQuery.each( inp_val, function( index ){
                        all_paramas += inp_el + inp_val[ index ] + "~";
                    });
                } else {
                    all_paramas += inp_el + inp_val + "~";
                }
            } 
//console.log(all_paramas);
            jQuery(".booking_search_ajax_container").remove();
            
            jQuery.ajax({                                           // Start Ajax Sending
                // url: wpdev_bk_plugin_url+ '/' + wpdev_bk_plugin_filename,
                url: wpbc_ajaxurl,
                type:'POST',
                success: function (data, textStatus){if( textStatus == 'success')   jQuery('#booking_search_ajax' ).html( data ) ;},
                error:function (XMLHttpRequest, textStatus, errorThrown){window.status = 'Ajax search Error status:'+ textStatus;alert(XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText);if (XMLHttpRequest.status == 500) {alert('Please check at this page according this error:' + ' https://wpbookingcalendar.com/faq/#ajax-sending-error');}},
                // beforeSend: someFunction,
                data:{
                    //ajax_action : 'BOOKING_SEARCH',
                    action : 'BOOKING_SEARCH',
                    bk_check_in: string_check_in_date ,
                    bk_check_out: string_check_out_date ,
                    bk_visitors: search_form.visitors.value,
                    bk_no_results_title: search_form.bk_no_results_title.value,
                    bk_search_results_title: search_form.bk_search_results_title.value,
                    bk_category:my_bk_category,
                    bk_tag:my_bk_tag,
                    bk_users:my_bk_users,
                    bk_search_params: all_paramas,
                    additional_search: my_bk_advanced,
                    wpdev_active_locale:wpdev_active_locale,
                    wpbc_nonce: document.getElementById('wpbc_search_nonce').value 
                }
            });
    }
    //]]>




    function setDaysSelectionsInCalendar(bk_type, check_in, check_out){

        clearTimeout(timeout_DSwindow);
        

        var inst = jQuery.datepick._getInst(document.getElementById('calendar_booking'+bk_type));
        inst.dates = [];

        var original_array = []; var date;

        for(var j=0; j < original_array.length ; j++) {       //loop array of dates
            if (original_array[j] != -1) inst.dates.push(original_array[j]);
        }
        var dateStr = (inst.dates.length == 0 ? '' : jQuery.datepick._formatDate(inst, inst.dates[0])); // Get first date
        for ( var i = 1; i < inst.dates.length; i++)
             dateStr += jQuery.datepick._get(inst, 'multiSeparator') +  jQuery.datepick._formatDate(inst, inst.dates[i]);  // Gathering all dates
        jQuery('#date_booking' + bk_type).val(dateStr); // Fill the input box

        if (original_array.length>0) { // Set showing of start month
            inst.cursorDate = original_array[0];
            inst.drawMonth = inst.cursorDate.getMonth();
            inst.drawYear = inst.cursorDate.getFullYear();
        }

        // Update calendar
        jQuery.datepick._notifyChange(inst);
        jQuery.datepick._adjustInstDate(inst);
        jQuery.datepick._showDate(inst);
        jQuery.datepick._updateDatepick(inst);
    }



function is_max_visitors_selection_more_than_available( bk_type, visitors_selection , element ) {

    if  (  ( wpdev_in_array( parent_booking_resources, bk_type ) ) ||   // Item have some capacity
           ( is_use_visitors_number_for_availability === true   )      // Item single, but checking for MAX visitors in situatio, when visitors apply to capacity
    ) {

                var my_dates_v = document.getElementById('date_booking' + bk_type).value;
                if(typeof( checkDayAvailability4Visitors ) == 'function') {
                    var is_visitors_more_then_need = checkDayAvailability4Visitors(bk_type, visitors_selection, my_dates_v);
                    if (is_visitors_more_then_need) {

                        // Show warning for booking form without calendar                                               //FixIn: 9.4.4.7
                        if  (  ( jQuery( element ).parents('.booking_form_div').length > 0)                             // Booking form exist
                            && ( 0 == jQuery( element ).parents('.booking_form_div').find('.datepick-inline').length )  // No calendar here
                        ){
                            element = jQuery( element ).parents( '.booking_form_div' ).find( 'input[type="button"]' ).get(0);
                            showMessageUnderElement( element , 'The dates are already booked.', 'alert-danger');
                            return true;
                        }

                        showErrorMessage( element , message_verif_visitors_more_then_available, false );   		//FixIn: 8.5.1.3
                        return true;
                    }
                }
    }

    return false;
}

    var timeout_SelectDaysInCalendar;
    jQuery(document).ready(function(){

       if (
             (location.href.indexOf('bk_check_in=')>0) &&
             (location.href.indexOf('bk_check_out=')>0) &&
             (location.href.indexOf('bk_type=')>0)
           ) {
            timeout_SelectDaysInCalendar=setTimeout("setDaySelectionsInCalendar()",1500);
       }
    });


    function setDaySelectionsInCalendar(){

        //FixIn: 8.8.2.3
        if ( 'On' == wpbc_global5.booking_search_results_days_select ){
            return false;                                                 // Disable days selection  in calendar,  after  redirection  from  the "Search results page,  after  search  availability"
        }
        clearTimeout(timeout_SelectDaysInCalendar);

        // Parse a URL
        var myURLParams = location.href.split('?');
        myURLParams = myURLParams[1].split('&');
        for ( var i = 0; i < myURLParams.length; i++ ){     //FixIn: 8.4.5.14
            var myParam = myURLParams[ i ].split( '=' );
            if ( myParam[ 0 ] == 'bk_check_in' ) var check_in_date = myParam[ 1 ];
            if ( myParam[ 0 ] == 'bk_check_out' ) var check_out_date = myParam[ 1 ];
            if ( myParam[ 0 ] == 'bk_visitors' ) var bk_visitors_num = myParam[ 1 ];
            if ( myParam[ 0 ] == 'bk_type' ) var my_bk_type = myParam[ 1 ].split( '#' )[ 0 ];
        }
        jQuery('select[name=visitors'+ my_bk_type + ']').val( bk_visitors_num );


        check_in_date = check_in_date.split('-');
        check_out_date = check_out_date.split('-');
        var bk_type = my_bk_type;
// jQuery( '#calendar_booking' + bk_type ).hide();
// jQuery( '#booking_form_div' + bk_type + ' .block_hints').hide();
        var inst = jQuery.datepick._getInst(document.getElementById('calendar_booking'+bk_type));
        inst.dates = [];
        var original_array = [];
        var date;
        var bk_inputing = document.getElementById('date_booking' + bk_type);
        var bk_distinct_dates = [];

        date=new Date();
        date.setFullYear( check_in_date[0], (check_in_date[1]-1), check_in_date[2] );                                    // year, month, date
        var original_check_in_date = date;
        original_array.push( jQuery.datepick._restrictMinMax(inst, jQuery.datepick._determineDate(inst, date, null))  ); //add date
        if ( !  wpdev_in_array(bk_distinct_dates, (check_in_date[2]+'.'+check_in_date[1]+'.'+check_in_date[0]) ) ) {
            bk_distinct_dates.push(check_in_date[2]+'.'+check_in_date[1]+'.'+check_in_date[0]);
        }

        var date_out=new Date();
        date_out.setFullYear( check_out_date[0], (check_out_date[1]-1), check_out_date[2] );                                    // year, month, date
        var original_check_out_date = date_out;

        var mewDate=new Date(original_check_in_date.getFullYear(), original_check_in_date.getMonth(), original_check_in_date.getDate() );
        mewDate.setDate(original_check_in_date.getDate()+1);

        while(
                (original_check_out_date > date ) &&
                (original_check_in_date != original_check_out_date ) )
             {
            date=new Date(mewDate.getFullYear(), mewDate.getMonth(), mewDate.getDate() );

            original_array.push( jQuery.datepick._restrictMinMax(inst, jQuery.datepick._determineDate(inst, date, null))  ); //add date
            if ( !  wpdev_in_array(bk_distinct_dates, (date.getDate()+'.'+parseInt(date.getMonth()+1)+'.'+date.getFullYear()) ) ) {
                bk_distinct_dates.push((date.getDate()+'.'+parseInt(date.getMonth()+1)+'.'+date.getFullYear()));
            }

            mewDate=new Date(date.getFullYear(), date.getMonth(), date.getDate() );
            mewDate.setDate(mewDate.getDate()+1);
        }
        original_array.pop();
        bk_distinct_dates.pop();

        // Check minimum  number days condition                                 //FixIn: 7.0.1.31
        var is_continue_selection = true;
        if ( bk_days_selection_mode == 'dynamic' )
            if ( (bk_2clicks_mode_days_min != undefined) && (original_array.length < bk_2clicks_mode_days_min ) ){
                is_continue_selection = false        
            }
        if ( is_continue_selection ) {
            for(var j=0; j < original_array.length ; j++) {       //loop array of dates
                if (original_array[j] != -1) inst.dates.push(original_array[j]);
            }
            var dateStr = (inst.dates.length == 0 ? '' : jQuery.datepick._formatDate(inst, inst.dates[0])); // Get first date
            for ( i = 1; i < inst.dates.length; i++)
                 dateStr += jQuery.datepick._get(inst, 'multiSeparator') +  jQuery.datepick._formatDate(inst, inst.dates[i]);  // Gathering all dates
            jQuery('#date_booking' + bk_type).val(dateStr); // Fill the input box
        }
        if (original_array.length>0) { // Set showing of start month
            inst.cursorDate = original_array[0];
            inst.drawMonth = inst.cursorDate.getMonth();
            inst.drawYear = inst.cursorDate.getFullYear();
        }

        // Update calendar
        jQuery.datepick._notifyChange(inst);
        jQuery.datepick._adjustInstDate(inst);
        jQuery.datepick._showDate(inst);
        jQuery.datepick._updateDatepick(inst);
                
        check_condition_sections_in_bkform( jQuery('#date_booking' + bk_type).val() , bk_type);

        // HERE WE WILL DISABLE ALL OPTIONS IN RANGE TIME INTERVALS FOR SINGLE DAYS SELECTIONS FOR THAT DAYS WHERE HOURS ALREADY BOOKED
        bkDisableBookedTimeSlots( jQuery('#date_booking' + bk_type).val() , bk_type);
        
        showCostHintInsideBkForm(bk_type);
    }


//FixIn: 8.6.1.21
function getMinRangeDaysSelections(){
    if ( bk_days_selection_mode == 'dynamic' ) return bk_2clicks_mode_days_min;
    if ( bk_days_selection_mode == 'fixed' ) return bk_1click_mode_days_num;
    return 0;
}


function wpbc_search_check_in_selected( date ) {

    // Parse a string value into a date object
	var search_check_in_date = jQuery.datepick.parseDate( wpbc_search_form_dates_format , jQuery( '#booking_search_check_in' ).val() );

    var date_to_check = new Date();
    date_to_check.setFullYear( search_check_in_date.getFullYear(), search_check_in_date.getMonth(), search_check_in_date.getDate() );


    if (  ( bk_days_selection_mode == 'fixed' ) && ( bk_1click_mode_days_start != -1 )  ){

        var startDay = getAbsClosestValue( date_to_check.getDay(), bk_1click_mode_days_start );
        date_to_check.setDate( date_to_check.getDate() - (date_to_check.getDay() - startDay) );

        var string_date = jQuery.datepick.formatDate( wpbc_search_form_dates_format, date_to_check );        // Format a date object into a string value.

        jQuery( '#booking_search_check_in' ).val( string_date );
    }
    if (  ( bk_days_selection_mode == 'dynamic' ) && ( bk_2clicks_mode_days_start != -1 )  ){

        var startDay = getAbsClosestValue( date_to_check.getDay(), bk_2clicks_mode_days_start );
        date_to_check.setDate( date_to_check.getDate() - (date_to_check.getDay() - startDay) );

        var string_date = jQuery.datepick.formatDate( wpbc_search_form_dates_format, date_to_check );        // Format a date object into a string value.
        jQuery( '#booking_search_check_in' ).val( string_date );
    }

    if ( document.getElementById( 'booking_search_check_out' ) != null ){

        var start_bk_month_4_check_out = jQuery.datepick.parseDate( wpbc_search_form_dates_format, jQuery( '#booking_search_check_in' ).val() );
        var myDate = new Date();
        myDate.setFullYear( start_bk_month_4_check_out.getFullYear(), start_bk_month_4_check_out.getMonth(), start_bk_month_4_check_out.getDate() );

        var days_interval = getMinRangeDaysSelections();
        if ( days_interval > 0 ) days_interval--;
        myDate.setDate( myDate.getDate() + days_interval );

        var string_date = jQuery.datepick.formatDate( wpbc_search_form_dates_format, myDate );        // Format a date object into a string value.
        jQuery( '#booking_search_check_out' ).val( string_date );
    }

}


function wpbc_search_apply_css_before_show_check_in(date ){

    var class_day = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    var additional_class = 'date_available ';

    for ( var i = 0; i < user_unavilable_days.length; i++ ){
        if ( date.getDay() == user_unavilable_days[ i ] ) return [false, 'cal4date-' + class_day + ' date_user_unavailable'];
    }

    var my_test_date = new Date();
    my_test_date.setFullYear( wpbc_today[ 0 ], (wpbc_today[ 1 ] - 1), wpbc_today[ 2 ], 0, 0, 0 ); //Get today
    if ( (days_between( date, my_test_date ) + 1) < block_some_dates_from_today ) return [false, 'cal4date-' + class_day + ' date_user_unavailable'];

    return [true, 'cal4date-' + class_day + ' ' + additional_class + ' ']; // Available
}


function wpbc_search_apply_css_before_show_check_out(date){

    var class_day = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    var additional_class = 'date_available ';

    for ( var i = 0; i < user_unavilable_days.length; i++ ){
        if ( date.getDay() == user_unavilable_days[ i ] ) return [false, 'cal4date-' + class_day + ' date_user_unavailable'];
    }

    var my_test_date = new Date();
    my_test_date.setFullYear( wpbc_today[ 0 ], (wpbc_today[ 1 ] - 1), wpbc_today[ 2 ], 0, 0, 0 );           //Get today
    if ( (days_between( date, my_test_date ) + 1) < block_some_dates_from_today ) return [false, 'cal4date-' + class_day + ' date_user_unavailable'];


    if (
           ( document.getElementById( 'booking_search_check_in' ) != null )
        && ( document.getElementById( 'booking_search_check_in' ).value != '' )
    ){

        // Parse a string value into a date object
        var checkInDate = jQuery.datepick.parseDate( wpbc_search_form_dates_format, jQuery( '#booking_search_check_in' ).val() );

        var days_interval = getMinRangeDaysSelections();
        if ( days_interval > 0 ) days_interval--;
        checkInDate.setDate( checkInDate.getDate() + days_interval );

        if ( checkInDate <= date ){
            return [true, 'cal4date-' + class_day + ' ' + additional_class + ' ']; // Available
        } else {
            return [false, ''];                                                     // Unavailable
        }

    } else {
        return [true, 'cal4date-' + class_day + ' ' + additional_class + ' '];      // Available
    }
}

