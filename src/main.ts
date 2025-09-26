import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';

import Vant from 'vant';
import 'vant/lib/index.css';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vant);
app.use(Antd);

app.mount('#app');
