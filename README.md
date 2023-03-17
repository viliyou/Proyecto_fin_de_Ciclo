# Proyecto_fin_de_Ciclo
 
Descripción del proyecto

Es una web de una escuela de buceo de Finisterre. 

El cliente necesita una web que le permita gestionar las reservas de sus alumnos. Además quieren modificar los precios de los cursos y actividades que ofrecen.

En principio me dan libertad creativa con la estructura y diseño de la web. Les preocupa más que cumpla con los requisitos especificados.

El objetivo es buscar una forma de cumplir con los requisitos.

Elegí Wordpress para ahorrar horas de desarrollo y abaratar coste final del proyecto.

Solución del primer requisito:

Implementé el plugin de booking calendar, que permite configurar distintos calendarios para cada curso y especificar el número de personas que pueden realizarlo.

Lo configurés de manera que pueden recibir la información que necesitan para cada curso, añadir una pasarela de pago online, para que los alumnos puedan pagar la fianza (para que la escuela pueda aceptar la reserva del curso)

Solución del segundo requisito:

Creé un usuario con funciones específicas para el administrador de la escuela de buceo. En su menú puede recibir las reservas, visualizarlas en un calendario, cancelarlas o aprobarlas y ponerse en contacto con sus estudiantes a través de correo electrónico. Una de las opciones que tienen es modificar el precio de los cursos. 

A través de funciones en php, realizo una consulta a la base de datos y vuelco los resultados en el front, de esta manera la web siempre tiene los precios actualizados sin necesidad de modificar el código.

function get_db_connection_or_die(){
	
	$mysqli = new mysqli('localhost', 'vilas_wp657', '3Y5A6S[p5.', 'vilas_wp657'); //Asignamos a la variable $mysqli la conexión a la BBDD 
        if ($mysqli -> connect_error){
            echo "<!DOCTYPE html>";
            echo "<html>";
            echo "<head><meta charset='UTF8'></head>";
            echo "<body>";
            echo "<p>Parece que ha habido un error inesperado con la conexión a la base de datos</p>";
            echo "</body>";
            echo "</html>";
            die();
        }
        return $mysqli;
	
}

function showPrice1(){	
	
    $mysqli = get_db_connection_or_die();	//guardamos en la variable $mysqli el resultado de la función de conexión 
	 $sql = 'SELECT * FROM wp7i_bookingtypes WHERE booking_type_id = 1'; //Guardamos en la variable $sql la consulta
     $conexion = mysqli_query($mysqli, $sql) or die('Query Error'); //guardamos en $conexion la consulta que lanzamos contra la BBDD
     while ($row = mysqli_fetch_array($conexion)) {
      echo $row['cost'];
      //echo '<p id="porcentaje_anticipo">'.$row['porcentaje_anticipo'].'</p>';
     }	
	mysqli_close($mysqli);	//Cerramos la conexión

}
add_shortcode('sc_showPrice1', 'showPrice1');


Los pasos iniciales para arrancar el proyecto fueron los siguientes:

Diseño
Primero estructuré la página web.
Después investigué las opciones que tenía para ofrecer un sistema de reservas.
Una vez me decanté por el booking calendar, configuré la pasarela de pagos, formularios y mensajes automáticos.

Desarrollo
Creé las páginas, menús. Añadí reglas de exclusión para la visualización de headers y footers
Probé distintas formas para visualizar los precios de la base de datos. 
Resolví con las funciones php explicadas en el anterior punto.
Creé un usuario para que el cliente pueda modificar los precios de los cursos




