// const { header } = require("express/lib/request")

const formularioSelector = document.querySelector('#formulario')
const correoSelector = document.querySelector('#correoSelector')
const passwordSelector = document.querySelector('#passwordSelector')

formulario.addEventListener("submit", async (event) => {
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
    /*const mostrarTabla = (data) => {
    console.log(data)
    }
    mostrarTabla()*/
})

