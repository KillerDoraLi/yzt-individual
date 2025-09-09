import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import { Toast } from 'vant';

const app = createApp(App);
app.use(createPinia());

app.use(Toast);
app.use(router).mount('#app');
