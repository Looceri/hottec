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
        <h6>Categoria Selecionada: {{ novoNome }}</h6>

        <q-input type="text" v-model="novoNome" />
        <div class="q-mt-md">
          <q-btn color="primary" label="Alterar Nome" @click="updateCategoryName" />
          <q-btn color="negative" label="Apagar Categoria" @click="deleteCategory" />
        </div>
        <div v-if="categoryExists" class="text-red">O nome da categória já existe</div>
        <div v-if="showSuccessMessage" class="text-green">Categoria actualizada com sucesso</div>
        <div v-if="showSuccessMessage1" class="text-green">Categoria apagado com sucesso</div>
      </div>
    </ContainerLink>
  </q-page>
</template>

<script>
import { initializeFirebase } from 'src/boot/firebase'
import ContainerLink from 'src/components/ContainerLink.vue'
import { ref, onMounted, watch } from 'vue'
import { collection, getDocs } from 'firebase/firestore'

export default {
  components: {
    ContainerLink
  },
  setup () {
    const categories = ref([])
    const selectedCategory = ref(null)
    const novoNome = ref(null)
    const showSuccessMessage = ref(null)
    const showSuccessMessage1 = ref(null)

    watch(selectedCategory, (newValue) => {
      novoNome.value = newValue
    })

    onMounted(async () => {
      const { db } = await initializeFirebase()
      const querySnapshot = await getDocs(collection(db, 'categories'))
      categories.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
    const updateCategoryName = async () => {
      try {
        const { db } = await initializeFirebase()
        const category = {
          name: selectedCategory.value
        }
        let existingCategory = await db.collection('categories')
          .where('name', '==', novoNome.value) // Use novoNome.value instead of novoNome
          .get()
        if (!existingCategory.empty) {
          // Category with the same name already exists
          console.log('Category with the same name already exists')
          return
        }
        existingCategory = await db.collection('categories')
          .where('name', '==', category.name)
          .get()

        // Update the category name in the database
        await db.collection('categories').doc(existingCategory.docs[0].id).update({
          name: novoNome.value
        })
        showSuccessMessage.value = true
        showSuccessMessage1.value = null

        const querySnapshot = await getDocs(collection(db, 'categories'))
        categories.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        console.log('Category name updated successfully')
      } catch (error) {
        console.error('Error registering category: ', error)
      }
    }
    const deleteCategory = async () => {
      try {
        const { db } = await initializeFirebase()
        const category = {
          name: selectedCategory.value
        }
        const existingCategory = await db.collection('categories')
          .where('name', '==', category.name)
          .get()

        if (existingCategory.empty) {
          // Category does not exist
          console.log('Category does not exist')
          return
        }

        // Delete the category from the database
        await db.collection('categories').doc(existingCategory.docs[0].id).delete()
        showSuccessMessage1.value = true
        showSuccessMessage.value = null

        const querySnapshot = await getDocs(collection(db, 'categories'))
        categories.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

        console.log('Category deleted successfully')
      } catch (error) {
        console.error('Error deleting category: ', error)
      }
    }

    return {
      categories,
      novoNome,
      selectedCategory,
      updateCategoryName,
      showSuccessMessage,
      showSuccessMessage1,
      deleteCategory
    }
  }
}
</script>
