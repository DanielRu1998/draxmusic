<?php
	include 'configBD.php';

$tabla='';
//$query='SELECT * FROM artista ORDER BY id';
if (isset($_POST['valor'])) {
	$q=$conexion->real_escape_string($_POST['valor']);
	//Filtramos artistas primero:
	$query="SELECT * FROM artista WHERE 
		nombre LIKE '%".$q."%' ORDER BY RAND() LIMIT 3";
	//Filtramos albums en segundo lugar
	$query2="SELECT * FROM album WHERE 
		nombre LIKE '%".$q."%' ORDER BY RAND() LIMIT 3";
	//Filtramos canciones en tercer lugar
	$query3="SELECT * FROM cancion WHERE 
		nombre LIKE '%".$q."%' ORDER BY RAND() LIMIT 3";
	//Filtramos genero en cuarto lugar
	$query4="SELECT * FROM genero WHERE 
		nombre LIKE '%".$q."%' ORDER BY RAND() LIMIT 3";	
}
$buscarArtista = $conexion->query($query);
$buscarAlbum = $conexion->query($query2);
$buscarCancion = $conexion->query($query3);
$buscarGenero = $conexion->query($query4);
$tabla.='
   <table style="color:#fff;font-size:20px;" class="centered">';
if ($buscarArtista->num_rows > 0) {
  while ($filaArtista=$buscarArtista->fetch_assoc()) {
	$tabla.=
	'<tr style="background:#262626;cursor:pointer;" class="select_filtr hoverable">
		<td><img src="images/img_artistas/'.$filaArtista['imagen'].'" width="70px" height="70px" class="valign-wrapper"></td>
		<td><b>'.$filaArtista['nombre'].'</b></td>
		<td><i class="material-icons" style="font-size:25px;">person</i></td>
		<td style="display:none;">'.$filaArtista['id'].'</td>
		<td style="display:none;">2</td>
	</tr>';
  }
}
if ($buscarAlbum->num_rows > 0) {
  while ($filaAlbum=$buscarAlbum->fetch_assoc()) {
	$tabla.=
	'<tr style="background:#262626;cursor:pointer;" class="select_filtr hoverable">
		<td><img src="img_albums/'.$filaAlbum['imagen'].'" width="70px" height="70px" class="valign-wrapper"></td>
		<td><b>'.$filaAlbum['nombre'].'</b></td>
		<td><i class="material-icons" style="font-size:25px;">album</i></td>
		<td style="display:none;">'.$filaAlbum['id'].'</td>
		<td style="display:none;">3</td>
	</tr>';
  }
}
if ($buscarCancion->num_rows > 0) {
  while ($filaCancion=$buscarCancion->fetch_assoc()) {
  	$queryw = 'SELECT * FROM album WHERE id='.$filaCancion['id_album'];
	$re1 = mysqli_query($conexion, $queryw);
	$g = mysqli_fetch_array($re1);
	$tabla.=
	'<tr style="background:#262626;cursor:pointer;" class="select_filtr hoverable">
		<td><img src="img_albums/'.$g['imagen'].'" width="70px" height="70px" class="valign-wrapper"></td>
		<td><b>'.$filaCancion['nombre'].'</b></td>
		<td><i class="material-icons" style="font-size:25px;">audiotrack</i></td>
		<td style="display:none;">'.$g['id'].'</td>
		<td style="display:none;">4</td>
		<td style="display:none;">'.$filaCancion['num_pista'].'</td>
	</tr>';
  }
}
if ($buscarGenero->num_rows > 0) {
  while ($filaGenero=$buscarGenero->fetch_assoc()) {
	$tabla.=
	'<tr style="background:#262626;cursor:pointer;" class="select_filtr hoverable">
		<td><img src="images/img_artistas/dr_genero_p.png" width="70px" height="70px" class="valign-wrapper"></td>
		<td><b>'.$filaGenero['nombre'].'</b></td>
		<td><i class="material-icons" style="font-size:25px;">music_video</i></td>
		<td style="display:none;">'.$filaGenero['nombre'].'</td>
		<td style="display:none;">6</td>
	</tr>';
  }
}
$tabla.='
   </table>';
echo $tabla;
?>