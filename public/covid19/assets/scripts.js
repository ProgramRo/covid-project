// const { header } = require("express/lib/request")

const formularioSelector = document.querySelector('#formulario')
const correoSelector = document.querySelector('#correo')
const passwordSelector = document.querySelector('#password')
const tablaSelector = document.querySelector('#tabla')
const grafico1Selector = document.querySelector('#grafico')

let datosTomados = []


const crearTd = (texto) => {
  const text = document.createTextNode(texto)
  const td = document.createElement("td")
  td.appendChild(text)
  return td
}

const crearTr = () => {
  return document.createElement("tr")
}

const manejadorDeClick = async (e) => {
  const location = e.target.dataset.location
  try {
    const response = await fetch(`http://localhost:3000/api/countries/${location}`,
          {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('jwt-token')}`,
              },
          })
      const { data } = await response.json()
      console.log(data)
  } catch (err) {
      console.error(`Error: ${err}`)
  }
}

const mostrarModal = () => {
  
}


const mostrarTabla = () => {
    //console.log(datosTomados)
    for (let i = 0; i < datosTomados.length; i++) {
        const tr = crearTr()
        tr.appendChild(crearTd(datosTomados[i].location))
        tr.appendChild(crearTd(datosTomados[i].active))
        tr.appendChild(crearTd(datosTomados[i].confirmed))
        tr.appendChild(crearTd(datosTomados[i].deaths))
        tr.appendChild(crearTd(datosTomados[i].recovered))

        const tdButton = crearTd("")
        const button = document.createElement("button")
        button.dataset.location = datosTomados[i].location
        // button.dataset.indice = i
        button.addEventListener("click", manejadorDeClick)

        button.classList.add("btn", "btn-link")
        const buttonText = document.createTextNode("Ver detalles")
        button.appendChild(buttonText)
        tdButton.appendChild(button)
        tr.appendChild(tdButton)

        tablaSelector.appendChild(tr)
    }
}

const mostrarGraficoCasos = (paisesCasosActivos) => {
    const data = {
      labels: paisesCasosActivos.map(p => p.location),
      datasets: [
        {
          label: 'Casos Activos',
          data: paisesCasosActivos.map(p => p.active),
          borderColor: 'red',
          backgroundColor: 'red',
        },
        {
          label: 'Casos Confirmados',
          data: paisesCasosActivos.map(p => p.confirmed),
          borderColor: 'yellow',
          backgroundColor: 'yellow',
        },
        {
          label: 'Casos Muertos',
          data: paisesCasosActivos.map(p => p.deaths),
          borderColor: 'grey',
          backgroundColor: 'grey',
        },
        {
          label: 'Casos Recuperados',
          data: paisesCasosActivos.map(p => p.recovered),
          borderColor: 'skyblue',
          backgroundColor: 'skyblue',
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
    const ctx = grafico1Selector.getContext('2d');
    new Chart(ctx, config)
}

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

const postData = async (email, password) => {
  try {
      const response = await fetch("http://localhost:3000/api/login", // Consulta para crear token
          {
              method: 'POST', // Crear el token 
              body: JSON.stringify({ email, password }),
          })
      const { token } = await response.json()
      localStorage.setItem('jwt-token', token) // Persistiendo el token
      return token
  } catch (err) {
      console.error(`Error: ${err}`)
  }
}

formularioSelector.addEventListener("submit", async (event) => {
    event.preventDefault()
    const dataUser = await postData(correoSelector.value, passwordSelector.value)
    console.log(dataUser)

    datosTomados = await getData()

    // Se filtran los datos para obtener los mayores confirmados (10000)
    const paisesCasosActivos = datosTomados.filter((datosTomados) => {
        return datosTomados.confirmed >= 10000
    })

    mostrarGraficoCasos(paisesCasosActivos)

    mostrarTabla() // Cuando se llame a la función, ponerle los argumentos si es que hay parámetros

    // mostrarModal(datosTomados)
})
