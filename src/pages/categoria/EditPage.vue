<template>
  <q-page padding>
    <ContainerLink>
      <h3>Editar Categorias</h3>
      <select v-model="selectedCategory">
        <option v-for="category in categories" :key="category.name" :value="category.name">
          {{ category.name }}
        </option>
      </select>
      <div v-if="selectedCategory">
        <h6>Categoria Selecionada: {{ selectedCategory }}</h6>
        <!-- Add more content or actions based on the selected category -->
      </div>
    </ContainerLink>
  </q-page>
</template>

<script>
import { initializeFirebase } from 'src/boot/firebase'
import ContainerLink from 'src/components/ContainerLink.vue'
import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'

export default {
  components: {
    ContainerLink
  },
  setup () {
    const categories = ref([])
    const selectedCategory = ref(null)

    onMounted(async () => {
      const { db } = await initializeFirebase()
      const querySnapshot = await getDocs(collection(db, 'categories'))
      categories.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })

    return {
      categories,
      selectedCategory
    }
  }
}
</script>
