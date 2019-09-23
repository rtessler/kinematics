import React, { Component } from 'react'
import CanvasAnimation from '../components/canvasAnimation'

import './rightPanel.scss'

export default class RightPanel extends Component {

  constructor(props) {

    super(props)
  }

  componentDidMount() {
    
    window.addEventListener('resize', this.resize)
  }

  resize = () => { 

    // console.log('resize')

    // this.createCanvas()  
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  componentDidUpdate(prevProps) {

  }

  render() {

    return <div className='right-panel'>

              <CanvasAnimation />

          </div>
  }
}