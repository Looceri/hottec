<template>
  <div>
    <div>
      <label for="name">Nome:</label>
      <input type="text" id="name" v-model="technology.name">
    </div>
    <div>
      <label for="brand">Marca:</label>
      <input type="text" id="brand" v-model="technology.brand">
    </div>
    <div>
      <label for="model">Modelo:</label>
      <input type="text" id="model" v-model="technology.model">
    </div>
    <div>
      <label for="category">Categoria:</label>
      <select id="category" v-model="technology.category_id">
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>
    <div>
      <label for="price">Preço:</label>
      <input type="number" id="price" v-model="technology.price">
    </div>
    <div>
      <label for="description">Descrição:</label>
      <textarea id="description" v-model="technology.description"></textarea>
    </div>
    <div>
      <label for="image">Imagem:</label>
      <input type="file" id="image" @change="onFileSelected">
    </div>
    <div>
      <label for="stock">Estoque:</label>
      <input type="number" id="stock" v-model="technology.stock">
    </div>
    <!-- Add submit button or other actions here -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      technology: {
        name: '',
        brand: '',
        model: '',
        category_id: '',
        price: '',
        description: '',
        image: null,
        stock: ''
      },
      categories: [] // Fetch categories from your backend API
    }
  },
  methods: {
    onFileSelected (event) {
      this.technology.image = event.target.files[0]
    }
  },
  created () {
    // Fetch categories from your backend API
    // Example using axios:
    // axios.get('/api/categories')
    //  .then(response => {
    //     this.categories = response.data;
    //   })
    //  .catch(error => {
    //     console.error(error);
    //   });
  }
}
</script>
