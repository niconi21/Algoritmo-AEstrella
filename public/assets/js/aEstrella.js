


const muro = '#000000';
const tierra = '#777777';
let canvas;
let ctx;
let FPS = 10;
let columnas// = 10;
let filas// = 11;
let escenario;  //matriz del nivel
let anchoT;
let altoT;
let principio;
let fin;
let openSet = [];
let closedSet = [];
let camino = [];
let terminado = false;



function definirObstaculos(obstaculos) {
    obstaculos.forEach(obstaculo => {
        escenario[obstaculo.x][obstaculo.y].tipo = 1
    });
}



function inicializa(filasL, columnasL, principioL, finL, obstaculos) {
    filas = filasL;
    columnas = columnasL;

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    //CALCULAMOS EL TAMAÑO DE LOS TILES (Proporcionalmente)
    anchoT = parseInt(canvas.width / columnas);
    altoT = parseInt(canvas.height / filas);

    //CREAMOS LA MATRIZ
    escenario = creaArray2D(filas, columnas);

    //AÑADIMOS LOS OBJETOS CASILLAS
    for (i = 0; i < filas; i++) {
        for (j = 0; j < columnas; j++) {
            escenario[i][j] = new Casilla(j, i)
        }
    }
    definirObstaculos(obstaculos);


    //AÑADIMOS LOS VECINOS
    for (i = 0; i < filas; i++) {
        for (j = 0; j < columnas; j++) {
            escenario[i][j].addVecinos();
        }
    }


    // //CREAMOS ORIGEN Y DESTINO DE LA RUTA
    principio = escenario[principioL.y][principioL.x];

    fin = escenario[finL.y][finL.x];
    // //INICIALIZAMOS OPENSET
    openSet.push(principio)
    // //EMPEZAMOS A EJECUTAR EL BUCLE PRINCIPAL
    setInterval(() => { principal(); }, 1000 / FPS);
}

//CREAMOS UN ARRAY 2D
function creaArray2D(f, c) {
    var obj = new Array(f);
    for (a = 0; a < f; a++) {
        obj[a] = new Array(c);
    }
    return obj;
}

function heuristica(a, b) {
    // var x = Math.abs(a.x - b.x);
    // var y = Math.abs(a.y - b.y);

    // var dist = x + y;

    // // return dist;

    return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2))

}


function borraDelArray(array, elemento) {
    for (i = array.length - 1; i >= 0; i--) {
        if (array[i] == elemento) {
            array.splice(i, 1);
        }
    }
}

function Casilla(x, y) {

    //POSICIÓN
    this.x = x;
    this.y = y;

    //TIPO (obstáculo=1, vacío=0)
    this.tipo = 0;

    // var aleatorio = Math.floor(Math.random() * 5);  // 0-4
    // if (aleatorio == 1)
    //     this.tipo = 1;

    //PESOS
    this.f = 0;  //coste total (g+h)
    this.g = 0;  //pasos dados
    this.h = 0;  //heurística (estimación de lo que queda)

    this.vecinos = [];
    this.padre = null;

    this.setTipo = function (tipo) { this.tipo = tipo }
    //MÉTODO QUE CALCULA SUS VECNIOS
    this.addVecinos = function () {
        if (this.x > 0) {
            this.vecinos.push(escenario[this.y][this.x - 1]);   //vecino izquierdo

        }
        if (this.x < columnas - 1) {
            this.vecinos.push(escenario[this.y][this.x + 1]);   //vecino derecho
        }
        if (this.y > 0)
            this.vecinos.push(escenario[this.y - 1][this.x]);   //vecino de arriba

        if (this.y < filas - 1)
            this.vecinos.push(escenario[this.y + 1][this.x]); //vecino de abajo
        if (this.y > 0 && this.x > 0) {
            this.vecinos.push(escenario[this.y - 1][this.x - 1])//vecino esquina superior izquierda
        }
        if (this.y > 0 && this.x < columnas - 1) {
            this.vecinos.push(escenario[this.y - 1][this.x + 1])//vecino esquina superior derecha
        }
        if (this.y < filas - 1 && this.x > 0) {
            this.vecinos.push(escenario[this.y + 1][this.x - 1])//vecino esquina inferior izquierda
        }
        if (this.y < filas - 1 && this.x < columnas - 1) {
            this.vecinos.push(escenario[this.y + 1][this.x + 1])//vecino esquina inferior derecha
        }
    }



    //MÉTODO QUE DIBUJA LA CASILLA
    this.dibuja = function () {
        var color;

        if (this.tipo == 0)
            color = tierra;

        if (this.tipo == 1)
            color = muro;

        //DIBUJAMOS EL CUADRO EN EL CANVAS
        ctx.fillStyle = color;
        ctx.fillRect(this.x * anchoT, this.y * altoT, anchoT, altoT);
    }



    //DIBUJA OPENSET
    this.dibujaOS = function () {
        ctx.fillStyle = '#008000';
        ctx.fillText = `(${this.x}, ${this.y})`
        ctx.fillRect(this.x * anchoT, this.y * altoT, anchoT, altoT);

    }

    //DIBUJA CLOSEDSET
    this.dibujaCS = function () {
        ctx.fillStyle = '#800000';
        ctx.fillText = `(${this.x}, ${this.y})`
        ctx.fillRect(this.x * anchoT, this.y * altoT, anchoT, altoT);
    }


    //DIBUJA CAMINO
    this.dibujaCamino = function () {
        ctx.fillStyle = '#00FFFF';  //cyan
        ctx.fillText = `(${this.x}, ${this.y})`
        ctx.fillRect(this.x * anchoT, this.y * altoT, anchoT, altoT);
    }

}


function dibujaEscenario() {
    for (i = 0; i < filas; i++) {
        for (j = 0; j < columnas; j++) {
            escenario[i][j].dibuja();
        }
    }

    //DIBUJA OPENSET
    for (i = 0; i < openSet.length; i++) {
        openSet[i].dibujaOS();
    }


    //DIBUJA CLOSEDSET
    for (i = 0; i < closedSet.length; i++) {
        closedSet[i].dibujaCS();
    }

    for (i = 0; i < camino.length; i++) {
        camino[i].dibujaCamino();
    }



}


function borraCanvas() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function algoritmo() {

    //SEGUIMOS HASTA ENCONTRAR SOLUCIÓN
    if (terminado != true) {

        //SEGUIMOS SI HAY AlGO EN OPENSET
        if (openSet.length > 0) {
            var ganador = 0;  //índie o posición dentro del array openset del ganador

            //evaluamos que OpenSet tiene un menor coste / esfuerzo
            for (i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[ganador].f) {
                    ganador = i;
                }
            }

            //Analizamos la casilla ganadora
            var actual = openSet[ganador];

            //SI HEMOS LLEGADO AL FINAL BUSCAMOS EL CAMINO DE VUELTA
            if (actual === fin) {

                var temporal = actual;
                camino.push(temporal);

                while (temporal.padre != null) {
                    temporal = temporal.padre;
                    camino.push(temporal);
                }


                console.log('camino encontrado');
                terminado = true;
            }

            //SI NO HEMOS LLEGADO AL FINAL, SEGUIMOS
            else {
                borraDelArray(openSet, actual);
                closedSet.push(actual);

                var vecinos = actual.vecinos;
                //RECORRO LOS VECINOS DE MI GANADOR
                for (i = 0; i < vecinos.length; i++) {
                    var vecino = actual.vecinos[i];

                    //SI EL VECINO NO ESTÁ EN CLOSEDSET Y NO ES UNA PARED, HACEMOS LOS CÁLCULOS
                    if (!closedSet.includes(vecino) && vecino.tipo != 1) {
                        var tempG = actual.g + 1;

                        //si el vecino está en OpenSet y su peso es mayor
                        if (openSet.includes(vecino)) {
                            if (tempG < vecino.g) {
                                vecino.g = tempG;     //camino más corto
                            }
                        }
                        else {
                            vecino.g = tempG;
                            openSet.push(vecino);
                        }

                        //ACTUALIZAMOS VALORES
                        vecino.h = heuristica(vecino, fin);
                        vecino.f = vecino.g + vecino.h;

                        //GUARDAMOS EL PADRE (DE DÓNDE VENIMOS)
                        vecino.padre = actual;

                    }

                }


            }





        }

        else {
            console.log('No hay un camino posible');
            terminado = true;   //el algoritmo ha terminado
        }



    }

}


let bandera = 0;
function principal() {
    borraCanvas();
    algoritmo();
    dibujaEscenario();
    if (terminado && bandera == 0) { escribirResutlados(); bandera = 1 }
}

function escribirResutlados() {

    let coordenadas = '<div class="col-sm">';
    let i = 0;
    for (let index = camino.length - 1; index >= 0; index--) {
        if (i % 5 == 0)
            coordenadas += '</div><div class="col-sm">';
        coordenadas += `${i + 1}.- (${camino[index].x}, ${camino[index].y}) <br>`
        i++;
    }
    coordenadas += '</div>'
    $('#resultado').append(coordenadas)
}