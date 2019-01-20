<template>
  <!-- App -->
  <f7-app :params="f7params">
    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main View -->
    <f7-view id="main-view" url="/" main></f7-view>

  </f7-app>
</template>

<script>
// Import Routes
import routes from "./routes.js";

export default {
  data() {
    return {
      // Framework7 parameters here
      f7params: {
        id: "com.myapp.watchlist", // App bundle ID
        name: "watchlist-app", // App name
        theme: "auto", // Automatic theme detection
        // App routes
        routes: routes
      }
    };
  }
};
</script>
