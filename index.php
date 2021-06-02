<!DOCTYPE html>
<html lang="es">
<head>
  <title>DraxMusic</title>
	<meta charset="UTF-8">
  <!--Manejo del cache-->
  <meta http-equiv="Expires" content="0">
  <meta http-equiv="Last-Modified" content="0">
  <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate">
  <meta http-equiv="Pragma" content="no-cache">

  <!--Adaptacion a Moviles-->
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta name="author" content="Dany el Crak">
  <meta name="description" content="Escucha tus mejores canciones local">
  <meta name="copyright" content="Los R. R.">
  <meta name="robots" content="noindex">
	<!--Import Google Icon Font-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!--Import materialize.css-->
    <link type="text/css" rel="stylesheet" href="Pluggins/materialize/css/materialize.min.css"  media="screen,projection"/>
    <!--Estilos al hacer scroll animacion a los albums-->
    <link rel="stylesheet" href="css/animation.css">
    <!--Estilos noUIslider-->
    <link rel="stylesheet" href="css/nouislider.css">
    <!--Estilos-->
    <link rel="stylesheet" href="css/estilos.css">
    <!--Icono .ico-->
    <link rel="shortcut icon" href="images/drax.ico" type="image/x-icon">
</head>
<body>
<!-- Menu-->
<div id="divMenu" style="height:60px; background-color:#262626" class="slideRight">
  <nav class="pushpin" data-target="divMenu">
    <div class="nav-wrapper">
      <a class="brand-logo show_inicio" style="cursor:pointer;"><img src="images/drax1.png" width="240px" height="70px"/></a>
      <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down">
        <li><a class="show_inicio"><i class="material-icons left">home</i>Inicio</a></li>
        <li><a class="show_albums"><i class="material-icons left">album</i>Albums</a></li>
        <li><a href="#modalx" class="modal-trigger show_crear"><i class="material-icons left">library_music</i>Crear</a></li>
      </ul>
    </div>
  </nav>
  <!-- Menu para vistas de celulares-->
  <ul class="sidenav" id="mobile-demo">
     <li><div class="user-view">
        <a class="show_inicio" style="cursor:pointer;"><img src="images/drax1.png" width="100%" height="100%"></a>
      </div></li>
      <li><div class="divider"></div></li>
      <li style="cursor:pointer;"><a class="show_inicio"><i class="material-icons left">home</i>Inicio</a></li>
      <li style="cursor:pointer;"><a class="show_albums"><i class="material-icons left">album</i>Albums</a></li>
      <li style="cursor:pointer;"><a href="#modalx" class="modal-trigger show_crear"><i class="material-icons left">library_music</i>Crear</a></li>
  </ul>	
  <!-- Modal Structure para la parte de Creacion-->
  <div id="modalx" class="modal">
  <a class="modal-close btn-floating btn waves-effect waves-light cyan darken-2" style="float:right;z-index:1;position:relative;margin-top:0px;"><i class="material-icons" style="color:#fff;font-size:40px;">close</i></a>
    <div class="modal-content">
    <h4 class="center-align">Ajustes de Edición</h4>
      <div class="row">
        <div class="col s12 m7 l3" id="mi_temporizador">
            <div class="card bigEntrance">
              <div class="card-image waves-effect waves-block waves-light">
                <img class="activator" src="images/tempo.jpg">
              </div>
              <div class="card-content" style="background-color:#262626;color:#fff;padding-top: 5px;padding-bottom: 10px;">
                 <span class="card-title activator white-text text-darken-4">Temporizador<i class="material-icons right">more_vert</i></span>
                 <input type="text" class="timepicker" placeholder="Haz Click para Agregar!" id="pon_tiempo" onfocus="blur();">
              </div>
              <div class="card-reveal" style="background-color:#262626;color:#fff;">
                  <span class="card-title white-text text-darken-4">Temporizador<i class="material-icons right">close</i></span>
                  <br>
                  <p style="font-size:105%;">Si deseas que la música en reproduccion se apague a una hora determinada de manera "Automatica" este ajuste es para ti.</p><br>
                  <div class="center-align">
                  <a class="waves-effect waves-light btn cyan darken-2" style="border-radius: 7px 7px 7px 7px;"><i class="material-icons left" style="font-size:25px;">add_alarm</i>Agregar</a></div>
                </div>
              </div>
        </div>
        <div class="col s12 m5 l3" id="mi_playlist">
          <div class="card bigEntrance">
              <div class="card-image waves-effect waves-block waves-light">
                <img class="activator" src="images/playlist.png">
              </div>
              <div class="card-content" style="background-color:#262626;color:#fff;">
                 <span class="card-title activator white-text text-darken-4">Crear Playlist<i class="material-icons right">more_vert</i></span>
                  <p><a style="color:#0097a7;">En construcción :(</a></p>
              </div>
              <div class="card-reveal" style="background-color:#262626;color:#fff;">
                  <span class="card-title white-text text-darken-4">Crear Playlist<i class="material-icons right">close</i></span>
                  <p style="font-size:105%;">¿Desearias crear un álbum personalizado con las canciones de tu preferencia?</p>
                  <br>
                  <p style="font-size:105%;">Entonces crea ahora mismo tu propio Playlist.</p>
                </div>
              </div>
        </div>
        <div class="col s12 m7 l3" id="sube_album">
          <div class="card bigEntrance">
              <div class="card-image waves-effect waves-block waves-light">
                <img class="activator" src="images/albums.jpg">
              </div>
              <div class="card-content" style="background-color:#262626;color:#fff;">
                 <span class="card-title activator white-text text-darken-4">Subir Álbum<i class="material-icons right">more_vert</i></span>
                  <p><a style="color:#0097a7;">En construcción :(</a></p>
              </div>
              <div class="card-reveal" style="background-color:#262626;color:#fff;">
                  <span class="card-title white-text text-darken-4">Sube un Álbum<i class="material-icons right">close</i></span>
                  <p style="font-size:105%;">Si en DraxMusic no se encuentra tu álbum favorito, entonces sube ahora el álbum.</p>
                </div>
              </div>
        </div>
        <div class="col s12 m5 l3" id="sube_pista">
          <div class="card bigEntrance">
              <div class="card-image waves-effect waves-block waves-light">
                <img class="activator" src="images/pista.png">
              </div>
              <div class="card-content" style="background-color:#262626;color:#fff;">
                 <span class="card-title activator white-text text-darken-4">Subir Pista<i class="material-icons right">more_vert</i></span>
                  <p><a style="color:#0097a7;">En construcción :(</a></p>
              </div>
              <div class="card-reveal" style="background-color:#262626;color:#fff;">
                  <span class="card-title white-text text-darken-4">Sube una Pista<i class="material-icons right">close</i></span>
                  <p style="font-size:105%;">Si en algun álbum no se encuentra una pista, puedes subir la pista faltante.</p>
                </div>
              </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div id="divPrincipal">
<!-- Barra de Busqueda-->
  <nav id="la_busqueda" class="pushpin" data-target="divPrincipal">
    <div class="nav-wrapper">
      <form id="target_s">
        <div class="input-field">
          <input id="search" type="search" placeholder="Escribir..." autocomplete="off">
          <label class="label-icon" for="search"><i class="material-icons">search</i></label>
          <i class="material-icons" id="borra">close</i>
        </div>
        <div id="tabla_resultado" style="z-index:1005;"></div>
      </form>
    </div>
  </nav>
  <!-- DIV PRINCIPAL para filtrar contenido-->
  <div class="row" id="contenidoFiltrado" style="margin-bottom: 40px;">
    <!-- Parallax Por defecto al iniciar la aplicacion:-->
    <div class="parallax-container bigEntrance" style="width: 100%;" id="ramsteinss">
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
  </div>
</div>	
 <!--Footer, donde se visualizara la reproduccion de alguna pista o pistas el z-index es de la capa de los modales para que se pueda usar al poner un album--> 
<div id="reproductor" class="row" style="z-index:1005;">
  <!--Contenedor de la imagen del album y nombre de la cancion actual(ESTE DIV SERA EL DINAMICO PARA INSERTAR LA CANCION SELECCIONADA)-->
  <div class="col s4 m3 l3 hide-on-small-only" id="Album_datos">
    <!--Contenedor de la imagen del album-->
    <div class="col s6 m4 l3" style="padding:0;">
      <img src="" width="100%" height="80px" id="art" style="cursor:pointer;" class="la_cola">
    </div>
    <!--Contenedor de la informacion de la cancion-->
    <div class="col s6 m8 l9" style="padding-left:3px;">
      <h6 style="line-height: 80%;color:#fff;padding-top: 10px;" id="title"></h6>
      <h8 style="line-height: 80%;color:#8C8C8C;" id="artist"></h8>
    </div>
  </div>
  <!--Contenedor de los controles de la musica, play, aleatorio, etc-->
  <div class="col s12 m7 l7" id="Controles_music" style="padding:0;">
    <!--Contenedor de los botones de control-->
    <div class="col s12 m12 l12" style="padding:0;">
      <div id="mve_ctls">
        <a class="tooltipped" data-position="top" data-tooltip="Activar Aleatorio" id="aleatoriedad"><i class="material-icons" style="font-size:30px;">shuffle</i></a>
        <a class="tooltipped" data-position="top" data-tooltip="Anterior" id="ant_song"><i class="material-icons" style="font-size:45px;">skip_previous</i></a>
        <a class="tooltipped" data-position="top" data-tooltip="Reproducir" id="repro_pause" style="position: relative;"><i class="material-icons" style="font-size:60px;">play_circle_outline</i>
        <!--Preloader, incrustado sobre el boton de play para indicar carga de la musica-->
           <div class="preloader-wrapper big active" style="position: absolute;left:5px;top:5px;cursor:pointer;display:none;" id="mi_prelo1">
              <div class="spinner-layer spinner-blue-only">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
            </div>
        </a>
        <a class="tooltipped" data-position="top" data-tooltip="Siguiente" id="nex_song"><i class="material-icons" style="font-size:45px;">skip_next</i></a>
        <a class="tooltipped" data-position="top" data-tooltip="Activar Repetir" id="loop_botons"><i class="material-icons" style="font-size:30px;">loop</i></a>
      </div>
    </div>
    <!--Contenedor de la barra de duracion de la pista-->
    <div class="col s12 m12 l12">
      <h6 class="col s1 m1 l1 right-align" id="duracion_pista_act">0:00</h6>
      <div class="col s10 m10 l10">
       <div id="barra_pista"></div>
      </div>
            <h6 class="col s1 m1 l1" id="duracion_pista">0:00</h6>
    </div>
  </div>
  <!--Contenedor del control de volumen y Descarga-->
  <div class="col s12 m2 l2 hide-on-med-and-down" id="Control_volumen">
      <div class="col m12 l12">
         <br>
      </div>
      <div class="col m2 l2" id="volum">
         <i class="material-icons" style="color:#BFBFBF;cursor:pointer;font-size:30px;" id="cambia_volum">volume_up</i>
      </div>
      <div class="col m10 l10">
            <p class="range-field">
              <input type="range" id="barra_volumen" min="0" max="100" value="100" disabled/>
            </p>
      </div>
  </div>
</div>
<!--Contexto canvas y contenedores de las imagens que utilizara DraxMusic:
<canvas id="canvas" width="640" height="480" style="display: none;"></canvas>
<img src="" id="laimagen" style="display: none;" />-->
</body>
<!--JavaScript at end of body for optimized loading-->
<script>
window.onload = function(){
  window.location.hash = 'no-back-button';
  window.location.hash = 'Again-No-back-button';

  window.onhashchange=function(){
    window.location.hash = 'no-back-button';
  }
}
</script>
<script src="js/jquery-3.4.1.min.js"></script>
<script src="js/ajax1.js"></script>
<script src="js/eventos1.js"></script>
<script type="text/javascript" src="Pluggins/materialize/js/materialize.min.js"></script>
<script src="js/nouislider.js"></script>
</html>