<?php
	$servidorBD = "localhost";
	$usuarioBD = "root";
	$contrasenaBD = "";
	$nombreBD = "draxmusic";
	$conexion = mysqli_connect($servidorBD,$usuarioBD,$contrasenaBD,$nombreBD);
	mysqli_query($conexion, "SET NAMES 'utf8'");
	if (mysqli_connect_errno($conexion)) {
		die("Problemas con la conexion al servidor Mysql: ".mysqli_connect_error());
	}else{
		mysqli_query($conexion, "SET NAMES 'utf8'");
	}
?>
