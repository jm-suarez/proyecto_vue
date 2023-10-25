import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import HomePage from './components/pages/HomePage.vue';
import AreaPage from './components/pages/AreaPage.vue';
import ActivoPage from './components/pages/ActivoPage.vue';


const routes = [
    {
        path: '/areas',
        name: 'Areas',
        component: AreaPage
    },
    {
        path: '/activos',
        name: 'Activos',
        component: ActivoPage
    },
    { path: '/', component: HomePage }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

createApp(App).use(router).mount('#app');
