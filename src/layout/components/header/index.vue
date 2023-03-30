<template>
  <div w-full flex>
    <div flex-1 flex items-center>
      <!-- <MenuCollapse /> -->
      <!-- <BreadCrumb ml-1 /> -->
    </div>
    <div flex-1><HeadMenu /></div>
    <div flex-1 flex items-center justify-end pr-2>
      <ThemeMode />
      <!-- <GithubSite /> -->
      <FullScreen />
      <UserAvatar />
    </div>
  </div>
</template>

<script setup>
import BreadCrumb from './components/bread-crumb.vue'
import MenuCollapse from './components/menu-collapse.vue'
import FullScreen from './components/full-screen.vue'
import UserAvatar from './components/user-avatar.vue'
import GithubSite from './components/github-site.vue'
import ThemeMode from './components/theme-mode.vue'
import HeadMenu from './components/head-menu.vue'
</script>
