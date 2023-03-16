<?php
/**
 * @package  Code Mirror
 * @description  HTML Forms with  highlighting Syntax
 *
 * Author: wpdevelop, oplugins
 * @link http://oplugins.com/
 * @email info@oplugins.com
 *
 * @version 1.0
 * @modified 2019-04-10
 */


if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit if accessed directly

// https://make.wordpress.org/core/tag/codemirror/

// General Init Class
final class WPBC_CodeMirror {

    static private $instance = NULL;											// Define only one instance of this class


	/** Get only one instance of this class
	 *
	 * @return class WPBC_CodeMirror
	 */
	public static function init() {

		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof WPBC_CodeMirror ) ) {

			self::$instance = new WPBC_CodeMirror;

			// JS & CSS
			add_action( 'wpbc_enqueue_js_files',  array( self::$instance, 'wpbc_js_load_files' ),     50  );
			add_action( 'wpbc_enqueue_css_files', array( self::$instance, 'wpbc_enqueue_css_files' ), 50  );

			// // Ajax Handlers.		Note. "locale_for_ajax" recehcked in wpbc-ajax.php
			// add_action( 'wp_ajax_'		    . 'WPBC_CODEMIRROR', array( self::$instance, 'wpbc_ajax_' . 'WPBC_CODEMIRROR' ) );	// Admin & Client (logged in usres)
			// add_action( 'wp_ajax_nopriv_' . 'WPBC_CODEMIRROR', array( self::$instance, 'wpbc_ajax_' . 'WPBC_CODEMIRROR' ) );	    // Client         (not logged in)
		}

		return self::$instance;
	}


	/** JSS */
	public function wpbc_js_load_files( $where_to_load ) {

		$in_footer = true;

		if ( ( is_admin() ) && ( in_array( $where_to_load, array( 'admin', 'both' ) ) ) ) {

		    $wpbc_ce_settings = wp_enqueue_code_editor( array( 'type' => 'text/html' ) );

		    // Bail if user disabled CodeMirror.
		    if ( false === $wpbc_ce_settings ) {
		        return;
		    }

		    wp_localize_script( 'wpbc-global-vars', 'wpbc_ce_settings', $wpbc_ce_settings );                            //FixIn: 8.7.8.6

			//FixIn: 9.0.1.6
			if ( ! wp_script_is( 'wp-theme-plugin-editor', 'registered' ) ) {
				wp_enqueue_script( 'wp-theme-plugin-editor' );
			}

			wp_enqueue_script( 'wpbc-codemirror'
							 , trailingslashit( plugins_url( '', __FILE__ ) ) . 'codemirror.js'         /* wpbc_plugin_url( '/src/js/codemirror.js' ) */
							 , array( 'wpbc-global-vars' ), '1.1', $in_footer );
		}
	}


	/** CSS */
	public function wpbc_enqueue_css_files( $where_to_load ) {

		if ( ( is_admin() ) && ( in_array( $where_to_load, array( 'admin', 'both' ) ) ) ) {

			wp_enqueue_style( 'wp-codemirror' );

			wp_enqueue_style( 'wpbc-codemirror'
							, trailingslashit( plugins_url( '', __FILE__ ) ) . 'codemirror.css'         /* wpbc_plugin_url( '/src/css/codemirror.css' ) */
							, array(), WP_BK_VERSION_NUM );
		}
	}


	/**
	 *  Define Textarea elements,  where we need to  define CodeMirror for HTML editing.
	 *
	 * @param $params    array(
									'textarea_id' => '#wpbc_add_form_html',
									'preview_id'   => '#wpbc_add_form_html_preview'    (Optional)
								)
	 *
	 * Example of usage:
     *                     wpbc_codemirror()->set_codemirror( array( 'textarea_id' => '#wpbc_add_form_html', 'preview_id'   => '#wpbc_add_form_html_preview' ) )
	 */
	public function set_codemirror( $params ) {

		$defaults = array(
							'textarea_id' => '#wpbc_add_form_html',
							'preview_id'  => false
		);
		$params   = wp_parse_args( $params, $defaults );


		?>
		<script type="text/javascript">
			jQuery( document ).ready( function (){

				WPBC_CM.init_codemirror( {
											textarea_id : '<?php echo $params['textarea_id']; ?>'
											<?php
											if ( false !== $params['preview_id'] ) {
												echo ", preview_id: '{$params['preview_id']}'";
											}
											?>
										}
										, wpbc_ce_settings
				);
			} );
		</script>
		<?php
	}
}


function wpbc_codemirror() {
    return WPBC_CodeMirror::init();
}
wpbc_codemirror();																	// Run



/**
 * Example of Usage:
 *
 * 1) wpbc_codemirror()->set_codemirror( array( 'textarea_id' => '#wpbc_add_form_html', 'preview_id'   => '#wpbc_add_form_html_preview' ) )
 *
 * 2)
 *
 	$wpbc_add_form_html = get_bk_option( 'wpbc_add_form_html' );

	?><textarea id="wpbc_add_form_html" name="wpbc_add_form_html" style="width:100%;height:200px;"><?php

		echo( ! empty( $wpbc_add_form_html ) ? esc_textarea( $wpbc_add_form_html ) : '' );

	?></textarea><?php
	wpbc_codemirror()->set_codemirror( array(
										'textarea_id' => '#wpbc_add_form_html'
										, 'preview_id'   => '#wpbc_add_form_html_preview'
	) );

	/**
	* Example of Reseting CM form:
	?>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			WPBC_CM.set_codemirror_value( '#wpbc_add_form_html', 'This Form Was reseted !!!')
		});
	</script>
	<?php
 */