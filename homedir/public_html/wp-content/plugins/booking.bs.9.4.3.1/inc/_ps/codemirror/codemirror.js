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

var WPBC_CM = ( function ( parent, $ ){

	// Define all Textarea objects,  where we need to  use CodeMirror
	var textareas = parent.textareas = parent.textareas || {};

	var is_codemirror_inited = false;


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Define ShortCodes [...] with Own Styles for CodeMirror
	 * Use ".cm-oshortcode { }"  for styling in CSS
	 */
	parent.define_oshortcode_mode = function (){

		wp.CodeMirror.defineMode( "oshortcode", function ( config, parserConfig ){

			// https://discuss.codemirror.net/t/highlight-custom-syntax-wordpress-shortcodes-in-html/1168
			var opl_overlay = {
				token: function ( stream, state ){
					var ch;
					if ( stream.match( /^\[([a-zA-Z0-9_]+)\*?\s?/ ) ){
						while ( (ch = stream.next()) != null )
							if ( ch == "]" ){
								return "oshortcode";
							}
					}
					while ( stream.next() != null && !stream.match( /^\[([a-zA-Z0-9_]+)\*?\s?/, false ) ){
					}
					return null;
				}
			};

			// "htmlmixed" is means definition of array( 'type' => 'text/html' ) at load-js.php
			return wp.CodeMirror.overlayMode( wp.CodeMirror.getMode( config, parserConfig.backdrop || "htmlmixed" ), opl_overlay );
		} );

		is_codemirror_inited = true;
	}


	/**
	 * Init Code Mirror for specific Element - usually TextArea
	 *
	 * @param elements_id	-	{ textarea_id: '#textarea_id', preview_id: '#div_id_html_preview' }		-	preview_id - Optional
	 * @param wpbc_ce_settings
	 */
	parent.init_codemirror = function ( elements_id, wpbc_ce_settings ) {

		// Define ShortCodes [...] with Own Styles	-- run only  once.
		if ( !is_codemirror_inited ){
			this.define_oshortcode_mode();
		}

		var wpbc_elements_id = elements_id || {
												textarea_id: '#textarea_id',
												preview_id  : '#div_id_html_preview'
											};

		wpbc_ce_settings.codemirror.mode = "oshortcode";

		// Initialize "Code Mirror" object  for "#textarea_id" element.
		var my_opl_editor = wp.codeEditor.initialize( jQuery( wpbc_elements_id.textarea_id ), wpbc_ce_settings );


		// Add to list  of textarea new reference of CodeMirror object relative to  TextArea HTML ID
		this.define_cm_to_textarea_by_id( wpbc_elements_id.textarea_id, my_opl_editor );


		// Live Preview
		if ( (wpbc_elements_id.preview_id) && (jQuery( wpbc_elements_id.preview_id ).length > 0) ){

			this.set_preview_to_textarea_by_id( wpbc_elements_id.textarea_id, wpbc_elements_id.preview_id );

			// Get HTML value from  CodeMirror
			var editor_html = my_opl_editor.codemirror.getValue();

			// Add  "preview-oshortcode" CSS class for better showing
			editor_html = editor_html.replace( /(\[)([^\]]*)(\])/gi, '<span class="preview-oshortcode">$1$2$3</span>' );

			//jQuery( wpbc_elements_id.preview_id ).html( editor_html );
			this.update_preview( wpbc_elements_id.textarea_id, editor_html );

			var that = this;

			// Define HOOK for updating Preview during editing.
			jQuery( document ).on( 'keyup', '.CodeMirror-code', function (){
				editor_html = my_opl_editor.codemirror.getValue();
				editor_html = editor_html.replace( /(\[)([^\]]*)(\])/gi, '<span class="preview-oshortcode">$1$2$3</span>' );

				that.update_preview( wpbc_elements_id.textarea_id, editor_html );										// jQuery( wpbc_elements_id.preview_id ).html( editor_html );

				jQuery( wpbc_elements_id.preview_id ).trigger( 'change' );
			} );
		}
	}


	// Text Area ///////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Set CodeMiror obj to textarea list.
	 *
	 * @param html_id - string jQuery like definition of textarea	- '#sometextarea'
	 * @param cm_obj - CodeMirror Object of textarea
	 */
	parent.define_cm_to_textarea_by_id = function( html_id, cm_obj ){
		textareas[ html_id ] = {};
		textareas[ html_id ][ 'textarea' ] =  cm_obj;
	}

	/**
	 * Get Object of specific TextArea
	 *
	 * @param html_id - string jQuery like definition of textarea	- '#sometextarea'
	 * @returns obj
	 */
	parent.get_textarea_obj = function( html_id ){
		return textareas[ html_id ][ 'textarea' ];
	}

	/**
	 * Get CodeMirror Object of specific TextArea
	 *
	 * @param html_id - string jQuery like definition of textarea	- '#sometextarea'
	 * @returns obj
	 */
	parent.get_codemirror_obj = function( html_id ){
		return textareas[ html_id ][ 'textarea' ].codemirror;
	}

	/**
	 * Check if specific textarea element was defined for using CodeMirror
	 * @param html_id - string jQuery like definition of textarea	- '#sometextarea'
	 * @returns {boolean}
	 */
	parent.is_defined = function ( html_id ){
		if ( undefined == textareas[ html_id ] ){
			return false;
		} else {
			return true;
		}
	}

	// Code Mirror /////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Get Value from CodeMirror - Edited HTML
	 *
	 * @param html_id - string jQuery like definition of textarea	- '#sometextarea'
	 * @returns obj
	 */
	parent.get_codemirror_value = function( html_id ){

		var editor_html = this.get_codemirror_obj( html_id ).getValue()

		return editor_html;
	}


	/**
	 * Set Value for CodeMirror - Edited HTML
	 *
	 * @param html_id - string jQuery like definition of textarea	- '#sometextarea'
	 * @param html_value - HTML to  set
	 */
	parent.set_codemirror_value = function( html_id, html_value ){

		this.get_codemirror_obj( html_id ).setValue( html_value );

		this.update_preview( html_id, html_value );
	}


	// Preview /////////////////////////////////////////////////////////////////////////////////////////////////////////

	parent.set_preview_to_textarea_by_id = function ( html_textarea_id, html_preview_id){

		textareas[ html_textarea_id ][ 'preview_obj' ]  = textareas[ html_textarea_id ][ 'preview_obj' ] || {};

		textareas[ html_textarea_id ][ 'preview_obj' ][ 'preview_id' ] = html_preview_id;
	}


	/**
	 * Get Preview Object of specific TextArea
	 *
	 * @param html_id - string jQuery like definition of textarea	- '#sometextarea'
	 * @returns obj
	 */
	parent.get_preview_obj = function( html_textarea_id ){
		return textareas[ html_textarea_id ][ 'preview_obj' ];
	}

	parent.update_preview = function( html_textarea_id, html_value ){

		if ( ( this.get_preview_obj( html_textarea_id ) ) && ( jQuery( this.get_preview_obj( html_textarea_id ).preview_id ).length > 0 ) ){
			jQuery( this.get_preview_obj( html_textarea_id ).preview_id ).html( html_value );
		}
	}


	return parent;
}( WPBC_CM || {}, jQuery ) );


// console.log( WPBC_CM );

/*
// Usage Examples:
jQuery( document ).ready( function (){
	// With  Preview
	WPBC_CM.init_codemirror( { textarea_id: '#wpbc_add_form_html', preview_id: '#wpbc_add_form_html_preview' }
							 , wpbc_ce_settings
	);

	// || without Preview
	// WPBC_CM.init_codemirror( { textarea_id: '#wpbc_add_form_html' } , wpbc_ce_settings );

	// Set Value to CodeMirror
	WPBC_CM.set_codemirror_value( '#wpbc_add_form_html' , 'TaDa 1' );						// -> WPBC_CM.get_codemirror_obj( "#wpbc_add_form_html" ).setValue( 'Tada' );

	// Get Value from CodeMirror
	var my_html = WPBC_CM.get_codemirror_value('#wpbc_add_form_html')
});
*/