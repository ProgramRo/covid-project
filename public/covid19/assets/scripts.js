// Selectores de elementos a trabajar
const formularioSelector = document.querySelector('#formulario')
const correoSelector = document.querySelector('#correo')
const passwordSelector = document.querySelector('#password')
const tablaSelector = document.querySelector('#tabla')
const grafico1Selector = document.querySelector('#grafico-total')
const tituloModalSelector = document.querySelector('#titulo-modal')
const cuerpoModalSelector = document.querySelector('#cuerpo-modal')
const cerrarModalSelector = document.querySelectorAll('.cerrar-modal')
const iniciarSesionSelector = document.querySelector('#iniciar-sesion')
const cerrarSesionSelector = document.querySelector('#cerrar-sesion')
const situacionChileSelector = document.querySelector('#situacion-chile')
const tablaCasosSelector = document.querySelector('#tabla-casos')
const graficoCasosSelector = document.querySelector('#grafico-casos')
const modalSelector = document.querySelector('#modal-contenedor-grafico')

const myModal = modalSelector && new bootstrap.Modal(modalSelector, {})

// Única variable global a utilizar
let datosTomados = []

// Funciones para ocultar y mostrar elementos
const ocultarObjeto = (objeto) => {
  if (objeto.style.display === "none") {
      objeto.style.display = "block";
  } else {
      objeto.style.display = "none";
  }
}
const mostrarObjeto = (objeto) => {
  if (objeto.style.display === "block") {
      objeto.style.display = "none";
  } else {
      objeto.style.display = "block";
  }
}

// Evento para cerrar sesión y eliminar token
cerrarSesionSelector.addEventListener('click', () => {
  localStorage.removeItem('jwt-token')
})

// Función que crea datos en una tabla
const crearTd = (texto) => {
  const text = document.createTextNode(texto)
  const td = document.createElement("td")
  td.appendChild(text)
  return td
}

// Función que crea filas en una tabla
const crearTr = () => {
  return document.createElement("tr")
}

// Función que muestra el gráfico del modal
const mostrarGraficoModal = (datos) => {
  const data = {
    labels: datos.map(p => p.location),
    datasets: [
      {
        label: 'Casos Activos',
        data: datos.map(p => p.active),
        borderColor: 'red',
        backgroundColor: 'red',
      },
      {
        label: 'Casos Confirmados',
        data: datos.map(p => p.confirmed),
        borderColor: 'yellow',
        backgroundColor: 'yellow',
      },
      {
        label: 'Casos Muertos',
        data: datos.map(p => p.deaths),
        borderColor: 'grey',
        backgroundColor: 'grey',
      },
      {
        label: 'Casos Recuperados',
        data: datos.map(p => p.recovered),
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
  const grafico2Selector = document.querySelector('#grafico-modal')
  const ctx = grafico2Selector.getContext('2d');
  new Chart(ctx, config)
}

// Función que solicita la información y crea el gráfico en el modal
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
      tituloModalSelector.innerHTML = data.location
      const listaDePaises = []
      listaDePaises.push(data)
      cuerpoModalSelector.innerHTML = ""
      cuerpoModalSelector.innerHTML = '<canvas id="grafico-modal"></canvas>'
      mostrarGraficoModal(listaDePaises)
      myModal.show()
  } catch (err) {
      console.error(`Error: ${err}`)
  }
}

// Función que crea los elementos de la tabla a mostrar
const mostrarTabla = () => {
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
        button.addEventListener("click", manejadorDeClick)

        button.classList.add("btn", "btn-link")
        const buttonText = document.createTextNode("Ver detalles")
        button.appendChild(buttonText)
        tdButton.appendChild(button)
        tr.appendChild(tdButton)

        tablaSelector.appendChild(tr)
    }
}

// Función que crea el gráfico con los casos totales activos
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
            text: 'Casos de Covid-19 a Nivel Mundial'
          }
        }
      },
    };
    const ctx = grafico1Selector.getContext('2d');
    new Chart(ctx, config)
}

// Función que obtiene la información de la API
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

// Función que crea el token con la información del usuario
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

// Escuchador del evento submit en el formulario
formularioSelector && formularioSelector.addEventListener("submit", async (event) => {
    event.preventDefault()
    const dataUser = await postData(correoSelector.value, passwordSelector.value)

    datosTomados = await getData()

    // Se filtran los datos para obtener los mayores confirmados (>= 10000)
    const paisesCasosActivos = datosTomados.filter((datosTomados) => {
        return datosTomados.confirmed >= 10000
    })
    // Función que oculta y muestra elementos
    ocultarObjeto(iniciarSesionSelector)
    mostrarObjeto(cerrarSesionSelector)
    mostrarObjeto(situacionChileSelector)
    mostrarObjeto(tablaCasosSelector)
    mostrarObjeto(graficoCasosSelector)

    mostrarGraficoCasos(paisesCasosActivos)

    mostrarTabla()
})
