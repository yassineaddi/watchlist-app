<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-title v-if="items.length > 0">My Watchlist ({{ items.length }})</f7-nav-title>
      <f7-nav-title v-else>My Watchlist</f7-nav-title>
    </f7-navbar>

    <f7-block v-if="items.length > 0">
      <f7-row class="margin-bottom" v-for="i in rowCount" :key="i">
        <f7-col v-for="(item, index) in itemCountInRow(i)" :key="item && item.imdbID">
          <div
            class="elevation-1"
            style="position: relative;"
            v-if="item != null"
            @click="$f7router.navigate(`/shows/${item.imdbID}/`, {
            props: {
              index: (i - 1) * itemsPerRow + index,
              __item: item
            }
          })"
          >
            <img class="display-flex col-100" :src="item.Poster" :alt="item.Title">

            <f7-badge
              v-if="item.Seen"
              color="orange"
              style="position: absolute; top: -3px; left: -3px;"
            >&#10004;</f7-badge>
          </div>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block v-else></f7-block>

    <f7-fab position="center-bottom" slot="fixed" href="/shows/search/">
      <f7-icon ios="f7:add" md="material:add"></f7-icon>
    </f7-fab>
  </f7-page>
</template>

<script>
import store from "store";

export default {
  data() {
    return {
      itemsPerRow: 3,
      items: store.get("store") || [],
    };
  },
  computed: {
    rowCount: function() {
      return Math.ceil(this.items.length / this.itemsPerRow);
    }
  },
  mounted: function() {
    this.$f7.on("addItem", (imdbID, Title, Poster) => {
      this.items.push({
        imdbID,
        Title,
        Poster,
        Seen: false
      });
      store.set("store", this.items);
    });
    this.$f7.on("setProp", (index, prop, val) => {
      this.items[index][prop] = val;
      store.set("store", this.items);
    });
    this.$f7.on("removeItem", index => {
      this.items.splice(index, 1);
      store.set("store", this.items);
    });
  },
  methods: {
    itemCountInRow: function(index) {
      let items = this.items.slice(
        (index - 1) * this.itemsPerRow,
        index * this.itemsPerRow
      );
      return items.concat(new Array(this.itemsPerRow - items.length));
    }
  }
};
</script>
