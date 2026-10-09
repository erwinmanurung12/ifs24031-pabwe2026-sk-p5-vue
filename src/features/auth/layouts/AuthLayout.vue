<template>
  <main class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div class="mb-6 flex flex-col items-center gap-2">
        <img src="/logo.svg" alt="Logo Delcom" width="48" height="48" />
        <p class="text-lg font-bold text-indigo-700">Delcom</p>
      </div>
      <RouterView />
    </div>
  </main>
</template>
