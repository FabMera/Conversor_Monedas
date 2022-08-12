//Seleccionamos las variables del DOM.
const monto = document.getElementById("monto"); //input
const select = document.getElementById("selector"); //select
const resultado = document.getElementById("resultado"); //span Resultado
const btnBuscar = document.getElementById("buscar"); //boton
const div = document.querySelector(".Grafico"); //div de grafico para css.

//Desafio API:
//si el usuario elige dólar o euro se debe convertir los pesos
//chilenos en el valor seleccionado y mostrar un gráfico de la moneda y sus cambios en
//los ultimos 10 dias.

//--------------------------------------------------------------------------------------------//
btnBuscar.addEventListener("click", () => getConversionDeMonedas());

/*Obtenemos los datos de la API y ejecutamos la conversion*/
async function getConversionDeMonedas() {
  let tipoMoneda = select.selectedIndex;
  try {
    const endpoint = "https://mindicador.cl/api/";
    const resp = await fetch(endpoint);
    const cambio = await resp.json();
    console.log(cambio);

    if (monto.value >= 1) {
      if (tipoMoneda == "1") {
        resultado.innerHTML =
          "Resultado $USD :" + (monto.value / cambio.dolar.valor).toFixed(2);
        div.style.backgroundColor = "white";
        renderGrafica();
      } else if (tipoMoneda == "2") {
        resultado.innerHTML =
          "Resultado €:" + (monto.value / cambio.euro.valor).toFixed(2);
        div.style.backgroundColor = "white";
        renderGraficaEuros();
      }
    } else {
      alert("Debe ingresar un valor valido");
    }
  } catch (error) {
    alert(error.message);
  }
}
//------------------- Funcion asincrona para los dolares en Grafica--------------------------------//

async function getDolaresDias() {
  const endpoint = "https://mindicador.cl/api/dolar";
  const resp = await fetch(endpoint);
  const dolares = await resp.json();
  const fechas = dolares.serie.slice(0, 10); //obtengo las 10 ultimas fechas
  //console.log(fechas)
  //console.log(dolares.serie[0].fecha);
  return fechas;
}
//---------------------------------Preparando la Grafica (dolares)--------------------------------//
function prepararConfigGrafica(fechas) {
  const tipoDeGrafica = "line";
  const nombreDelCambio = fechas.map((dia) => dia.fecha); //eje horizontal
  const titulo = "Dolares últimos 10 Dias";
  const colorDeLinea = "red";
  const valores = fechas.map((dia) => dia.valor); //eje vertical

  const config = {
    type: tipoDeGrafica,
    data: {
      labels: nombreDelCambio,
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          data: valores,
        },
      ],
    },
  };
  return config;
}
//-----------------------------Renderizado DOLARES-------------------------------------------------//
async function renderGrafica() {
  const fechas = await getDolaresDias();
  const config = prepararConfigGrafica(fechas);
  const chartDOM = document.getElementById("myChart");
  new Chart(chartDOM, config);
}

//------------------------------Funcion Asincrona para EUROS en Grafico----------------------------//
async function getEuroDias() {
  const endpoint = "https://mindicador.cl/api/euro";
  const resp = await fetch(endpoint);
  const euros = await resp.json();
  const fechasEuros = euros.serie.slice(0, 10); //obtengo las 10 ultimas fechas
  return fechasEuros;
}
//---------------------------------Preparando la Grafica (EUROS)---------------------------------//
function prepararConfigGraficaEuros(fechasEuros) {
  const tipoDeGrafica = "line";
  const nombreDelCambio = fechasEuros.map((dia) => dia.fecha); //eje horizontal
  const titulo = "Euros últimos 10 Dias";
  const colorDeLinea = "red";
  const valores = fechasEuros.map((dia) => dia.valor); //eje vertical

  const config = {
    type: tipoDeGrafica,
    data: {
      labels: nombreDelCambio,
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          data: valores,
        },
      ],
    },
  };
  return config;
}
//-----------------------------Renderizado EUROS-------------------------------------------------//
async function renderGraficaEuros() {
  const fechasEuros = await getEuroDias();
  const config = prepararConfigGraficaEuros(fechasEuros);
  const chartDOM = document.getElementById("myChart");
  new Chart(chartDOM, config);
}
//-------------------------------------Fin--JS--------------------------------------------------//
