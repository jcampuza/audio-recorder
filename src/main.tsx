import { render } from 'preact';
import { App } from './app';
import './index.css';
import { init } from './state';

render(<App />, document.getElementById('app')!);
init();
