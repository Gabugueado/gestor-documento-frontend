
// export const myAction = ( state ) => {

// }


export const login = ( state, { username, access, refresh }) => {
    
    if ( access ) {
        localStorage.setItem( 'access', access )
        state.access = access
    }

    if ( refresh ) {
        localStorage.setItem( 'refresh', refresh )
        state.refresh = refresh
    }
    
    state.username  = username
    state.status    = 'authenticated'
}


export const logout = (state) => {
    
    state.user = null
    state.access = null
    state.refresh = null
    state.status = 'not-authenticated'

    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
}
