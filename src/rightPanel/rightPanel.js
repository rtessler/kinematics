import React, { Component } from 'react'
import CanvasAnimation from '../components/canvasAnimation'

import './rightPanel.scss'

export default class RightPanel extends Component {

  componentDidMount() {
    
    window.addEventListener('resize', this.resize)
  }

  resize = () => { 

    console.log('resize')
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  render() {

    const { numberOfPoints, circleSizes } = this.props

    return <div className='right-panel'>

              <CanvasAnimation numberOfPoints={numberOfPoints} circleSizes={circleSizes} /> 

          </div>
  }
}