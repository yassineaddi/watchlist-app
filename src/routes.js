import HomePage from './pages/home.vue';
import SearchPage from './pages/shows-search.vue';
import ShowPage from './pages/show.vue';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/shows/search/',
    component: SearchPage
  },
  {
    path: '/shows/:imdbID/',
    component: ShowPage
  }
];
