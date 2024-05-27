import firebase from 'firebase/compat/app'

import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDDtYvK-DPwZW-ncayfVpUOz4cgD6vi0B0',
  authDomain: 'hottec-a0f76.firebaseapp.com',
  projectId: 'hottec-a0f76',
  storageBucket: 'hottec-a0f76.appspot.com',
  messagingSenderId: '469791663937',
  appId: '1:469791663937:web:e8e2daabea79ef9e0423c0'
}

export const initializeFirebase = () => {
  return new Promise((resolve, reject) => {
    const firebaseApp = firebase.initializeApp(firebaseConfig)
    console.log('Firebase App Initialized:', firebaseApp)

    const db = firebaseApp.firestore()
    console.log('Firebase Firestore Initialized:', db)

    const storage = firebaseApp.storage()
    console.log('Firebase Storage Initialized:', storage)

    if (firebaseApp && db) {
      resolve({ firebaseApp, db, storage })
    } else {
      reject(new Error('Firebase initialization failed'))
    }
  })
}
