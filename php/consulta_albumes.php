<?php
	include 'configBD.php';

	$album="";
  $id_filtro = $_POST['el_filtro'];
  if ($id_filtro == 1) {//Dio click en inicio
    $album.=
    '<div class="parallax-container bigEntrance" style="width: 100%;">
      <div class="parallax" id="ramstein"><img src="images/ram.jpg"></div>
    </div>
    <div class="parallax-container bigEntrance">
      <div class="parallax" id="billi"><img src="images/billi.jpg"></div>
    </div>  
    <div class="parallax-container bigEntrance">
      <div class="parallax" id="clasica"><img src="images/mozart.jpg"></div>
    </div>  
    <div class="parallax-container bigEntrance">
      <div class="parallax" id="bjork"><img src="images/ramones.jpg"></div>
    </div>
    <div id="en_cola" class="row"></div>';
  }else{
  if ($id_filtro == 0) {
    $query = 'SELECT * FROM album ORDER BY RAND() LIMIT 20';//Hacemos una consulta aleatoria de los albums 22
    $re = mysqli_query($conexion, $query);
  }
  if ($id_filtro == 2) {
    $query = 'SELECT * FROM album WHERE id_artista='.$_POST['lo_que_es'].' ORDER BY año DESC';//Es un artista
    $re = mysqli_query($conexion, $query);
  }
  if ($id_filtro == 3) {
    $query = 'SELECT * FROM album WHERE id='.$_POST['lo_que_es'].' ORDER BY año DESC';//Es un album
    $re = mysqli_query($conexion, $query);
  }
  if ($id_filtro == 4) {
    $query = 'SELECT * FROM album WHERE id='.$_POST['lo_que_es'].' ORDER BY año DESC';//Es una pista
    $re = mysqli_query($conexion, $query);
  }
  if ($id_filtro == 0 || $id_filtro == 2 || $id_filtro == 3 || $id_filtro == 4) {
  if ($re->num_rows > 0) {
	while ($f = mysqli_fetch_array($re)) {
    $mi_artista = $f['id_artista'];
    $mi_album = $f['id'];
		//Apartado para saber el nombre del artista:
		$query1 = 'SELECT * FROM artista WHERE id='.$f['id_artista'];
		$re1 = mysqli_query($conexion, $query1);
		$g = mysqli_fetch_array($re1);
		//Construyendo el album:
		$album.=
    '<div class="col s12 m4 l3 fadeIn" id="mi_content'.$f['id'].'" style="margin-bottom:25px;">
      <div class="card modal-trigger" style="cursor:pointer;" data-target="modal'.$f['id'].'">
        <div class="col s12 m12 l12 card-image" style="padding:0;height:300px;">
          <img src="img_albums/'.$f['imagen'].'" style="height: inherit;pointer-events: none;">
          <a class="btn-floating btn-large pulse waves-effect waves-light cyan darken-2" style="z-index:0;position:absolute;display:none;"><i class="material-icons">play_arrow</i></a>
        </div>
        <div class="card-content" style="color:#fff;background-color:#262626;padding:1px 10px 5px 10px;height:70%;">
          <p class="center-align" style="font-size:25px;"><b>'.$g['nombre'].'</b></p>
          <p class="center-align" style="font-size:18px;">'.$f['nombre'].'</p>
          <p class="center-align" style="font-size:12px;">'.$f['año'].'</p>
        </div>
      </div>

     <div id="modal'.$f['id'].'" class="modal">
     <a class="modal-close btn-floating btn waves-effect waves-light cyan darken-2 hide-on-small-only" style="float:right;z-index:1;position:relative;margin-top:10px;"><i class="material-icons" style="color:#fff;font-size:40px;">close</i></a>
       <div class="modal-content" style="background:url(img_albums/'.$f['imagen'].');background-repeat:no-repeat;background-position:center;background-size:cover;">
       	 <div class="row" style="color:#fff;background-color:#262626;border-radius:10px 10px 10px 10px;opacity: 0.93;margin-bottom:0;height:auto;">
       	 <div class="col s12 m6 l4 center-align" style="padding:0px;">
       	 <img src="img_albums/'.$f['imagen'].'" class="z-depth-5 responsive-img" style="pointer-events: none;">
         <div class="center-align" style="font-family: CabinSketch-Bold;"><div class="hide-on-small-only" style="font-size:25px;">'.$f['nombre'].'</div><h5 class="hide-on-med-and-up" id="title_movil'.$f['id'].'"></h5></div>
         <a class="btn-floating pulse cyan darken-2 reprocude_all_album" style="font-size:25px;color:#fff;border-radius:20px 20px 20px 20px;padding:0px 10px;margin-top:5px;"><i class="material-icons left" style="font-size:38px;">play_arrow</i><div style="display:none;"><p>'.$f['id'].'</p></div><li style="list-style:none;display:inline-block;">Reproducir</li></a>
         <div class="hide-on-med-and-up show_pistas" style="display:inline-block;position:absolute;right:4px;"><i class="material-icons" style="font-size:55px;">playlist_play</i></div>
         </div>
         <div class="col s12 m6 l8 hide-on-small-only" style="padding-left:50px;">
         <table style="font-size:19px;">
        <thead style="display:none;">
          <tr>
          	  <th>Pista</th>
              <th>Nombre</th>
              <th>Duración</th>
          </tr>
        </thead>

        <tbody>';

        //Creando la consulta de las canciones de cada album
        $query2 = "SELECT * FROM cancion WHERE id_artista=$mi_artista AND id_album=$mi_album ORDER BY num_pista ASC";
		$re2 = mysqli_query($conexion, $query2);
        while ($h = mysqli_fetch_array($re2)) {
        	$album.=
        		'<tr style="cursor:pointer;" class="select_music hoverable">
        		      <td style="width:50px;text-align:center;">'.$h['num_pista'].'</td>
                  <td>'.$h['nombre'].'</td>
                  <td class="hide-on-med-only" style="text-align:end;padding-right:15px;width:80px;">'.$h['duracion'].'</td>
                  <td style="display:none;">'.$f['id_artista'].'</td>
                  <td style="display:none;">'.$f['id'].'</td>
                  <td style="display:none;">'.$h['id'].'</td>
                  <td style="display:none;">'.$h['num_pista'].'</td>
                </tr>';
        }
    $album.=
        '</tbody>
      </table>
      </div>
       </div>
       </div>
     </div>
    </div>';
	}
  $album.=
    '<div id="en_cola" class="row"></div>';
  }
 }
}
if ($id_filtro == 5) {
  $cuenta_1=0;
    $query = "SELECT * FROM album WHERE 
    nombre LIKE '%".$_POST['lo_que_es']."%' ORDER BY RAND() LIMIT 10";//Es un FILTRO dando enter para busquedas de albums
    $re = mysqli_query($conexion, $query);
  if ($re->num_rows > 0) {$cuenta_1=$cuenta_1+1;
  $album.=
    '<div class="s12 m12 l12">
    <div class="center-align" style="color:#1d1d1d; font-size:35px;font-family: FascinateInline-Regular;">
     Albums
     </div>';
  while ($f = mysqli_fetch_array($re)) {
    $mi_artista = $f['id_artista'];
    $mi_album = $f['id'];
    //Apartado para saber el nombre del artista:
    $query1 = 'SELECT * FROM artista WHERE id='.$f['id_artista'];
    $re1 = mysqli_query($conexion, $query1);
    $g = mysqli_fetch_array($re1);
    //Construyendo el album:
    $album.=
    '<div class="col s12 m4 l3 fadeIn" id="mi_content'.$f['id'].'" style="margin-bottom:25px;">
      <div class="card modal-trigger" style="cursor:pointer;" data-target="modal'.$f['id'].'">
        <div class="col s12 m12 l12 card-image" style="padding:0;height:300px;">
          <img src="img_albums/'.$f['imagen'].'" style="height: inherit;pointer-events: none;">
          <a class="btn-floating btn-large pulse waves-effect waves-light cyan darken-2" style="z-index:0;position:absolute;display:none;"><i class="material-icons">play_arrow</i></a>
        </div>
        <div class="card-content" style="color:#fff;background-color:#262626;padding:1px 10px 5px 10px;height:70%;">
          <p class="center-align" style="font-size:25px;"><b>'.$g['nombre'].'</b></p>
          <p class="center-align" style="font-size:18px;">'.$f['nombre'].'</p>
          <p class="center-align" style="font-size:12px;">'.$f['año'].'</p>
        </div>
      </div>

     <div id="modal'.$f['id'].'" class="modal">
     <a class="modal-close btn-floating btn waves-effect waves-light cyan darken-2 hide-on-small-only" style="float:right;z-index:1;position:relative;margin-top:10px;"><i class="material-icons" style="color:#fff;font-size:40px;">close</i></a>
       <div class="modal-content" style="background:url(img_albums/'.$f['imagen'].');background-repeat:no-repeat;background-position:center;background-size:cover;">
         <div class="row" style="color:#fff;background-color:#262626;border-radius:10px 10px 10px 10px;opacity: 0.93;margin-bottom:0;height:auto;">
         <div class="col s12 m4 l4 center-align" style="padding:0px;">
         <img src="img_albums/'.$f['imagen'].'" class="z-depth-5 responsive-img" style="pointer-events: none;">
         <div class="center-align" style="font-family: CabinSketch-Bold;"><div class="hide-on-small-only" style="font-size:25px;">'.$f['nombre'].'</div><h5 class="hide-on-med-and-up" id="title_movil'.$f['id'].'"></h5></div>
         <a class="waves-effect waves-light cyan darken-2 reprocude_all_album" style="font-size:25px;color:#fff;border-radius:20px 20px 20px 20px;padding:0px 10px;margin-top:5px;"><i class="material-icons left" style="font-size:38px;">play_arrow</i><div style="display:none;"><p>'.$f['id'].'</p></div><li style="list-style:none;display:inline-block;">Reproducir</li></a>
         <div class="hide-on-med-and-up show_pistas" style="display:inline-block;position:absolute;right:4px;"><i class="material-icons" style="font-size:55px;">playlist_play</i></div>
         </div>
         <div class="col s12 m6 l8 hide-on-small-only" style="padding-left:50px;">
         <table style="font-size:19px;">
        <thead style="display:none;">
          <tr>
              <th>Pista</th>
              <th>Nombre</th>
              <th>Duración</th>
          </tr>
        </thead>

        <tbody>';

        //Creando la consulta de las canciones de cada album
        $query2 = "SELECT * FROM cancion WHERE id_artista=$mi_artista AND id_album=$mi_album ORDER BY num_pista ASC";
    $re2 = mysqli_query($conexion, $query2);
        while ($h = mysqli_fetch_array($re2)) {
          $album.=
            '<tr style="cursor:pointer;" class="select_music hoverable">
                  <td style="width:50px;text-align:center;">'.$h['num_pista'].'</td>
                  <td>'.$h['nombre'].'</td>
                  <td class="hide-on-med-only" style="text-align:end;padding-right:15px;width:80px;">'.$h['duracion'].'</td>
                  <td style="display:none;">'.$f['id_artista'].'</td>
                  <td style="display:none;">'.$f['id'].'</td>
                  <td style="display:none;">'.$h['id'].'</td>
                  <td style="display:none;">'.$h['num_pista'].'</td>
                </tr>';
        }
    $album.=
        '</tbody>
      </table>
      </div>
       </div>
       </div>
     </div>
    </div>';
  }
  $album.= '</div>';
  }
  $querya = "SELECT * FROM artista WHERE 
  nombre LIKE '%".$_POST['lo_que_es']."%' ORDER BY RAND() LIMIT 10";//Es un FILTRO dando enter para busqueda de artistas
  $rea = mysqli_query($conexion, $querya);
  if ($rea->num_rows > 0) {$cuenta_1=$cuenta_1+1;
  $album.=
    '<div class="col s12 m12 l12">
    <div class="center-align" style="color:#1d1d1d; font-size:40px;font-family: FascinateInline-Regular;">
     Artistas
     </div>';
    while ($fa = mysqli_fetch_array($rea)) {
      $query = 'SELECT * FROM album WHERE id_artista='.$fa['id'];
      $re = mysqli_query($conexion, $query);
      $f = mysqli_fetch_array($re);
    $mi_artista = $f['id_artista'];
    $mi_album = $f['id'];
    //Apartado para saber el nombre del artista:
    $query1 = 'SELECT * FROM artista WHERE id='.$f['id_artista'];
    $re1 = mysqli_query($conexion, $query1);
    $g = mysqli_fetch_array($re1);
    //Construyendo el album:
    $album.=
    '<div class="col s12 m4 l3 fadeIn" id="mi_content'.$f['id'].'" style="margin-bottom:25px;">
      <div class="card modal-trigger" style="cursor:pointer;" data-target="modal'.$f['id'].'">
        <div class="col s12 m12 l12 card-image" style="padding:0;height:300px;">
          <img src="img_albums/'.$f['imagen'].'" style="height: inherit;pointer-events: none;">
          <a class="btn-floating btn-large pulse waves-effect waves-light cyan darken-2" style="z-index:0;position:absolute;display:none;"><i class="material-icons">play_arrow</i></a>
        </div>
        <div class="card-content" style="color:#fff;background-color:#262626;padding:1px 10px 5px 10px;height:70%;">
          <p class="center-align" style="font-size:25px;"><b>'.$g['nombre'].'</b></p>
          <p class="center-align" style="font-size:18px;">'.$f['nombre'].'</p>
          <p class="center-align" style="font-size:12px;">'.$f['año'].'</p>
        </div>
      </div>

     <div id="modal'.$f['id'].'" class="modal">
     <a class="modal-close btn-floating btn waves-effect waves-light cyan darken-2 hide-on-small-only" style="float:right;z-index:1;position:relative;margin-top:10px;"><i class="material-icons" style="color:#fff;font-size:40px;">close</i></a>
       <div class="modal-content" style="background:url(img_albums/'.$f['imagen'].');background-repeat:no-repeat;background-position:center;background-size:cover;">
         <div class="row" style="color:#fff;background-color:#262626;border-radius:10px 10px 10px 10px;opacity: 0.93;margin-bottom:0;height:auto;">
         <div class="col s12 m4 l4 center-align" style="padding:0px;">
         <img src="img_albums/'.$f['imagen'].'" class="z-depth-5 responsive-img" style="pointer-events: none;">
         <div class="center-align" style="font-family: CabinSketch-Bold;"><div class="hide-on-small-only" style="font-size:25px;">'.$f['nombre'].'</div><h5 class="hide-on-med-and-up" id="title_movil'.$f['id'].'"></h5></div>
         <a class="waves-effect waves-light cyan darken-2 reprocude_all_album" style="font-size:25px;color:#fff;border-radius:20px 20px 20px 20px;padding:0px 10px;margin-top:5px;"><i class="material-icons left" style="font-size:38px;">play_arrow</i><div style="display:none;"><p>'.$f['id'].'</p></div><li style="list-style:none;display:inline-block;">Reproducir</li></a>
         <div class="hide-on-med-and-up show_pistas" style="display:inline-block;position:absolute;right:4px;"><i class="material-icons" style="font-size:55px;">playlist_play</i></div>
         </div>
         <div class="col s12 m6 l8 hide-on-small-only" style="padding-left:50px;">
         <table style="font-size:19px;">
        <thead style="display:none;">
          <tr>
              <th>Pista</th>
              <th>Nombre</th>
              <th>Duración</th>
          </tr>
        </thead>

        <tbody>';

        //Creando la consulta de las canciones de cada album
        $query2 = "SELECT * FROM cancion WHERE id_artista=$mi_artista AND id_album=$mi_album ORDER BY num_pista ASC";
    $re2 = mysqli_query($conexion, $query2);
        while ($h = mysqli_fetch_array($re2)) {
          $album.=
            '<tr style="cursor:pointer;" class="select_music hoverable">
                  <td style="width:50px;text-align:center;">'.$h['num_pista'].'</td>
                  <td>'.$h['nombre'].'</td>
                  <td class="hide-on-med-only" style="text-align:end;padding-right:15px;width:80px;">'.$h['duracion'].'</td>
                  <td style="display:none;">'.$f['id_artista'].'</td>
                  <td style="display:none;">'.$f['id'].'</td>
                  <td style="display:none;">'.$h['id'].'</td>
                  <td style="display:none;">'.$h['num_pista'].'</td>
                </tr>';
        }
    $album.=
        '</tbody>
      </table>
      </div>
       </div>
       </div>
     </div>
    </div>';      
    }
    $album.= '</div>';
  }
  $querya = "SELECT * FROM cancion WHERE 
  nombre LIKE '%".$_POST['lo_que_es']."%' ORDER BY RAND() LIMIT 10";//Es un FILTRO dando enter para busqueda de pistas
  $rea = mysqli_query($conexion, $querya);
  if ($rea->num_rows > 0) {$cuenta_1=$cuenta_1+1;
  $album.=
    '<div class="col s12 m12 l12" id="dr_pistas_unic">
    <div class="center-align" style="color:#1d1d1d; font-size:40px;font-family: FascinateInline-Regular;">Pistas</div>';
    while ($fa = mysqli_fetch_array($rea)) {
      $query = 'SELECT * FROM album WHERE id='.$fa['id_album'];
      $re = mysqli_query($conexion, $query);
      $f = mysqli_fetch_array($re);
    $mi_artista = $f['id_artista'];
    $mi_album = $f['id'];
    //Apartado para saber el nombre del artista:
    $query1 = 'SELECT * FROM artista WHERE id='.$f['id_artista'];
    $re1 = mysqli_query($conexion, $query1);
    $g = mysqli_fetch_array($re1);
    //Construyendo el album:
    $album.=
    '<div class="col s12 m4 l3 fadeIn" id="mi_content'.$f['id'].'" style="margin-bottom:25px;">
      <div class="card modal-trigger" style="cursor:pointer;" data-target="modal'.$f['id'].'">
        <div class="col s12 m12 l12 card-image" style="padding:0;height:300px;">
          <img src="img_albums/'.$f['imagen'].'" style="height: inherit;pointer-events: none;">
          <a class="btn-floating btn-large pulse waves-effect waves-light cyan darken-2" style="z-index:0;position:absolute;display:none;"><i class="material-icons">play_arrow</i></a>
        </div>
        <div class="card-content" style="color:#fff;background-color:#262626;padding:1px 10px 5px 10px;height:70%;">
          <p class="center-align" style="font-size:15px;"><b>'.$fa['nombre'].'</b></p>
          <p class="center-align" style="font-size:18px;">'.$f['nombre'].'</p>
          <p style="display:none;">'.$fa['num_pista'].'</p>
        </div>
      </div>

     <div id="modal'.$f['id'].'" class="modal">
     <a class="modal-close btn-floating btn waves-effect waves-light cyan darken-2 hide-on-small-only" style="float:right;z-index:1;position:relative;margin-top:10px;"><i class="material-icons" style="color:#fff;font-size:40px;">close</i></a>
       <div class="modal-content" style="background:url(img_albums/'.$f['imagen'].');background-repeat:no-repeat;background-position:center;background-size:cover;">
         <div class="row" style="color:#fff;background-color:#262626;border-radius:10px 10px 10px 10px;opacity: 0.93;margin-bottom:0;height:auto;">
         <div class="col s12 m4 l4 center-align" style="padding:0px;">
         <img src="img_albums/'.$f['imagen'].'" class="z-depth-5 responsive-img" style="pointer-events: none;">
         <div class="center-align" style="font-family: CabinSketch-Bold;"><div class="hide-on-small-only" style="font-size:25px;">'.$f['nombre'].'</div><h5 class="hide-on-med-and-up" id="title_movil'.$f['id'].'"></h5></div>
         <a class="waves-effect waves-light cyan darken-2 reprocude_all_album" style="font-size:25px;color:#fff;border-radius:20px 20px 20px 20px;padding:0px 10px;margin-top:5px;"><i class="material-icons left" style="font-size:38px;">play_arrow</i><div style="display:none;"><p>'.$f['id'].'</p></div><li style="list-style:none;display:inline-block;">Reproducir</li></a>
         <div class="hide-on-med-and-up show_pistas" style="display:inline-block;position:absolute;right:4px;"><i class="material-icons" style="font-size:55px;">playlist_play</i></div>
         </div>
         <div class="col s12 m6 l8 hide-on-small-only" style="padding-left:50px;">
         <table style="font-size:19px;">
        <thead style="display:none;">
          <tr>
              <th>Pista</th>
              <th>Nombre</th>
              <th>Duración</th>
          </tr>
        </thead>

        <tbody>';

        //Creando la consulta de las canciones de cada album
        $query2 = "SELECT * FROM cancion WHERE id_artista=$mi_artista AND id_album=$mi_album ORDER BY num_pista ASC";
    $re2 = mysqli_query($conexion, $query2);
        while ($h = mysqli_fetch_array($re2)) {
          $album.=
            '<tr style="cursor:pointer;" class="select_music hoverable">
                  <td style="width:50px;text-align:center;">'.$h['num_pista'].'</td>
                  <td>'.$h['nombre'].'</td>
                  <td class="hide-on-med-only" style="text-align:end;padding-right:15px;width:80px;">'.$h['duracion'].'</td>
                  <td style="display:none;">'.$f['id_artista'].'</td>
                  <td style="display:none;">'.$f['id'].'</td>
                  <td style="display:none;">'.$h['id'].'</td>
                  <td style="display:none;">'.$h['num_pista'].'</td>
                </tr>';
        }
    $album.=
        '</tbody>
      </table>
      </div>
       </div>
       </div>
     </div>
    </div>';      
    }
    $album.= '</div>';
  }
  if ($cuenta_1 != 0) {
 $album.=
    '<div id="en_cola" class="row"></div>';
  }
  }
  if ($id_filtro == 6) {
  $querya = "SELECT * FROM ".$_POST['lo_que_es']." ORDER BY RAND() LIMIT 5";
  $rea = mysqli_query($conexion, $querya);
  if ($rea->num_rows > 0) {
    while ($fa = mysqli_fetch_array($rea)) {
      $query = 'SELECT * FROM album WHERE id_artista='.$fa['id_artista'];
      $re = mysqli_query($conexion, $query);
    while ($f = mysqli_fetch_array($re)) {
    $mi_artista = $f['id_artista'];
    $mi_album = $f['id'];
    //Apartado para saber el nombre del artista:
    $query1 = 'SELECT * FROM artista WHERE id='.$f['id_artista'];
    $re1 = mysqli_query($conexion, $query1);
    $g = mysqli_fetch_array($re1);
    //Construyendo el album:
    $album.=
    '<div class="col s12 m4 l3 fadeIn" id="mi_content'.$f['id'].'" style="margin-bottom:25px;">
      <div class="card modal-trigger" style="cursor:pointer;" data-target="modal'.$f['id'].'">
        <div class="col s12 m12 l12 card-image" style="padding:0;height:300px;">
          <img src="img_albums/'.$f['imagen'].'" style="height: inherit;pointer-events: none;">
          <a class="btn-floating btn-large pulse waves-effect waves-light cyan darken-2" style="z-index:0;position:absolute;display:none;"><i class="material-icons">play_arrow</i></a>
        </div>
        <div class="card-content" style="color:#fff;background-color:#262626;padding:1px 10px 5px 10px;height:70%;">
          <p class="center-align" style="font-size:25px;"><b>'.$g['nombre'].'</b></p>
          <p class="center-align" style="font-size:18px;">'.$f['nombre'].'</p>
          <p style="display:none;">'.$f['año'].'</p>
        </div>
      </div>

     <div id="modal'.$f['id'].'" class="modal">
     <a class="modal-close btn-floating btn waves-effect waves-light cyan darken-2 hide-on-small-only" style="float:right;z-index:1;position:relative;margin-top:10px;"><i class="material-icons" style="color:#fff;font-size:40px;">close</i></a>
       <div class="modal-content" style="background:url(img_albums/'.$f['imagen'].');background-repeat:no-repeat;background-position:center;background-size:cover;">
         <div class="row" style="color:#fff;background-color:#262626;border-radius:10px 10px 10px 10px;opacity: 0.93;margin-bottom:0;height:auto;">
         <div class="col s12 m4 l4 center-align" style="padding:0px;">
         <img src="img_albums/'.$f['imagen'].'" class="z-depth-5 responsive-img" style="pointer-events: none;">
         <div class="center-align" style="font-family: CabinSketch-Bold;"><div class="hide-on-small-only" style="font-size:25px;">'.$f['nombre'].'</div><h5 class="hide-on-med-and-up" id="title_movil'.$f['id'].'"></h5></div>
         <a class="waves-effect waves-light cyan darken-2 reprocude_all_album" style="font-size:25px;color:#fff;border-radius:20px 20px 20px 20px;padding:0px 10px;margin-top:5px;"><i class="material-icons left" style="font-size:38px;">play_arrow</i><div style="display:none;"><p>'.$f['id'].'</p></div><li style="list-style:none;display:inline-block;">Reproducir</li></a>
         <div class="hide-on-med-and-up show_pistas" style="display:inline-block;position:absolute;right:4px;"><i class="material-icons" style="font-size:55px;">playlist_play</i></div>
         </div>
         <div class="col s12 m6 l8 hide-on-small-only" style="padding-left:50px;">
         <table style="font-size:19px;">
        <thead style="display:none;">
          <tr>
              <th>Pista</th>
              <th>Nombre</th>
              <th>Duración</th>
          </tr>
        </thead>

        <tbody>';

        //Creando la consulta de las canciones de cada album
        $query2 = "SELECT * FROM cancion WHERE id_artista=$mi_artista AND id_album=$mi_album ORDER BY num_pista ASC";
    $re2 = mysqli_query($conexion, $query2);
        while ($h = mysqli_fetch_array($re2)) {
          $album.=
            '<tr style="cursor:pointer;" class="select_music hoverable">
                  <td style="width:50px;text-align:center;">'.$h['num_pista'].'</td>
                  <td>'.$h['nombre'].'</td>
                  <td class="hide-on-med-only" style="text-align:end;padding-right:15px;width:80px;">'.$h['duracion'].'</td>
                  <td style="display:none;">'.$f['id_artista'].'</td>
                  <td style="display:none;">'.$f['id'].'</td>
                  <td style="display:none;">'.$h['id'].'</td>
                  <td style="display:none;">'.$h['num_pista'].'</td>
                </tr>';
        }
    $album.=
        '</tbody>
      </table>
      </div>
       </div>
       </div>
     </div>
    </div>';
    }      
    }
    $album.= '</div>';
  }
   $album.=
    '<div id="en_cola" class="row"></div>';
  }
	if ($album == '') {
		echo '<div class="center-align" style="color:#1d1d1d; font-size:40px; margin-top:80px;font-family: CabinSketch-Bold;">
		 No hay resultados.
		 </div>
     <div id="en_cola" class="row"></div>';
	}else{
		echo $album;
	}
?>