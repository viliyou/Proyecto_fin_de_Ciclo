<?php
/**
 * @version 1.0
 * @package Booking Calendar 
 * @subpackage Check updates
 * @category 
 * 
 * @author wpdevelop
 * @link https://wpbookingcalendar.com/
 * @email info@wpbookingcalendar.com
 *
 * @modified 2014.10.06
 * @since 5.3.0
 */

if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit if accessed directly


// TODO:
// 1. Check  version,  is it Free or paid 
// 2. Cehck  if WP Table (wp_)bookingtypes exist  or not.
// 3. If its Free version  and the Table (wp_)bookingtypes exist,  
//    then user  was making New update from Paid to Free version. 
//    We need to direct him  to Booking Calendar request  new update page. 

// - Update  "Update Available" page tab for do not allow automatic updates of paid vesion.




class WPBC_Plugin_Updater {

    
    private $api_url  = '';
    private $name     = '';
    private $slug     = '';
    private $current_version  = '';
    private $is_second_time_wp_fire_check = false;
    private $remote_version_data = false;
    private $plugin_html_id = '';
    
    
    /**
     * 
     * @param type $_api_url
     * @param type $_plugin_file
     * @param type $_api_data
     */
    function __construct ($my_plugin_file = null, $my_api_url = null, $my_api_data = null ) {
		
        $this->api_url  = $my_api_url;
        $this->name     = plugin_basename( $my_plugin_file );
        $this->slug     = basename( $my_plugin_file, '.php');
        
        $this->current_version  = $my_api_data['version'];
        $this->plugin_html_id   = $my_api_data['plugin_html_id'];
                
        $this->defineHooks();
    }

    
    /**
     * Set up Wordpress filters to hook into WP's update process.
     *
     */
    private function defineHooks() {
        
        add_filter( 'pre_set_site_transient_update_plugins', array( $this, 'pre_set_site_transient_update_plugins_filter' ) );
            
        global $pagenow;
        // Show different Plugin info at  this page
        if ( 'plugins.php' === $pagenow ) {
            add_action(   'in_plugin_update_message-' . $this->name , array( $this, 'update_plugin_message'), 20, 2 );
        }

        // Reset Plugin data on this page
        if ( 'update-core.php' === $pagenow ) { 
            add_action('admin_init', array( $this, 'reset_plugin_data') );
        }    

        // Fires after each specific row in the Plugins list table.
        add_action('after_plugin_row_' . $this->name , array( $this, 'after_plugin_row'), 20, 3 );

        add_filter( 'plugin_auto_update_setting_html', array( $this,'bookingplugin_auto_update_setting_html' ), 10, 3 );		//FixIn: 8.7.8.5
    }


    //FixIn: 8.7.8.5
	/**
	 * In new WordPress 5.5 available this new auto-update feature for plugins,  that  we need to disable.
	 *
		For reference, here is the default HTML content:

		<a href="…" class="toggle-auto-update" data-wp-action="…">
			<span class="dashicons dashicons-update spin hidden" aria-hidden="true"></span>
			<!-- The following text is replaced with "Disable auto-updates" when auto-updates are already enabled for this plugin -->
			<span class="label">Enable auto-updates</span>
		</a>

	 *
	 * @param $html
	 * @param $plugin_file
	 * @param $plugin_data
	 *
	 * @return string|void
	 */
	function bookingplugin_auto_update_setting_html( $html, $plugin_file, $plugin_data ) {

		if (  $this->name  === $plugin_file ) {

			$this->check_updates();

			if ( $this->is_this_new_update() === false ) {
				$html = __( 'Auto-updates are not available for this plugin.', 'my-plugin' ) . ' '
						  . sprintf( __('You can request the new update of plugin on %1$sthis page%2$s.' ,'booking')
						, '<a href="'.$this->remote_version_data->download_url.'" target="_blank">'
						, '</a>');
				return $html;
			}

			// We are having new update!
			$html = sprintf( __('There is a new version of %1$s available. <a href="%2$s" target="_blank" title="%3$s">View version %4$s details</a>. <em>Automatic update is unavailable for this plugin.</em>')
							, $this->remote_version_data->name
							, $this->remote_version_data->changelog_url
							, $this->remote_version_data->name
							, $this->remote_version_data->version )
						  . ' '
				  . sprintf( __('You can request the new update of plugin on %1$sthis page%2$s.' ,'booking')
								, '<a href="'.$this->remote_version_data->download_url.'" target="_blank">'
								, '</a>');
		}
		return $html;
	}




    /** 
     * We reset plugin Update data at specific page(s)
     * Its required for ability  to remove the plugin from that list in that page     
     */
    public function reset_plugin_data() {

	    /**
	     * This line generate this error:
	     * Fatal error: Uncaught Error: Attempt to modify property "no_update" on null in ...\wp-content\plugins\nextend-smart-slider3-pro\Nextend\SmartSlider3\Platform\WordPress\WordPressUpdate.php:90
	     */
	    //FixIn: 8.8.3.14
        // set_site_transient( 'update_plugins', null );                           // Force to check updates by WordPress
        delete_transient( '_wpbc_check_updates' );        
    }

    
    /**
     * Update site_transient for the "update_plugins_filter",  if we are having new update at the own host.
     * Remove completely info about updates at the update-core.php page 
     * 
     * Check wp-includes/update.php line 121 for the original wp_update_plugins() function.
     * 
     * @global type $pagenow
     * @param type $_transient_data
     * @return type
     */
    public function pre_set_site_transient_update_plugins_filter( $_transient_data ) {
        
        // This ensures that the custom API request only runs on the second time that WP fires the update check
        if( empty( $_transient_data ) || ! $this->is_second_time_wp_fire_check ) {            
            $this->is_second_time_wp_fire_check = true;
            return $_transient_data;
        }


        // Completely Remove info about new updates of plugin at the page: update-core.php
        global $pagenow;
        if ( 'update-core.php' === $pagenow ) {                                 

        	/*
        	 * Default value from  WordPress:
$$_transient_data =
   [no_update] => Array
        (
        	  ...
			  [booking/wpdev-booking.php] => stdClass Object
                (
                    [id] => w.org/plugins/booking
                    [slug] => booking
                    [plugin] => booking/wpdev-booking.php
                    [new_version] => 8.8.2
                    [url] => https://wordpress.org/plugins/booking/
                    [package] => https://downloads.wordpress.org/plugin/booking.8.8.2.zip
                    [icons] => Array
                        (
                            [2x] => https://ps.w.org/booking/assets/icon-256x256.png?rev=1730848
                            [1x] => https://ps.w.org/booking/assets/icon-128x128.png?rev=1730848
                        )

                    [banners] => Array
                        (
                            [1x] => https://ps.w.org/booking/assets/banner-772x250.png?rev=1623635
                        )

                    [banners_rtl] => Array
                        (
                        )

                    [requires] => 4.0
                )
        	    ...
        	 */

            if ( isset($_transient_data->no_update[$this->name]) ) {                                                    //FixIn: 8.8.3.14
            	// unset($_transient_data->no_update[$this->name]);

				// No update is available.		https://make.wordpress.org/core/2020/07/30/recommended-usage-of-the-updates-api-to-support-the-auto-updates-ui-for-plugins-and-themes-in-wordpress-5-5/
				/**
						$item = (object) array(
							'id'            => 'my-plugin/my-plugin.php',
							'slug'          => 'my-plugin',
							'plugin'        => 'my-plugin/my-plugin.php',
							'new_version'   => $myplugin_current_version,
							'url'           => '',
							'package'       => '',
							'icons'         => array(),
							'banners'       => array(),
							'banners_rtl'   => array(),
							'tested'        => '',
							'requires_php'  => '',
							'compatibility' => new stdClass(),
						);
						// Adding the "mock" item to the `no_update` property is required for the enable/disable auto-updates links to correctly appear in UI.
						$transient->no_update['my-plugin/my-plugin.php'] = $item;
				*/

				// Add mock for not ability to update of plugin:
	            $_transient_data->no_update[ $this->name ]->url = '';
	            $_transient_data->no_update[ $this->name ]->package = '';

            }
                
            if ( isset($_transient_data->response[$this->name]) )  unset($_transient_data->response[$this->name]);

            return $_transient_data;            
        }        

//debuge('$_transient_data before update', $_transient_data);

        if( $this->is_this_new_update() ) {

            // Get the plugin data from  WordPress (its can be in "respose" or "no_update" data, depend if the update exist  or not in WP Respository)
            $exist_plugin_data = new stdClass();                               
            if ( isset($_transient_data->response[$this->name]) )                
                $exist_plugin_data = $_transient_data->response[$this->name];

            if ( isset($_transient_data->no_update[$this->name]) ) 
                $exist_plugin_data = $_transient_data->no_update[$this->name];

            // Update Plugin Data.
            $exist_plugin_data->new_version = $this->remote_version_data->version;
            $exist_plugin_data->url = $this->remote_version_data->download_url;
            $exist_plugin_data->package = '';                               // Block automatic update.

            $_transient_data->response[$this->name] = $exist_plugin_data;
            
            
        }
                
        return $_transient_data;
    }
    
    
    /**
     * Update "collumn" after  the plugin,  if the new update is exist
     * 
     * @param string $plugin_file Path to the plugin file, relative to the plugins directory.
     * @param array  $plugin_data An array of plugin data.
     * @param string $status      Status of the plugin. Defaults are 'All', 'Active',
     *                            'Inactive', 'Recently Activated', 'Upgrade', 'Must-Use',
     *                            'Drop-ins', 'Search'.
     * 
     */
    function after_plugin_row($plugin_file, $plugin_data, $status) {
//debuge($plugin_file, $plugin_data, $status);        
        if ( $this->is_this_new_update() === false ) 
            return;
        
        // We are having new update!
        
        
        // Check  if the "site_transient" still have old data amd do not have response new version,  then  reset it.
        $_transient_data = get_site_transient( 'update_plugins' );
        if ( ! isset( $_transient_data->response[$this->name] ) ) {
            $this->reset_plugin_data();
        }

        
        $message_update_version = esc_js(
                        sprintf( __('There is a new version of %1$s available. <a href="%2$s" target="_blank" title="%3$s">View version %4$s details</a>. <em>Automatic update is unavailable for this plugin.</em>')
                                    , $this->remote_version_data->name
                                    , $this->remote_version_data->changelog_url
                                    , $this->remote_version_data->name
                                    , $this->remote_version_data->version )
                      . ' ' 
                      . sprintf( __('You can request the new update of plugin on %1$sthis page%2$s.' ,'booking')
                                    , '<a href="'.$this->remote_version_data->download_url.'" target="_blank">'
                                    , '</a>') 
                        );
        
        if ( isset($this->remote_version_data->upgrade_notice) )
             $upgrade_notice = '<div class="wpbc-upgrade-notice" style="padding:5px 30px 0;">'
                                    . '<strong>' . __('Upgrade Notice' ,'booking').'</strong>: ' 
                                    . html_entity_decode( esc_js( $this->remote_version_data->upgrade_notice ) ,ENT_QUOTES) 
                                .'</div>';
        else $upgrade_notice = '';
        
        ?><tr class="plugin-update-tr">
            <td class="plugin-update colspanchange" colspan="3">
                <div class="update-message">
                    <?php echo html_entity_decode($message_update_version  ,ENT_QUOTES); ?>
                    <?php if (! empty($upgrade_notice) ) echo $upgrade_notice; ?>                    
                </div>
            </td>
          </tr><?php
    }

    
    /** 
     * Update Plugin Row 
     * 
     * @param type $plugin_data
     * @param type $r
     */
    public function update_plugin_message($plugin_data, $r) {
                
        if ( $this->is_this_new_update() === false ) 
            return;
        
        /* $message_update_version = esc_js(
                        sprintf( __('There is a new version of %1$s available. <a href="%2$s" target="_blank" title="%3$s">View version %4$s details</a>. <em>Automatic update is unavailable for this plugin.</em>')
                                    , $this->remote_version_data->name
                                    , $this->remote_version_data->changelog_url
                                    , $this->remote_version_data->name
                                    , $this->remote_version_data->version )
                      . ' ' 
                      . sprintf( __('You can request the new update of plugin on %1$sthis page%2$s.' ,'booking')
                                    , '<a href="'.$this->remote_version_data->download_url.'" target="_blank">'
                                    , '</a>') 
                        );/**/
        
        $message_version_info = esc_js(
                        sprintf( __('Version %s By %s' ,'booking')
                                    , $this->current_version . ' | '
                                    , '<a href="'.$this->remote_version_data->homepage.'">'.$this->remote_version_data->author.'</a> | '
                               )
                               . '<a href="'.$this->remote_version_data->changelog_url.'">' . __('View details' ,'booking') . '</a>'
                                );
        
        ?><script type="text/javascript">
            jQuery(document).ready(function(){                
                jQuery('#<?php echo $this->plugin_html_id; ?>').next('.plugin-update-tr').remove();
                <?php /* jQuery('#<?php echo $this->plugin_html_id; ?>').next('.plugin-update-tr').find('.update-message').html('<?php echo html_entity_decode($message_update_version,ENT_QUOTES); ?>'); */ ?>
                jQuery('#<?php echo $this->plugin_html_id; ?> div.plugin-version-author-uri').html('<?php echo html_entity_decode($message_version_info,ENT_QUOTES); ?>');
            });
        </script><?php        
    }
 
    
    /**
     * Check  if the new udate available or not.
     * 
     * @return true|false
     */
    public function is_this_new_update() {
        
        $this->check_updates();
        
        if( false !== $this->remote_version_data && is_object( $this->remote_version_data ) && isset( $this->remote_version_data->version ) ) {

            if( version_compare( $this->current_version, $this->remote_version_data->version  ) < 0 ) 
                return true;            
        }
        
        return  false;        
    }
    
    
    /**
     * Check inside of the exis transient or by requesting from HOST info about updates
     * 
     * Assign remote_version_data property
     * 
     * @return Remote version object
     */
    private function check_updates() {
        
        if ( ! get_transient( '_wpbc_check_updates' ) ) {

            // Delete this transient
            delete_transient( '_wpbc_check_updates' );
            
            // Get version data from plugin host
            if ( $this->remote_version_data === false ) {
                $this->remote_version_data = $this->get_latest_version( );             
                        
                set_transient( '_wpbc_check_updates', serialize($this->remote_version_data), 60/*60*24*/ );
            }
            
        } else {
            $this->remote_version_data = maybe_unserialize( get_transient( '_wpbc_check_updates' ) );
        }

        return  $this->remote_version_data;
    }
    
    
    /**
     * Get latest version data from  our host.
     *
     * @return false|object
     */
    private function get_latest_version() {
 
        if( $this->api_url == home_url() ) {
                return false; 
        }

        $request = wp_remote_get( $this->api_url, array( 'timeout' => 15, 'sslverify' => false  ) );

        if ( ! is_wp_error( $request ) ) {
                $request = json_decode( wp_remote_retrieve_body( $request ) );
                if( $request && isset( $request->sections ) ) {
                        $request->sections = maybe_unserialize( $request->sections );
                }
                return $request;
        } else {
                return false;
        }
    }
    
}
