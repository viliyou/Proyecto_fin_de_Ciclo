<?php
/**
 * @version 1.0
 * @package Costs functions
 * @category Costs
 * @author wpdevelop
 *
 * @web-site https://wpbookingcalendar.com/
 * @email info@wpbookingcalendar.com 
 * 
 * @modified 2016-06-26
 */
/*
This is COMMERCIAL SCRIPT
We are do not guarantee correct work and support of Booking Calendar, if some file(s) was modified by someone else then wpdevelop.
*/

if ( ! defined( 'ABSPATH' ) ) exit;                                             // Exit if accessed directly




////////////////////////////////////////////////////////////////////////////////
// Cost Format
////////////////////////////////////////////////////////////////////////////////

/**
	 * Format booking cost with a currency symbol
 *
 * @param float $cost
 * @param array $args (default: array())
 * @return string
 * 
 * Exmaple of usage:
   wpbc_cost_show( $subtotal, array(  'currency' => wpbc_get_currency() ) );
 */
function wpbc_cost_show( $cost, $args = array() ) {

    extract( apply_filters( 'wpbc_cost_args', wp_parse_args( $args, array(
            'currency'           => '',
            'decimals'           => wpbc_get_cost_decimals(),
            'decimal_separator'  => wpbc_get_cost_decimal_separator(),
            'thousand_separator' => wpbc_get_cost_thousand_separator(),
            'cost_format'        => wpbc_get_cost_format()
    ) ) ) );
//debuge($cost, $currency, $decimals, $decimal_separator, $thousand_separator, $cost_format);
    $cost       = floatval( $cost );                                        // Convert possible string cost to Float
    $negative   = $cost < 0;
    //$cost       = floatval( $negative ? 0 : $cost );                        // if less than 0,  then set  cost  as 0      //FixIn: 7.0.1.30
    $cost       = apply_filters( 'wpbc_formatted_cost'
                                        , number_format( $cost, $decimals, $decimal_separator, $thousand_separator )
                                        , $cost
                                        , $decimals
                                        , $decimal_separator
                                        , $thousand_separator );

    $formatted_cost = sprintf( $cost_format, '<span class="wpbc-currency-symbol">' . wpbc_get_currency_symbol( $currency ) . '</span>', $cost );
    $return         = '<span class="wpbc-cost-amount">' . $formatted_cost . '</span>';

    return apply_filters( 'wpbc_cost_show', $return, $cost, $args );
}


/**
	 * Get cost format depending on the currency position.
 * 
 * @param string $currency_pos - default '' (load from  DB) | 'left' | 'right' | 'left_space' | 'right_space'
 * @return string
 */
function wpbc_get_cost_format( $currency_pos = '' ) {

    if ( empty( $currency_pos ) )
        $currency_pos = get_bk_option( 'booking_currency_pos' );
    
    $format = '%1$s%2$s';

    switch ( $currency_pos ) {

        case 'left' :
                $format = '%1$s%2$s';
                break;
        case 'right' :
                $format = '%2$s%1$s';
                break;
        case 'left_space' :
                $format = '%1$s&nbsp;%2$s';
                break;
        case 'right_space' :
                $format = '%2$s&nbsp;%1$s';
                break;
    }

    return apply_filters( 'wpbc_get_cost_format', $format, $currency_pos );
}


/**
	 * Get number of decimals after the decimal point
 * 
 * @return int
 */
function wpbc_get_cost_decimals() {
    return absint( get_bk_option( 'booking_cost_currency_format_decimal_number', 2 ) );
}


/**
	 * Get decimal separator for costs.
 * 
 * @return string
 */
function wpbc_get_cost_decimal_separator() {
    $separator = stripslashes( get_bk_option( 'booking_cost_currency_format_decimal_separator' ) );
    $separator = str_replace( 'space', ' ', $separator );
    return $separator ? $separator : '.';
}


/**
	 * Get thousand separator for costs.
 *
 * @return string
 */
function wpbc_get_cost_thousand_separator() {
    $separator = stripslashes( get_bk_option( 'booking_cost_currency_format_thousands_separator' ) );
    $separator = str_replace( 'space', ' ', $separator );
    return $separator;
}



////////////////////////////////////////////////////////////////////////////////
// Currencies
////////////////////////////////////////////////////////////////////////////////
/**
	 * Get active Currency
 * 
 * @return string
 */
function wpbc_get_currency(){
    
    $currency = apply_filters( 'wpbc_booking_currency', get_bk_option('booking_currency') );
    
    if ( empty( $currency ) ) 
        $currency = get_bk_option( 'booking_paypal_curency' );
    
    if ( empty( $currency ) ) 
        $currency = 'USD';
    
    return $currency;
}

/**
	 * Get full list of currency codes.
 *
 * @return array
 */
function wpbc_get_currency_list() {
    return array_unique(
                apply_filters( 'wpbc_currency_list',
			array(
				'AED' =>  'United Arab Emirates dirham', 
				'AFN' =>  'Afghan afghani',
				'ALL' =>  'Albanian lek',
				'AMD' =>  'Armenian dram',
				'ANG' =>  'Netherlands Antillean guilder',
				'AOA' =>  'Angolan kwanza',
				'ARS' =>  'Argentine peso',
				'AUD' =>  'Australian dollar',
				'AWG' =>  'Aruban florin',
				'AZN' =>  'Azerbaijani manat',
				'BAM' =>  'Bosnia and Herzegovina convertible mark',
				'BBD' =>  'Barbadian dollar',
				'BDT' =>  'Bangladeshi taka',
				'BGN' =>  'Bulgarian lev',
				'BHD' =>  'Bahraini dinar',
				'BIF' =>  'Burundian franc',
				'BMD' =>  'Bermudian dollar',
				'BND' =>  'Brunei dollar',
				'BOB' =>  'Bolivian boliviano',
				'BRL' =>  'Brazilian real',
				'BSD' =>  'Bahamian dollar',
				'BTC' =>  'Bitcoin',
				'BTN' =>  'Bhutanese ngultrum',
				'BWP' =>  'Botswana pula',
				'BYR' =>  'Belarusian ruble',
				'BZD' =>  'Belize dollar',
				'CAD' =>  'Canadian dollar',
				'CDF' =>  'Congolese franc',
				'CHF' =>  'Swiss franc',
				'CLP' =>  'Chilean peso',
				'CNY' =>  'Chinese yuan',
				'COP' =>  'Colombian peso',
				'CRC' =>  'Costa Rican col&oacute;n',
				'CUC' =>  'Cuban convertible peso',
				'CUP' =>  'Cuban peso',
				'CVE' =>  'Cape Verdean escudo',
				'CZK' =>  'Czech koruna',
				'DJF' =>  'Djiboutian franc',
				'DKK' =>  'Danish krone',
				'DOP' =>  'Dominican peso',
				'DZD' =>  'Algerian dinar',
				'EGP' =>  'Egyptian pound',
				'ERN' =>  'Eritrean nakfa',
				'ETB' =>  'Ethiopian birr',
				'EUR' =>  'Euro',
				'FJD' =>  'Fijian dollar',
				'FKP' =>  'Falkland Islands pound',
				'GBP' =>  'Pound sterling',
				'GEL' =>  'Georgian lari',
				'GGP' =>  'Guernsey pound',
				'GHS' =>  'Ghana cedi',
				'GIP' =>  'Gibraltar pound',
				'GMD' =>  'Gambian dalasi',
				'GNF' =>  'Guinean franc',
				'GTQ' =>  'Guatemalan quetzal',
				'GYD' =>  'Guyanese dollar',
				'HKD' =>  'Hong Kong dollar',
				'HNL' =>  'Honduran lempira',
				'HRK' =>  'Croatian kuna',
				'HTG' =>  'Haitian gourde',
				'HUF' =>  'Hungarian forint',
				'IDR' =>  'Indonesian rupiah',
				'ILS' =>  'Israeli new shekel',
				'IMP' =>  'Manx pound',
				'INR' =>  'Indian rupee',
				'IQD' =>  'Iraqi dinar',
				'IRR' =>  'Iranian rial',
				'ISK' =>  'Icelandic kr&oacute;na',
				'JEP' =>  'Jersey pound',
				'JMD' =>  'Jamaican dollar',
				'JOD' =>  'Jordanian dinar',
				'JPY' =>  'Japanese yen',
				'KES' =>  'Kenyan shilling',
				'KGS' =>  'Kyrgyzstani som',
				'KHR' =>  'Cambodian riel',
				'KMF' =>  'Comorian franc',
				'KPW' =>  'North Korean won',
				'KRW' =>  'South Korean won',
				'KWD' =>  'Kuwaiti dinar',
				'KYD' =>  'Cayman Islands dollar',
				'KZT' =>  'Kazakhstani tenge',
				'LAK' =>  'Lao kip',
				'LBP' =>  'Lebanese pound',
				'LKR' =>  'Sri Lankan rupee',
				'LRD' =>  'Liberian dollar',
				'LSL' =>  'Lesotho loti',
				'LYD' =>  'Libyan dinar',
				'MAD' =>  'Moroccan dirham',
				'MDL' =>  'Moldovan leu',
				'MGA' =>  'Malagasy ariary',
				'MKD' =>  'Macedonian denar',
				'MMK' =>  'Burmese kyat',
				'MNT' =>  'Mongolian t&ouml;gr&ouml;g',
				'MOP' =>  'Macanese pataca',
				'MRO' =>  'Mauritanian ouguiya',
				'MUR' =>  'Mauritian rupee',
				'MVR' =>  'Maldivian rufiyaa',
				'MWK' =>  'Malawian kwacha',
				'MXN' =>  'Mexican peso',
				'MYR' =>  'Malaysian ringgit',
				'MZN' =>  'Mozambican metical',
				'NAD' =>  'Namibian dollar',
				'NGN' =>  'Nigerian naira',
				'NIO' =>  'Nicaraguan c&oacute;rdoba',
				'NOK' =>  'Norwegian krone',
				'NPR' =>  'Nepalese rupee',
				'NZD' =>  'New Zealand dollar',
				'OMR' =>  'Omani rial',
				'PAB' =>  'Panamanian balboa',
				'PEN' =>  'Peruvian nuevo sol',
				'PGK' =>  'Papua New Guinean kina',
				'PHP' =>  'Philippine peso',
				'PKR' =>  'Pakistani rupee',
				'PLN' =>  'Polish z&#x142;oty',
				'PRB' =>  'Transnistrian ruble',
				'PYG' =>  'Paraguayan guaran&iacute;',
				'QAR' =>  'Qatari riyal',
				'RON' =>  'Romanian leu',
				'RSD' =>  'Serbian dinar',
				'RUB' =>  'Russian ruble',
				'RWF' =>  'Rwandan franc',
				'SAR' =>  'Saudi riyal',
				'SBD' =>  'Solomon Islands dollar',
				'SCR' =>  'Seychellois rupee',
				'SDG' =>  'Sudanese pound',
				'SEK' =>  'Swedish krona',
				'SGD' =>  'Singapore dollar',
				'SHP' =>  'Saint Helena pound',
				'SLL' =>  'Sierra Leonean leone',
				'SOS' => 'Somali shilling',
				'SRD' =>  'Surinamese dollar',
				'SSP' =>  'South Sudanese pound',
				'STD' =>  'S&atilde;o Tom&eacute; and Pr&iacute;ncipe dobra',
				'SYP' =>  'Syrian pound',
				'SZL' =>  'Swazi lilangeni',
				'THB' =>  'Thai baht',
				'TJS' =>  'Tajikistani somoni',
				'TMT' =>  'Turkmenistan manat',
				'TND' =>  'Tunisian dinar',
				'TOP' =>  'Tongan pa&#x2bb;anga',
				'TRY' =>  'Turkish lira',
				'TTD' =>  'Trinidad and Tobago dollar',
				'TWD' =>  'New Taiwan dollar',
				'TZS' =>  'Tanzanian shilling',
				'UAH' =>  'Ukrainian hryvnia',
				'UGX' =>  'Ugandan shilling',
				'USD' =>  'United States dollar',
				'UYU' =>  'Uruguayan peso',
				'UZS' =>  'Uzbekistani som',
				'VEF' =>  'Venezuelan bol&iacute;var',
				'VND' =>  'Vietnamese &#x111;&#x1ed3;ng',
				'VUV' =>  'Vanuatu vatu',
				'WST' =>  'Samoan t&#x101;l&#x101;',
				'XAF' =>  'Central African CFA franc',
				'XCD' =>  'East Caribbean dollar',
				'XOF' =>  'West African CFA franc',
				'XPF' =>  'CFP franc',
				'YER' =>  'Yemeni rial',
				'ZAR' =>  'South African rand',
				'ZMW' =>  'Zambian kwacha'
			)
		)
	);
}

/**
	 * Get Currency symbol.
 *
 * @param string $currency (default: ''), if skipped "Currency Code"  then, load active currency from DB
 * @return string
 */
function wpbc_get_currency_symbol( $currency = '' ) {
    
	if ( ! $currency ) {
		$currency = wpbc_get_currency();
	}

	$symbols = apply_filters( 'wpbc_currency_symbols', array(
		'AED' => '&#x62f;.&#x625;',
		'AFN' => '&#x60b;',
		'ALL' => 'L',
		'AMD' => 'AMD',
		'ANG' => '&fnof;',
		'AOA' => 'Kz',
		'ARS' => '&#36;',
		'AUD' => '&#36;',
		'AWG' => '&fnof;',
		'AZN' => 'AZN',
		'BAM' => 'KM',
		'BBD' => '&#36;',
		'BDT' => '&#2547;&nbsp;',
		'BGN' => '&#1083;&#1074;.',
		'BHD' => '.&#x62f;.&#x628;',
		'BIF' => 'Fr',
		'BMD' => '&#36;',
		'BND' => '&#36;',
		'BOB' => 'Bs.',
		'BRL' => '&#82;&#36;',
		'BSD' => '&#36;',
		'BTC' => '&#3647;',
		'BTN' => 'Nu.',
		'BWP' => 'P',
		'BYR' => 'Br',
		'BZD' => '&#36;',
		'CAD' => '&#36;',
		'CDF' => 'Fr',
		'CHF' => '&#67;&#72;&#70;',
		'CLP' => '&#36;',
		'CNY' => '&yen;',
		'COP' => '&#36;',
		'CRC' => '&#x20a1;',
		'CUC' => '&#36;',
		'CUP' => '&#36;',
		'CVE' => '&#36;',
		'CZK' => '&#75;&#269;',
		'DJF' => 'Fr',
		'DKK' => 'DKK',
		'DOP' => 'RD&#36;',
		'DZD' => '&#x62f;.&#x62c;',
		'EGP' => 'EGP',
		'ERN' => 'Nfk',
		'ETB' => 'Br',
		'EUR' => '&euro;',
		'FJD' => '&#36;',
		'FKP' => '&pound;',
		'GBP' => '&pound;',
		'GEL' => '&#x10da;',
		'GGP' => '&pound;',
		'GHS' => '&#x20b5;',
		'GIP' => '&pound;',
		'GMD' => 'D',
		'GNF' => 'Fr',
		'GTQ' => 'Q',
		'GYD' => '&#36;',
		'HKD' => '&#36;',
		'HNL' => 'L',
		'HRK' => 'Kn',
		'HTG' => 'G',
		'HUF' => '&#70;&#116;',
		'IDR' => 'Rp',
		'ILS' => '&#8362;',
		'IMP' => '&pound;',
		'INR' => '&#8377;',
		'IQD' => '&#x639;.&#x62f;',
		'IRR' => '&#xfdfc;',
		'ISK' => 'Kr.',
		'JEP' => '&pound;',
		'JMD' => '&#36;',
		'JOD' => '&#x62f;.&#x627;',
		'JPY' => '&yen;',
		'KES' => 'KSh',
		'KGS' => '&#x43b;&#x432;',
		'KHR' => '&#x17db;',
		'KMF' => 'Fr',
		'KPW' => '&#x20a9;',
		'KRW' => '&#8361;',
		'KWD' => '&#x62f;.&#x643;',
		'KYD' => '&#36;',
		'KZT' => 'KZT',
		'LAK' => '&#8365;',
		'LBP' => '&#x644;.&#x644;',
		'LKR' => '&#xdbb;&#xdd4;',
		'LRD' => '&#36;',
		'LSL' => 'L',
		'LYD' => '&#x644;.&#x62f;',
		'MAD' => '&#x62f;. &#x645;.',
		'MAD' => '&#x62f;.&#x645;.',
		'MDL' => 'L',
		'MGA' => 'Ar',
		'MKD' => '&#x434;&#x435;&#x43d;',
		'MMK' => 'Ks',
		'MNT' => '&#x20ae;',
		'MOP' => 'P',
		'MRO' => 'UM',
		'MUR' => '&#x20a8;',
		'MVR' => '.&#x783;',
		'MWK' => 'MK',
		'MXN' => '&#36;',
		'MYR' => '&#82;&#77;',
		'MZN' => 'MT',
		'NAD' => '&#36;',
		'NGN' => '&#8358;',
		'NIO' => 'C&#36;',
		'NOK' => '&#107;&#114;',
		'NPR' => '&#8360;',
		'NZD' => '&#36;',
		'OMR' => '&#x631;.&#x639;.',
		'PAB' => 'B/.',
		'PEN' => 'S/.',
		'PGK' => 'K',
		'PHP' => '&#8369;',
		'PKR' => '&#8360;',
		'PLN' => '&#122;&#322;',
		'PRB' => '&#x440;.',
		'PYG' => '&#8370;',
		'QAR' => '&#x631;.&#x642;',
		'RMB' => '&yen;',
		'RON' => 'lei',
		'RSD' => '&#x434;&#x438;&#x43d;.',
		'RUB' => '&#8381;',
		'RWF' => 'Fr',
		'SAR' => '&#x631;.&#x633;',
		'SBD' => '&#36;',
		'SCR' => '&#x20a8;',
		'SDG' => '&#x62c;.&#x633;.',
		'SEK' => '&#107;&#114;',
		'SGD' => '&#36;',
		'SHP' => '&pound;',
		'SLL' => 'Le',
		'SOS' => 'Sh',
		'SRD' => '&#36;',
		'SSP' => '&pound;',
		'STD' => 'Db',
		'SYP' => '&#x644;.&#x633;',
		'SZL' => 'L',
		'THB' => '&#3647;',
		'TJS' => '&#x405;&#x41c;',
		'TMT' => 'm',
		'TND' => '&#x62f;.&#x62a;',
		'TOP' => 'T&#36;',
		'TRY' => '&#8378;',
		'TTD' => '&#36;',
		'TWD' => '&#78;&#84;&#36;',
		'TZS' => 'Sh',
		'UAH' => '&#8372;',
		'UGX' => 'UGX',
		'USD' => '&#36;',
		'UYU' => '&#36;',
		'UZS' => 'UZS',
		'VEF' => 'Bs F',
		'VND' => '&#8363;',
		'VUV' => 'Vt',
		'WST' => 'T',
		'XAF' => 'Fr',
		'XCD' => '&#36;',
		'XOF' => 'Fr',
		'XPF' => 'Fr',
		'YER' => '&#xfdfc;',
		'ZAR' => '&#82;',
		'ZMW' => 'ZK',
            
                'CURRENCY_SYMBOL' => 'CURRENCY_SYMBOL'                          // System term - usually  used for later  replacing.
	) );

	$currency_symbol = isset( $symbols[ $currency ] ) ? $symbols[ $currency ] : '';

	return apply_filters( 'wpbc_currency_symbol', $currency_symbol, $currency );
}