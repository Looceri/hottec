<template>
  <q-page padding>
    <div class="row q-gutter-md">
      <q-card v-for="(technology, index) in technologies" :key="index" class="col-12 col-md-4">
        <q-card-section>
          <q-img
            :src="technology.image"
            :ratio="16/9"
            spinner-color="primary"
            style="max-width: 100%; max-height: 200px;"
          />
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <div class="text-h6">{{ technology.name }}</div>
          <div class="text-subtitle1">Marca: {{ technology.brand }}</div>
          <div class="text-subtitle1">Modelo: {{ technology.model }}</div>
          <div class="text-subtitle1">Categoria: {{ technology.category_id.name }}</div>
          <div class="text-subtitle1">Preço: {{ formattedPrice(technology.price) }}</div>
          <div class="text-subtitle1">Estoque: {{ technology.stock }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <!-- <q-btn flat round icon="shopping_cart" @click="addToCart(technology)">
            Adicionar ao Carrinho
          </q-btn> -->
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { initializeFirebase } from 'src/boot/firebase'

export default {
  data () {
    return {
      technologies: [],
      isLoading: true,
      db: null
    }
  },
  mounted () {
    initializeFirebase()
      .then(({ db }) => {
        this.db = db
        this.fetchTechnologies()
      })
      .catch(error => {
        console.error('Erro ao inicializar o Firebase:', error)
      })
  },
  methods: {
    async fetchTechnologies () {
      try {
        this.isLoading = true
        const snapshot = await this.db.collection('technologies').get()
        this.technologies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        this.isLoading = false
      } catch (error) {
        console.error('Erro ao buscar tecnologias:', error)
        this.isLoading = false
      }
    },
    formattedPrice (price) {
      return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'MZN' }).format(price)
    },
    addToCart (technology) {
      // Implementar a lógica para adicionar a tecnologia ao carrinho
      console.log('Adicionando tecnologia ao carrinho:', technology)
    }
  }
}
</script>

<style scoped>
</style>
