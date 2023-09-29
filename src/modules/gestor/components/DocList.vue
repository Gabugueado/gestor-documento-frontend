<template>
  <div class="doc-list-container h-100">
      <div class="px-2 pt-2">
          <input 
            type="text"
            class="form-control"
            placeholder="Buscar entrada"
            v-model="term"
          />
      </div>

      <div class="mt-2 d-flex flex-column">
        <button class="btn btn-primary mx-3"
          @click="$router.push({ name: 'doc', params: { id: 'new' } })">
          <i class="fa fa-plus-circle"></i>
          Nueva entrada
        </button>
      </div>


      <div class="doc-scrollarea">
          <Doc
            v-for="doc in docsByTerm"
            :key="doc.id"
            :doc="doc"
          />
      </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    Doc: defineAsyncComponent(() => import('./DocComponent.vue'))
  },
  computed: {
    ...mapGetters('gestor', ['getDocsByTerm']),
    docsByTerm() {
      const docs = this.getDocsByTerm( this.term )
      
      return docs
    }
  },
  data() {
    
    return {
      term: ''
    }
  }
}
</script>



<style lang="scss" scoped>
.doc-list-container{
    border-right: 1px solid #2c3e50;
    // height: calc( 100vh - 56px );
    // height: 100%;
}

.doc-scrollarea{
    height: calc( 100vh - 110px );
    overflow: scroll;
    // height: 100%;
    height: 97.44%;
}
</style>
