<template>
  <f7-page>
    <f7-navbar>
      <f7-link icon-if-ios="f7:close" icon-if-md="material:close" back></f7-link>
    </f7-navbar>
    <f7-subnavbar :inner="false">
      <f7-searchbar custom-search @searchbar:search="onSearch"></f7-searchbar>
    </f7-subnavbar>

    <f7-block>
      <f7-row class="margin-bottom" v-for="i in rowCount" :key="i">
        <f7-col v-for="item in itemCountInRow(i)" :key="item && item.imdbID">
          <div
            class="elevation-1"
            style="position: relative;"
            v-if="item != null"
            @click="$f7router.navigate(`/shows/${item.imdbID}/`)"
          >
            <img class="display-flex col-100" :src="item.Poster" :alt="item.Title">
          </div>
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script>
import fetch from "node-fetch";

export default {
  data() {
    return {
      itemsPerRow: 3,
      items: [],
      timeout: null,
      _: false
    };
  },
  computed: {
    rowCount: function() {
      return Math.ceil(this.items.length / this.itemsPerRow);
    }
  },
  methods: {
    itemCountInRow: function(index) {
      let items = this.items.slice(
        (index - 1) * this.itemsPerRow,
        index * this.itemsPerRow
      );
      return items.concat(new Array(this.itemsPerRow - items.length));
    },
    // Listen for keystroke events
    onSearch(searchbar, query, previousQuery) {
      if (query == null || query.trim().length <= 2) {
        return;
      }
      this._ = false;
      this.$f7.preloader.show();
      this.items = [];
      // Clear the timeout if it has already been set.
      // This will prevent the netwrok call from executing
      // if it has been less than 800ms
      clearTimeout(this.timeout);
      // Make a new timeout set to go off in 800ms
      this.timeout = setTimeout(() => {
        this._ = true;
        this.callOmdbAPI(query);
        this.$f7.preloader.hide();
      }, 800);
    },
    callOmdbAPI(s, p) {
      if (!this._) {
        return;
      }
      p = typeof p !== "undefined" ? p : 1;
      fetch(
        `http://www.omdbapi.com/?apikey=${
          this.$config.apikey
        }&s=${s.trim()}&page=${p}`
      )
        .then(res => res.json())
        .then(json => {
          if (json !== null && Array.isArray(json.Search)) {
            json.Search.forEach(item => {
              if (item.Poster != "N/A") {
                this.items.push(item);
              }
            });
            if (++p <= Math.ceil(json.totalResults / 10)) {
              this.callOmdbAPI(s, p);
            }
          }
        });
    }
  }
};
</script>