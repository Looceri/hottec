<template>
  <form @submit.prevent="register">
    <div>
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="email" required>
    </div>
    <div>
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required>
    </div>
    <div>
      <button type="submit">Register</button>
    </div>
    <div>
      <button type="button" @click="googleLogin">Register with Google</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { firebaseAuth } from '../boot/firebase.js' // Import your Firebase auth instance
import firebase from 'firebase/compat/app' // Import the firebase app
import 'firebase/auth'

const email = ref('')
const password = ref('')

const register = async () => {
  try {
    await firebaseAuth.createUserWithEmailAndPassword(email.value, password.value)
    // Handle successful registration
  } catch (error) {
    // Handle registration error
  }
}

const googleLogin = async () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  try {
    await firebaseAuth.signInWithPopup(provider)
    // Handle successful Google login
  } catch (error) {
    // Handle Google login error
  }
}
</script>
