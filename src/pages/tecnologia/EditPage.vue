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
            <q-td key="actions" :props="props">
              <q-btn
                size="sm"
                color="primary"
                icon="edit"
                @click="editTechnology(props.row)"
              />
              <q-btn
                size="sm"
                color="negative"
                icon="delete"
                @click="deleteTechnology(props.row.id)"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </ContainerLink>
  </q-page>

  <q-dialog v-model="editDialog" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">Editar Tecnologia</div>
      </q-card-section>
      <q-card-section>
        <q-input v-model="editingTechnology.name" label="Nome" />
        <q-input v-model="editingTechnology.brand" label="Marca" />
        <q-input v-model="editingTechnology.model" label="Modelo" />
        <q-select
          v-model="editingTechnology.category_id"
          :options="categories"
          option-value="id"
          option-label="name"
          label="Categoria"
        />
        <q-input v-model="editingTechnology.price" label="Preço" type="number" />
        <q-input v-model="editingTechnology.description" label="Descrição" type="textarea" />
        <q-input v-model="editingTechnology.stock" label="Estoque" type="number" />
        <q-file
          filled
          bottom-slots
          @click="onFileChange"
          v-model="editingTechnology.image"
          label="Imagem"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancelar" @click="editDialog = false" />
        <q-btn flat label="Salvar" color="primary" @click="saveTechnology" />
      </q-card-actions>
    </q-card>
  </q-dialog>
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
        { name: 'image', align: 'center', label: 'Imagem', field: 'image' },
        { name: 'actions', align: 'center', label: 'Ações', field: 'actions' }
      ],
      db: null,
      categories: [],
      editDialog: false,
      editingTechnology: {}
    }
  },
  mounted () {
    initializeFirebase()
      .then(({ db }) => {
        this.db = db
        this.fetchTechnologies()
        this.fetchCategories()
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
    async fetchCategories () {
      try {
        const snapshot = await this.db.collection('categories').get()
        this.categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      }
    },
    editTechnology (technology) {
      this.editingTechnology = { ...technology }
      this.editDialog = true
    },
    async saveTechnology () {
      try {
        await this.db.collection('technologies').doc(this.editingTechnology.id).update(this.editingTechnology)
        this.editDialog = false
        await this.fetchTechnologies()
      } catch (error) {
        console.error('Erro ao salvar tecnologia:', error)
      }
    },
    async deleteTechnology (id) {
      try {
        await this.db.collection('technologies').doc(id).delete()
        await this.fetchTechnologies()
      } catch (error) {
        console.error('Erro ao deletar tecnologia:', error)
      }
    },
    onFileChange (event) {
      this.editingTechnology.image = event.target.files[0]
    }
  }
}
</script>

<style scoped>
.q-table {
  width: 100%;
}
</style>
