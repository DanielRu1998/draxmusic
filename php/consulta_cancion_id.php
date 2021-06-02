<?php
	include 'configBD.php';

	$respAX = array();
	//Recibiendo los datos por post:
	$nombre = $_POST['nombre'];
	$duracion = $_POST['duracion'];
	$id_artista = $_POST['id_artista'];
	$id_album = $_POST['id_album'];
	$id_pista = $_POST['id_pista'];

	$query = 'SELECT * FROM cancion WHERE id='.$id_pista;
	$re = mysqli_query($conexion, $query);
	if ($f = mysqli_fetch_array($re)) {
	//Generando el Json con el identificador de la pista seleccionada:
	$respAX["iden"] = $f['num_pista'];
   }
	echo json_encode($respAX);
?>