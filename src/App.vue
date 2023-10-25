<template>
  <nav class="navbar bg-navbar navbar-dark navbar-expand-lg">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">F & F</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="areas">Areas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="activos">Activos</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
.bg-navbar {
  background-color: #263238!important;
  color: #fff!important;
}
thead tr th, .modal-header {
  background-color: #26a69a!important;
  color: #fff!important;
}


</style>
