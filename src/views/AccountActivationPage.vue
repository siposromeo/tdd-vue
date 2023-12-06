<template>
    <div data-testid="activation-page">
        <div class="alert alert-success mt-3" v-if="success">
            Account is activated
        </div>
        <div class="alert alert-danger mt-3" v-else>
            Activation failure
        </div>
    </div>
</template>

<script setup>
import Axios from 'axios';
import { onMounted, ref } from 'vue'

const responseData = ref(null)
const success = ref(false)

const props = defineProps({
    token: String
})

onMounted(async () => {
    try {
        responseData.value = await Axios.post(`/api/users/token/${props.token}`)
        if (responseData.value.status === 200) {
            success.value = true
        }
    } catch (error) {
        // console.log(error.response.data.message)    // -> Activation failure
        success.value = false
    }
})
</script>