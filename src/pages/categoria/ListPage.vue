<template>
  <q-page padding>
    <ContainerLink>
      <h3>Listar Categorias</h3>
      <ul>
        <li v-for="category in categories" :key="category.name">
          <h4>
            {{ category.name }}
          </h4>
        </li>
      </ul>
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
      categories: []
    }
  },
  async created () {
    try {
      const { db } = await initializeFirebase()
      const categoriesSnapshot = await db.collection('categories').get()
      this.categories = categoriesSnapshot.docs.map(doc => doc.data())
    } catch (error) {
      console.error('Error fetching categories: ', error)
    }
  }
}
</script>
