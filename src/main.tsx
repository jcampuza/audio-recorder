import { render } from 'preact';
import { App } from './components/App';
import './index.css';
import { init } from './lib/state';

init();
render(<App />, document.getElementById('app')!);
