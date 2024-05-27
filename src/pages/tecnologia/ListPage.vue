<template>
  <q-page padding>
    <ContainerLink>
      <h3>Lista de Tecnologias</h3>
      <q-table
        title="Tecnologias"
        :rows="technologies"
        :columns="columns"
        row-key="id"
        :loading="isLoading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              {{ props.row.name }}
            </q-td>
            <q-td key="brand" :props="props">
              {{ props.row.brand }}
            </q-td>
            <q-td key="model" :props="props">
              {{ props.row.model }}
            </q-td>
            <q-td key="category" :props="props">
              {{ props.row.category_id.name }}
            </q-td>
            <q-td key="price" :props="props">
              {{ formattedPrice(props.row.price) }}
            </q-td>
            <q-td key="stock" :props="props">
              {{ props.row.stock }}
            </q-td>
            <q-td key="image" :props="props">
              <q-img
                :src="props.row.image"
                :ratio="16/9"
                spinner-color="primary"
                style="max-width: 100px; max-height: 100px;"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
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
      technologies: [],
      isLoading: true,
      columns: [
        { name: 'name', align: 'left', label: 'Nome', field: 'name' },
        { name: 'brand', align: 'left', label: 'Marca', field: 'brand' },
        { name: 'model', align: 'left', label: 'Modelo', field: 'model' },
        { name: 'category', align: 'left', label: 'Categoria', field: 'category' },
        { name: 'price', align: 'left', label: 'Preço', field: 'price', format: val => new Intl.NumberFormat('pt-pt', { style: 'currency', currency: 'MZN' }).format(val) },
        { name: 'stock', align: 'left', label: 'Estoque', field: 'stock' },
        { name: 'image', align: 'center', label: 'Imagem', field: 'image' }
      ],
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
      // You can use Intl.NumberFormat for currency formatting
      return new Intl.NumberFormat('pt-pt', { style: 'currency', currency: 'MZN' }).format(price)
    }
  }
}
</script>

<style scoped>
.q-table {
  width: 100%;
}
</style>
