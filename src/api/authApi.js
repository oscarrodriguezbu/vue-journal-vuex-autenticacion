
import axios from 'axios'


const authApi = axios.create({
    baseURL: 'https://identitytoolkit.googleapis.com/v1/accounts',
    params: {
        key: 'AIzaSyAeMs51xfiR6QXbD-VsBKWRgyh-U_h0nKM' // esto viene desde configuracion de proyecto/ Clave de API web (FIREBASE)
    }
})

// console.log( process.env.NODE_ENV ) // TEST durante testing, 

export default authApi


