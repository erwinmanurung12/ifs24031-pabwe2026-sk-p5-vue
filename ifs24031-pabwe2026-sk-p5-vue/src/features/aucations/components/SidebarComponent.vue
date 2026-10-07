<template>
  <nav aria-label="Menu lelang" class="flex flex-wrap gap-2 bg-indigo-50 px-4 py-2 text-sm font-semibold">
    <RouterLink v-for="[to, t] in [['/','Dashboard Lelang'],['/?me=1','Lelang Saya'],['/users','Daftar Pengguna'],['/profile','Profil Saya']]" :key="to" :to="to"
      class="rounded-lg px-3 py-1 text-indigo-900 hover:bg-indigo-100">{{ t }}</RouterLink>
  </nav>
</template>
