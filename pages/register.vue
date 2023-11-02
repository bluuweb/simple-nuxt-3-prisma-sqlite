<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { z } from 'zod';
import { registerZodSchema } from "~/schemas/registerSchema";

type Schema = z.output<typeof registerZodSchema>

const state = reactive({
  email: undefined,
  name: undefined
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  try {
    const {data} = await useFetch('/api/user', {
      method: 'POST',
      body: {
        email: event.data.email,
        name: event.data.name
      }
    })
    console.log(data.value)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <UForm :schema="registerZodSchema" :state="state" @submit="onSubmit">
    <UFormGroup label="Name" name="name" class="mb-4">
      <UInput v-model="state.name" type="text" />
    </UFormGroup>

    <UFormGroup label="Email" name="email" class="mb-4">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton type="submit">
      Register
    </UButton>
  </UForm>
</template>

