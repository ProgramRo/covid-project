// const { header } = require("express/lib/request")

const formularioSelector = document.querySelector('#formulario')
const correoSelector = document.querySelector('#correo')
const passwordSelector = document.querySelector('#password')
const tablaSelector = document.querySelector('#tabla')
const graficoSelector1 = document.querySelector('#grafico')

formularioSelector.addEventListener("submit", async (event) => {
    event.preventDefault()
    const postData = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/login", // Consulta para crear token
                {
                    method: 'POST', // Crear el token 
                    body: JSON.stringify({ email: correoSelector.value, password: passwordSelector.value }),
                })
            const { token } = await response.json()
            localStorage.setItem('jwt-token', token) // Persistiendo el token
            return token
        } catch (err) {
            console.error(`Error: ${err}`)
        }
    }
    const dataUser = await postData()
    console.log(dataUser)

    const getData = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/total",
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
                    },
                })
            const { data } = await response.json()
            return data
        } catch (err) {
            console.error(`Error: ${err}`)
        }
    }
    const datosTomados = await getData()
    console.log(datosTomados)

    // Se filtran los datos para obtener los mayores confirmados (10000)
    const paisesCasosActivos = datosTomados.filter((datosTomados) => {
        return datosTomados.confirmed >= 10000
    })
    console.log(paisesCasosActivos)

    const mostrarGraficoCasos = (paisesCasosActivos) => {
        console.log(paisesCasosActivos)
        const crearGraficoCasos = ''
          const data = {
            labels: paisesCasosActivos.map(p => p.location),
            datasets: [
              {
                label: 'Activos',
                data: paisesCasosActivos.map(p => p.active),
                borderColor: 'red',
                backgroundColor: 'red',
              },
              {
                label: 'Muertos',
                data: paisesCasosActivos.map(p => p.deaths),
                borderColor: 'blue',
                backgroundColor: 'blue',
              }
            ]
          };
          const config = {
            type: 'bar',
            data: data,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Chart.js Bar Chart'
                }
              }
            },
          };
          const myChart = new Chart(
            document.querySelector('#grafico'),
            config
          );
            graficoSelector1.innerHTML = myChart
            return crearGraficoCasos
    }
    mostrarGraficoCasos(paisesCasosActivos)

    const mostrarTabla = (datosTomados) => {
        console.log(datosTomados)
        const crearTabla = ''
        for (let i = 0; i < datosTomados.length; i++) {
            tablaSelector.innerHTML += `
            <table class="table">
            <thead>
              <tr>
                <th scope="col">País</th>
                <th scope="col">Casos Activos</th>
                <th scope="col">Casos Confirmados</th>
                <th scope="col">Muertes</th>
                <th scope="col">Recuperados</th>
                <th scope="col">Ver detalle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">${datosTomados[i].location}</th>
                <td>${datosTomados[i].active}</td>
                <td>${datosTomados[i].confirmed}</td>
                <td>${datosTomados[i].deaths}</td>
                <td>${datosTomados[i].recovered}</td>
                <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Ver detalle
              </button></td>
              </tr>
            </tbody>
          </table>
          `
        }
        return crearTabla
    }
    mostrarTabla(datosTomados) // Cuando se llame a la función, ponerle los argumentos si es que hay parámetros

    const mostrarModal = () => {
        console.log()
        const crearModal = ''
        /*
        const paises = [
            {
              nombre: 'Chile',
              activos: 1000,
              muertos: 342,
            },
            {
              nombre: 'US',
              activos: 1000,
              muertos: 433,
            }
          ]
          const data = {
            labels: paises.map(p => p.nombre),
            datasets: [
              {
                label: 'Activos',
                data: paises.map(p => p.activos),
                borderColor: 'red',
                backgroundColor: 'red',
              },
              {
                label: 'Muertos',
                data: paises.map(p => p.muertos),
                borderColor: 'blue',
                backgroundColor: 'blue',
              }
            ]
          };
          const config = {
            type: 'bar',
            data: data,
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Chart.js Bar Chart'
                }
              }
            },
          };
          const myChart = new Chart(
            document.getElementById('myChart'),
            config
          );
          */
        // for (let i = 0; i < datosTomados.length; i++) {
            /*
            const crearGraficoPais = {
                labels: datosTomados[i].location,
                datasets: [
                    {
                        label: 'Activos',
                        data: datosTomados[i].active,
                        borderColor: 'red',
                        backgroundColor: 'red',
                    },
                    {
                        label: 'Muertos',
                        data: datosTomados[i].deaths,
                        borderColor: 'blue',
                        backgroundColor: 'blue',
                    }
                ]
            };
            const config = {
                type: 'bar',
                data: crearGraficoPais,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                        position: 'top',
                        },
                        title: {
                        display: true,
                        text: 'Chart.js Bar Chart'
                        }
                    }
                },
            };*/ 
            tablaSelector.innerHTML += `
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <!--
                <div>
                <canvas id="myChart"></canvas>
                </div>
                -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
            </div>
            `
        //}
        return crearModal
    }
    mostrarModal(datosTomados)
})
/*
const paises = [
    {
      nombre: 'Chile',
      activos: 1000,
      muertos: 342,
    },
    {
      nombre: 'US',
      activos: 1000,
      muertos: 433,
    }
  ]
  const data = {
    labels: paises.map(p => p.nombre),
    datasets: [
      {
        label: 'Activos',
        data: paises.map(p => p.activos),
        borderColor: 'red',
        backgroundColor: 'red',
      },
      {
        label: 'Muertos',
        data: paises.map(p => p.muertos),
        borderColor: 'blue',
        backgroundColor: 'blue',
      }
    ]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Bar Chart'
        }
      }
    },
  };
  const myChart = new Chart(
    document.getElementById('grafico'),
    config
  );
  */