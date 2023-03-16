jQuery(document).ready( function(){
   if( jQuery('.wpdev-validates-as-time').length > 0 ) {
       jQuery('.wpdev-validates-as-time').attr('alt','time');
       jQuery('.wpdev-validates-as-time').setMask();
   }
});


// Send booking Cacel by visitor
function bookingCancelByVisitor(booking_hash, bk_type, wpdev_active_locale){


    if (booking_hash!='') {


        document.getElementById('submiting' + bk_type).innerHTML =
            '<div style="height:20px;width:100%;text-align:center;margin:15px auto;"><img  style="vertical-align:middle;box-shadow:none;width:14px;" src="'+wpdev_bk_plugin_url+'/assets/img/ajax-loader.gif"><//div>';

        var wpdev_ajax_path = wpdev_bk_plugin_url+'/' + wpdev_bk_plugin_filename;
        var ajax_type_action='DELETE_BY_VISITOR';

        jQuery.ajax({                                           // Start Ajax Sending
            // url: wpdev_ajax_path,
            url: wpbc_ajaxurl,
            type:'POST',
            success: function (data, textStatus){if( textStatus == 'success')   jQuery('#ajax_respond_insert' + bk_type).html( data ) ;},
            error:function (XMLHttpRequest, textStatus, errorThrown){window.status = 'Ajax sending Error status:'+ textStatus;alert(XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText);if (XMLHttpRequest.status == 500) {alert('Please check at this page according this error:' + ' https://wpbookingcalendar.com/faq/#ajax-sending-error');}},
            // beforeSend: someFunction,
            data:{
                // ajax_action : ajax_type_action,
                action : ajax_type_action,
                booking_hash : booking_hash,
                bk_type : bk_type,
                wpdev_active_locale:wpdev_active_locale,
                wpbc_nonce: document.getElementById('wpbc_nonce_delete'+bk_type).value 
            }
        });
        return false;
    }
    return true;
}


////////////////////////////////////////////////////////////////////////////////

// Set cehckbox in booking form Exclusive on click
function wpdevExclusiveCheckbox(element){

    jQuery('[name="'+element.name+'"]').prop("checked", false);             // Uncheck  all checkboxes with  this name

    element.checked = true;
}

// Set selectbox with multiple selections - Exclusive
function wpdevExclusiveSelectbox(element){

    // Get all selected elements.
    var selectedOptions = jQuery.find('[name="'+element.name+'"] option:selected');

    // Check if we are have more than 1 selection
    if ( selectedOptions.length > 1 ) {

        var ind = selectedOptions[0].index;                                             // Get index of the first  selected element
        jQuery('[name="'+element.name+'"] option').prop("selected", false);             // Uncheck  all checkboxes with  this name
        jQuery('[name="'+element.name+'"] option:eq('+ind+')').prop("selected", true);  // Set the first element selected
    }        
}

////////////////////////////////////////////////////////////////////////////////


function wpdev_add_remark(id, text){
    
    document.getElementById("remark_row" + id ).style.display="none";

    wpbc_admin_show_message_processing( '' ); 
    
    jQuery.ajax({                                           // Start Ajax Sending
        url: wpbc_ajaxurl,        
        type:'POST',
        success: function (data, textStatus){if( textStatus == 'success')   jQuery('#ajax_respond').html( data );},
        error:function (XMLHttpRequest, textStatus, errorThrown){ window.status = 'Ajax sending Error status:'+ textStatus; alert(XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText); if (XMLHttpRequest.status == 500) { alert('Please check at this page according this error:' + ' https://wpbookingcalendar.com/faq/#ajax-sending-error'); } },
        // beforeSend: someFunction,
        data:{
            // ajax_action : 'UPDATE_REMARK',
            action : 'UPDATE_REMARK',
            remark_id : id,
            remark_text : text,
            wpbc_nonce: document.getElementById('wpbc_admin_panel_nonce').value
        }
    });
    return false;

}


function wpdev_change_bk_resource( booking_id, resource_id ){
    
    document.getElementById("changing_bk_res_in_booking" + booking_id ).style.display="none";

    wpbc_admin_show_message_processing( '' ); 

    var is_send_emeils = 1;                                                     //FixIn: 6.1.0.2
    if ( jQuery('#is_send_email_for_pending').length ) {
        is_send_emeils = jQuery( '#is_send_email_for_pending' ).is( ':checked' );       //FixIn: 8.7.9.5
        if ( false === is_send_emeils ) { is_send_emeils = 0; }
        else                            { is_send_emeils = 1; }
    }

    jQuery.ajax({                                           // Start Ajax Sending
        url: wpbc_ajaxurl,
        type:'POST',
        success: function (data, textStatus){if( textStatus == 'success')   jQuery('#ajax_respond').html( data );},
        error:function (XMLHttpRequest, textStatus, errorThrown){ window.status = 'Ajax sending Error status:'+ textStatus; alert(XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText); if (XMLHttpRequest.status == 500) { alert('Please check at this page according this error:' + ' https://wpbookingcalendar.com/faq/#ajax-sending-error'); } },
        // beforeSend: someFunction,
        data:{
            // ajax_action : 'UPDATE_BK_RESOURCE_4_BOOKING',
            action : 'UPDATE_BK_RESOURCE_4_BOOKING',
            booking_id : booking_id,
            resource_id : resource_id,
            is_send_emeils:is_send_emeils,                                      //FixIn: 6.1.0.2
            wpbc_nonce: document.getElementById('wpbc_admin_panel_nonce').value
        }
    });
    return false;

}


//FixIn: 5.4.5.1
/**
	 * Duplicate booking
 * 
 * @param {type} booking_id - Id of booking to  duplicate
 * @param {type} resource_id - destination  booking resource
 * @returns {Boolean}
 */
function wpbc_duplicate_booking_to_resource( booking_id, resource_id ){
    
    document.getElementById("changing_bk_res_in_booking" + booking_id ).style.display="none";

    var wpdev_active_locale = wpbc_get_selected_locale(booking_id,  '' );

    wpbc_admin_show_message_processing( '' ); 

    jQuery.ajax({                                           // Start Ajax Sending
        url: wpbc_ajaxurl,
        type:'POST',
        success: function (data, textStatus){if( textStatus == 'success')   jQuery('#ajax_respond').html( data );},
        error:function (XMLHttpRequest, textStatus, errorThrown){ window.status = 'Ajax sending Error status:'+ textStatus; alert(XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText); if (XMLHttpRequest.status == 500) { alert('Please check at this page according this error:' + ' https://wpbookingcalendar.com/faq/#ajax-sending-error'); } },
        // beforeSend: someFunction,
        data:{
            // ajax_action : 'UPDATE_BK_RESOURCE_4_BOOKING',
            action : 'DUPLICATE_BOOKING_TO_OTHER_RESOURCE',
            booking_id : booking_id,
            resource_id : resource_id,
            wpbc_nonce: document.getElementById('wpbc_admin_panel_nonce').value,
            wpdev_active_locale: wpdev_active_locale,
        }
    });
    return false;

}


//Print
function print_booking_listing(){                                               //FixIn: 7.0.1.34 - added #print_loyout_content before #wpbc_print_row -- because we are having 2 such  elements. May be in future to  use CLASSS instead of ID
    jQuery("#print_loyout_content").html( jQuery("#booking_print_loyout").html()  ) ;
    
    jQuery(".modal-footer").show();
    var selected_id = get_selected_bookings_id_in_booking_listing();
  
    // Show only selected
    if ( selected_id !='' ) {
        selected_id = selected_id.split('|');
        jQuery("#print_loyout_content .wpbc_print_rows").hide();
        for (var i = 0; i < selected_id.length; ++i) {
            jQuery("#print_loyout_content #wpbc_print_row" + selected_id[i] ).show();
        }
    } else {    // Show all
        jQuery("#print_loyout_content .wpbc_print_rows").show();   
    }
    
    //FixIn: 7.0.1.10
    if ( 'function' === typeof( jQuery('#wpbc_print_modal').wpbc_my_modal ) ) {        //FixIn: 9.0.1.5
        jQuery('#wpbc_print_modal').wpbc_my_modal('show');
    } else {
        alert('Warning! Booking Calendar. Its seems that  you have deactivated loading of Bootstrap JS files at Booking Settings General page in Advanced section.')
    }                
    
}

/*  Deprected Print     //FixIn: 9.2.1.6
function wpbc_all_element_to_print_section(elem) {                              //FixIn: 7.0.1.34 - new function  for creating print content
    
    var domClone = elem.cloneNode(true);
    
    var $wpbc_print_section = document.getElementById("wpbc_print_section");
    
    if (!$wpbc_print_section) {
        var $wpbc_print_section = document.createElement("div");
        $wpbc_print_section.id = "wpbc_print_section";
        document.body.appendChild($wpbc_print_section);
    }
    
    $wpbc_print_section.innerHTML = "";
    
    $wpbc_print_section.appendChild(domClone);
}

jQuery.fn.print = function(){
        
    wpbc_all_element_to_print_section( document.getElementById("print_loyout_content") );       //FixIn: 7.0.1.34 - new way  of printing - fix issue of not printing in Chrome
    window.print();
    return;
}
*/

// Export 
var csv_content;
//<![CDATA[
function export_booking_listing(export_type, wpdev_active_locale){
        
    var ajax_type_action    = 'EXPORT_BOOKINGS_TO_CSV';
    var bk_request_params     = document.getElementById('bk_request_params').value;


    // Export only selected,  if making export not all bookings
    var selected_id = get_selected_bookings_id_in_booking_listing();
    if ( export_type != 'page' ) {
        selected_id = '';
    }

    wpbc_admin_show_message_processing( '' ); 

    jQuery.ajax({                                           // Start Ajax Sending
        url: wpbc_ajaxurl,
        type:'POST',
        success: function (data, textStatus){  if( textStatus == 'success')   jQuery('#ajax_respond').html( data );},
        error:function (XMLHttpRequest, textStatus, errorThrown){ window.status = 'Ajax sending Error status:'+ textStatus; alert(XMLHttpRequest.status + ' ' + XMLHttpRequest.statusText); if (XMLHttpRequest.status == 500) { alert('Please check at this page according this error:' + ' https://wpbookingcalendar.com/faq/#ajax-sending-error'); } },
        // beforeSend: someFunction,
        data:{
            // ajax_action : ajax_type_action,
            action : ajax_type_action,
            csv_data:bk_request_params,
            export_type:export_type,
            selected_id:selected_id,
            wpbc_nonce: document.getElementById('wpbc_admin_panel_nonce').value 
            ,wpdev_active_locale:wpdev_active_locale
        }
    });
}
//]]>



function reset_to_def_from(type) {
    // document.getElementById('booking_form').value = reset_booking_form(type);
    var editor_textarea_id = 'booking_form';
    var editor_textarea_content = reset_booking_form(type);

    //FixIn: 8.4.7.18
    if  ( (typeof WPBC_CM !== 'undefined') && ( WPBC_CM.is_defined( '#' + editor_textarea_id ) ) ){

        WPBC_CM.set_codemirror_value( '#' + editor_textarea_id , editor_textarea_content );

    } else {

        if ( typeof tinymce != "undefined" ){
            var editor = tinymce.get( editor_textarea_id );
            if ( editor && editor instanceof tinymce.Editor ){
                editor.setContent( editor_textarea_content );
                editor.save( {no_events: true} );
            } else {
                jQuery( '#' + editor_textarea_id ).val( editor_textarea_content );
            }
        } else {
            jQuery( '#' + editor_textarea_id ).val( editor_textarea_content );
        }
    }
}

function reset_to_def_from_show(type) {
    // document.getElementById('booking_form_show').value = reset_booking_content_form(type);
    var editor_textarea_id = 'booking_form_show';
    var editor_textarea_content = reset_booking_content_form(type);

    //FixIn: 8.4.7.18
    if  ( (typeof WPBC_CM !== 'undefined') && ( WPBC_CM.is_defined( '#' + editor_textarea_id ) ) ){

        WPBC_CM.set_codemirror_value( '#' + editor_textarea_id , editor_textarea_content );
    } else {


        if( typeof tinymce != "undefined" ) {
            var editor = tinymce.get( editor_textarea_id );
            if( editor && editor instanceof tinymce.Editor ) {
                editor.setContent( editor_textarea_content );
                editor.save( { no_events: true } );
            } else {
                jQuery( '#' + editor_textarea_id ).val( editor_textarea_content );
            }
        } else {
            jQuery( '#' + editor_textarea_id ).val( editor_textarea_content );
        }
    }
}


function reset_booking_form(form_type) {
    var form_content = '';
    
    if ( (form_type == 'times') || (form_type == 'times30')  || (form_type == 'times15') ){
           form_content = '';
           form_content +='[calendar] \n'; 
           form_content +='<div class="times-form"> \n';
           if ( form_type == 'times' ) {
                form_content +='     <p>Select Times:<br />[select* rangetime multiple "10:00 AM - 12:00 PM@@10:00 - 12:00" "12:00 PM - 02:00 PM@@12:00 - 14:00" "02:00 PM - 04:00 PM@@14:00 - 16:00" "04:00 PM - 06:00 PM@@16:00 - 18:00" "06:00 PM - 08:00 PM@@18:00 - 20:00"]</p> \n';
           } 
           if ( form_type == 'times30' ) { //FixIn: 7.1.2.6
                form_content +='     <p>Select Times:<br />[select rangetime "06:00 - 06:30" "06:30 - 07:00" "07:00 - 07:30" "07:30 - 08:00" "08:00 - 08:30" "08:30 - 09:00" "09:00 - 09:30" "09:30 - 10:00" "10:00 - 10:30" "10:30 - 11:00" "11:00 - 11:30" "11:30 - 12:00" "12:00 - 12:30" "12:30 - 13:00" "13:00 - 13:30" "13:30 - 14:00" "14:00 - 14:30" "14:30 - 15:00" "15:00 - 15:30" "15:30 - 16:00" "16:00 - 16:30" "16:30 - 17:00" "17:00 - 17:30" "17:30 - 18:00" "18:00 - 18:30" "18:30 - 19:00" "19:00 - 19:30" "19:30 - 20:00" "20:00 - 20:30" "20:30 - 21:00" "21:00 - 21:30"]</p> \n';
           }
           if ( form_type == 'times15' ) { //FixIn: 7.1.2.6
                form_content +='     <p>Select Times:<br />[select rangetime "8:00 AM - 8:15 AM@@08:00 - 08:15" "8:15 AM - 8:30 AM@@08:15 - 08:30" "8:30 AM - 8:45 AM@@08:30 - 08:45" "8:45 AM - 9:00 AM@@08:45 - 09:00" "9:00 AM - 9:15 AM@@09:00 - 09:15" "9:15 AM - 9:30 AM@@09:15 - 09:30" "9:30 AM - 9:45 AM@@09:30 - 09:45" "9:45 AM - 10:00 AM@@09:45 - 10:00" "10:00 AM - 10:15 AM@@10:00 - 10:15" "10:15 AM - 10:30 AM@@10:15 - 10:30" "10:30 AM - 10:45 AM@@10:30 - 10:45" "10:45 AM - 11:00 AM@@10:45 - 11:00" "11:00 AM - 11:15 AM@@11:00 - 11:15" "11:15 AM - 11:30 AM@@11:15 - 11:30" "11:30 AM - 11:45 AM@@11:30 - 11:45" "11:45 AM - 12:00 AM@@11:45 - 12:00" "12:00 AM - 12:15 AM@@12:00 - 12:15" "12:15 AM - 12:30 AM@@12:15 - 12:30" "12:30 AM - 12:45 AM@@12:30 - 12:45" "12:45 AM - 1:00 PM@@12:45 - 13:00" "1:00 PM - 1:15 PM@@13:00 - 13:15" "1:15 PM - 1:30 PM@@13:15 - 13:30" "1:30 PM - 1:45 PM@@13:30 - 13:45" "1:45 PM - 2:00 PM@@13:45 - 14:00" "2:00 PM - 2:15 PM@@14:00 - 14:15" "2:15 PM - 2:30 PM@@14:15 - 14:30" "2:30 PM - 2:45 PM@@14:30 - 14:45" "2:45 PM - 3:00 PM@@14:45 - 15:00" "3:00 PM - 3:15 PM@@15:00 - 15:15" "3:15 PM - 3:30 PM@@15:15 - 15:30" "3:30 PM - 3:45 PM@@15:30 - 15:45" "3:45 PM - 4:00 PM@@15:45 - 16:00" "4:00 PM - 4:15 PM@@16:00 - 16:15" "4:15 PM - 4:30 PM@@16:15 - 16:30" "4:30 PM - 4:45 PM@@16:30 - 16:45" "4:45 PM - 5:00 PM@@16:45 - 17:00" "5:00 PM - 5:15 PM@@17:00 - 17:15" "5:15 PM - 5:30 PM@@17:15 - 17:30" "5:30 PM - 5:45 PM@@17:30 - 17:45" "5:45 PM - 6:00 PM@@17:45 - 18:00" "6:00 PM - 6:15 PM@@18:00 - 18:15" "6:15 PM - 6:30 PM@@18:15 - 18:30" "6:30 PM - 6:45 PM@@18:30 - 18:45" "6:45 PM - 7:00 PM@@18:45 - 19:00" "7:00 PM - 7:15 PM@@19:00 - 19:15" "7:15 PM - 7:30 PM@@19:15 - 19:30" "7:30 PM - 7:45 PM@@19:30 - 19:45" "7:45 PM - 8:00 PM@@19:45 - 20:00" "8:00 PM - 8:15 PM@@20:00 - 20:15" "8:15 PM - 8:30 PM@@20:15 - 20:30" "8:30 PM - 8:45 PM@@20:30 - 20:45" "8:45 PM - 9:00 PM@@20:45 - 21:00" "9:00 PM - 9:15 PM@@21:00 - 21:15" "9:15 PM - 9:30 PM@@21:15 - 21:30" "9:30 PM - 9:45 PM@@21:30 - 21:45"]</p> \n';
           }
           form_content +='     <p>First Name (required):<br />[text* name] </p> \n';
           form_content +='     <p>Last Name (required):<br />[text* secondname] </p> \n';
           form_content +='     <p>Email (required):<br />[email* email] </p>   \n';
           form_content +='     <p>Phone:<br />[text phone] </p> \n';
           form_content +='     <p>Adults:  [select visitors class:col-md-1 "1" "2" "3" "4"] Children: [select children class:col-md-1 "0" "1" "2" "3"]</p> \n';
           form_content +='     <p>Details:<br /> [textarea details] </p> \n';
           form_content +='     <p>[checkbox* term_and_condition use_label_element "I Accept term and conditions"] </p>\n';
           form_content +='     <p>[captcha]</p> \n';
           form_content +='     <p>[submit class:btn "Send"]</p> \n';
           form_content +='</div>';
    }

    if (form_type == 'timesweek'){
           form_content = '';
           form_content +='[calendar] \n'; 
           form_content +='<div class="times-form"> \n';
           form_content +='<p> \n';
           form_content +='    [condition name="weekday-condition" type="weekday" value="*"] \n';
           form_content +='        Select Time Slot:<br/> [select rangetime multiple "10:00 - 12:00" "12:00 - 14:00" "14:00 - 16:00" "16:00 - 18:00" "18:00 - 20:00"] \n';
           form_content +='    [/condition] \n';
           form_content +='    [condition name="weekday-condition" type="weekday" value="1,2"] \n';
           form_content +='        Select Time Slot available on Monday, Tuesday:<br/>    [select rangetime multiple "10:00 - 12:00" "12:00 - 14:00"] \n';
           form_content +='    [/condition] \n';
           form_content +='    [condition name="weekday-condition" type="weekday" value="3,4"] \n';
           form_content +='        Select Time Slot available on Wednesday, Thursday:<br/>  [select rangetime multiple "14:00 - 16:00" "16:00 - 18:00" "18:00 - 20:00"] \n';
           form_content +='    [/condition] \n';
           form_content +='    [condition name="weekday-condition" type="weekday" value="5,6,0"] \n';
           form_content +='        Select Time Slot available on Friday, Saturday, Sunday:<br/> [select rangetime multiple "12:00 - 14:00" "14:00 - 16:00" "16:00 - 18:00"] \n';
           form_content +='    [/condition] \n';
           form_content +='</p> \n';
           form_content +='     <p>First Name (required):<br />[text* name] </p> \n';
           form_content +='     <p>Last Name (required):<br />[text* secondname] </p> \n';
           form_content +='     <p>Email (required):<br />[email* email] </p>   \n';
           form_content +='     <p>Phone:<br />[text phone] </p> \n';
           form_content +='     <p>Adults:  [select visitors class:col-md-1 "1" "2" "3" "4"] Children: [select children class:col-md-1 "0" "1" "2" "3"]</p> \n';
           form_content +='     <p>Details:<br /> [textarea details] </p> \n';
           form_content +='     <p>[checkbox* term_and_condition use_label_element "I Accept term and conditions"] </p>\n';
           form_content +='     <p>[captcha]</p> \n';
           form_content +='     <p>[submit class:btn "Send"]</p> \n';
           form_content +='</div>';
    }

    if (form_type == 'hints'){
           form_content = '';
           form_content +='[calendar] \n'; 
           form_content +='<div class="standard-form"> \n';
           form_content +='     <div class="form-hints"> \n';
           form_content +='          Dates:[selected_short_timedates_hint]  ([nights_number_hint] - night(s))<br><br> \n';
           form_content +='          Full cost of the booking: [cost_hint] <br> \n';
           form_content +='     </div><hr/> \n';
           form_content +='     <p>First Name (required):<br />[text* name] </p> \n';
           form_content +='     <p>Last Name (required):<br />[text* secondname] </p> \n';
           form_content +='     <p>Email (required):<br />[email* email] </p>   \n';
           form_content +='     <p>Phone:<br />[text phone] </p> \n';
           form_content +='     <p>Adults:  [select visitors class:col-md-1 "1" "2" "3" "4"] Children: [select children class:col-md-1 "0" "1" "2" "3"]</p> \n';
           form_content +='     <p>Details:<br /> [textarea details] </p> \n';
           form_content +='     <p>[checkbox* term_and_condition use_label_element "I Accept term and conditions"] </p>\n';
           form_content +='     <p>[captcha]</p> \n';
           form_content +='     <p>[submit class:btn "Send"]</p> \n';
           form_content +='</div>';
    }

    //FixIn: 8.7.3.5
    if ( 'hints-dev' == form_type ){
           form_content = '';
           form_content +='[calendar] \n';
           form_content +='<div class="standard-form"> \n';
           form_content +='     <div class="form-hints-dev"> \n';
           form_content +='		 <p>Dates: <span class="dates-hints-dev">[selected_short_dates_hint]</span> \n';
           form_content +='			 ([days_number_hint] - day(s))</p> \n';
           form_content +='         <p>Total booking cost: <strong>[cost_hint]</strong></p> \n';
           form_content +='     </div> \n';
           form_content +='     <p>First Name (required):<br />[text* name] </p> \n';
           form_content +='     <p>Last Name (required):<br />[text* secondname] </p> \n';
           form_content +='     <p>Email (required):<br />[email* email] </p> \n';
           form_content +='     <p>Adults:<br />[select visitors "1" "2" "3" "4" "5" "6" "7" "8" "9"]</p> \n';
           form_content +='     <p>Children:<br />[select children "0" "1" "2" "3"]</p> \n';
           form_content +='     <p>Details:<br /> [textarea details] </p> \n';
           form_content +='     <p>[submit class:btn "Send"]</p> \n';
           form_content +='</div>';
    }

	if ( (form_type == 'payment') || (form_type == 'paymentUS') ){
        form_content = '';
        form_content +='[calendar] \n';
        form_content +='<div class="payment-form"> \n';
        form_content +='     <p>First Name (required):<br />[text* name] </p> \n';
        form_content +='     <p>Last Name (required):<br />[text* secondname] </p> \n';
        form_content +='     <p>Email (required):<br />[email* email] </p> \n';
        form_content +='     <p>Phone:<br />[text phone] </p> \n';
        form_content +='     <p>Address (required):<br />  [text* address] </p> \n';  
        form_content +='     <p>City (required):<br />  [text* city] </p> \n';
        form_content +='     <p>Post code (required):<br />  [text* postcode] </p> \n';
        if ( form_type == 'paymentUS' ){                                                                                //FixIn: 8.1.1.5
            form_content +='     <p>Country (required):<br />  [country "US"] </p> \n';
            form_content +='     <p>State:<br /> [select state "" "Alabama@@AL" "Alaska@@AK" "Arizona@@AZ" "Arkansas@@AR" "California@@CA" "Colorado@@CO" "Connecticut@@CT" "Delaware@@DE" "Florida@@FL" "Georgia@@GA" "Hawaii@@HI" "Idaho@@ID" "Illinois@@IL" "Indiana@@IN" "Iowa@@IA" "Kansas@@KS" "Kentucky@@KY" "Louisiana@@LA" "Maine@@ME" "Maryland@@MD" "Massachusetts@@MA" "Michigan@@MI" "Minnesota@@MN" "Mississippi@@MS" "Missouri@@MO" "Montana@@MT" "Nebraska@@NE" "Nevada@@NV" "New Hampshire@@NH" "New Jersey@@NJ" "New Mexico@@NM" "New York@@NY" "North Carolina@@NC" "North Dakota@@ND" "Ohio@@OH" "Oklahoma@@OK" "Oregon@@OR" "Pennsylvania@@PA" "Rhode Island@@RI" "South Carolina@@SC" "South Dakota@@SD" "Tennessee@@TN" "Texas@@TX" "Utah@@UT" "Vermont@@VT" "Virginia@@VA" "Washington@@WA" "West Virginia@@WV" "Wisconsin@@WI" "Wyoming@@WY"] </p> \n';
		} else {
			form_content += '     <p>Country (required):<br />  [country] </p> \n';
		}
        form_content +='     <p>Adults:  [select visitors class:col-md-1 "1" "2" "3" "4"] Children: [select children class:col-md-1 "0" "1" "2" "3"]</p> \n';
        form_content +='     <p>Details:<br /> [textarea details] </p> \n';
        form_content +='     <p>[checkbox* term_and_condition use_label_element "I Accept term and conditions"] </p> \n';
        form_content +='     <p>[captcha]</p> \n';
        form_content +='     <p>[submit class:btn "Send"]</p> \n';
        form_content +='</div>';
    }

    if (form_type == 'wizard')  {
        //FixIn: 8.6.1.15
		form_content = '';
        form_content +='<div class="wpbc_wizard_step wpbc_wizard_step1"> \n';
        form_content +='     [calendar] \n';
        form_content +='     <a href="javascript:void(0);" onclick="javascript:wpbc_wizard_step(this ,2);" class="btn">Continue to step 2</a> \n';
        form_content +='</div> \n\n';
        form_content +='<div class="wpbc_wizard_step wpbc_wizard_step2" style="display:none;clear:both;"> \n';
        form_content +='     <p>First Name (required):<br />[text* name] </p> \n';
        form_content +='     <p>Last Name (required):<br />[text* secondname] </p> \n';
        form_content +='     <p>Email (required):<br />[email* email] </p> \n';
        form_content +='     <p>Phone:<br />[text phone] </p> \n';
        form_content +='     <p>Adults:  [select visitors class:col-md-1 "1" "2" "3" "4"] Children: [select children class:col-md-1 "0" "1" "2" "3"]</p> \n';
        form_content +='     <p>Details:<br /> [textarea details] </p> \n';
        form_content +='     <p>[checkbox* term_and_condition use_label_element "I Accept term and conditions"] </p> \n';
        form_content +='     <p>[captcha]</p> \n';
        form_content +='     <hr/> \n';
        form_content +='    <div style="text-align:right;">[submit class:btn "Send"] <a href="javascript:void(0);" onclick="javascript:wpbc_wizard_step(this, 1);" class="btn">Back to step 1</a></div> \n';
        form_content +='</div>';
        /*
        form_content = '';          
        form_content +='<div class="bk_calendar_step"> \n';
        form_content +='     [calendar] \n';
        form_content +='     <a href="javascript:;" onclick="javascript:bk_calendar_step_click(this);" class="btn">Continue to step 2</a> \n';
        form_content +='</div> \n\n';
        form_content +='<div class="bk_form_step" style="display:none;clear:both;"> \n';
        form_content +='     <p>First Name (required):<br />[text* name] </p> \n';
        form_content +='     <p>Last Name (required):<br />[text* secondname] </p> \n'; 
        form_content +='     <p>Email (required):<br />[email* email] </p> \n';
        form_content +='     <p>Phone:<br />[text phone] </p> \n';
        form_content +='     <p>Adults:  [select visitors class:col-md-1 "1" "2" "3" "4"] Children: [select children class:col-md-1 "0" "1" "2" "3"]</p> \n';
        form_content +='     <p>Details:<br /> [textarea details] </p> \n';
        form_content +='     <p>[checkbox* term_and_condition use_label_element "I Accept term and conditions"] </p> \n';
        form_content +='     <p>[captcha]</p> \n';
        form_content +='     <hr/> \n';
        form_content +='    <div style="text-align:right;">[submit class:btn "Send"] <a href="javascript:;" onclick="javascript:bk_form_step_click(this);" class="btn">Back to step 1</a></div> \n';
        form_content +='</div> \n\n';
		//FixIn: 8.1.2.16
        // FixIn: 8.4.4.4
        /*
        form_content +='<script type="text/javascript"> \n';
        form_content +='function bk_calendar_step_click( el ){ \n';
        form_content +='  var br_id = jQuery( el ).closest( \'form\' ).find( \'input[name^="bk_type"]\' ).val(); \n';
        form_content +='  var is_error = wpbc_check_errors_in_booking_form( br_id ); \n';                               //FixIn: 8.4.0.2
        form_content +='  if ( is_error ) { return false; } \n';
        form_content +='  if ( br_id != undefined ) { \n';
        form_content +='    jQuery( "#booking_form" + br_id + " .bk_calendar_step" ).css({"display":"none"}); \n';
        form_content +='    jQuery( "#booking_form" + br_id + " .bk_form_step" ).css({"display":"block"}); \n';
        form_content +='  } else { \n';
        form_content +='    jQuery(".bk_calendar_step" ).css({"display":"none"}); \n';
        form_content +='    jQuery(".bk_form_step" ).css({"display":"block"}); \n';
        form_content +='  } \n';
        form_content +='} \n';
        form_content +='function bk_form_step_click( el ){ \n';
        form_content +='  var br_id = jQuery( el ).closest( \'form\' ).find( \'input[name^="bk_type"]\' ).val(); \n';
        form_content +='  var is_error = wpbc_check_errors_in_booking_form( br_id ); \n';                               //FixIn: 8.4.0.2
        form_content +='  if ( is_error ) { return false; } \n';
        form_content +='  if ( br_id != undefined ) { \n';
        form_content +='    jQuery( "#booking_form" + br_id + " .bk_calendar_step" ).css({"display":"block"}); \n';
        form_content +='    jQuery( "#booking_form" + br_id + " .bk_form_step" ).css({"display":"none"}); \n';
        form_content +='    makeScroll( "#bklnk" + br_id ); \n';
        form_content +='  } else { \n';
        form_content +='    jQuery(".bk_calendar_step" ).css({"display":"block"}); \n';
        form_content +='    jQuery(".bk_form_step" ).css({"display":"none"}); \n';
        form_content +='  } \n';
        form_content +='} \n';
        form_content +='</script>';
        */
    }

    if (form_type == '2collumns')  { // calendar next to  form
        form_content = '';
        form_content +='<div style="float:left;margin-right:10px;   " >  [calendar]  </div> \n';
        form_content +='<div style="float:left;" > \n';
        form_content +='     <p>First Name (required):<br />[text* name] </p> \n';
        form_content +='     <p>Last Name (required):<br />[text* secondname] </p> \n';
        form_content +='     <p>Email (required):<br />[email* email] </p> \n';
        form_content +='     <p>Phone:<br />[text phone] </p> \n';
        form_content +='     <p>Adults:  [select visitors class:col-md-1 "1" "2" "3" "4"]  Children: [select children class:col-md-1 "0" "1" "2" "3"]</p> \n';
        form_content +='</div> \n';
        form_content +='<div  style="clear:both"> \n';
        form_content +='     <p>Details:<br /> [textarea details 100x5 class:col-md-6]</p> \n';
        form_content +='      [captcha]\n';
        form_content +='     <p>[checkbox* term_and_condition use_label_element "I Accept term and conditions"]</p> \n';
        form_content +='     <hr/><p>[submit class:btn "Send"] </p> \n';
        form_content +='</div>';
    }

    //FixIn: 8.7.7.15
    if (form_type == 'fields2columns')  { // 2 columns form
        form_content = '';
        form_content +='[calendar]\n';
        form_content +='<div class="wpbc_form_columns">\n';
        form_content +='	<div class="wpbc_form_row">\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>First Name (required):</label><br/>[text* name]\n';
        form_content +='		</div>\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>Last Name (required):</label><br/>[text* secondname]\n';
        form_content +='		</div>\n';
        form_content +='	</div>\n';
        form_content +='	<div class="wpbc_form_row">\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>Email (required):</label><br/>[email* email]\n';
        form_content +='		</div>\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>Phone:</label><br/>[text phone]\n';
        form_content +='		</div>\n';
        form_content +='	</div>\n';
        form_content +='	<div class="wpbc_form_row">\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>Address (required):</label><br/>[text* address]\n';
        form_content +='		</div>\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>City (required):</label><br/>[text* city]\n';
        form_content +='		</div>\n';
        form_content +='	</div>\n';
        form_content +='	<div class="wpbc_form_row">\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>Post code (required):</label><br/>[text* postcode]\n';
        form_content +='		</div>\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>Country (required):</label><br/>[country]\n';
        form_content +='		</div>\n';
        form_content +='	</div>\n';
        form_content +='	<div class="wpbc_form_row">\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>Adults:</label><br/>[select visitors "1" "2" "3" "4" "5"]\n';
        form_content +='		</div>\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>Children:</label><br/>[select children "0" "1" "2" "3"]\n';
        form_content +='		</div>\n';
        form_content +='	</div>\n';
        form_content +='	<div class="wpbc_form_row">\n';
        form_content +='		<div class="wpbc_form_field">\n';
        form_content +='			<label>Details:</label>\n';
        form_content +='			<div style="clear:both;width:100%;"></div>\n';
        form_content +='			[textarea details]\n';
        form_content +='		</div>\n';
        form_content +='	</div><br/>\n';
        form_content +='	<p>[submit class:btn "Send"]</p>\n';
        form_content +='</div>';
    }

    //FixIn: 8.8.2.6
    if (form_type == 'fields3columns')  { // 3 columns form
        form_content +='<div class="wpbc_form_columns_general">\n';
        form_content +='    <div class="wpbc_form_row_general">\n';
        form_content +='        <div class="wpbc_form_field_general">\n';
        form_content +='            [calendar]\n';
        form_content +='        </div>\n';
        form_content +='        <div class="wpbc_form_field_general">\n';
        form_content +='            <div class="wpbc_form_columns">\n';
        form_content +='                <div class="wpbc_form_row">\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>First Name (required):</label><br/>[text* name]\n';
        form_content +='                    </div>\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>Last Name (required):</label><br/>[text* secondname]\n';
        form_content +='                    </div>\n';
        form_content +='                </div>\n';
        form_content +='                <div class="wpbc_form_row">\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>Email (required):</label><br/>[email* email]\n';
        form_content +='                    </div>\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>Phone:</label><br/>[text phone]\n';
        form_content +='                    </div>\n';
        form_content +='                </div>\n';
        form_content +='                <div class="wpbc_form_row">\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>Address (required):</label><br/>[text* address]\n';
        form_content +='                    </div>\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>City (required):</label><br/>[text* city]\n';
        form_content +='                    </div>\n';
        form_content +='                </div>\n';
        form_content +='                <div class="wpbc_form_row">\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>Post code (required):</label><br/>[text* postcode]\n';
        form_content +='                    </div>\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>Country (required):</label><br/>[country]\n';
        form_content +='                    </div>\n';
        form_content +='                </div>\n';
        form_content +='                <div class="wpbc_form_row">\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>Adults:</label><br/>[select visitors "1" "2" "3" "4" "5"]\n';
        form_content +='                    </div>\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>Children:</label><br/>[select children "0" "1" "2" "3"]\n';
        form_content +='                    </div>\n';
        form_content +='                </div>\n';
        form_content +='                <div class="wpbc_form_row">\n';
        form_content +='                    <div class="wpbc_form_field">\n';
        form_content +='                        <label>Details:</label>\n';
        form_content +='                        <div style="clear:both;width:100%;"></div>\n';
        form_content +='                        [textarea details]\n';
        form_content +='                    </div>\n';
        form_content +='                </div><br/>\n';
        form_content +='                <p>[submit class:btn "Send"]</p>\n';
        form_content +='            </div>\n';
        form_content +='        </div>\n';
        form_content +='    </div>\n';
        form_content +='</div>\n';
    }


    //FixIn: 8.7.11.14
    if (form_type == 'fields2columnstimes')  { // 2 columns form
        form_content = '';
        form_content +='	<div style="max-width:760px;">\n';
        form_content +='		<div class="wpbc_row">\n';
        form_content +='			<div class="wpbc_col wpbc_cal">\n';
        form_content +='				Select Date:<br />\n';
        form_content +='				[calendar]\n';
        form_content +='			</div>\n';
        form_content +='			<div class="wpbc_col wpbc_times">\n';
        form_content +='				Select Times:<br />[select* rangetime multiple "10:00 AM - 12:00 PM@@10:00 - 12:00" "12:00 PM - 02:00 PM@@12:00 - 14:00" "02:00 PM - 04:00 PM@@14:00 - 16:00" "04:00 PM - 06:00 PM@@16:00 - 18:00" "06:00 PM - 08:00 PM@@18:00 - 20:00"]\n';
        form_content +='			</div>\n';
        form_content +='		</div>\n';
        form_content +='		<div class="wpbc_row">	\n';
        form_content +='			<div class="wpbc_col">\n';
        form_content +='				 First Name (required):<br />[text* name] \n';
        form_content +='			</div> \n';
        form_content +='			<div class="wpbc_col">\n';
        form_content +='				 Last Name (required):<br />[text* secondname] \n';
        form_content +='			</div> \n';
        form_content +='		</div>	\n';
        form_content +='		<div class="wpbc_row">	\n';
        form_content +='			<div class="wpbc_col">\n';
        form_content +='				 Email (required):<br />[email* email] \n';
        form_content +='			</div> \n';
        form_content +='			<div class="wpbc_col">\n';
        form_content +='				 Phone:<br />[text phone] \n';
        form_content +='			</div> \n';
        form_content +='		</div>		\n';
        form_content +='		<div class="wpbc_row">	\n';
        form_content +='			<div class="wpbc_col">\n';
        form_content +='				 Adults: <br /> [select visitors "1" "2" "3" "4"]\n';
        form_content +='			</div> \n';
        form_content +='			<div class="wpbc_col">\n';
        form_content +='				 Children:<br /> [select children "0" "1" "2" "3"]\n';
        form_content +='			</div> \n';
        form_content +='		</div>		\n';
        form_content +='		<div class="wpbc_row">	\n';
        form_content +='			<div class="wpbc_col" style="flex:1;">\n';
        form_content +='				 Details:<br /> [textarea details x5 class:col-md-10]\n';
        form_content +='			</div> \n';
        form_content +='		</div>\n';
        form_content +='		<div class="wpbc_row">	\n';
        form_content +='			<div class="wpbc_col" style="flex:1;border-bottom:1px solid #eee;">\n';
        form_content +='				 [captcha]\n';
        form_content +='				<p>[checkbox* term_and_condition use_label_element "I Accept term and conditions"]</p> \n';
        form_content +='			</div> \n';
        form_content +='		</div>\n';
        form_content +='		<div class="wpbc_row">	\n';
        form_content +='			<div class="wpbc_col">\n';
        form_content +='				[submit class:btn "Send"]\n';
        form_content +='			</div> \n';
        form_content +='		</div> \n';
        form_content +='	</div>';
    }

    if (form_content == '') { // Default Form.
           form_content = '';
           form_content +='[calendar] \n'; 
           form_content +='<div class="standard-form"> \n';
           form_content +='     <p>First Name (required):<br />[text* name] </p> \n';
           form_content +='     <p>Last Name (required):<br />[text* secondname] </p> \n';
           form_content +='     <p>Email (required):<br />[email* email] </p>   \n';
           form_content +='     <p>Phone:<br />[text phone] </p> \n';
           form_content +='     <p>Adults:  [select visitors class:col-md-1 "1" "2" "3" "4"] Children: [select children class:col-md-1 "0" "1" "2" "3"]</p> \n';
           form_content +='     <p>Details:<br /> [textarea details] </p> \n';
           form_content +='     <p>[checkbox* term_and_condition use_label_element "I Accept term and conditions"] </p>\n';
           form_content +='     <p>[captcha]</p> \n';
           form_content +='     <p>[submit class:btn "Send"]</p> \n';
           form_content +='</div>';
    }
    
    return form_content;
}

function reset_booking_content_form(form_type){
    var form_content = '';
        
    if ( (form_type == 'payment')  || (form_type == 'paymentUS') || ( 'fields2columns' == form_type ) || ( 'fields3columns' == form_type ) ) {               //FixIn: 8.7.7.15      //FixIn: 8.8.2.6
        form_content = '';
        form_content += '<div class="payment-content-form"> \n';
        form_content += '    <strong>First Name</strong>:<span class="fieldvalue">[name]</span><br/> \n';
        form_content += '    <strong>Last Name</strong>:<span class="fieldvalue">[secondname]</span><br/> \n';
        form_content += '    <strong>Email</strong>:<span class="fieldvalue">[email]</span><br/> \n';
        form_content += '    <strong>Phone</strong>:<span class="fieldvalue">[phone]</span><br/> \n';
        form_content += '    <strong>Address</strong>:<span class="fieldvalue">[address]</span><br/> \n';
        form_content += '    <strong>City</strong>:<span class="fieldvalue">[city]</span><br/> \n';
        form_content += '    <strong>Post code</strong>:<span class="fieldvalue">[postcode]</span><br/> \n';
        form_content += '    <strong>Country</strong>:<span class="fieldvalue">[country]</span><br/> \n';
        if ( form_type == 'paymentUS' ) { //FixIn: 8.1.1.5
            form_content += '    <strong>State</strong>:<span class="fieldvalue">[state]</span><br/> \n';
        }
        form_content += '    <strong>Adults</strong>:<span class="fieldvalue"> [visitors]</span><br/> \n';
        form_content += '    <strong>Children</strong>:<span class="fieldvalue"> [children]</span><br/> \n';
        form_content += '    <strong>Details</strong>:<br /><span class="fieldvalue"> [details]</span> \n';
        form_content += '</div>';
    }

    if ( (form_type == 'times') || (form_type == 'times30')  || (form_type == 'times15')  || ( form_type == 'timesweek') || ( 'fields2columnstimes' == form_type ) ){      //FixIn: 7.1.2.6       //FixIn: 8.7.11.14
        form_content = '';
        form_content +='<div class="times-content-form"> \n';
        form_content +='  <strong>Times</strong>:<span class="fieldvalue">[rangetime]</span><br/> \n';
        form_content +='  <strong>First Name</strong>:<span class="fieldvalue">[name]</span><br/> \n';
        form_content +='  <strong>Last Name</strong>:<span class="fieldvalue">[secondname]</span><br/> \n';
        form_content +='  <strong>Email</strong>:<span class="fieldvalue">[email]</span><br/> \n';
        form_content +='  <strong>Phone</strong>:<span class="fieldvalue">[phone]</span><br/> \n';
        form_content +='  <strong>Adults</strong>:<span class="fieldvalue"> [visitors]</span><br/> \n';
        form_content +='  <strong>Children</strong>:<span class="fieldvalue"> [children]</span><br/> \n';
        form_content +='  <strong>Details</strong>:<br /><span class="fieldvalue"> [details]</span> \n';
        form_content +='</div>';
    }

    //FixIn: 8.7.3.5
    if ( 'hints-dev' == form_type ){
        form_content = '';
        form_content +='<div class="standard-content-form"> \n';
        form_content +='	<strong>First Name</strong>:<span class="fieldvalue">[name]</span><br/> \n';
        form_content +='	<strong>Last Name</strong>:<span class="fieldvalue">[secondname]</span><br/> \n';
        form_content +='	<strong>Email</strong>:<span class="fieldvalue">[email]</span><br/> \n';
        form_content +='	<strong>Adults</strong>:<span class="fieldvalue"> [visitors]</span><br/> \n';
        form_content +='	<strong>Children</strong>:<span class="fieldvalue"> [children]</span><br/> \n';
        form_content +='	<strong>Details</strong>:<br /><span class="fieldvalue"> [details]</span> \n';
        form_content +='</div>';
    }

    if (  (form_type == 'wizard') || (form_type == '2collumns') || (form_content == 'hints') || (form_content == '') ){
        form_content = '';
        form_content +='<div class="standard-content-form"> \n';
        form_content +='    <strong>First Name</strong>:<span class="fieldvalue">[name]</span><br/> \n';
        form_content +='    <strong>Last Name</strong>:<span class="fieldvalue">[secondname]</span><br/> \n';
        form_content +='    <strong>Email</strong>:<span class="fieldvalue">[email]</span><br/> \n';
        form_content +='    <strong>Phone</strong>:<span class="fieldvalue">[phone]</span><br/> \n';
        form_content +='    <strong>Adults</strong>:<span class="fieldvalue"> [visitors]</span><br/> \n';
        form_content +='    <strong>Children</strong>:<span class="fieldvalue"> [children]</span><br/> \n';
        form_content +='    <strong>Details</strong>:<br /><span class="fieldvalue"> [details]</span> \n';
        form_content +='</div>';
    }
    return form_content;
}



function setSelectBoxByValue(el_id, el_value) {

    for (var i=0; i < document.getElementById(el_id).length; i++) {
        if (document.getElementById(el_id)[i].value == el_value) {
            document.getElementById(el_id)[i].selected = true;
        }
    }
}