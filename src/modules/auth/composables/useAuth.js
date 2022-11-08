import { computed } from 'vue'
import { useStore } from 'vuex'


const useAuth = () => {
    
    const store = useStore()

    const createUser = async( user ) => {
        const resp = await store.dispatch('auth/createUser', user )
        return resp
    }

    const loginUser = async( user ) => {
        const resp = await store.dispatch('auth/signInUser', user )
        return resp
    }

    const checkAuthStatus = async() => {
        const resp = await store.dispatch('auth/checkAuthentication')
        return resp
    }
    
    const logout = () => {
        store.commit('auth/logout')
        //Otra opcion para limpiar es hacer una navegacion tradicional sin el router con el window.locatlon y eso hace un refresh
        //del navegador donde purga todo, pero para este ejercicio se deja asi:
        store.commit('journal/clearEntries') 
    }
    
    return {
        checkAuthStatus,
        createUser,
        loginUser,
        logout,

        authStatus: computed(()=> store.getters['auth/currentState']),
        username: computed(()=> store.getters['auth/username'])
    }
}

export default useAuth