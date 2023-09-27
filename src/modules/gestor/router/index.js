

export default {

    name: 'gestor',
    component: () => import(/* webpackChunkName: "gestor" */ '@/modules/gestor/layouts/GestorLayout.vue'),
    children: [
        {
            path: '',
            name: 'no-doc',
            component: () => import(/* webpackChunkName: "gestor-no-doc" */ '@/modules/gestor/views/NoDocSelected.vue'),
        },
        {
            path: ':id',
            name: 'doc',
            component: () => import(/* webpackChunkName: "gestor-doc" */ '@/modules/gestor/views/DocView.vue'),
            props: ( route ) => {
                return {
                    id: route.params.id
                }
            }
        }
    ]

}