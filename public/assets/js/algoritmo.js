class AEstrella {

    constructor(filas, columnas, inicio, fin, obstaculos) {
        this.filas = filas;
        this.columnas = columnas;
        this.inicio = inicio;
        this.fin = fin;
        this.obstaculos = obstaculos;
        this.crearMatriz();
        this.crearCasillas();
        this.crearObstaculos();
        this.crearInicioFin();
        this.crearArreglos();
        this.calcularVecinos();
        this.calcular()
    }

    calcular(){
        this.timeIntervalValue = setInterval(() => {
            this.dibujarEscenario();
            this.algoritmo()
        }, 100);
    }

    crearMatriz() {
        this.matriz = new Array(this.filas)
        for (let columna = 0; columna < this.columnas; columna++) {
            this.matriz[columna] = new Array(this.filas);
        }
    }

    crearCasillas() {
        this.matriz.forEach((columna, index) => {
            for (let fila = 0; fila < this.filas; fila++) {
                columna[fila] = new Casilla(index, fila, this.filas, this.columnas, this.matriz)
            }
        })


    }

    crearObstaculos() {
        this.obstaculos.forEach(coordenada => {
            this.matriz[coordenada.x][coordenada.y].tipo = 1
        })
    }

    crearInicioFin() {
        this.inicio = this.matriz[this.inicio.x][this.inicio.y];
        this.inicio.tipo = 2;
        this.fin = this.matriz[this.fin.x][this.fin.y];
        this.fin.tipo = 3;
    }

    calcularVecinos() {
        this.matriz.forEach(columna => {
            columna.forEach(fila => {
                fila.crearVecinos()

            })
        })

    }

    crearArreglos() {
        this.openSet = [];
        this.closedSet = [];
        this.terminado = false;
        this.camino = [];
        this.openSet.push(this.inicio)
    }

    dibujarEscenario() {
        this.matriz.forEach(fila => {
            fila.forEach(columna => {
                columna.dibuja()
            })
        })
        for (let i = 0; i < this.openSet.length; i++) {
            this.openSet[i].dibujaOS();
        }


        //DIBUJA CLOSEDSET
        for (let i = 0; i < this.closedSet.length; i++) {
            this.closedSet[i].dibujaCS();
        }

        for (let i = 0; i < this.camino.length; i++) {
            this.camino[i].dibujaCamino();
        }
    }

    algoritmo() {
        if (this.terminado != true) {
            //SEGUIMOS SI HAY AlGO EN OPENSET
            if (this.openSet.length > 0) {
                let ganador = 0;  //índie o posición dentro del array openset del ganador
                //evaluamos que OpenSet tiene un menor coste / esfuerzo
                for (let i = 0; i < this.openSet.length; i++) {
                    if (this.openSet[i].f < this.openSet[ganador].f) {
                        ganador = i;
                    }
                }
                //Analizamos la casilla ganadora
                let actual = this.openSet[ganador];
                //SI HEMOS LLEGADO AL FINAL BUSCAMOS EL CAMINO DE VUELTA
                if (actual === this.fin) {

                    let temporal = actual;
                    this.camino.push(temporal);

                    while (temporal.padre != null) {
                        temporal = temporal.padre;
                        this.camino.push(temporal);
                    }
                    console.log('camino encontrado');
                    this.terminado = true;
                    clearInterval(this.timeIntervalValue)
                    this.dibujarEscenario()
                    this.escribirResutlados()
                }

                //SI NO HEMOS LLEGADO AL FINAL, SEGUIMOS
                else {
                    this.borraDelArray(this.openSet, actual);
                    this.closedSet.push(actual);

                    var vecinos = actual.vecinos;
                    //RECORRO LOS VECINOS DE MI GANADOR
                    for (let i = 0; i < vecinos.length; i++) {
                        var vecino = actual.vecinos[i];

                        //SI EL VECINO NO ESTÁ EN CLOSEDSET Y NO ES UNA PARED, HACEMOS LOS CÁLCULOS
                        if (!this.closedSet.includes(vecino) && vecino.tipo != 1) {
                            var tempG = actual.g + 1;

                            //si el vecino está en OpenSet y su peso es mayor
                            if (this.openSet.includes(vecino)) {
                                if (tempG < vecino.g) {
                                    vecino.g = tempG;     //camino más corto
                                }
                            }
                            else {
                                vecino.g = tempG;
                                this.openSet.push(vecino);
                            }

                            //ACTUALIZAMOS VALORES
                            vecino.h = this.heuristica(vecino, this.fin);
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
                clearInterval(this.timeIntervalValue)
                this.dibujarEscenario()
            }



        }
    }

    heuristica(a, b) {
        return  Math.abs((b.x - a.x )*14) + Math.abs((b.y - a.y )*14);
    }

    borraDelArray(array, elemento) {
        for (let i = array.length - 1; i >= 0; i--) {
            if (array[i] == elemento) {
                array.splice(i, 1);
            }
        }
    }

    getCamino(){
        return this.camino
    }

    escribirResutlados() {

        let coordenadas = '<div class="col-sm">';
        let i = 0;
        for (let index = this.camino.length - 1; index >= 0; index--) {
            if (i % 5 == 0)
                coordenadas += '</div><div class="col-sm">';
            coordenadas += `${i + 1}.- (${this.camino[index].x+1}, ${this.camino[index].y+1}) <br>`
            i++;
        }
        coordenadas += '</div>'
        $('#resultado').append(coordenadas)
    }

}

class Casilla {

    constructor(x, y, filas, columnas, matriz) {
        this.x = x;
        this.y = y;
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = matriz;
        this.padre = null;
        this.vecinos = [];

        this.tipo = 0;
        this.h = 0;
        this.g = 0;
        this.f = 0;
        this.crearCanvas()
    }

    crearCanvas() {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.ancho = parseInt(this.canvas.width / this.columnas);
        this.alto = parseInt(this.canvas.height / this.filas);
    }

    crearVecinos() {

        if (this.x > 0) {
            // console.log('izquierda');
            this.vecinos.push(this.matriz[this.x - 1][this.y]);   //vecino izquierdo

        }
        if (this.x < this.columnas - 1) {
            // console.log('derecho');

            this.vecinos.push(this.matriz[this.x + 1][this.y]);   //vecino derecho
        }
        if (this.y > 0) {
            // console.log('arriba');

            this.vecinos.push(this.matriz[this.x][this.y - 1]);   //vecino de arriba
        }
        if (this.y < this.filas - 1) {
            // console.log('abajo');
            this.vecinos.push(this.matriz[this.x][this.y + 1]); //vecino de abajo}
        }

        if (this.y > 0 && this.x > 0) {
            this.vecinos.push(this.matriz[this.x - 1][this.y - 1])//vecino esquina superior izquierda
        }

        if (this.y > 0 && this.x < this.columnas - 1) {
            this.vecinos.push(this.matriz[this.x + 1][this.y - 1])//vecino esquina superior derecha
        }

        if (this.y < this.filas - 1 && this.x > 0) {
            this.vecinos.push(this.matriz[this.x - 1][this.y + 1])//vecino esquina inferior izquierda
        }
        if (this.y < this.filas - 1 && this.x < this.columnas - 1) {
            this.vecinos.push(this.matriz[this.x + 1][this.y + 1])//vecino esquina inferior derecha
        }
    }

    dibuja() {
        let color;

        if (this.tipo == 0)
            color = '#28a745';

        if (this.tipo == 1)
            color = '#212529';

        if (this.tipo == 2)
            color = '#6610f2';

        if (this.tipo == 3)
            color = '#fd7e14';

        //DIBUJAMOS EL CUADRO EN EL CANVAS
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(this.x * this.ancho, this.y * this.alto, this.ancho, this.alto);
        this.ctx.fillStyle = color;
        this.ctx.fillRect((this.x * this.ancho) + 2, (this.y * this.alto) + 2, this.ancho - 2, this.alto - 2);
    }

    dibujaOS = function () {
        let color;
        switch (this.tipo) {
            case 2:
                color = '#6610f2';
                break;
            case 3:
                color = '#fd7e14';
                break;
            default:
                color = "#008000"
                break;
        }

        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(this.x * this.ancho, this.y * this.alto, this.ancho, this.alto);
        this.ctx.fillStyle = color;
        this.ctx.fillRect((this.x * this.ancho) + 2, (this.y * this.alto) + 2, this.ancho - 2, this.alto - 2);

    }

    dibujaCS = function () {
        let color;
        switch (this.tipo) {
            case 2:
                color = '#6610f2';
                break;
            case 3:
                color = '#fd7e14';
                break;
            default:
                color = "#dc3545"
                break;
        }
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(this.x * this.ancho, this.y * this.alto, this.ancho, this.alto);
        this.ctx.fillStyle = color;
        this.ctx.fillRect((this.x * this.ancho) + 2, (this.y * this.alto) + 2, this.ancho - 2, this.alto - 2);
    }

    dibujaCamino = function () {
        let color;
        switch (this.tipo) {
            case 2:
                color = '#6610f2';
                break;
            case 3:
                color = '#fd7e14';
                break;
            default:
                color = "#17a2b8"
                break;
        }
        this.ctx.fillStyle = "#000";
        this.ctx.fillRect(this.x * this.ancho, this.y * this.alto, this.ancho, this.alto);
        this.ctx.fillStyle = color;  //cyan
        this.ctx.fillRect((this.x * this.ancho) + 2, (this.y * this.alto) + 2, this.ancho - 2, this.alto - 2);
    }
}