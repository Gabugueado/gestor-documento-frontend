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
                <template v-if="isLoading">
                    Cargando...
                </template>
                <template v-else>
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

                        Mostrar todas las páginas
                    </label>
                </template>
            </div>

            <div class="app-content">
                <vue-pdf-embed 
                    v-show="doc.base64_content"
                    ref="pdfRef" 
                    :source="doc.base64_content" 
                    :page="page"
                    @password-requested="handlePasswordRequest"
                    @rendered="handleDocumentRender"
                />
            </div>
        </div>

    </template>

    <Fab icon="fa-save" @on:click="saveDoc" />
</template>

<script>
import { defineAsyncComponent, ref } from 'vue'
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
        Fab: defineAsyncComponent(() => import('../components/FabComponent.vue')), //lazy load
        VuePdfEmbed,
    },
    data() {
        return {
            doc: ref({
                title: '',
                content: '',
                file: null,
                base64_content: null,
                created_at: new Date().getTime()
            }),
            isLoading: true,
            page: null,
            pageCount: 1,
            showAllPages: true,
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
        // carga vista del documento
        async loadDoc() {
            if (this.id === 'new') {
                this.doc = {
                    title: '',
                    content: '',
                    file: null,
                    base64_content: null,
                    created_at: new Date().getTime()
                }
            } else {
                this.doc = this.getDocById(this.id)
                const { base64_content } = await this.loadFiles(this.id)
                this.doc.base64_content = `data:application/pdf;base64,${base64_content}`
                
                
                if (this.doc.file.includes(".docx")) console.log('type docx')

                if (this.doc.file.includes(".txt")) console.log('type txt')
                
                if (!this.doc.id) return this.$router.push({ name: 'no-doc' })
            }
            console.log(this.doc.base64_content);

            // this.doc = doc
        },

        async saveDoc() {

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
            if (!file) {
                this.doc.file = null
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
            if (!retry) {
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
            } else {
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

            


        },
    },
    created() {
        this.loadDoc()
    },
    watch: {
        id() {
            this.loadDoc()
        },
        showAllPages() {
            this.page = this.showAllPages ? null : 1
        }
    }



}
</script>

<style lang="scss" scoped>
.vue-pdf-embed>div {
    margin-bottom: 8px;
    box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

.app-header {
    padding: 16px;
    box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
    background-color: #555;
    color: #ddd;
}

.app-content {
    background-color: #ccc;
}


input[type="file"] {
    display: none;
}

.custom-file-upload {
    border: 1px solid #ccc;
    border-radius: 4px;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    background: #4A8FED;
    padding: 10px;
    color: #fff;
    font: inherit;
    font-size: 16px;
    font-weight: bold;
}
</style>