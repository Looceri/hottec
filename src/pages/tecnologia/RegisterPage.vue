<template>
  <q-page padding>
    <ContainerLink>
      <h3>Registrar Tecnologias</h3>
      <div>
        <q-input v-model="technology.name" label="Nome" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.brand" label="Marca" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.model" label="Modelo" />
        <div class="q-mt-md"></div>
        <q-select v-model="technology.category_id" :options="categories" option-value="id" option-label="name" label="Categoria" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.price" label="Preço" type="number" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.description" label="Descrição" type="textarea" />
        <div class="q-mt-md"></div>
        <q-input v-model="technology.stock" label="Estoque" type="number" />
        <div class="q-mt-md"></div>
        <q-file filled bottom-slots @click="onFileChange" v-model="technology.image" label="Imagem" />
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
        image: null, // Use null for the image initially
        stock: ''
      },
      categories: [],
      db: null, // Store the database instance
      storage: null // Store the storage instance
    }
  },
  methods: {
    onFileChange (event) {
      this.technology.image = event.target.files[0]
    },
    async registerTechnology () {
      // Validação de campos obrigatórios
      const hasRequiredFields = Object.values(this.technology).every(field => field !== '' && field !== null)
      if (!hasRequiredFields || !this.technology.image) {
        alert('Por favor, preencha todos os campos obrigatórios.')
        return
      }

      try {
        // Upload da imagem
        const storageRef = this.storage.ref(`technologies/${this.technology.image.name}`)
        const uploadTaskSnapshot = await storageRef.put(this.technology.image)
        const imageUrl = await uploadTaskSnapshot.ref.getDownloadURL()

        // Atualiza a URL da imagem
        this.technology.image = imageUrl

        // Adiciona a tecnologia ao Firestore
        await this.db.collection('technologies').add(this.technology)

        alert('Tecnologia registrada com sucesso!')

        // Limpa os campos do formulário
        this.technology = {
          name: '',
          brand: '',
          model: '',
          category_id: '',
          price: '',
          description: '',
          image: null,
          stock: ''
        }
      } catch (error) {
        console.error('Erro ao registrar tecnologia:', error)
        alert('Erro ao registrar tecnologia. Por favor, tente novamente.')
      }
    }
  },
  async mounted () {
    try {
      const { db, storage } = await initializeFirebase()
      this.db = db
      this.storage = storage

      const categoriesSnapshot = await db.collection('categories').get()
      this.categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Erro ao buscar categorias: ', error)
    }
  }
}
</script>
