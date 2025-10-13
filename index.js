import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './src/store/cart.js';

registerRootComponent(App);
<Provider store={store}>
  <App />
</Provider>