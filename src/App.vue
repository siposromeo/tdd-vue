<template>
    <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">Hogy MIIIII??</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <router-link to="/" class="nav-link active" aria-current="page">Home</router-link>
            <router-link to="/signup" class="nav-link">Sign Up</router-link>
          </div>
        </div>
      </div>
    </nav>
    <div class="pt-5">
      <router-view></router-view>
    </div>
</template>
