<template>
    <div class="entry-container mb-3 pointer p-2" @click="$router.push({ name: 'doc', params: { id: doc.id } })">
        <!-- Titulo -->
        <div class="doc-title d-flex">
            <span class="text-success fs-5 fw-bold">{{ day }}</span>
            <span class="mx-1 fs-5">{{ month }}</span>
            <span class="mx-2 fw-light">{{ yearDay }}</span>
        </div>

        <div class="doc-description">
            {{ shortText }}
        </div>
    </div>
</template>

<script>
import getDayMonthYear from '../helpers/getDayMonthYear'

export default {
    props: {
        doc: {
            type: Object,
            required: true
        }
    },

    computed: {
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
        },
        shortText() {
            return (this.doc.file.length > 39)
                ? decodeURIComponent(this.doc.file.substring(39))
                : this.doc.file.name

        },
    }
}
</script>

<style lang="scss" scoped>
.entry-container {
    border-bottom: 1px solid #2c3e50;
    transition: 0.2s all ease-in;

    &:hover {
        background-color: lighten($color: grey, $amount: 45);
        transition: 0.2s all ease-in;
    }

    .entry-description {
        font-size: 12px;
    }
}
</style>