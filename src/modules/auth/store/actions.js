import tokenApi from "@/api/tokenApi";
import loginApi from "@/api/loginApi";

// export const myAction = async ({ commit }) => {


// }


export const createUser = async ( /*{ commit }, user */) => {


}


export const signIn = async ({ commit }, user) => {

    const { username, password } = user

    try {
        const { data } = await tokenApi.post('/new/', { username, password })
        const { access, refresh } = data
        commit('login', { username, access, refresh })
        return { ok: true, title: 'ingreso con éxito' }
    } catch (error) {
       console.log(error.response.data);
        if (typeof error.response.data == 'object'){
            
            if (error.response.data.password && error.response.data.username ) return { ok: false, title: 'complete los campos' }
            if (error.response.data.username) return { ok: false, title: 'ingrese un username' }
            if (error.response.data.password) return { ok: false, title: 'ingrese una contraseña' }
             
        }
        const { detail }  = error.response.data
        return { ok: false, title: detail }
    }
}


export const checkAuthentication = async ({ commit } ) => {
    

    const access    = localStorage.getItem('access')
    const refresh   = localStorage.getItem('refresh')
    
    
    if( !access ) {
        commit('logout')
        return { ok: false, title: 'No hay token' }
    }

    try {
        
        const { data } = await loginApi.get('/userinfo/', {
            headers: {
              Authorization: `Bearer ${access}`,
            }
        })
        const { username } = data
        
        commit('login', { username, access, refresh })
        
        
        return { ok: true }

    } catch (error) {
        
        commit('logout')
        
        return { ok: false }
    }



}