var guarda_pista_aux=0;//Variable auxiliar para recuperar el nmero de la pista al hacer acciones con la tupla.
var guarda_pista_aux2=0;//Variable auxiliar que guarda el id de la pista, este id es el unico traido de la BD
var guarda_id_pista=0; //Variable que guarda el numero de pista que se esta reproduciendo actualmente.
var guarda_id_album=0;//Variable que guarda el id del albumen reproduccion
var bandera_volum = 0;//Controla el estado del volumen apagado o encendido
var bandera_repro_pause = 0;//Controla el estado de pausa o reproduce
var bandera_aleatorio = 0;//Controla el estado de aleatoriedad de pistas
var bandera_loop = 0;//Controla el estado de repetir pista
var bandera_desliza = 0;//Controla los tiempos del slider
var bandera_habilita_eventos = 0;//Controla los eventos del reproductor 
var bandera_inicio_albums = 0;//Controla el filtrado de inicio y albums
var bandera_lista = 0;//Controla los eventos de despliegue de canciones modo movil
var muestra_fon = 0;//Guarga el ID del album que se desplego la lista de canciones modo movil
var current_track = 0;//Variable de control principal que maneja el json "La pista a reproducir"
var que_es;//guarda el id dependiendo de que se filtro en el album, pista o artista
var dr_posi;
var verify_tip=0;//Bandera que verifica si el usuario va a buscar algo, usado para habilitar la escucha al presionar la tecla espacio. 
var nombre_pista;//Guarda el nombre de la pista actual, visible solo en moviles
var xDown = null;                                                        
var yDown = null;
var slider = document.getElementById('barra_pista');
var skipTime = 10; //Variable de control usada por el reproductor en segundo plano de google para avanzar cada 10s en la pista en reproduccion
var songs = '';//Esta variable guardara el json de todo el album despues de cierto evento
var audio = new Audio();//Se inicializa la variable audio para trabajar posteriormente con el
window.addEventListener("popstate", e => {//Evento para manejar el boton hacia atras y cerrar ventana modal
	if (bandera_lista == 1) { //Maneja las listas de camciones en modo vovil, al hacer hacia atras
            	bandera_lista = 0; //Apagamos el evento de que estaba en la lista de canciones
            	//Cambiamos estilos:
            	document.getElementById('modal'+muestra_fon+'').childNodes[3].childNodes[1].childNodes[1].className = 'col s12 m6 l4 center-align';
				document.getElementById('modal'+muestra_fon+'').childNodes[3].childNodes[1].childNodes[3].className = 'col s12 m6 l8 hide-on-small-only';
				document.getElementById('modal'+muestra_fon+'').childNodes[3].childNodes[1].style.opacity = '0.93';
    }
    $('.modal').modal('close');
});
$(document).bind('keydown',function(e){
	if ( e.which == 27 ) {//Evento para cerrar modales presionando la tecla ESC:
		window.history.back();
        $('.modal').modal('close');
    };
    if ( e.which == 32 ) {//Evento para pausar o reproducir la musica al precionar la tecla espacio
    	if (verify_tip ==0) {
    	e.preventDefault();
		if (songs != '') {
			if ($('#repro_pause i').text() === 'pause_circle_outline') {//Si esta en reproduccion:
				bandera_repro_pause = 1;
				pause_play();
			}else{//Si esta en Pause:
				bandera_repro_pause = 0;
				pause_play();
			}
		}
	   }
    };
});
$(document).ready(function(){
  //Activa los tooltip de los controles
	$('.tooltipped').tooltip({
		enterDelay: 700
	});
  //Pone por primera vez la barra de reproduccion de la pista
  noUiSlider.create(slider, {
   start: 0,
   tooltips: true,
   connect: [true, false],
   orientation: 'horizontal',
   range: {
     'min': 0,
     'max': 100
   }
  });
  //Eventos para detectar el desplazamiento con dedos
  document.addEventListener('touchstart', handleTouchStart, false);        
  document.addEventListener('touchmove', handleTouchMove, false);
  //Desabilitando los botones del reproductor al inicio de la aplicacion:
  slider.setAttribute('disabled', true);
  	//Eventos que esperan la escucha: 
	document.getElementById('nex_song').addEventListener("click", nextTrack, false);
	document.getElementById('ant_song').addEventListener("click", prevTrack, false);
	document.getElementById('loop_botons').addEventListener("click", repeticion_song, false);
	document.getElementById('cambia_volum').addEventListener("click", change_volumen, false);
	document.getElementById('repro_pause').addEventListener("click", pause_play, false);
	document.getElementById('aleatoriedad').addEventListener("click", aleatorio_song, false);
//Eventos que esperan la escucha del reproductor en segundo plano de google:
  navigator.mediaSession.setActionHandler('play', function() {
  	bandera_repro_pause = 0;
  	pause_play();
  });
  navigator.mediaSession.setActionHandler('pause', function() {
  	bandera_repro_pause = 1;
  	pause_play();
  });
  navigator.mediaSession.setActionHandler('seekbackward', function() {
  	audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
  });
  navigator.mediaSession.setActionHandler('seekforward', function() {
  	audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
  });
  navigator.mediaSession.setActionHandler('previoustrack', function() {prevTrack();});
  navigator.mediaSession.setActionHandler('nexttrack', function() {
  	nextTrack();    
  });
  //Evento que vuelve a desplegar el modal presionando sobre la imagen del reproductor:
  $('.la_cola').click(function(){
  	$('#modal'+guarda_id_album).modal('open');
  	if (songs != '') {
				document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].style.color = "#00acc1";
				document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = '<i class="material-icons" style="font-size:25px;">play_arrow</i>';
				document.getElementById('title_movil'+guarda_id_album+'').innerHTML = nombre_pista;
				if ($('#repro_pause i').text() === 'pause_circle_outline') {
					document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[1].childNodes[5].childNodes[2].innerHTML = 'Pausar';
					document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[1].childNodes[5].childNodes[0].innerHTML = 'pause';

				}
		}
  });
	//Evento para cambiar el nivel de volumen con el range:
	$("#barra_volumen").bind("change", function() {
		var vol = $('#Control_volumen .thumb .value').text();
		audio.volume=vol/100;//Dividimos entre 100 porque el volumen solo se maneja de 0 a 1
	});
	//Evento que lee cuando se empieza a arrastar el slider:
	slider.noUiSlider.on('start', function () { 
		bandera_desliza =1;
		var valor_segundos = $('.noUi-tooltip').text();
		$('.noUi-tooltip').text(convierte_duracion(valor_segundos));
	});
	//Evento que lee cuando arrastramos el slider:
	slider.noUiSlider.on('slide', function () { 
		var valor_segundos = $('.noUi-tooltip').text();
		$('.noUi-tooltip').text(convierte_duracion(valor_segundos));
	});
	//Evento que lee cuando se acaba de arrastrar el slider:
	slider.noUiSlider.on('end', function () { 
		bandera_desliza = 0;
		var valor_segundos = $('.noUi-tooltip').text();
		$('.noUi-tooltip').text(convierte_duracion(valor_segundos));
	});
	//Evento para podernos desplazar en la pista actual presionando una parte del slider:
	slider.noUiSlider.on('change', function () { 
		bandera_desliza = 1;
		var value_slider = slider.noUiSlider.get();//Con esto obtenemos el valor del slider donde se haga click
		audio.currentTime = value_slider;
		bandera_desliza = 0;
	});
	//Evento para desplazar la barra de audio de la pista actual automaticamente(song en reproduccion) y siguiente pista automaticamente:
	audio.addEventListener('timeupdate', function () {
	var curtime = parseInt(this.currentTime, 10); 
	if (bandera_desliza == 0) {
		slider.noUiSlider.set(curtime);
	}
	$('#duracion_pista_act').text(convierte_duracion(curtime));//Actualizando el tiempo de la pista
	//A continuacion el codigo para avanzar a la siguiente pista cuando acabe una pista automaticamente:
	if (Math.trunc(audio.duration) == curtime) {
		//OJO la prioridad la tiene "Repetir pista cuando estan activos repetir y aletoriedad"
		//OJO "Repetir pista" solo se da cuando acaba una pista, no cuando se cambia de pista
		if (bandera_loop == 1 && bandera_aleatorio == 1){//Si esta activado "Repetir pista" y "Aleatoriedad"
			current_track--;
		}
		if (bandera_loop == 1 && bandera_aleatorio == 0) {//Si esta activado solamente "Repetir pista"
			current_track--;
		}
		if (bandera_loop == 0 && bandera_aleatorio == 1) {//Si esta activado solamente "Aleatoriedad"
			var song_aleatorio = aleatorio(0,10000);
			current_track = song_aleatorio;
			current_track = current_track % (songs.length);
		}
		nextTrack();
	}
	});
});

//Escucha para poder esconder el reproductor en celulares a la hora de filtrar:
$('#search').focus(function(){
	verify_tip=1;
	$('#reproductor').css("display", "none");
	$('#divMenu').css("display", "none");
});
$('#search').focusout(function(){
	verify_tip=0;
	setTimeout(function(){$('#tabla_resultado').html('<div></div>');},200);//desaparecemos lo filtrtado despues de 200milis
	setTimeout(function(){$('#divMenu').css("display", "block");},400);
	setTimeout(function(){$('#reproductor').css("display", "block");},400);
	
});
//Escucha para el filtrado de busqueda:
$('#search').keyup(function(){
	verify_tip=1;
	$('#reproductor').css("display", "none");
	$('#divMenu').css("display", "none");
	$('#tabla_resultado').html('<table class="centered"><tr style="background:#262626;"><td><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></td></tr></table>')//Mostrando un preloader al usuario para que espere los resultados posibles
	var valorBusqueda = $(this).val();
	if (valorBusqueda != '') {
		obtener_filtrado(valorBusqueda);
	}else{
		$('#tabla_resultado').html('<div></div>');
	}
});
//Escucha si el usuario presiono enter a la hora de la busqueda
$('#target_s').submit(function(event){
	verify_tip=0;
	event.preventDefault();//hacemos que no se recargue la pagina
	$("html, body").animate({scrollTop: $('#divMenu').offset().top }, 1000);
	var valorBusqueda = $('#search').val();
	if (valorBusqueda != '') {
		$('#contenidoFiltrado').html('<div class="preloader"></div>');
		$('#tabla_resultado').html('<div></div>');//Quitamos los resultados filtrados
		$('#search').blur();//desabilitamos la busqueda para que se cierre el teclado a la hora de buscar
		bandera_inicio_albums = 5;
		que_es = valorBusqueda;//Asignamos el valor a que_es lo que escribio el usuario
		obtener_registros();//Mandamos a traer lo filtrado si es que existe
	}else{
		$('#tabla_resultado').html('<div></div>');
	}
});
//Funcion con ajax que me devuelve los resultados de nombres filtrados de la escucha keyup:
function obtener_filtrado(valor){
	$.ajax({
		data: {valor: valor},
		url: "./php/consulta_filtrado.php",
		type: 'POST',
		change: false,
		dataType: "html"
	})

	.done(function(result){
		$('#tabla_resultado').html(result);
		lk1();
	})
}
//Escucha para filtrar los albums del boton que se encuentra en el nav:
$('.show_albums').click(function() {
	$('#contenidoFiltrado').html('<div class="preloader"></div>');
	bandera_inicio_albums = 0;
	obtener_registros();
	$('.sidenav').sidenav("close");//Para vistas celulares cerramos el sidenav
});
//Escucha para regresar al inicio de la app:
$('.show_inicio').click(function() {
	bandera_inicio_albums = 1;
	obtener_registros();
	$('.sidenav').sidenav("close");//Para vistas celulares cerramos el sidenav

});
function obtener_registros(){
	$.ajax({
		data: 'el_filtro='+bandera_inicio_albums+'&lo_que_es='+que_es,
		url: "./php/consulta_albumes.php",//este metodo ajax tambien debe ser capaz de filtrar la busqueda(en construccion)
		type: 'POST',
		cache: false,
		dataType: "html"
	})

	.done(function(res){
		$('#contenidoFiltrado').html(res);
		if (bandera_inicio_albums == 1) {$('.parallax').parallax();}
		if (songs != '') {
				if ($('#mi_content'+guarda_id_album).length == 0) {
					//Este ajax muestra el album en reproduccion actual aunque el usuario filtre otros albums:
					$.ajax({
						data: 'la_cola='+guarda_id_album,
						url: "./php/consulta_album_cola.php",
						type: 'POST',
						cache: false,
						dataType: "html"
					})
					.done(function(rell){
						$('#en_cola').html(rell);
						albumss();
						$('.modal').modal({//Opciones para visualizar el modal de los albums seleccionados
							opacity: 1,
							dismissible: false,
							inDuration: 500,
							outDuration: 600,
							startingTop: '-100%',
							endingTop: '5%'
						});
						document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "block";
					})
				}else{
					albumss();
					$('.modal').modal({//Opciones para visualizar el modal de los albums seleccionados
						opacity: 1,
						dismissible: false,
						inDuration: 500,
						outDuration: 600,
						startingTop: '-100%',
						endingTop: '5%'
					});
					document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "block";
				}
		}else{
			albumss();
			$('.modal').modal({//Opciones para visualizar el modal de los albums seleccionados
			opacity: 1,
			dismissible: false,
			inDuration: 500,
			outDuration: 600,
			startingTop: '-100%',
			endingTop: '5%'
			});
		}
	})
}
//La funcion lk1 trabaja con el contenido filtrado: 
function lk1(){
	const dr_estilo = document.querySelectorAll('#tabla_resultado .select_filtr');//Capturando contenido filtrado
	const estilo5 = function (){
		this.style.color = "#00acc1";
	}
	const estilo6 = function (){
		this.style.color = "#fff";
	}
	const buscar = function (){
		$('#contenidoFiltrado').html('<div class="preloader"></div>');
		$('#search').val(this.childNodes[3].childNodes[0].innerHTML);//Ponemos en la busqueda la eleccion escogida
		$('#tabla_resultado').html('<div></div>');//Quitamos los resultados filtrados
		bandera_inicio_albums = this.childNodes[9].innerHTML;//representa el identificador del filtrado, si se trata de un album, artista o pista
		que_es = this.childNodes[7].innerHTML;
		if (bandera_inicio_albums == 4) {dr_posi = this.childNodes[11].innerHTML}
		obtener_registros();//Mandamos a traer lo filtrado
		$("html, body").animate({scrollTop: $('#divMenu').offset().top }, 1000);
	}
	dr_estilo.forEach(dr_botom => {
		dr_botom.addEventListener("click", buscar);
		dr_botom.addEventListener("mouseover", estilo5);
		dr_botom.addEventListener("mouseout", estilo6);
	});
}
//funcion que actua sobre los albums filtrados y sus pistas individuales:
//OJO, evitemos llamar constantes veces un: document.querySelectorAll, este solo debe de llamarse 1 sola vez
//Un ejemplo de esto es la funcion albumss().
//El error de llamar sucesivas veces document.querySelectorAll es que obtendremos llamadas repetidas de este query
function albumss(){
	$('#contenidoFiltrado .modal-close').click(function(){
  		window.history.back();
  	});
	const botones = document.querySelectorAll('#contenidoFiltrado .card');//Capturando los albums 
	const musica = document.querySelectorAll('.select_music');//Capturando pistas resultantes del album seleccionado
	const individual_album = document.querySelectorAll('.reprocude_all_album');//Capturando el boton de reproduccion de todo el album
	const movil_boton = document.querySelectorAll('.show_pistas');// Capturando el boton de muestra pistas(solo moviles)
	const estilo1 = function (){
		$(this).addClass("floating");
	}
	const estilo2 = function (){
		$(this).removeClass("floating");
	}
	const refresca = function (){
		//Cargamos en la url una direccion basura para que cuando oprima el boton de regresar se cierre el modal:
		history.pushState(null, null, './#!');
		//Cuando volvemos a cargar los albums o se hace un filtrado, el album en reproduccion conservara sus estilos:
		if (songs != '') {
				document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].style.color = "#00acc1";
				document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = '<i class="material-icons" style="font-size:25px;">play_arrow</i>';
				document.getElementById('title_movil'+guarda_id_album+'').innerHTML = nombre_pista;
				if ($('#repro_pause i').text() === 'pause_circle_outline') {
					document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[1].childNodes[5].childNodes[2].innerHTML = 'Pausar';
					document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[1].childNodes[5].childNodes[0].innerHTML = 'pause';
				}
		}
		if (this.parentNode.parentNode.childNodes[1].innerHTML == 'Pistas') {
	dr_posi=this.childNodes[3].childNodes[5].innerHTML;
	var cc_1 = this.parentNode.childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[dr_posi-1];
	//Codigo para reproducir pista y album del filtrado al hacer enter y seleccionar una pista determinada
	$('#contenidoFiltrado .modal div div div a i').text('play_arrow');//Ponemos el estilo a todos los botones de los albums para reproducir
	//Reseteamos el estilo de las tuplas:
	$('.modal div tbody tr').css('color', '#fff');
	$('#contenidoFiltrado .modal div div div a li').text('Reproducir');
	//Reseteamos los valores del reproductor a los iniciales:
    bandera_volum = 0;//Controla el estado del volumen apagado o encendido
    bandera_repro_pause = 0;//Controla el estado de pausa o reproduce
    bandera_desliza = 0;//Controla los tiempos del slider
    bandera_habilita_eventos = 0;
    current_track = 0;//Variable de control principal que maneja el json "La pista a reproducir"
		var numero_pista = cc_1.childNodes[13].innerHTML;//Con innerHTML podemos acceder al contenido de la etiqueta hijo
		var nombre = cc_1.childNodes[3].innerHTML;
		var duracion = cc_1.childNodes[5].innerHTML;
		var id_artista = cc_1.childNodes[7].innerHTML;
		var id_album = cc_1.childNodes[9].innerHTML;
		var id_pista = cc_1.childNodes[11].innerHTML;
		var frm = 'nombre='+nombre+'&'+'duracion='+duracion+'&'+'id_artista='+id_artista+'&'+'id_album='+id_album+'&'+'id_pista='+id_pista;
		if (songs != '') {//Si ya hay un album cargado entonces:
			document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "none";
			document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = guarda_id_pista;
		}
		if (guarda_id_album != id_album) {//Condicion para quitar la parte de reproduccion actual al seleccionar otro album filtrado 
			$('#en_cola').css('display', 'none');
		}
		guarda_id_album = id_album;
		guarda_id_pista = numero_pista;//Cada vez que se de click en una tupla se guarda el id del album 
		cc_1.style.color = "#00acc1";//Cambiando color al hacer click en esta tupla que se esta reproduciendo
		guarda_pista_aux2 = id_pista;//Guardamos el ID de la pista que trae unico de la BD
		document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "block";
		$.ajax({//Primer Ajax para obtener el listado de todas las pistas del album
            method:"POST",
            url:"./php/consulta_cancion.php",
            cache:false,
            data: frm,
            success:function(respAX){
            	$.ajax({//Segundo Ajax para obtener el identificador de la pista seleccionada a reproducir
            		method:"POST",
            		url:"./php/consulta_cancion_id.php",
            		cache:false,
            		data: frm,
            		success:function(respAX2){
                		var AX2 = JSON.parse(respAX2);
                		current_track = AX2.iden;
                		current_track = current_track-1;
                		//Activando el Reproductor:
                		var AX = JSON.parse(respAX);
                		songs = AX;//Le asignamos el json a la variable songs
                		init();//Inicializamos el reproductos
                		//Apagamos los botones de aleatoriedad y loop (ESTILOS) porque la funcionalidad se reseteo anteriormente:
            		}
        		});
            }
        });
        //Accedemos a su boton de reproduccion total y le ponemos el estilo para pausar:
         cc_1.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[5].childNodes[0].innerHTML = 'pause';
		}
	}
	const reproduce = function (){
	document.getElementById('mi_prelo1').style.display = "block";//Activa el preloader para indicar al usuario que esta cargando
	$('#contenidoFiltrado .modal div div div a i').text('play_arrow');//Ponemos el estilo a todos los botones de los albums para reproducir
	//Reseteamos el estilo de las tuplas:
	$('.modal div tbody tr').css('color', '#fff');
	$('#contenidoFiltrado .modal div div div a li').text('Reproducir');
	$('#contenidoFiltrado h5').text(''); //Limpiamos titulo en moviles de album anterior
	//Reseteamos los valores del reproductor a los iniciales:
    bandera_volum = 0;//Controla el estado del volumen apagado o encendido
    bandera_repro_pause = 0;//Controla el estado de pausa o reproduce
    bandera_desliza = 0;//Controla los tiempos del slider
    bandera_habilita_eventos = 0;
    current_track = 0;//Variable de control principal que maneja el json "La pista a reproducir"
		var numero_pista = this.childNodes[13].innerHTML;//Con innerHTML podemos acceder al contenido de la etiqueta hijo
		var nombre = this.childNodes[3].innerHTML;
		var duracion = this.childNodes[5].innerHTML;
		var id_artista = this.childNodes[7].innerHTML;
		var id_album = this.childNodes[9].innerHTML;
		var id_pista = this.childNodes[11].innerHTML;
		var frm = 'nombre='+nombre+'&'+'duracion='+duracion+'&'+'id_artista='+id_artista+'&'+'id_album='+id_album+'&'+'id_pista='+id_pista;
		if (songs != '') {//Si ya hay un album cargado entonces:
			document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "none";
			document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = guarda_id_pista;
		}
		if (guarda_id_album != id_album) {//Condicion para quitar la parte de reproduccion actual al seleccionar otro album filtrado 
			$('#en_cola').css('display', 'none');
		}
		guarda_id_album = id_album;
		guarda_id_pista = numero_pista;//Cada vez que se de click en una tupla se guarda el id del album 
		this.style.color = "#00acc1";//Cambiando color al hacer click en esta tupla que se esta reproduciendo
		guarda_pista_aux2 = id_pista;//Guardamos el ID de la pista que trae unico de la BD
		document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "block";
		$.ajax({//Primer Ajax para obtener el listado de todas las pistas del album
            method:"POST",
            url:"./php/consulta_cancion.php",
            cache:false,
            data: frm,
            success:function(respAX){
            	$.ajax({//Segundo Ajax para obtener el identificador de la pista seleccionada a reproducir
            		method:"POST",
            		url:"./php/consulta_cancion_id.php",
            		cache:false,
            		data: frm,
            		success:function(respAX2){
                		var AX2 = JSON.parse(respAX2);
                		current_track = AX2.iden;
                		current_track = current_track-1;
                		//Activando el Reproductor:
                		var AX = JSON.parse(respAX);
                		songs = AX;//Le asignamos el json a la variable songs
                		init();//Inicializamos el reproductos
                		//Apagamos los botones de aleatoriedad y loop (ESTILOS) porque la funcionalidad se reseteo anteriormente:
            		}
        		});
            }
        });
        //Accedemos a su boton de reproduccion total y le ponemos el estilo para pausar:
         this.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[5].childNodes[0].innerHTML = 'pause';
	}
	const estilo3 = function (){
		if (guarda_pista_aux2 != this.childNodes[11].innerHTML) {
		this.style.color = "#00acc1";//Cambiando color al hacer hover en una pista determinada
		var num_pista = this.childNodes[1].innerHTML;
		guarda_pista_aux=num_pista;//Guardando el numero de la pista
		//Incrustando el elemento de reproducir a la tupla:
		this.childNodes[1].innerHTML = '<i class="material-icons" style="font-size:25px;">play_arrow</i>';
		}
	}
	const estilo4 = function (){
		if (guarda_pista_aux2 != this.childNodes[11].innerHTML) {
		this.style.color = "#fff";//Devolviendo color de la pista a la orignal
		this.childNodes[1].innerHTML = guarda_pista_aux;//Devolviendo numero de la pista a la orignal
		}
	}
	const repro_all_album = function (){
	if (songs != '') {
		if (this.childNodes[0].innerHTML === 'pause') {
		bandera_repro_pause = 1;
		pause_play();
		this.childNodes[0].innerHTML = 'play_arrow';//Ponemos el estilo a todos los botones de los albums para reproducir
		}else{
		document.getElementById('mi_prelo1').style.display = "block";//Activa el preloader para indicar al usuario que esta cargando
		 if (this.childNodes[0].innerHTML === 'play_arrow' && songs[0].title === this.parentNode.parentNode.childNodes[3].childNodes[1].childNodes[3].childNodes[0].childNodes[3].innerHTML) {
			bandera_repro_pause = 0;
			pause_play();
			this.childNodes[0].innerHTML = 'pause';//Controla boton que reproduce album completo
		 }else{
		 	$('#contenidoFiltrado .modal div div div a i').text('play_arrow');//Ponemos el estilo a todos los botones de los albums para reproducir
			$('.modal div tbody tr').css('color', '#fff');
			$('#contenidoFiltrado .modal div div div a li').text('Reproducir');
			$('#contenidoFiltrado h5').text(''); //Limpiamos titulo en moviles de album anterior
	//Reseteamos los valores del reproductor a los iniciales:
    bandera_volum = 0;//Controla el estado del volumen apagado o encendido
    bandera_repro_pause = 0;//Controla el estado de pausa o reproduce
    bandera_desliza = 0;//Controla los tiempos del slider
    bandera_habilita_eventos = 0;
    current_track = 0;//Variable de control principal que maneja el json "La pista a reproducir"
    var id_album = this.childNodes[1].childNodes[0].innerHTML;
    if (songs != '') {//Si ya hay un album cargado entonces:
			document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "none";
		document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = guarda_id_pista;
	}
	if (guarda_id_album != id_album) {//Condicion para quitar la parte de reproduccion actual al seleccionar otro album filtrado 
			$('#en_cola').css('display', 'none');
		}
    guarda_id_album = id_album;//Cada vez que se de click en una tupla se guarda el id del album 
    guarda_id_pista = 1;//Cuando reproducimos el album completo primero empieza la primera pista
    guarda_pista_aux2 = document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[0].childNodes[11].innerHTML;
    $('#modal'+guarda_id_album+' div tbody tr:first').css("color", "#00acc1");
    $('#modal'+guarda_id_album+' div tbody tr:first td:first').html('<i class="material-icons">play_arrow</i>');
	document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "block";
    var frm = 'id_album='+id_album;
    $.ajax({
           method:"POST",
           url:"./php/consulta_cancion.php",
           cache:false,
           data: frm,
            success:function(respAX3){
                var AX3 = JSON.parse(respAX3);
                songs = AX3;//Le asignamos el json a la variable songs
                init();//Inicializamos el reproductos
            }
       });
      this.childNodes[0].innerHTML = 'pause';//Ponemos el estilo al boton en pausar
		 }
	    }
	}else{	
	document.getElementById('mi_prelo1').style.display = "block";
	$('#contenidoFiltrado .modal div div div a i').text('play_arrow');//Ponemos el estilo a todos los botones de los albums para reproducir
	$('.modal div tbody tr').css('color', '#fff');
	$('#contenidoFiltrado .modal div div div a li').text('Reproducir');
	$('#contenidoFiltrado h5').text(''); //Limpiamos titulo en moviles de album anterior
	//Reseteamos los valores del reproductor a los iniciales:
    bandera_volum = 0;//Controla el estado del volumen apagado o encendido
    bandera_repro_pause = 0;//Controla el estado de pausa o reproduce
    bandera_desliza = 0;//Controla los tiempos del slider
    bandera_habilita_eventos = 0;
    current_track = 0;//Variable de control principal que maneja el json "La pista a reproducir"
    var id_album = this.childNodes[1].childNodes[0].innerHTML;
    if (songs != '') {//Si ya hay un album cargado entonces:
			document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "none";
			document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = guarda_id_pista;
		}
	if (guarda_id_album != id_album) {//Condicion para quitar la parte de reproduccion actual al seleccionar otro album filtrado 
			$('#en_cola').css('display', 'none');
		}
    guarda_id_album = id_album;//Cada vez que se de click en una tupla se guarda el id del album 
    guarda_id_pista = 1;//Cuando reproducimos el album completo primero empieza la primera pista
    guarda_pista_aux2 = document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[0].childNodes[11].innerHTML;
    $('#modal'+guarda_id_album+' div tbody tr:first').css("color", "#00acc1");
    $('#modal'+guarda_id_album+' div tbody tr:first td:first').html('<i class="material-icons">play_arrow</i>');
	document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "block";
    var frm = 'id_album='+id_album;
    $.ajax({
           method:"POST",
           url:"./php/consulta_cancion.php",
           cache:false,
           data: frm,
            success:function(respAX3){
                var AX3 = JSON.parse(respAX3);
                songs = AX3;//Le asignamos el json a la variable songs
                init();//Inicializamos el reproductos
            }
       });
      this.childNodes[0].innerHTML = 'pause';//Ponemos el estilo al boton en pausar
  	 }
	}
	const muestra_pistas = function (){
		//Estos estilos solo son disponibles para moviles(tam=s)
		var id_album = this.parentNode.childNodes[5].childNodes[1].childNodes[0].innerHTML;
		muestra_fon = id_album;
		bandera_lista = 1;
		document.getElementById('modal'+id_album+'').childNodes[3].childNodes[1].childNodes[1].className = 'col s12 m5 l4 center-align hide-on-small-only';
		document.getElementById('modal'+id_album+'').childNodes[3].childNodes[1].childNodes[3].className = 'col s12 m7 l8';
		document.getElementById('modal'+id_album+'').childNodes[3].childNodes[1].childNodes[3].style.padding = '0px';
		document.getElementById('modal'+id_album+'').childNodes[3].childNodes[1].style.opacity = '0.81';//Disminuye la opacidad para que sea visible el album
	}
	botones.forEach(boton => {
		boton.addEventListener("mouseover", estilo1);
		boton.addEventListener("mouseout", estilo2);
		boton.addEventListener("click", refresca);
	});
	musica.forEach(botom => {
		botom.addEventListener("click", reproduce);
		botom.addEventListener("mouseover", estilo3);
		botom.addEventListener("mouseout", estilo4);
	});
	individual_album.forEach(botoms => {
		botoms.addEventListener("click", repro_all_album);
	});
	movil_boton.forEach(botomss => {
		botomss.addEventListener("click", muestra_pistas);
	});
if (bandera_inicio_albums == 4) {//Reproduce automaticamente la cancion seleccionada del filtrado
	document.getElementById('mi_prelo1').style.display = "block";
	$('#contenidoFiltrado .modal div div div a i').text('play_arrow');//Ponemos el estilo a todos los botones de los albums para reproducir
	//Reseteamos el estilo de las tuplas:
	$('.modal div tbody tr').css('color', '#fff');
	$('#contenidoFiltrado .modal div div div a li').text('Reproducir');
	$('#contenidoFiltrado h5').text(''); //Limpiamos titulo en moviles de album anterior
	//Reseteamos los valores del reproductor a los iniciales:
    bandera_volum = 0;//Controla el estado del volumen apagado o encendido
    bandera_repro_pause = 0;//Controla el estado de pausa o reproduce
    bandera_desliza = 0;//Controla los tiempos del slider
    bandera_habilita_eventos = 0;
    current_track = 0;//Variable de control principal que maneja el json "La pista a reproducir"
		var numero_pista = document.getElementById('contenidoFiltrado').childNodes[0].childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[dr_posi-1].childNodes[13].innerHTML;//Con innerHTML podemos acceder al contenido de la etiqueta hijo
		var nombre = document.getElementById('contenidoFiltrado').childNodes[0].childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[dr_posi-1].childNodes[3].innerHTML;
		var duracion = document.getElementById('contenidoFiltrado').childNodes[0].childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[dr_posi-1].childNodes[5].innerHTML;
		var id_artista = document.getElementById('contenidoFiltrado').childNodes[0].childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[dr_posi-1].childNodes[7].innerHTML;
		var id_album = document.getElementById('contenidoFiltrado').childNodes[0].childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[dr_posi-1].childNodes[9].innerHTML;
		var id_pista = document.getElementById('contenidoFiltrado').childNodes[0].childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[dr_posi-1].childNodes[11].innerHTML;
		var frm = 'nombre='+nombre+'&'+'duracion='+duracion+'&'+'id_artista='+id_artista+'&'+'id_album='+id_album+'&'+'id_pista='+id_pista;
		if (songs != '') {//Si ya hay un album cargado entonces:
			document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "none";
			document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = guarda_id_pista;
		}
		if (guarda_id_album != id_album) {//Condicion para quitar la parte de reproduccion actual al seleccionar otro album filtrado 
			$('#en_cola').css('display', 'none');
		}
		guarda_id_album = id_album;
		guarda_id_pista = numero_pista;//Cada vez que se de click en una tupla se guarda el id del album 
		document.getElementById('contenidoFiltrado').childNodes[0].childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[dr_posi-1].style.color = "#00acc1";//Cambiando color al hacer click en esta tupla que se esta reproduciendo
		guarda_pista_aux2 = id_pista;//Guardamos el ID de la pista que trae unico de la BD
		document.getElementById('mi_content'+guarda_id_album+'').childNodes[1].childNodes[1].childNodes[3].style.display = "block";
		$.ajax({//Primer Ajax para obtener el listado de todas las pistas del album
            method:"POST",
            url:"./php/consulta_cancion.php",
            cache:false,
            data: frm,
            success:function(respAX){
            	$.ajax({//Segundo Ajax para obtener el identificador de la pista seleccionada a reproducir
            		method:"POST",
            		url:"./php/consulta_cancion_id.php",
            		cache:false,
            		data: frm,
            		success:function(respAX2){
                		var AX2 = JSON.parse(respAX2);
                		current_track = AX2.iden;
                		current_track = current_track-1;
                		//Activando el Reproductor:
                		var AX = JSON.parse(respAX);
                		songs = AX;//Le asignamos el json a la variable songs
                		init();//Inicializamos el reproductos
                		//Apagamos los botones de aleatoriedad y loop (ESTILOS) porque la funcionalidad se reseteo anteriormente:
            		}
        		});
            }
        });
        //Accedemos a su boton de reproduccion total y le ponemos el estilo para pausar:
         document.getElementById('contenidoFiltrado').childNodes[0].childNodes[3].childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[dr_posi-1].parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[5].childNodes[0].innerHTML = 'pause';
	}
}
//Funcion para generar numeros aleatorios:
function aleatorio(inferior,superior){
    var numPosibilidades = superior - inferior
    var aleat = Math.random() * numPosibilidades
    aleat = Math.round(aleat)
    return parseInt(inferior) + aleat
}
//Funcion de Inicializacion del reproductor:
function init() {
	var title_movil = 'title_movil'+guarda_id_album;
    song = songs[current_track];//carga la posicion 0 del json
    audio.src = song.url;//Cargando la pista mp3
    title.textContent = song.title;//Cargando el titulo de la pista
    document.getElementById(title_movil).innerHTML = song.title;
    nombre_pista=song.title;
    artist.textContent = song.artist;//Cargando el artista
    art.src = song.art;//Cargando la imagen
    activa_repro();
    audio.onloadeddata = function() {//Es muy importante esta funcion que alista cuando se halla cargado completamente el audio
    pause_play();
	};    
}
//Funcion que Actualiza los datos del reproductor en segundo plano de google:
function updateMetadata() {
    navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist,
    album: song.album,
    artwork: [
      { src: song.art,   sizes: '96x96',   type: 'image/png' },
      { src: song.art, sizes: '128x128', type: 'image/png' },
      { src: song.art, sizes: '192x192', type: 'image/png' },
      { src: song.art, sizes: '256x256', type: 'image/png' },
      { src: song.art, sizes: '384x384', type: 'image/png' },
      { src: song.art, sizes: '512x512', type: 'image/png' },
    ]
  });
}
//Funcion que activa los elementos del reproductor:
function activa_repro(){
	 //Activamos los elementos necesatios para utilizar el reproductor:
    document.getElementById('art').style.display = 'block';
    $('#Album_datos').attr("class", "col s3 m4 l3 hide-on-small-only");
    $('#Controles_music').attr("class", "col s12 m8 l7");
    slider.removeAttribute('disabled');
    $("#barra_volumen").prop('disabled', false);
    bandera_habilita_eventos = 1;
    bandera_repro_pause = 0;
    anima_datos();
}
//Funcion para manejar la pausa y play:
function pause_play() {
	if (bandera_habilita_eventos == 1) {
	$('.tooltipped').tooltip("close");
	var el_cambio = document.getElementById('repro_pause');
	if (bandera_repro_pause == 0) {
			audio.play()
			.then(_ => updateMetadata())
  			.catch(error => console.log(error));
  			document.getElementById('mi_prelo1').style.display = "none";//Finaliza el preloader al ser reproducida la musica
			bandera_repro_pause = 1;
			var captura_modal = 'modal'+guarda_id_album;//Formamos una cadena que sera el modal del album en reproduccion
			$('#'+captura_modal+' div div div a i').text('pause');//Accedemos al album que se esta escuchando para cambiarle su estilo
			document.getElementById(''+captura_modal+'').childNodes[3].childNodes[1].childNodes[1].childNodes[5].childNodes[2].innerHTML = 'Pausar';
			$('#repro_pause').attr("data-tooltip", "Pausa");
			el_cambio.childNodes[0].innerHTML = "pause_circle_outline";
			//A continuacion aqui va el codigo para poner en pausa la musica:
			$('#duracion_pista').text(convierte_duracion(audio.duration));
			//Aqui va el codigo para Actualizar el rango del slider de acuerdo a la duracion de la pista:
			slider.noUiSlider.updateOptions({
        		range: {
            		'min': 0,
            		'max': audio.duration,
        		}
  		  });
			$('#barra_pista').attr('max',audio.duration);
		}else{
			$('#contenidoFiltrado .modal div div div a i').text('play_arrow');//Cuando en el reproductor pausamos, todos los albums cambiaran su boton a reproducir
			$('#contenidoFiltrado .modal div div div a li').text('Reproducir');
			$('#repro_pause').attr("data-tooltip", "Reproducir");
			el_cambio.childNodes[0].innerHTML = "play_circle_outline";
			bandera_repro_pause = 0;
			//A continuacion aqui va el codigo para poner de nuevo la musica despausa:
			audio.pause();
		}
	}
}
//Funcion para manejar el volumen:
function change_volumen() {
	if (bandera_habilita_eventos == 1) {
	if (bandera_volum == 0) {
			bandera_volum = 1;
			this.innerHTML = '<i class="material-icons" style="color:#BFBFBF;cursor:pointer;font-size:30px;">volume_off</i>';
			audio.volume=0;
	}else{
		this.innerHTML = '<i class="material-icons" style="color:#BFBFBF;cursor:pointer;font-size:30px;">volume_up</i>';
		bandera_volum = 0;
		var vol = $('#Control_volumen .thumb .value').text();
		if (vol == '') {
		   audio.volume=1;//Si no se ha movido el control de audio	
		}else{
			audio.volume=vol/100;//Si ya se ha movido el control de audio
		}
	}
  }
}
//Funcion para cambiar a la siguiente pista:
//OJO solo se reproduce la aleatoriedad cuando esta apagado loop, porque no tiene caso que este prendido cuando acaba la cancion loop viene a esta funcion
function nextTrack() {
	if (bandera_habilita_eventos == 1) {
	document.getElementById('mi_prelo1').style.display = "block";
	if (bandera_loop == 0 && bandera_aleatorio == 1) {//Si esta activado solamente "Aleatoriedad"
		var song_aleatorio = aleatorio(0,1000);
		current_track = song_aleatorio;
	}else {
		current_track++;				
	}
    current_track = current_track % (songs.length);
    song = songs[current_track];
    audio.src = song.url;
    audio.play();
  	updateMetadata();
  	$('.tooltipped').tooltip("close");
    var captura_modal = 'modal'+guarda_id_album;//Formamos una cadena que sera el modal del album en reproduccion
    //Accedemos al album que se esta escuchando para cambiarle su estilo a la tupla que esta en reproduccion:

	var yy = document.getElementById(''+captura_modal+'');
	yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].style.color = '#fff';
	yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = guarda_id_pista;

	guarda_id_pista = current_track+1;

	guarda_pista_aux2 = yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[11].innerHTML;
	yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].style.color = '#00acc1';
	yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = '<i class="material-icons" style="font-size:25px;">play_arrow</i>';
    
    audio.onloadeddata = function() {
      bandera_repro_pause = 1;
      $('#duracion_pista').text(convierte_duracion(audio.duration));
      slider.noUiSlider.updateOptions({
        range: {
            'min': 0,
            'max': audio.duration,
        }
  		});
      $('#barra_pista').attr('max',audio.duration);
      updateInfo();
    }
   }
}
//Funcion para retoceder a la otra pista:
function prevTrack() {
	if (bandera_habilita_eventos == 1) {
	document.getElementById('mi_prelo1').style.display = "block";
	if (bandera_loop == 0 && bandera_aleatorio == 1) {//Si esta activado solamente "Aleatoriedad"
		var song_aleatorio = aleatorio(0,1000);
		current_track = song_aleatorio;
		current_track = current_track % (songs.length);
	}else {
		if (bandera_loop == 1 && bandera_aleatorio == 1) {
			var song_aleatorio = aleatorio(0,1000);
			current_track = song_aleatorio;
			current_track = current_track % (songs.length);
		}else{
		current_track--;	
		current_track = (current_track == -1 ? (songs.length - 1) : current_track);
		}
	}
    song = songs[current_track];
    audio.src = song.url;
    audio.play();//Para mayor rapidez y eficacia del reproductor en segundo plano de google penemos en play la pista 
  	updateMetadata();//Actualizamos los datos de la reproduccion en el reproductor de segundo plano
  	$('.tooltipped').tooltip("close");
    var captura_modal = 'modal'+guarda_id_album;//Formamos una cadena que sera el modal del album en reproduccion
    //Accedemos al album que se esta escuchando para cambiarle su estilo a la tupla que esta en reproduccion:

	var yy = document.getElementById(''+captura_modal+'');
	yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].style.color = '#fff';
	yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = guarda_id_pista;
	
	guarda_id_pista = current_track+1;

	guarda_pista_aux2 = yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[11].innerHTML;
	yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].style.color = '#00acc1';
	yy.childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = '<i class="material-icons" style="font-size:25px;">play_arrow</i>';
    
    audio.onloadeddata = function() {
      bandera_repro_pause = 1;
      $('#duracion_pista').text(convierte_duracion(audio.duration));
      slider.noUiSlider.updateOptions({
        range: {
            'min': 0,
            'max': audio.duration,
        }
  		});
      $('#barra_pista').attr('max',audio.duration);
      updateInfo();
    }
  }
}
//Funcion que actualiza toda la informacion cuando cambia de cancion:
function updateInfo() {
	document.getElementById('mi_prelo1').style.display = "none";//Finaliza el preloader al ser reproducida la musica
	var title_movil = 'title_movil'+guarda_id_album;
    title.textContent = song.title;
    artist.textContent = song.artist;
    document.getElementById(title_movil).innerHTML = song.title;
    nombre_pista=song.title;
    art.src = song.art;
    art.onload = function() {
        anima_datos();
    }
}
//Funcion para manejar repeticion de pistas(SOLO ESTILOS y cambio de bandera):
function repeticion_song() {
	if (bandera_habilita_eventos == 1) {
	$('.tooltipped').tooltip("close");
	if (bandera_loop == 0) {
			bandera_loop = 1;
			$('#loop_botons i').css('color', '#0097a7');
			$('#loop_botons').attr("data-tooltip", "Desactivar Repetir");
		}else{
			$('#loop_botons').attr("data-tooltip", "Activar Repetir");
			$('#loop_botons i').css('color', '#BFBFBF');
			bandera_loop = 0;
		}
	}
}
//Funcion para manejar la Aleatoriedad(SOLO ESTILOS y cambio de bandera):
function aleatorio_song() {
	if (bandera_habilita_eventos == 1) {
	$('.tooltipped').tooltip("close");
	if (bandera_aleatorio == 0) {
			bandera_aleatorio = 1;
			$('#aleatoriedad i').css('color', '#0097a7');
			$('#aleatoriedad').attr("data-tooltip", "Desactivar Aleatorio");
		}else{
			$('#aleatoriedad').attr("data-tooltip", "Activar Aleatorio");
			$('#aleatoriedad i').css('color', '#BFBFBF');
			bandera_aleatorio = 0;
		}
	}
}
//Funcion para animar el texto de los datos del album:
function anima_datos(){
	var titulo_song = $('#title').text();
	var artista_song = $('#artist').text();
	var afecta_titulo = document.getElementById('title');
	var afecta_artista = document.getElementById('artist');
	if (titulo_song.length > 23) {
		afecta_titulo.innerHTML = '<MARQUEE SCROLLDELAY =300>'+titulo_song+'</MARQUEE>';
	}
	if (artista_song.length > 23) {
		afecta_artista.innerHTML = '<MARQUEE SCROLLDELAY =300>'+artista_song+'</MARQUEE>';
	}
	/*if ($('#title_movil').text().length > 30) {
		$('#title_movil').html('<MARQUEE SCROLLDELAY =300>'+titulo_song+'</MARQUEE>')
	}*/
}
//Funcion para convertir segundos en formato tiempo de una pista:
function convierte_duracion(duracion) {
	var resultado=0, horas=0,minutos=0, segundos=0, aux1=0;
	aux1 = duracion/60;
	segundos=duracion%60;
	segundos = Math.trunc(segundos);
	aux1 = Math.trunc(aux1);
	minutos=aux1%60;
	minutos = Math.trunc(minutos);
	aux1 = aux1/60;
	horas = Math.trunc(aux1);
	if (horas == 0) {
		if (segundos > 9) {
			resultado = minutos+':'+segundos;
		}else{
			resultado = minutos+':0'+segundos;
		}
	}else{
		if (minutos > 9) {
			if (segundos > 9) {
			resultado = horas+':'+minutos+':'+segundos;
		}else{
			resultado = horas+':'+minutos+':0'+segundos;
		}
		}else {
			if (segundos > 9) {
			resultado = horas+':0'+minutos+':'+segundos;
		}else{
			resultado = horas+':0'+minutos+':0'+segundos;
		}
		}
	}
	return resultado;
}
//Eventos para detectar desplazamiento con dedo(movil)
function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* Codigo si deslizas hacia la izquierda */
            if (songs != '') {
            	$('#modal'+guarda_id_album).modal('open');//Se abre el album en reproduccion actual
  				history.pushState(null, null, './#!'); 
  				document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].style.color = "#00acc1";
				document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[guarda_id_pista-1].childNodes[1].innerHTML = '<i class="material-icons" style="font-size:25px;">play_arrow</i>';
				document.getElementById('title_movil'+guarda_id_album+'').innerHTML = nombre_pista;
				if ($('#repro_pause i').text() === 'pause_circle_outline') {
					document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[1].childNodes[5].childNodes[2].innerHTML = 'Pausar';
					document.getElementById('modal'+guarda_id_album+'').childNodes[3].childNodes[1].childNodes[1].childNodes[5].childNodes[0].innerHTML = 'pause';
				}
  			}
        } else {
            /* Codigo si deslizas hacia la derecha */
            if (bandera_lista == 1) { //Esta en modo lista de canciones
            	bandera_lista = 0; //Apagamos el evento de que estaba en la lista de canciones
            	//Cambiamos estilos:
            	document.getElementById('modal'+muestra_fon+'').childNodes[3].childNodes[1].childNodes[1].className = 'col s12 m6 l4 center-align';
				document.getElementById('modal'+muestra_fon+'').childNodes[3].childNodes[1].childNodes[3].className = 'col s12 m6 l8 hide-on-small-only';
				document.getElementById('modal'+muestra_fon+'').childNodes[3].childNodes[1].style.opacity = '0.93';
            }
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* Codigo si deslizas hacia arriba */ 
        } else { 
            /* Codigo si deslizas hacia abajo */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};