// selectores
const contenedorGraficoSelector = document.querySelector("#contenedor-grafico");
const graficoChileSelector = document.querySelector('#grafico-chile')

// mis funciones
const getDatos = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt-token")}`,
      },
    });
    const { data } = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

const crearGrafico = (confirmed, deaths, recovered) => {
  // debugger
    const data = {
      labels: confirmed.map(p => p.date),
      datasets: [
        {
          label: 'Casos Confirmados',
          data: confirmed.map(p => p.total),
          borderColor: 'yellow',
          backgroundColor: 'yellow',
        },
        {
          label: 'Casos Muertos',
          data: deaths.map(p => p.total),
          borderColor: 'grey',
          backgroundColor: 'grey',
        },
        {
          label: 'Casos Recuperados',
          data: recovered.map(p => p.total),
          borderColor: 'skyblue',
          backgroundColor: 'skyblue',
        }
      ]
    };
    // debugger
    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Casos de Covid-19 en Chile'
          }
        }
      },
    };
    const ctx = graficoChileSelector.getContext('2d');
    new Chart(ctx, config)
}
/*
function crearGrafico(data) {
  // agregar logica para pintar 
  new Chart(contenedorGraficoSelector, {})
}
*/

// mi programa
(async () => {
  const confirmedData = await getDatos("confirmed");
  const deathsData = await getDatos("deaths");
  const recoveredData = await getDatos("recovered");
  
  crearGrafico(confirmedData, deathsData, recoveredData)
})();