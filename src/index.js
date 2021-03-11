import React from 'react'
import { render } from 'react-dom'
import { Provider } from './context/context'
import { App } from './App'
import './index.css'

render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
)
