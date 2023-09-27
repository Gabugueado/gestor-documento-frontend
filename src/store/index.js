import { createStore } from 'vuex'

import auth from '../modules/auth/store'
import gestor from '../modules/gestor/store/doc'


const store = createStore({
    modules: {
        auth,
        gestor
    }
})




export default store