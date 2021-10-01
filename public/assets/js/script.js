const calcular = () => {
    let filas = $('#filasInput').val()
    let columnas = $('#columnasInput').val()
    let inicio = obtenerXY($('#inicioInput').val())
    let fin = obtenerXY($('#finalInput').val())
    let obstaculos = obtenerCoordenadaObstaculos($('#obstaculosInput').val())
    $('#detalles').html('')
    $('#detalles').append(`
    <b>Filas:${filas}</b><br><br>
    <b>Columnas:${columnas}</b><br><br>
    <b>Inicio::${$('#inicioInput').val()}</b><br><br>
    <b>Destino:${$('#finalInput').val()}</b><br><br>
    <b>Obstaculos:${$('#obstaculosInput').val()}</b><br><br>
    `)
    inicializa(filas, columnas, inicio, fin, obstaculos)
}

const obtenerCoordenadaObstaculos = (obstaculos = '') => {
    let coordenadas = []
    coordenadas = obstaculos.split('),(')
    coordenadas[0] = coordenadas[0].substr(1, coordenadas[0].length)
    coordenadas[coordenadas.length - 1] = coordenadas[coordenadas.length - 1].substr(0, coordenadas[coordenadas.length - 1].length - 1)
    let obstaculosCoordenadas = []

    coordenadas.forEach(coordenada => {
        let xy = coordenada.split(',')
        obstaculosCoordenadas.push({ x: xy[0], y: xy[1] })
    })
    return obstaculosCoordenadas;
}

const obtenerXY = (valor = '') => {
    valor = valor.substr(1, valor.length - 2);
    let coordenadas = valor.split(',');
    return { x: coordenadas[0], y: coordenadas[1] }
}