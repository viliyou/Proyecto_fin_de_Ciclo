<?php /**
 * @version 1.0
 * @package Booking Calendar 
 * @category Content of Settings page 
 * @author wpdevelop
 *
 * @web-site https://wpbookingcalendar.com/
 * @email info@wpbookingcalendar.com 
 * 
 * @modified 2015-11-02
 */

if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit if accessed directly


/**
	 * Show Content
 *  Update Content
 *  Define Slug
 *  Define where to show
 */
class WPBC_Page_SettingsUp extends WPBC_Page_Structure {
    
    
    public function in_page() {
    	if ( ! wpbc_is_show_up_news() ) { return 'wpbc-settings-none'; }    												//FixIn: 8.1.3.9
        return 'wpbc-settings';
    }        
    
    
    public function tabs() {
       
        $tabs = array();
        
        
        
        $tabs[ 'upgrade' ] = array(
                                    'title' => __( 'Upgrade', 'booking')                     // Title of TAB    
                                  , 'page_title' => __( 'Upgrade to higher version', 'booking')                // Title of Page    
                                  , 'hint' => ''                      // Hint    
                                  , 'link' => ''                      // Can be skiped,  then generated link based on Page and Tab tags. Or can  be extenral link
                                  , 'position' => 'right'             // 'left'  ||  'right'  ||  ''
                                  , 'css_classes' => ''               // CSS class(es)
                                  , 'icon' => ''                      // Icon - link to the real PNG img
                                  , 'font_icon' => 'wpbc_icn_redeem'                 // CSS definition  of forn Icon
                                  , 'default' => false                // Is this tab activated by default or not: true || false. 
                    );
        
        return $tabs;
    }


    public function content() {
                
        // Checking ////////////////////////////////////////////////////////////
        
        do_action( 'wpbc_hook_settings_page_header', 'upgrade_settings');       // Define Notices Section and show some static messages, if needed
        
        if ( ! wpbc_is_mu_user_can_be_here('activated_user') ) return false;    // Check if MU user activated, otherwise show Warning message.
   
        if ( ! wpbc_is_mu_user_can_be_here('only_super_admin') ) return false;  // User is not Super admin, so exit.  Basically its was already checked at the bottom of the PHP file, just in case.
            
        
        
        // Content  ////////////////////////////////////////////////////////////
        ?>
        <div class="clear" style="margin-bottom:10px;"></div>
        <span class="metabox-holder">

                <div class="wpbc_settings_row" >
                    <?php 
                    
                    $version = get_bk_version();
                    
                    if ( wpbc_is_this_demo() )  
                        $version = 'free';

                    $title = 'Upgrade to ';
                    if ( ($version == 'personal' ) )                                    $title .= 'Business Small /';                    
                    if ( in_array( $version, array( 'personal', 'biz_s' ) ) )           $title .= 'Business Medium /';                    
                    if ( in_array( $version, array( 'personal', 'biz_s', 'biz_m' ) ) )  $title .= 'Business Large /';                    
                    $title .= ' MultiUser';    
                                        
                    //wpbc_open_meta_box_section( 'wpbc_upgrade_settings', $title );  ?>

                        <div style="width:100%;border:none; clear:both;margin:20px 0px;" id="bk_news_section" class="wpdevelop"> 
                            <div id="bk_news" ><span style="font-size:11px;text-align:center;">Loading...</span></div>
                            <div id="ajax_bk_respond" style="display:none;"></div>
                            <?php /*
                            $response = wp_remote_post( OBC_CHECK_URL . 'info/', array() );

                            if (! ( is_wp_error( $response ) || 200 != wp_remote_retrieve_response_code( $response ) ) ) {

                                $body_to_show = json_decode( wp_remote_retrieve_body( $response ) );

                                ?><!--style type="text/css" media="screen">#bk_news_loaded{display:block !important;}</style--><?php

                                echo $body_to_show ;
                            }*/
                            ?>                    
                            <script type="text/javascript">
								jQuery(document).ready(function(){

										jQuery.ajax({
											url: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
											type:'POST',
											success: function (data, textStatus){
														if( textStatus == 'success')  {
															jQuery('#ajax_bk_respond').html( data );
															setTimeout( function() {
																			// Customization  of Upgrade table
																			jQuery('#bk_news_section .control-group').hide();
																			jQuery('#bk_news_section a.btn').addClass('button');
																			jQuery('#bk_news_section a.btn').removeClass('btn-small');
																			jQuery('#bk_news_section a.btn').removeClass('btn');
//Deprecated: FixIn: 9.0.1.1.1
// jQuery('.popover_feature').popover('destroy');
// jQuery('.popover_feature').popover( {
// 	  placement: 'top auto'
// 	, trigger:'hover'
// 	, delay: {show: 200, hide: 100}
// 	, content: ''
// 	, template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
// 	, viewport: '#bk_news_loaded'
// 	, html: 'true'
// });
					jQuery('.popover_feature img').replaceWith('<span class="wpbc_icn_not_listed_location" style="font-size:12px;" aria-hidden="true"></span');

					wpbc_tippy( '.popover_feature', {
						content( reference ){
							var popover_content = reference.getAttribute( 'data-content' );
							return '<div class="popover popover_tippy">'
										//+ '<div class="popover-close"><a href="javascript:void(0)" onclick="javascript:this.parentElement.parentElement.parentElement.parentElement.parentElement._tippy.hide();" >&times;</a></div>'
										// + '<div class="popover-title">'
										// 	+ popover_title
										// + '</div>'
										 + '<div class="popover-content" style="font-size: 0.8em;">'
											+ popover_content
										+ '</div>'
								 + '</div>';
						},
						allowHTML        : true,
						//trigger          : 'manual',
						interactive      : true,
						hideOnClick      : false,
						interactiveBorder: 10,
						maxWidth         : 550,
						theme            : 'wpbc-tippy-popover',
						placement        : 'top-start',
						touch: ['hold', 500], // 500ms delay
					} );


																			if ( jQuery( '#bk_news_section .version-name-row.version_bs' ).length ){
																				jQuery('#bk_news_section .version-name-row.version_bs').html( jQuery('#bk_news_section .version-name-row.version_bs').html().replace( /Business Small/gi, '<strong>Business Small</strong>' ) );
																			}
																			if ( jQuery( '#bk_news_section .version-name-row.version_bm' ).length ){
																				jQuery('#bk_news_section .version-name-row.version_bm').html( jQuery('#bk_news_section .version-name-row.version_bm').html().replace( /Business Medium/gi, '<strong>Business Medium</strong>' ) );
																			}
																			if ( jQuery( '#bk_news_section .version-name-row.version_bl' ).length ){
																				jQuery('#bk_news_section .version-name-row.version_bl').html( jQuery('#bk_news_section .version-name-row.version_bl').html().replace( /Business Large/gi, '<strong>Business Large</strong>' ) );
																			}
																			if ( jQuery( '#bk_news_section .version-name-row.version_mu' ).length ){
																				jQuery('#bk_news_section .version-name-row.version_mu').html( jQuery('#bk_news_section .version-name-row.version_mu').html().replace( /MultiUser/gi, '<strong>MultiUser</strong>' ) );
																			}
																		}
																, 2000 );
														}
													},
											error:function (XMLHttpRequest, textStatus, errorThrown){window.status = 'Ajax sending Error status:'+ textStatus;
											},
											data:{
												action : 'CHECK_BK_FEATURES',
												wpbc_nonce: document.getElementById('wpbc_admin_panel_nonce').value
											}
										});

								});
                            </script>                           
                        </div>
                        <p style="line-height:25px;text-align:center;padding-top:15px;" class="wpdevelop">                    
                            <a class="button button-primary" style="font-size: 1.1em;font-weight: 600;height: 2.5em;line-height: 1.1em;padding: 8px 25px;"  href="<?php echo wpbc_up_link(); ?>" target="_blank"><?php if ( wpbc_get_ver_sufix() == '' ) { _e('Purchase' ,'booking'); } else { _e('Upgrade Now' ,'booking'); } ?></a>
                        </p>    
                        
                    <?php //wpbc_close_meta_box_section(); ?>                    
                        
                </div>  
                <div class="clear"></div>
        </span>
    <?php         
//debuge( 'Content <strong>' . basename(__FILE__ ) . '</strong> <span style="font-size:9px;">' . __FILE__  . '</span>');                  
    }

}

add_action('wpbc_menu_created', array( new WPBC_Page_SettingsUp() , '__construct') );    // Executed after creation of Menu