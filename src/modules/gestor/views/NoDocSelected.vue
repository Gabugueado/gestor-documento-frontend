<template>
    <div class="d-flex justify-content-center">
        <h1 class="align-self-center">No hay nada seleccionado</h1>
    </div>

    <Fab 
        @on:click="createNewDoc"
    />
</template>


<script>
import { defineAsyncComponent } from 'vue'

export default {
    name: 'NoDocSelected',
    components: {
        Fab: defineAsyncComponent( () => import('../components/FabComponent.vue') )
    },
    methods: {
        createNewDoc() {
            this.$router.push({ name: 'doc', params: { id: 'new' } })
        }
    }
}
</script>

<style lang="scss" scoped>
div {
    height: 100%;
}
</style>