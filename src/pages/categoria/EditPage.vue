<template>
  <q-page padding>
    <ContainerLink>
      <h3>Editar Categorias</h3>

      <q-select
        filled
        v-model="selectedCategory"
        :options="categories.map(category => ({ label: category.name, value: category.id }))"
        label="Selecione uma categoria"
        @update:model-value="handleCategorySelection"
      />

      <div v-if="selectedCategory">
        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">
              Categoria Selecionada: {{ selectedCategoryName }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-input
              type="text"
              v-model="novoNome"
              label="Novo Nome"
              :value="selectedCategoryName"
            />
            <div v-if="categoryExists" class="text-red q-mt-sm">
              O nome da categoria já existe
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              color="primary"
              label="Alterar Nome"
              @click="updateCategoryName"
              :disable="categoryExists || novoNome === selectedCategoryName"
            />
            <q-btn
              color="negative"
              label="Apagar Categoria"
              @click="deleteCategory"
              :disable="novoNome !== selectedCategoryName"
            />
          </q-card-actions>
        </q-card>
        <div v-if="showSuccessMessage" class="text-green q-mt-md">
          Categoria atualizada com sucesso
        </div>
        <div v-if="showSuccessMessage1" class="text-green q-mt-md">
          Categoria apagada com sucesso
        </div>
      </div>
    </ContainerLink>
  </q-page>
</template>

<script>
import { initializeFirebase } from 'src/boot/firebase'
import ContainerLink from 'src/components/ContainerLink.vue'
import { ref, onMounted } from 'vue'
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

export default {
  components: {
    ContainerLink
  },
  setup () {
    const categories = ref([])
    const selectedCategory = ref(null)
    const selectedCategoryName = ref('') // Armazena o nome da categoria selecionada
    const novoNome = ref('') // Armazena o novo nome da categoria
    const categoryExists = ref(false)
    const showSuccessMessage = ref(false)
    const showSuccessMessage1 = ref(false)

    onMounted(async () => {
      await getCategories()
    })

    // Função para atualizar o nome da categoria e o input quando a categoria é selecionada
    const handleCategorySelection = () => {
      if (selectedCategory.value) {
        const category = categories.value.find(c => c.id === selectedCategory.value.value)
        if (category) {
          selectedCategoryName.value = category.name
          novoNome.value = category.name // Atribui o nome atual ao input
        }
      }
    }

    const updateCategoryName = async () => {
      try {
        const { db } = await initializeFirebase()

        // Verificar se o novo nome já existe
        const existingCategory = await db.collection('categories').where('name', '==', novoNome.value).get()
        if (!existingCategory.empty) {
          categoryExists.value = true
          console.log('Categoria com o mesmo nome já existe.')
          return
        }

        // Encontrar a categoria a ser atualizada pelo ID
        const categoryToUpdate = categories.value.find(category => category.id === selectedCategory.value.value)
        if (categoryToUpdate) {
          // Atualizar o nome da categoria no Firebase
          const categoryRef = doc(db, 'categories', categoryToUpdate.id)
          await updateDoc(categoryRef, { name: novoNome.value })
          showSuccessMessage.value = true
          categoryExists.value = false
          await getCategories() // Atualizar a lista de categorias
          console.log('Nome da categoria atualizado com sucesso.')
        } else {
          console.log('Categoria a ser atualizada não encontrada.')
        }
      } catch (error) {
        console.error('Erro ao atualizar categoria:', error)
      }
    }

    const deleteCategory = async () => {
      try {
        const { db } = await initializeFirebase()
        // Encontrar a categoria a ser apagada pelo ID
        const categoryToDelete = categories.value.find(category => category.id === selectedCategory.value.value)
        console.log('categoryToDelete:', categoryToDelete) // Add this line to check the categoryToDelete object

        if (categoryToDelete) {
          // Apagar a categoria do Firebase
          const categoryRef = doc(db, 'categories', categoryToDelete.id)
          await deleteDoc(categoryRef)
          showSuccessMessage1.value = true
          await getCategories() // Atualizar a lista de categorias
          console.log('Categoria apagada com sucesso.')
        } else {
          console.log('Categoria a ser apagada não encontrada.')
        }
      } catch (error) {
        console.error('Erro ao apagar categoria:', error)
      }
    }

    const getCategories = async () => {
      try {
        const { db } = await initializeFirebase()
        const querySnapshot = await getDocs(collection(db, 'categories'))
        categories.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } catch (error) {
        console.error('Erro ao obter categorias:', error)
      }
    }

    return {
      categories,
      selectedCategory,
      selectedCategoryName, // Adicione o nome da categoria selecionada ao objeto retornado
      novoNome,
      categoryExists,
      showSuccessMessage,
      showSuccessMessage1,
      updateCategoryName,
      deleteCategory,
      handleCategorySelection
    }
  }
}
</script>
