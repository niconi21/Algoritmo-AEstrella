

let algoritmo; //Variable para poder manupular una instancia del algoritmo A*
const calcular = () => { //Función que se ejecutaŕa cuando se presione el botón "Calcular ruta óptima"
    $('#resultado').empty()//El contenedor donde se visualizan los resultados lo vaciamos
    let filas = $('#filasInput').val() //obtenemos el valor de las filas del input
    let columnas = $('#columnasInput').val() //obtenemos el valor de las columnas del input
    let inicio = obtenerXY($('#inicioInput').val())//obtenemos el valor del inicio del input
    let fin = obtenerXY($('#finalInput').val())//obtenemos el valor del final del input
    let obstaculos = obtenerCoordenadaObstaculos($('#obstaculosInput').val())//obtenemos las coordenadas de los obstaculos del textarea
    $('#detalles').html('')//vaciamos el contenedor dode se muestran los detalles de la ejecución

    //Llenamos con la información de los detalles de la ejecución
    $('#detalles').append(`  
    <b>Filas: ${filas}</b><br><br> 
    <b>Columnas: ${columnas}</b><br><br>
    <b>Inicio: ${$('#inicioInput').val()}</b><br><br>
    <b>Destino: ${$('#finalInput').val()}</b><br><br>
    <b>Obstaculos: ${$('#obstaculosInput').val()}</b><br><br>
    `)

    algoritmo = new AEstrella(filas, columnas, inicio, fin, obstaculos) //creamos la instancia de la clase AEstrella en la variable que creamos en un inicio

}

//este método nos permitirá limpiar el contenido de la ejecución cuando se presione el botón de "Limpiar"
const limpiar = () => {
    canvas = document.getElementById('canvas'); //obtenemos el elementos del canvas donde se dibuja la cuadricula del ejercicio
    ctx = canvas.getContext('2d');//obtenemos su contexto para poder manipular sobre el
    canvas.width = canvas.width;//establecemos un nuevo ancho, manteniendo el tamaño de este mismo
    canvas.height = canvas.height;//establecemos un nuevo alto, manteniendo el tamaño de este mismo

    algoritmo.camino = []//vaciamos el arreglo camino de la instancia de la clase "AEstrella" para eliminar la ruta optima que ya se encontró y poder buscar una nueva
}


//Este método nos ayudará a obtener las cordenadas de texto a objeto de los obstaculos
const obtenerCoordenadaObstaculos = (obstaculos = '') => { //recibimos los obtaculos en cadena de texto
    let coordenadas = []//inicializamos un arreglo vacío donde guardaremos las coordenadas separadas por de la cadena original: obstaculos
    coordenadas = obstaculos.split('),(')//separamos la cadena original "obstaculos" para que en cada pocisión de un arreglo contenga una coordenada
    coordenadas[0] = coordenadas[0].substr(1, coordenadas[0].length)//eliminamos el parentesis de la primera coordenada para evitar un error
    coordenadas[coordenadas.length - 1] = coordenadas[coordenadas.length - 1].substr(0, coordenadas[coordenadas.length - 1].length - 1)//eliminamos el parentesis de la ultima coordenada para evitar un error
    let obstaculosCoordenadas = [] //inicializamos el arreglo que contendrá las coordenada en notación de objeto {x, y}

    coordenadas.forEach(coordenada => {//rrecorremos las coordenadas que tenemos en cadena para convertirlas a objetos
        let xy = coordenada.split(',')//separamos cada pocisión por una coma para tener valores [x.y] en un arreglo
        obstaculosCoordenadas.push({ x: xy[0] - 1, y: xy[1] - 1 }) //introducimos un objeto con notacioń {x,y} al arreglo "obstaculosCoordenadas"
    })
    return obstaculosCoordenadas; //retornamos el arreglo de coordenadas con notación {x, yt}
}

//Este método nos ayudará a obtener las cordenadas de texto a objeto del inicio y el final
const obtenerXY = (valor = '') => { //recibimos un valor que es la cadena de texto de la coordenada
    valor = valor.substr(1, valor.length - 2);//le sacamos el valor de entre los parentesis, para ello usamos substr
    let coordenadas = valor.split(',');//separamos las coordenadas por la coma
    return { x: coordenadas[0] - 1, y: coordenadas[1] - 1 } //retornamos un objeto con la propiedades X y Y para la coordenada
}