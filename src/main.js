import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue/es';
import 'ant-design-vue/dist/antd.css';

import tooltip from './plugins/tooltip-directive.js';

const app = createApp(App)
app.use(Antd)
app.directive('tooltip',tooltip);
app.mount('#app')

