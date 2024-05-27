<template>
  <q-page padding>
    <ContainerLink>
      <h3>Registar Tecnologias</h3>
      <div>
        <q-input v-model="technology.name" label="Nome" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.brand" label="Marca" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.model" label="Modelo" />
        <div class="q-mt-md"></div>
        <q-select v-model="technology.category_id" :options="categories" option-value="id" option-label="name"
          label="Categoria" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.price" label="Preço" type="number" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.description" label="Descrição" type="textarea" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.stock" label="Estoque" type="number" />
        <div class="q-mt-md"></div>
        <q-file filled bottom-slots v-model="technology.image" label="Label" counter max-files="12">
          <template v-slot:before>
            <q-icon name="folder_open" />
          </template>
          <template v-slot:append>
            <q-btn round dense flat icon="add" @click.stop.prevent />
          </template>
        </q-file>
        <div class="q-mt-md"></div>
        <q-btn label="Registrar" @click="registerTechnology" />
      </div>
    </ContainerLink>
  </q-page>
</template>

<script>
import { initializeFirebase } from 'src/boot/firebase'
import ContainerLink from 'src/components/ContainerLink.vue'

export default {
  components: { ContainerLink },
  data () {
    return {
      technology: {
        name: '',
        brand: '',
        model: '',
        category_id: '',
        price: '',
        description: '',
        image: null,
        stock: ''
      },
      categories: [] // Fetch categories from your backend API
    }
  },
  methods: {
    async mounted () {
      try {
        const { db } = await initializeFirebase()
        console.log('Firebase database instance:', db)

        const categoriesSnapshot = await db.collection('categories').get()
        console.log('Categories snapshot:', categoriesSnapshot)

        this.categories = categoriesSnapshot.docs.map(doc => doc.data())
        console.log('Categories:', this.categories)

        if (this.categories.length === 0) {
          console.log('The categories array is empty.')
        } else {
          console.log('The categories array is not empty.')
        }
      } catch (error) {
        console.error('Error fetching categories: ', error)
      }
    },
    async registerTechnology () {
      if (!this.technology.name || !this.technology.brand || !this.technology.model || !this.technology.category_id ||
      !this.technology.price || !this.technology.description || !this.technology.stock || !this.technology.image) {
        console.error('All fields are required.')
        return
      }

      const { db, storage } = await initializeFirebase()
      const storageRef = storage.ref(`technologies/${this.technology.image.name}`)
      const uploadTask = storageRef.put(this.technology.image)

      await uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          this.technology.image = url
        })
        .catch(error => {
          console.error('Error uploading image:', error)
        })

      db.collection('technologies').add(this.technology)
        .then(docRef => {
          console.log('Technology registered successfully:', docRef.id)
        })
        .catch(error => {
          console.error('Error registering technology:', error)
        })
    }
  }
}
</script>
