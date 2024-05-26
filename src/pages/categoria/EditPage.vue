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

        <input type="text" v-model="selectedCategory" />
        <div class="q-mt-md">
          <q-btn color="primary" label="Alterar Nome" @click="updateCategoryName" />
        </div>

      </div>
    </ContainerLink>
  </q-page>
</template>

<script>
import { initializeFirebase } from 'src/bootsie/firebase'
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

    const updateCategoryName = async () => {
      console.log('')
    }

    return {
      categories,
      selectedCategory,
      updateCategoryName
    }
  }
}
</script>
