<template>
  <f7-page>
    <f7-navbar>
      <f7-link icon-if-ios="f7:arrow_left" icon-if-md="material:arrow_back" back></f7-link>
      <f7-nav-title>{{ Title }}</f7-nav-title>
    </f7-navbar>

    <f7-block>
      <f7-row>
        <f7-col></f7-col>
        <f7-col>
          <img class="display-flex col-100" :src="Poster" :alt="Title">
        </f7-col>
        <f7-col></f7-col>
      </f7-row>
    </f7-block>

    <f7-block-title>{{ Title }}</f7-block-title>
    <f7-block strong>
      <p>{{ Plot }}</p>
      <f7-block-footer>
        <star-rating
          :increment="0.1"
          :rating="imdbRating"
          :read-only="true"
          :show-rating="false"
          :star-size="20"
        ></star-rating>
      </f7-block-footer>
    </f7-block>

    <f7-fab
      position="right-bottom"
      slot="fixed"
      color="green"
      @click="addItem"
      v-if="typeof index === 'undefined'"
    >
      <f7-icon ios="f7:add" md="material:add"></f7-icon>
    </f7-fab>
    <div v-else>
      <f7-fab position="right-top" slot="fixed" color="red" @click="removeItem">
        <f7-icon ios="f7:trash" md="material:delete"></f7-icon>
      </f7-fab>
      <f7-block>
        <f7-button outline round big v-if="!item.Seen" @click="setProp('Seen', true)">
          <f7-icon ios="f7:eye_fill" md="material:visibility"></f7-icon>
        </f7-button>
        <f7-button outline round big v-else @click="setProp('Seen', false)">
          <f7-icon ios="f7:eye_off" md="material:visibility_off"></f7-icon>
        </f7-button>
      </f7-block>
    </div>
  </f7-page>
</template>
<script>
import fetch from "node-fetch";
import StarRating from "vue-star-rating";
import store from "store";

export default {
  components: {
    StarRating
  },
  props: {
    imdbID: String,
    index: Number,
    __item: Object
  },
  data() {
    return {
      Title: null,
      Poster: null,
      Plot: null,
      imdbRating: null,
      item: this.__item,
    };
  },
  created() {
    fetch(
      `http://www.omdbapi.com/?apikey=${this.$config.apikey}&i=${
        this.$f7route.params.imdbID
      }`
    )
      .then(res => res.json())
      .then(json => {
        if (json.Response == "True") {
          this.Title = json.Title;
          this.Poster = json.Poster;
          this.Plot = json.Plot;
          this.imdbRating = parseFloat(json.imdbRating) / 2;
        }
      });
  },
  methods: {
    addItem() {
      this.$f7.emit('addItem', this.$f7route.params.imdbID, this.Title, this.Poster);
      this.$f7.toast
        .create({
          text: `'${this.Title}' was added!`,
          position: "top",
          closeTimeout: 2 * 1000
        })
        .open();
      this.$f7router.navigate("/");
    },
    setProp(prop, val) {
      this.item[prop] = val;
      this.$f7.emit('setProp', this.index, prop, val);
    },
    removeItem() {
      this.$f7.emit('removeItem', this.index);
      this.$f7.toast
        .create({
          text: `'${this.Title}' was removed!`,
          position: "top",
          closeTimeout: 2 * 1000
        })
        .open();
      this.$f7router.navigate("/");
    }
  }
};
</script>