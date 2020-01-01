<template>
    <div>
        <historialPagoPaypal></historialPagoPaypal>
        <historialTareas></historialTareas>
    </div>
</template>

<script>
import historialPagoPaypal from '../miniComponents/HistorialComponent/historialPagoPaypal';
import historialTareas from '../miniComponents/HistorialComponent/historialTareas';

    export default {
        components: {
            historialPagoPaypal,
            historialTareas,
        },
    }
</script>

<style  scoped>

</style>