<?php
    if ( isset($_GET['csv_dir'] ) ) {
        $dir = $_GET['csv_dir'];
        $dir = str_replace('?', '', $dir);

        // $dir .= '/../wpbc_csv';                                                              //FixIn: 8.3.3.10       //FixIn: 8.7.3.2
    } else {
	    $dir = dirname( __FILE__ ) . '/../../../../wpbc_csv';                                   //FixIn: 8.3.3.10
    }

    $filename = 'bookings_export.csv';

    if ( ! file_exists( "$dir/$filename" ) ){

	    die( 'Wrong Path. Error during exporting CSV file!' . ' [' . "$dir/$filename" . ']' );

    } else {                                                                                                            //FixIn: 8.7.3.2
	    /**
	     * Security  check. Allow to download file only  during 15 minutes
	     * from  last  export,  otherwise delete this file
	     */
    	$csv_file = $dir . '/' . $filename;
    	$seconds_of_existing_file = ( strtotime( 'now' ) - filemtime( $csv_file ) );

    	if ( $seconds_of_existing_file > 300 ) {        // 300 sec - 5 minutes
    		unlink( $csv_file );
    		die( "CSV file expired [{$seconds_of_existing_file}s]. Make new CSV export." );
	    }
    }
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream'); 
    header('Content-Disposition: attachment; filename='.$filename);
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    echo "\xEF\xBB\xBF"; // UTF-8 BOM
    readfile("$dir/$filename");