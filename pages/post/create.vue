<script setup lang="ts">
  import type { FormSubmitEvent } from '#ui/types';
import { emailZodSchema } from '@/schemas/emailSchema';
import { ZodError, z } from "zod";

  const toast = useToast()

  const userExist = ref(false)

  const state = reactive({
    email: undefined,
    title: undefined,
    content: undefined
  })

  const postZodSchema = z.object({
    email: z.string().email("Invalid email"),
    title: z.string().min(2).max(50),
    content: z.string().min(2).max(1000)
  })

  type Schema = z.output<typeof postZodSchema>

  const checkAuthorExist = async () => {
    userExist.value = false
    try {
      emailZodSchema.parse({email: state.email})
      console.log('entró al checkAuthorExist')
      
      const {data, error} = await useFetch(`/api/user/${state.email}`)
      console.dir(data.value)
      if(data.value){
        userExist.value = true
      } else {
        userExist.value = false
      }
      
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.issues[0].message)
      }
    }
  }

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    const {data, error} = await useFetch('/api/post', {
      method: 'POST',
      body: {
        title: event.data.title,
        content: event.data.content,
        authorEmail: event.data.email
      }
    })

    state.email = undefined
    state.title = undefined
    state.content = undefined

    toast.add({
      title: "Post created",
    })

    if (error.value) {
      console.dir(error.value)
    } else {
    }
    console.dir(data.value)
  }
</script>

<template>
  <div>
    <h1>Create Post</h1>
    <UForm :schema="postZodSchema" :state="state" @submit="onSubmit">
      <UFormGroup label="Email" name="email" class="mb-4">
        <UInput v-model="state.email" @keyup="checkAuthorExist" />
      </UFormGroup>

      <UFormGroup label="Title" name="title" class="mb-4">
        <UInput v-model="state.title" type="text" />
      </UFormGroup>

      <UFormGroup label="Content" name="content" class="mb-4">
        <UInput v-model="state.content" type="text" />
      </UFormGroup>

      <UButton type="submit" :disabled="!userExist">
        Register
      </UButton>
    </UForm>
  </div>
</template>