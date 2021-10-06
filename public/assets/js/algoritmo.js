class AEstrella {

    //recibimos los datos necesarios para funcionar
    //filas: Cantidad de filas que establece le usuario
    //columnas: Cantidad de columnas que establece le usuario
    //inicio: Punto de inicio que establece le usuario
    //fin: Punto final que establece le usuario
    //obstaculos: Obstaculos que establece le usuario
    constructor(filas, columnas, inicio, fin, obstaculos) {
        this.filas = filas; //hacemos que la variable filas exista en un entorno global dentro de nuestra clase
        this.columnas = columnas; //hacemos que la variable columnas exista en un entorno global dentro de nuestra clase
        this.inicio = inicio; //hacemos que la variable inicio exista en un entorno global dentro de nuestra clase
        this.fin = fin; //hacemos que la variable fin exista en un entorno global dentro de nuestra clase
        this.obstaculos = obstaculos; //hacemos que la variable obstaculos exista en un entorno global dentro de nuestra clase
        this.crearMatriz(); //Este método creará la matriz de filas y columnas para poder manipular el tablero
        this.crearCasillas(); //A cada pocisión de la matriz le creamos una casilla con propiedades para poder ejercer el algoritmo
        this.crearObstaculos(); //Definimos los obtaculos dentro de nuestra matriz
        this.crearInicioFin(); //Definimos el inicio y el fin dentro de la matriz
        this.crearArreglos(); //Definimos los arreglos que necesitamos para poder operar, es decir: openSet, closedset, camino
        this.calcularVecinos();//Calculamos cada uno de las casillas vecinas de cada casilla dentro de la matriz
        this.calcular() //Iniciamos el algoritmo para calcular la ruta optima
    }

    calcular() {
        this.timeIntervalValue = setInterval(() => {
            this.dibujarEscenario();
            this.algoritmo()
        }, 100);
    }

    crearMatriz() { //Este método nos permitirá crear la matriz de las coordenadas que tendŕa el tablero
        this.matriz = new Array(this.filas) //Definomos una variable global llamada "matriz" cómo arreglo de la cantidad de columnas designadas
        for (let columna = 0; columna < this.columnas; columna++) { //con un ciclo for hacemos un recorrido desde 0 hasta la cantidad de columnas para poder crear cada columna de cada fila
            this.matriz[columna] = new Array(this.filas); //A cada columa de la matriz le cramos su arreglo correspondiente a la cantidad de las filas
        }
    }

    crearCasillas() { //Este métodos nos ayudará a crear las casillas dentro de la matriz
        this.matriz.forEach((columna, index) => {//recorremos la matriz para poder obtener cada columna
            for (let fila = 0; fila < this.filas; fila++) {//hacemos un ciclo for para poder recorrer las filas
                //a la columna, con determinada fila, es decir, a la coordenada (x,y) le creamos una instacia del objeto "Casilla" 
                //pasando cómo parámetro: (coordenada x, coordenada y, cantidad de filas, cantidad de columnas, la matriz)
                columna[fila] = new Casilla(index, fila, this.filas, this.columnas, this.matriz)
            }
        })


    }

    crearObstaculos() { //Este método nos ayudará a determinar los obstaculos dentro de a matriz
        this.obstaculos.forEach(coordenada => { //la varible global "obstaculos" determinada en el constructor, la recorremos, obteniendo cada una de las coordenadas de los obstaculos
            //esa coordenada la sacamos de la matriz y a la propiedad "tipo" del objeto "Casilla" la establecemos cómo 1
            //ya que el 1 se usa para identificar a los obstaculos
            this.matriz[coordenada.x][coordenada.y].tipo = 1
        })
    }

    crearInicioFin() { //Este método nos ayudará a determinar el punto de inicio y fin para calcular la ruta
        //a la variable global "inicio" creamos una referencia a las coordenada (x,y) de esta misma 
        //dentro de la matriz para poder tener una referencia de la casilla correspondiente
        this.inicio = this.matriz[this.inicio.x][this.inicio.y];
        //a la referencia de inicio, establecemos la propiedad "tipo" como 2 para indicar que es el punto de inicio
        this.inicio.tipo = 2;
        //a la variable global "fin" creamos una referencia a las coordenada (x,y) de esta misma 
        //dentro de la matriz para poder tener una referencia de la casilla correspondiente
        this.fin = this.matriz[this.fin.x][this.fin.y];
        //a la referencia de fin, establecemos la propiedad "tipo" como 3 para indicar que es el punto de fin
        this.fin.tipo = 3;
    }

    calcularVecinos() {//este método nos ayudará a saber los vecinos de cada una de las casillas de la matriz
        this.matriz.forEach(columna => { //recorremos la matriz obteniendo sus columnas
            columna.forEach(fila => { //recorremos a las columnas para obtener cada una de las filas o casillas individuales
                fila.crearVecinos() //llamamos a la función "crearVecinos" de la clase "Casilla" que calculará los vencios

            })
        })

    }

    crearArreglos() { //Este método nos ayudará a declarar los arreglos globales que necesitamos para poder calcular la ruta más optima
        this.openSet = [];//Aquí se almacenaran todas las casillas las cuales puede haber una posible ruta 
        this.closedSet = [];//Aquí se almacenaran todas las casillas las cuales ya fueron recorridas
        this.terminado = false;//Usamos este booleano para determinar si ya llegamos al nodo final
        this.camino = []; //Aquí se almacenaran todas las casillas las cuales serán la ruta optima
        this.openSet.push(this.inicio)//metemos a la casilla "inicio" a "openSet" para poder iniciar el algoritmo
    }

    dibujarEscenario() { //este método nos ayudará a poder dibujar cada una de las casillas dependiendo de su estado
        this.matriz.forEach(fila => { //recorremos a la matriz para que en cada casiila llamar a la función "dibuja"
            fila.forEach(columna => {
                columna.dibuja()//esta función dibujará a cada casilla dentro del tablero
            })
        })
        for (let i = 0; i < this.openSet.length; i++) { //recorremos a openSet
            this.openSet[i].dibujaOS();//cada casilla de openSet llamamos a la función "dibujaOS" para que dibuje de color verde aquellas posibles casillas con nuevas rutas
        }


        //DIBUJA CLOSEDSET
        for (let i = 0; i < this.closedSet.length; i++) {//recorremos a closedSet
            this.closedSet[i].dibujaCS();//cada casilla de closedSet llamamos a la función "dibujaCS" para que dibuje de color rojo aquellas casillas ya pasadas
        }

        for (let i = 0; i < this.camino.length; i++) {
            this.camino[i].dibujaCamino();
            //cada casilla de camino llamamos a la función "dibujaCamino" para que dibuje de color azul la ruta optima ya encontrada
        }
    }

    algoritmo() { //este método será el cual nos ayudará a realizar el algoritmo de A*
        if (this.terminado != true) { //validamos si no se ha teminado el algoritmo

            if (this.openSet.length > 0) {//Si hay algo en "openSet" entonces seguimos
                let ganador = 0;  //índie o posición dentro del array openset del ganador
                //evaluamos que OpenSet tiene un menor coste / esfuerzo
                for (let i = 0; i < this.openSet.length; i++) {  //recorremos a openSet con un ciclo for
                    if (this.openSet[i].f < this.openSet[ganador].f) { //si el esfuerzo de la casilla de openset es menor a la actual, entonces intercambiamos
                        ganador = i;
                    }
                }
                //Analizamos la casilla ganadora
                let actual = this.openSet[ganador];
                //SI HEMOS LLEGADO AL FINAL BUSCAMOS EL CAMINO DE VUELTA
                if (actual === this.fin) {

                    let temporal = actual; //esta variable nos ayudará para recorrer los nodos padres de las casillas
                    this.camino.push(temporal); //insertamos a termporal dentro de camino

                    while (temporal.padre != null) { //mientras haya un padre en la casilla
                        temporal = temporal.padre; //refrescamos a temporal con el padre de la casilla
                        this.camino.push(temporal);//insertamos a la casilla actual dentro del camino
                    }
                    this.terminado = true; //marcamos a "terminado" como true para indicar que ya se terminó el algoritmo
                    clearInterval(this.timeIntervalValue) //eliminamos el interval para que no se sigua ejcutando la función
                    this.dibujarEscenario() //sibujamos el escenario
                    this.escribirResutlados()//escribimos los resultado en el contenedor de resultados
                }

                //SI NO HEMOS LLEGADO AL FINAL, SEGUIMOS
                else {
                    this.borraDelArray(this.openSet, actual); //borramos la casilla actual de openSet
                    this.closedSet.push(actual); //a la casilla actual la metemos en closedSet

                    var vecinos = actual.vecinos; //a los vecinos de la casilla actual los almacenamos en una variable auxiliar
                    //RECORRO LOS VECINOS DE MI GANADOR
                    for (let i = 0; i < vecinos.length; i++) { //recorremos a cada uno de los vecino
                        var vecino = actual.vecinos[i]; //usamos otra variable auxiliar para poder tener una referencia del vecino actual

                        //SI EL VECINO NO ESTÁ EN CLOSEDSET Y NO ES UNA PARED, HACEMOS LOS CÁLCULOS
                        if (!this.closedSet.includes(vecino) && vecino.tipo != 1) {
                            var tempG = actual.g + 1; //calculamos el costo que tiene ese vecino hasta ese momento

                            //si el vecino está en OpenSet y su peso es mayor
                            if (this.openSet.includes(vecino)) {
                                if (tempG < vecino.g) {
                                    vecino.g = tempG;     //intercambiamos a los vecinos por el camino más corto
                                }
                            }
                            else { //si no está en openSet
                                vecino.g = tempG; //establecemos el costo para ese vecino
                                this.openSet.push(vecino); //lo agregamos en openSet como posible ruta
                            }

                            //ACTUALIZAMOS VALORES
                            vecino.h = this.heuristica(vecino, this.fin); //Calculamos la heuristica de ese vecino
                            vecino.f = vecino.g + vecino.h; //Calculamos el esfuerzo, sumando a la heuristica y al coste

                            
                            vecino.padre = actual; //GUARDAMOS EL PADRE (DE DÓNDE VENIMOS)

                        }

                    }


                }





            }
            else { //Si en "openSet" no hay nada, entonces determinamos que el camino no es posible
                this.terminado = true;   //marcamos que el algoritmo ha terminado
                clearInterval(this.timeIntervalValue) //paramos el interval para que ya no siga ejecutando el método
                this.dibujarEscenario() //dibujamos las casillas del escenario
            }



        }
    }

    heuristica(a, b) { //este método nos ayudará a poder calcular la heuristia desde el nodo actual hasta le nodo final
        return Math.abs((b.x - a.x) * 14) + Math.abs((b.y - a.y) * 14);//calculamos con la distancia de Manhattan
    }


    //Este método nos ayudará a borrar un elemento de una lista, especialmente lo usaremos para openSet, eliminar los nodos ya descartados o recorridos
    //Recime cómo parametro un arreglo y el elemento a eliminar
    borraDelArray(array, elemento) {
        for (let i = array.length - 1; i >= 0; i--) { //recorremos al arreglo con un ciclo for
            if (array[i] == elemento) {//si hay una coincidencia con el elmento entonces lo borramos
                array.splice(i, 1);//usamos la función "splice" para borrar ese elemento
            }
        }
    }


    getCamino() { //con esta función obtenemos el arreglo de camino
        return this.camino
    }

    escribirResutlados() {//con este método podremos escribir en el contenedor de resultados las coordenadas para la ruta optima
        let coordenadas = '<div class="col-sm">';
        let i = 0;
        for (let index = this.camino.length - 1; index >= 0; index--) {
            if (i % 5 == 0)
                coordenadas += '</div><div class="col-sm">';
            coordenadas += `${i + 1}.- (${this.camino[index].x + 1}, ${this.camino[index].y + 1}) <br>`
            i++;
        }
        coordenadas += '</div>'
        $('#resultado').append(coordenadas)
    }

}

class Casilla {

    //Recibimos a diferentes parámetros para que se puedan hacer operaciónes sobre las casiilas
    //x: coordenada x de la casiila
    //y: coordenada y de la casiila
    //filas: cantidad de filas en la matriz
    //columnas: cantidad de columnas en la matriz
    //matriz: referencia a la matriz para poder calcular los vecinos
    constructor(x, y, filas, columnas, matriz) {

        //A cada una de las variable recibidas hacemos una referencia para que existan globalmente dentro de la clase "Casilla"
        this.x = x;
        this.y = y;
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = matriz;

        this.padre = null; //esta variable nos permitirá hacer una conexión con el nodo padre, o la casilla de donde venimos, que nos servirá para calcular la ruta optima
        this.vecinos = []; //Aquí guardaremos los vecinos que tiene esta casilla

        //aquí de declara el tipo de casilla
        // 0: Casilla libre
        // 1: Obstaculo
        // 2: Inicio
        // 3: Fin
        this.tipo = 0;
        this.h = 0; //variable para la heuristica
        this.g = 0;//variable para el costo
        this.f = 0;//variable para la suma del costo y la heuristica
        this.crearCanvas()//Este método nos ayudará a tener una instancia del canvas para poder dibujar sobre el
    }

    crearCanvas() {//Este método nos ayudará a tener una instancia del canvas para poder dibujar sobre el
        this.canvas = document.getElementById('canvas');//obtenemos el elemento con el id "canvas" en el cual dibujaremos
        this.ctx = canvas.getContext('2d'); //obtenemos su contexto para poder dibujar sobre el
        this.ancho = parseInt(this.canvas.width / this.columnas); //en una varible global calculamos el ancho de cada una de las casiila
        this.alto = parseInt(this.canvas.height / this.filas);//en una varible global calculamos el alto de cada una de las casiila
    }

    crearVecinos() { //aquí calcularemos los vecinos que tiene la casilla

        if (this.x > 0) { //si la casilla no se encuentra en la primera columna
            this.vecinos.push(this.matriz[this.x - 1][this.y]);   //tiene un vecino izquierdo

        }
        if (this.x < this.columnas - 1) { //si la casilla no se encuentra en la ultima columna
            this.vecinos.push(this.matriz[this.x + 1][this.y]);   //tiene vecino derecho
        }
        if (this.y > 0) {//si la casilla no se encuentra en la primera fila

            this.vecinos.push(this.matriz[this.x][this.y - 1]);   //tiene un vecino de arriba
        }
        if (this.y < this.filas - 1) {//si la casilla no se encuentra en la ultima fila
            this.vecinos.push(this.matriz[this.x][this.y + 1]); //tiene un vecino de abajo
        }

        if (this.y > 0 && this.x > 0) {//si la casilla no se encuentra en la esquina superior izquierda
            this.vecinos.push(this.matriz[this.x - 1][this.y - 1])//tiene un vecino esquina superior izquierda
        }

        if (this.y > 0 && this.x < this.columnas - 1) {//si la casilla no se encuentra en la esquina superior derecha
            this.vecinos.push(this.matriz[this.x + 1][this.y - 1])//tiene un vecino esquina superior derecha
        }

        if (this.y < this.filas - 1 && this.x > 0) {//si la casilla no se encuentra en la esquina inferior izquierda
            this.vecinos.push(this.matriz[this.x - 1][this.y + 1])//tiene un vecino esquina inferior izquierda
        }
        if (this.y < this.filas - 1 && this.x < this.columnas - 1) {//si la casilla no se encuentra en la esquina infeior derecha
            this.vecinos.push(this.matriz[this.x + 1][this.y + 1])//tiene un vecino esquina inferior derecha
        }
    }

    dibuja() {//con este método dibujaremos la casilla en el tablero
        let color; //esta variable nos ayudará a saber de que color dibujar la casilla

        if (this.tipo == 0) //si el tipo es 0, entonces es una casilla libre
            color = '#28a745';//el color será verde

        if (this.tipo == 1)//si el tipo es 1, entonces es un obstaculo
            color = '#212529';//el color será negro

        if (this.tipo == 2)//si el tipo es 2, entonces es el inicio
            color = '#6610f2';//el color será morado

        if (this.tipo == 3)//si el tipo es 3, entonces es el fin
            color = '#fd7e14';//el color será naranja

        //DIBUJAMOS EL CUADRO EN EL CANVAS
        this.ctx.fillStyle = "#000";//establecemos el negro para poder hacer los marcos de la casilla
        this.ctx.fillRect(this.x * this.ancho, this.y * this.alto, this.ancho, this.alto); //dibujamos un cuadro negro en la coordenada de la casiila
        this.ctx.fillStyle = color;//establecemos el color que tendŕa la casilla
        this.ctx.fillRect((this.x * this.ancho) + 2, (this.y * this.alto) + 2, this.ancho - 2, this.alto - 2);//dibujamos la casiila del color que es, solo que un poco más pequeña
    }

    dibujaOS = function () { //esta función nos ayudará a dibujar las casilla en openset
        let color; //esta variable nos ayudará a poder determinar el colot
        switch (this.tipo) {
            case 2: //si el tipo de la casilla es 2, entonces la ponemos de color morado, pues es el inicio
                color = '#6610f2';
                break;
            case 3://si el tipo de la casilla es 3, entonces la ponemos de color naranja, pues es el fin
                color = '#fd7e14';
                break;
            default://si el tipo de la casilla no es ninguno de los anteriores, la dibujamos de color verde
                color = "#008000"
                break;
        }
        this.ctx.fillStyle = "#000";//establecemos el negro para poder hacer los marcos de la casilla
        this.ctx.fillRect(this.x * this.ancho, this.y * this.alto, this.ancho, this.alto); //dibujamos un cuadro negro en la coordenada de la casiila
        this.ctx.fillStyle = color;//establecemos el color que tendŕa la casilla
        this.ctx.fillRect((this.x * this.ancho) + 2, (this.y * this.alto) + 2, this.ancho - 2, this.alto - 2);//dibujamos la casiila del color que es, solo que un poco más pequeña

    }

    dibujaCS = function () {//esta función nos ayudará a dibujar las casilla en closedSet
        let color; //esta variable nos ayudará a poder determinar el colot
        switch (this.tipo) {
            case 2: //si el tipo de la casilla es 2, entonces la ponemos de color morado, pues es el inicio
                color = '#6610f2';
                break;
            case 3://si el tipo de la casilla es 3, entonces la ponemos de color naranja, pues es el fin
                color = '#fd7e14';
                break;
            default://si el tipo de la casilla no es ninguno de los anteriores, la dibujamos de color rojo
                color = "#dc3545"
                break;
        }

        this.ctx.fillStyle = "#000";//establecemos el negro para poder hacer los marcos de la casilla
        this.ctx.fillRect(this.x * this.ancho, this.y * this.alto, this.ancho, this.alto); //dibujamos un cuadro negro en la coordenada de la casiila
        this.ctx.fillStyle = color;//establecemos el color que tendŕa la casilla
        this.ctx.fillRect((this.x * this.ancho) + 2, (this.y * this.alto) + 2, this.ancho - 2, this.alto - 2);//dibujamos la casiila del color que es, solo que un poco más pequeña
    }

    dibujaCamino = function () {//esta función nos ayudará a dibujar las casilla en closedSet
        let color; //esta variable nos ayudará a poder determinar el colot
        switch (this.tipo) {
            case 2: //si el tipo de la casilla es 2, entonces la ponemos de color morado, pues es el inicio
                color = '#6610f2';
                break;
            case 3://si el tipo de la casilla es 3, entonces la ponemos de color naranja, pues es el fin
                color = '#fd7e14';
                break;
            default://si el tipo de la casilla no es ninguno de los anteriores, la dibujamos de color azul
                color = "#17a2b8"
                break;
        }

        this.ctx.fillStyle = "#000";//establecemos el negro para poder hacer los marcos de la casilla
        this.ctx.fillRect(this.x * this.ancho, this.y * this.alto, this.ancho, this.alto); //dibujamos un cuadro negro en la coordenada de la casiila
        this.ctx.fillStyle = color;//establecemos el color que tendŕa la casilla
        this.ctx.fillRect((this.x * this.ancho) + 2, (this.y * this.alto) + 2, this.ancho - 2, this.alto - 2);//dibujamos la casiila del color que es, solo que un poco más pequeña
    }
}