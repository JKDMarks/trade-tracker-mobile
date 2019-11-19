import React from 'react'
import './App.css'

import { Grid } from 'semantic-ui-react'

function App() {
  return (
    <div className='App'>
      <Grid>
        <Grid.Row centered className='header'>
            <h1>Trade Tracker</h1>
        </Grid.Row>
        <Grid.Row style={{backgroundColor: 'green'}}>

        </Grid.Row>
      </Grid>
    </div>
  )
}

export default App
