<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import Input from '../components/Input.vue'

const username = ref('')
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')
const responseData = ref(null)
const signUpSuccess = ref(false)
const errors = ref({})

const isDisabled = computed(() => {
  if (!password.value || !passwordRepeat.value) return true
  return password.value !== passwordRepeat.value
})

const hasPasswordMismatch = computed(() => {
  return password.value !== passwordRepeat.value
})

const submit = async () => {
  errors.value = {}
  let newUser = {
    username: username.value,
    email: email.value,
    password: password.value
  }
  try {
    responseData.value = await axios.post('/api/users', newUser)
    signUpSuccess.value = true
  } catch (error) {
    if (error.response.status === 400) {
      errors.value = error.response.data.message
      signUpSuccess.value = false
    }
  }
}

watch(username, (currentValue, oldValue) => {
  if (currentValue === '') {
    errors.value.username = { message: "Please add a username" }
  } else {
    delete errors.value.username
  }
});

</script>
<template>
  <div data-testid="signup-page">
    <form id="form-sign-up" v-show="!signUpSuccess">
      <h2>Sign Up</h2>
      <Input id="username" label="Username" :help="errors.username" v-model="username" />

      <Input id="e-mail" label="E-mail" :help="errors.email" v-model="email" />

      <Input id="password" label="Password" :help="errors.password" v-model="password" type="password" />

      <Input id="password-repeat" label="Password Repeat"
        :help="hasPasswordMismatch ? { message: 'Nem ugyanaz a jelszo' } : null" v-model="passwordRepeat" type="password" />
      <br>
      <button class="btn btn-primary" :disabled="isDisabled" @click.prevent="submit">Sign Up</button>
    </form>
  </div>

  <div id="info" class="alert alert-success" v-show="signUpSuccess">
    Please check your e-mail to activate your account
  </div>

  <div v-if="responseData">
    <p>Testing: {{ responseData.data }}</p>
  </div>
</template>


