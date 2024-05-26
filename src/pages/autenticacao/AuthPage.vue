<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-lg" style="width: 400px">
      <q-card-section>
        <div class="text-h5 text-center">Autenticação</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit">
          <q-input v-model="formData.email"  label="Email" :rules="[(val) => !!val || 'Preencha o email']" />

          <q-input v-model="formData.password" type="password" label="Senha" :rules="[(val) => !!val || 'Preencha a senha']" />

          <div class="q-mt-md">
            <q-btn type="submit" color="primary" label="Entrar" />
            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script type="text/javascript">
import { initializeFirebase } from 'src/boot/firebase'
console.log('asdsadasdasdasd')
console.log(initializeFirebase)
export default {
  name: 'AuthPage',
  data () {
    return {
      formData: {
        email: '',
        password: ''
      },
      firebaseAuth: null
    }
  },
  async created () {
    try {
      const { firebaseAuth } = await initializeFirebase()
      this.firebaseAuth = firebaseAuth
    } catch (error) {
      console.error('Error initializing Firebase:', error)
    }
  },
  methods: {
    async onSubmit () {
      try {
        const userCredential = await this.firebaseAuth.signInWithEmailAndPassword(this.formData.email, this.formData.password)
        console.log('User signed in:', userCredential.user)
      } catch (error) {
        console.error('Error signing in:', error)
      }
    }
  }
}
</script>
