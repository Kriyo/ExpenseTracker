import React from 'react'
import { render } from 'react-dom'

import { SpeechProvider } from '@speechly/react-client'
import { Provider } from './context/context'
import { App } from './App'
import './index.css'

render(
  <SpeechProvider appId="52c25600-018f-46ec-96aa-b2494aa76a2d" language="en-US">
    <Provider>
      <App />
    </Provider>
  </SpeechProvider>,
  document.getElementById('root')
)
