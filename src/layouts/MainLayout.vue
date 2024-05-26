<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Hottec App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Opções
        </q-item-label>

        <q-expansion-item
          group
          icon="add"
          label="Criar"
        >
          <EssentialLink
            v-for="link in linksList.create"
            :key="link.title"
            v-bind="link"
          />
        </q-expansion-item>

        <q-expansion-item
          group
          icon="edit"
          label="Editar"
        >
          <EssentialLink
            v-for="link in linksList.edit"
            :key="link.title"
            v-bind="link"
          />
        </q-expansion-item>

        <q-expansion-item
          group
          icon="list"
          label="Listar"
        >
          <EssentialLink
            v-for="link in linksList.list"
            :key="link.title"
            v-bind="link"
          />
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

defineOptions({
  name: 'MainLayout'
})

const linksList = {
  create: [
    {
      title: 'Categoria',
      icon: 'folder',
      link: '/criar_categoria'
    },
    {
      title: 'Tecnologia',
      icon: 'code',
      link: '/criar_tecnologia'
    }
  ],
  edit: [
    {
      title: 'Categoria',
      icon: 'folder',
      link: '/editar_categoria'
    },
    {
      title: 'Tecnologia',
      icon: 'code',
      link: '/editar_tecnologia'
    }
  ],
  list: [
    {
      title: 'Categoria',
      icon: 'folder',
      link: '/listar_categoria'
    },
    {
      title: 'Tecnologia',
      icon: 'code',
      link: '/listar_tecnologia'
    }
  ]
}

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
