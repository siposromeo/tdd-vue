<template>
  <div>
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      :autocomplete="id"
      class="form-control"
      :class="{'is-invalid': help}"
      v-model="modelValue"
      @input="$emit('update:model-value', modelValue)"
      :type="type"
    />
    <div id="error" class="invalid-feedback" v-if="help">{{ help.message }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  label: String,
  id: String,
  help: Object,
  type: String
})
const modelValue = ref("");

</script>
