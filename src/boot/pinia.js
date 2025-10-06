import { createPinia } from 'pinia';
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  const pinia = createPinia();

  const qPlugin = (context) => {
    context.store.$q = app.config.globalProperties.$q;
  };

  pinia.use(qPlugin);
  
  app.use(pinia);
});