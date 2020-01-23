<template>
    <div>
        <v-container>            
        <h1>estamos en cursos</h1>
        <CursosList></CursosList>
        </v-container>
    </div>
</template>

<script>
import CursosList from '../miniComponents/CursosList';
    export default {
        components: {
            CursosList,
        },
    }
</script>

<style scoped>

</style>