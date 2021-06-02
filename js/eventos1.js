 //Carga de las imagenes Parallax
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.parallax');
    var instances = M.Parallax.init(elems);
  });

//Carga de la ventana para vista en moviles 
    document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems, {
      draggable: true
    });
  });

//Ventana Modal de subir musica
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {
      opacity: 1,
      dismissible: false,
      inDuration: 500,
      outDuration: 600,
      startingTop: '-100%',
      endingTop: '5%'
    });
  });

//Para la barra de busqueda siempre visible "pushpin"
$(document).ready(function(){
  $('.pushpin').each(function() {
    var $this = $(this);
    var $target = $('#' + $(this).attr('data-target'));
    $this.pushpin({
      top:    $target.offset().top,
      bottom: $target.offset().top + $target.outerHeight() - $this.height()
    });
  });
  $('.show_crear').click(function(){
    //Cargamos en la url una direccion basura para que cuando oprima el boton de regresar se cierre el modal:
    history.pushState(null, null, './#!');
  });
  $('#modalx .modal-close').click(function(){
      window.history.back();
    });
  //Para el temporizador:
  $('.timepicker').timepicker({
    i18n: {
            cancel: 'Cancelar',
            clear: 'Limpar',
            done: 'Hecho'
        },
    autoClose: true,
    twelveHour: false,
    showClearBtn: true,
    onCloseEnd: function(){
      //Funcion para activar el temporizador:
      if ($('#pon_tiempo').val().length != 0) {
        var tiempo_pro = $('#pon_tiempo').val();

        var hora_pro = tiempo_pro.slice(0, -3);
        var minuto_pro = tiempo_pro.slice(-2);
        setInterval(function(){showtimes(hora_pro,minuto_pro);},30000);//Se corrobora cada medio minito si ya paso el tiempo programado para apagar la musica
      }
      
    }
  });
  $('#mi_temporizador .card-reveal a').click(function(){
    $('#mi_temporizador .card-reveal').css("display", "none");
    $('#mi_temporizador .card-reveal').css("transform", "translateY(0%)");
    $('#pon_tiempo').timepicker('open');
  });

});
//Evento para borrar todo el contenido en la barra de busqueda al presionar "X"
document.getElementById("borra").addEventListener("click", function(){
  $('#search').focus();
	var busca = document.getElementById("search");
	busca.value = '';
	this.style.visibility = "hidden";
  $('#tabla_resultado').html('<div></div>');
});
//Evento para que aparezca el icono de borrar en la barra de busqueda segun este lleno o vacio
document.getElementById("search").addEventListener("keyup", function(){
	var borra = document.getElementById("borra");
	if (this.value == '') {
		borra.style.visibility = "hidden";
	}else{
		borra.style.visibility = "visible";
	}
});
function showtimes(hora_pro,minuto_pro){
  var date = new Date();
  var hora_actual = date.getHours();
  var minuto_actual = date.getMinutes();
  if (hora_pro == hora_actual && minuto_pro == minuto_actual) {
    if (songs != '') {
        bandera_repro_pause = 1;
        pause_play();
    }
  }

}