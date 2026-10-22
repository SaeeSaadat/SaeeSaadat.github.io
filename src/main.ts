import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const target = document.getElementById('app')!
target.replaceChildren() // drop the static crawler summary from index.html
mount(App, { target })
