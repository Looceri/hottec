<template>
  <q-page padding>
    <ContainerLink>
      <h3>Registar Categoria</h3>
      <form @submit.prevent="submit">
        <ContainerLink>
          <q-input v-model="categoryName" type="text" placeholder="Enter category name" />
          <div v-if="categoryExists" class="text-red">O nome da categória já existe</div>
          <div v-if="showSuccessMessage" class="text-green">Categoria registada com sucesso</div>
          <div class="q-mt-md">
            <q-btn @click="registerCategory">Registar</q-btn>
          </div>
        </ContainerLink>
      </form>
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
      categoryName: '',
      categoryExists: false,
      showSuccessMessage: false
    }
  },
  computed: {
    categoryRegistered () {
      return this.categoryName !== '' && !this.categoryExists
    }
  },
  methods: {
    async submit () {
      await this.registerCategory()
    },
    async registerCategory () {
      try {
        const currentDate = new Date()
        const { db } = await initializeFirebase()
        const category = {
          id: currentDate.getTime(),
          name: this.categoryName
        }

        const existingCategory = await db.collection('categories')
          .where('name', '==', category.name)
          .get()

        if (existingCategory.empty) {
          const docRef = await db.collection('categories').add(category)
          console.log('Category registered with ID: ', docRef.id)
          this.categoryName = ''
          this.categoryExists = false
          this.showSuccessMessage = true
        } else {
          console.error('Category name already exists')
          this.categoryExists = true
          this.showSuccessMessage = false
        }
      } catch (error) {
        console.error('Error registering category: ', error)
      }
    }
  }
}
</script>
