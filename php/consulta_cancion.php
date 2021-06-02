<?php
	include 'configBD.php';

	$respAX = array();
	$i = 0;//Variable para acceder a la posicion del arreglo JSON
	//Recibiendo los datos por post:
	//$nombre = $_POST['nombre'];
	//$duracion = $_POST['duracion'];
	//$id_artista = $_POST['id_artista'];
	$id_album = $_POST['id_album'];
	//$id_pista = $_POST['id_pista'];
	//OJO es muy importante "num_pista" pues de este orden sabremos en el js que pista se esta reproduciendo en la parte de los modales
	$query = 'SELECT * FROM cancion WHERE id_album='.$id_album.' ORDER BY num_pista ASC';
	$re = mysqli_query($conexion, $query);
	while ($f = mysqli_fetch_array($re)) {
	//Obteniendo el nombre del artista:
	$query1 = 'SELECT * FROM artista WHERE id='.$f['id_artista'];
	$re1 = mysqli_query($conexion, $query1);
	$g = mysqli_fetch_array($re1);
	//Obteniendo el nombre del album:
	$query2 = 'SELECT * FROM album WHERE id='.$f['id_album'];
	$re2 = mysqli_query($conexion, $query2);
	$h = mysqli_fetch_array($re2);

	//Generando el Json de la pista $i:
	$respAX[$i] =
	array(
		"title" => "".$f['nombre']."",
		"artist" => "".$g['nombre']."",
		"url" => "musica/".$g['nombre']."/".$h['nombre']."/".$f['sound']."",
		"art" => "img_albums/".$h['imagen']."",
		"album" => "".$h['nombre']."",
	);
	$i=$i+1;
   }
	echo json_encode($respAX);
?>