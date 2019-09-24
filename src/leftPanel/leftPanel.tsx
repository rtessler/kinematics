import React, { Component } from 'react'

import Field from '../field/field'

import './leftPanel.scss'

interface LeftPanelData {

  numberOfPoints: number,
  circleSizes: number,
  onGenerate: any
}

export default class LeftPanel extends Component<LeftPanelData, any> {

  constructor(props: LeftPanelData) {

    super(props)

    this.state = { 
      numberOfPoints: props.numberOfPoints, 
      circleSizes: props.circleSizes }
  }

  componentDidUpdate(prevProps: LeftPanelData) {

    if (this.props !== prevProps) {

      this.setState({ 
        numberOfPoints: this.props.numberOfPoints, 
        circleSizes: this.props.circleSizes })
    }
  }

  onChange(e: any) {

    const id = e.target.id
    let val = e.target.value
    //const checked = e.target.checked

    // if (val == "")
    //   val = 0

    // val = parseInt(val)

    // put some limits

    let nextState:any = {...this.state}

    switch (id) {
      case 'numberOfPoints':

        if (val > 10000)
          val = 10000

        break;

      case 'circleSizes':

        // if (val > data.numberOfPoints)
        //   val = data.numberOfPoints

        break
    }

    nextState[id] = val

    this.setState({nextState})
  }

  go() {

    if (this.props.onGenerate)
      this.props.onGenerate(this.state)
  }

  render() {

    const { numberOfPoints, circleSizes } = this.props
   
    return (

      <div className='left-panel'>

        <div className='col'>

          <h3>Kinematics</h3>

          <Field id='numberOfPoints' label='number of points' value={numberOfPoints} onChange={this.onChange.bind(this)} />
          <Field id='circleSizes' label='circle sizes' value={circleSizes} onChange={this.onChange.bind(this)} />

          <button className='btn' onClick={this.go.bind(this)}>Go</button>

        </div>

      </div>
    )
  }
}
