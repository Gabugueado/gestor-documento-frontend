<template>
    <template v-if="doc">
        <div class="doc-title d-flex justify-content-between px-2 py-2">

            <div>
                <span class="text-success fs-3 fw-bold">{{ day }}</span>
                <span class="mx-1 fs-3">{{ month }}</span>
                <span class="mx-2 fs-4 fw-light">{{ yearDay }}</span>
            </div>

            <div>

                <input type="file" @change="onSelectedPDF" ref="imageSelector" v-show="false" accept="application/pdf">

                <button v-if="doc.id" class="btn btn-danger mx-2" @click="onDeleteDoc">
                    Borrar
                    <i class="fa fa-trash-alt"></i>
                </button>

                <button class="btn btn-primary" @click="onSelectPDF">
                    Subir Documento
                    <i class="fa fa-upload"></i>
                </button>
            </div>
        </div>
        <hr>
        <div class="d-flex flex-column h-100">
            <div class="app-header">
                <template >
                    <span v-if="showAllPages">
                        {{ pageCount }} page(s)
                    </span>

                    <span v-else>
                        <button :disabled="page <= 1" @click="page--">❮</button>

                        {{ page }} / {{ pageCount }}

                        <button :disabled="page >= pageCount" @click="page++">❯</button>
                    </span>

                    <label class="right">
                        <input v-model="showAllPages" type="checkbox">

                        Show all pages
                    </label>
                </template>
            </div>

            <div class="app-content">
                <vue-pdf-embed 
                    ref="pdfRef" 
                    :source="doc.base64_content" 
                    :page="page" 
                    @password-requested="handlePasswordRequest"
                    @rendered="handleDocumentRender"
                />
            </div>
            <!-- <vue-pdf-embed :source="doc.base64_content" /> -->
        </div>

    </template>

    <Fab icon="fa-save" @on:click="saveEntry" />
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex' // computed!!!
import Swal from 'sweetalert2'
import VuePdfEmbed from 'vue-pdf-embed'

import getDayMonthYear from '../helpers/getDayMonthYear'



export default {
    name: 'DocView',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        Fab: defineAsyncComponent(() => import('../components/FabComponent.vue')),
        VuePdfEmbed,
    },
    data() {
        return {
            doc: null,
            file: null,
            isLoading: true,
            page: null,
            pageCount: 1,
            showAllPages: true
        }
    },

    computed: {
        ...mapGetters('gestor', ['getDocById']),
        day() {
            const { day } = getDayMonthYear(this.doc.created_at)
            return day
        },
        month() {
            const { month } = getDayMonthYear(this.doc.created_at)
            return month
        },
        yearDay() {
            const { yearDay } = getDayMonthYear(this.doc.created_at)
            return yearDay
        }
    },

    methods: {
        ...mapActions('gestor', ['loadFiles', 'updateDoc', 'addDoc', 'deleteDoc']),
        async loadEntry() {
            let doc;

            if (this.id === 'new') {
                doc = {
                    title: '',
                    content: '',
                    file: null,
                    created_at: new Date().getTime()
                }

            } else {
                doc = this.getDocById(this.id)
                const { base64_content } = await this.loadFiles(this.id)
                doc.base64_content = `data:application/pdf;base64,${base64_content}`
                // doc.file = `data:application/pdf;base64, ${docFile.base64_content}`

                if (!doc) return this.$router.push({ name: 'no-doc' })
            }
            this.doc = doc
        },
        async saveEntry() {

            Swal.fire({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()

            this.doc.content = 'content'
            this.doc.title = 'title'
            this.doc.file = this.$refs.imageSelector.files[0]
            if (this.doc.id) {
                // Actualizar
                await this.updateDoc(this.doc)

            } else {
                // Crear una nueva entrada
                const id = await this.addDoc(this.doc)
                this.$router.push({ name: 'doc', params: { id: id } })
            }


            this.file = null
            Swal.fire('Guardado', 'Documento registrado con éxito', 'success')


        },
        async onDeleteDoc() {

            const { isConfirmed } = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Una vez borrado, no se puede recuperar',
                showDenyButton: true,
                confirmButtonText: 'Si, estoy seguro'
            })


            if (isConfirmed) {
                Swal.fire({
                    title: 'Espere por favor',
                    allowOutsideClick: false
                })
                Swal.showLoading()

                await this.deleteDoc(this.doc)
                this.$router.push({ name: 'no-doc' })

                Swal.fire('Eliminado', '', 'success')
            }
        },
        onSelectedPDF(event) {
            const file = event.target.files[0]
            console.log(file)
            if (!file) {
                this.pdfFile = null
                return
            }
            this.doc.file = file
            const fr = new FileReader()
            fr.onload = () => this.doc.base64_content = fr.result
            fr.readAsDataURL(file)

        },
        onSelectPDF() {
            this.$refs.imageSelector.click()
        },
        handleDocumentRender() {
            this.isLoading = false
            this.pageCount = this.$refs.pdfRef.pageCount
        },
        async handlePasswordRequest(callback, retry) {
            
            // retry está inicializado en false
            if (!retry){
                const { value: password } = await Swal.fire({
                title: 'ingrese la contraseña',
                input: 'password',
                inputLabel: 'Contraseña',
                inputPlaceholder: 'Contraseña',
                inputAttributes: {
                    maxlength: 10,
                    autocapitalize: 'off',
                    autocorrect: 'off'
                }
                })
                callback(password)
            }else {
                const { value: password } = await Swal.fire({
                title: 'Reingrese la contraseña',
                input: 'password',
                inputLabel: 'Contraseña Incorrecta',
                inputPlaceholder: 'Contraseña',
                inputAttributes: {
                    maxlength: 10,
                    autocapitalize: 'off',
                    autocorrect: 'off'
                }
                })
                callback(password)
            }
            
            // console.log(callback(password));
            
            
        },
    },
    created() {
        // console.log(this.$route.params.id)
        this.loadEntry()
    },
    watch: {
        id() {
            this.loadEntry()
        },
        showAllPages() {
            this.page = this.showAllPages ? null : 1
        }
    }



}
</script>

<style lang="scss" scoped>

.vue-pdf-embed > div {
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

.app-header {
  padding: 16px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  background-color: #555;
  color: #ddd;
}
.app-content{
    background-color: #ccc;
}



</style>