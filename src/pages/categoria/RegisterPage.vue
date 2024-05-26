<template>
  <div>
    <Container>
      <input v-model="categoryName" type="text" placeholder="Enter category name" />
      <button @click="registerCategory">Register Category</button>
    </Container>
  </div>
</template>

<script>
import { initializeFirebase } from 'rc/boot/firebase'
import Container from 'rc/components/ContainerLink.vue'

export default {
  components: { Container },
  data () {
    return {
      categoryName: ''
    }
  },
  methods: {
    async registerCategory () {
      try {
        const { db } = await initializeFirebase()
        const category = {
          name: this.categoryName
        }

        const existingCategory = await db.collection('categories')
          .where('name', '==', category.name)
          .get()

        if (existingCategory.empty) {
          const docRef = await db.collection('categories').add(category)
          console.log('Category registered with ID: ', docRef.id)
          this.categoryName = ''
        } else {
          console.error('Category name already exists')
        }
      } catch (error) {
        console.error('Error registering category: ', error)
      }
    }
  }
}
</script>
