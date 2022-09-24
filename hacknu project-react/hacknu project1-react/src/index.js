import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import './style.css'
import Main from './views/main'

const App = () => {
  return (
    <Router>
      <div>
        <Route component={Main} exact path="/main" />
      </div>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
