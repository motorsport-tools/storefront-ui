<script setup>
import { ref } from 'vue'

const searchOpen = ref(false)
const mobileMenuOpen = ref(false)

const closeSearch = () => {
  searchOpen.value = false
}

const handleKeydown = (e) => {
  if (e.key === 'Escape') closeSearch()
}
</script>

<template>
  <header @keydown.esc="closeSearch">
    <!-- Top Dark Bar -->
    <div class="bg-[#222222] text-white text-sm px-4 py-2 flex justify-between items-center">
      <div>
        <span class="mr-4 cursor-pointer hover:underline transition">🇬🇧 EN</span>
      </div>
      <NuxtLink to="/account" class="flex items-center space-x-1 hover:underline transition">
        <span>Account</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
               1.79-4 4 1.79 4 4 4zm0 2c-2.67 
               0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </NuxtLink>
    </div>

    <!-- Main White Header -->
    <div class="bg-white border-b">
      <div class="max-w-7xl mx-auto flex items-center justify-between p-4">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center">
          <img src="/img/motorsport-tools-logo.svg" alt="Logo" class="h-8" />
        </NuxtLink>

        <!-- Nav (desktop) -->
        <nav class="hidden lg:flex space-x-6 text-sm font-bold uppercase text-black">
          <NuxtLink to="/escort" class="hover:underline transition">Escort</NuxtLink>
          <NuxtLink to="/parts" class="hover:underline transition">Parts</NuxtLink>
          <NuxtLink to="/workshop" class="hover:underline transition">Workshop</NuxtLink>
          <NuxtLink to="/specials" class="hover:underline transition">Specials</NuxtLink>
          <NuxtLink to="/rewards" class="hover:underline transition">Rewards</NuxtLink>
        </nav>

        <!-- Icons -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <button @click="searchOpen = true" aria-label="Search" class="hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 
                   104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>

          <NuxtLink to="/wishlist" aria-label="Wishlist" class="hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 
                   12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 
                   3.41 1.01 4.13 2.44h1.74C13.09 
                   5.01 14.76 4 16.5 4 19 4 21 6 
                   21 8.5c0 3.78-3.4 6.86-8.55 
                   11.54L12 21.35z" />
            </svg>
          </NuxtLink>

          <NuxtLink to="/cart" aria-label="Cart" class="hover:text-gray-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 
                   22 7 22s2-.9 2-2-.9-2-2-2zm10 
                   0c-1.1 0-1.99.9-1.99 2S15.9 22 
                   17 22s2-.9 2-2-.9-2-2-2zM7.16 
                   14h9.72c.75 0 1.41-.41 
                   1.75-1.03l3.58-6.49a1 1 0 
                   00-.87-1.48H5.21L4.27 2H1v2h2l3.6 
                   7.59-1.35 2.45C4.52 14.37 5.48 
                   16 7.16 16z" />
            </svg>
          </NuxtLink>

          <!-- Mobile Menu -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden text-black">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Full Search Overlay -->
    <div v-if="searchOpen" class="fixed inset-0 bg-white z-50 flex items-start p-6 shadow-lg">
      <div class="w-full max-w-4xl mx-auto relative">
        <input
          autofocus
          type="text"
          placeholder="Search..."
          class="w-full border border-gray-300 rounded-md p-4 text-lg focus:outline-none focus:ring"
        />
        <button @click="closeSearch" class="absolute right-4 top-4 text-gray-500 hover:text-black transition">
          ✕
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Optional: slide down effect */
</style>