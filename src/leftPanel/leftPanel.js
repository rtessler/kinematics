import React, { Component } from 'react'

import Field from '../field/field'

import './leftPanel.scss'

export default class LeftPanel extends Component {

  constructor(props) {

    super(props)

    this.state = { data: {...props.data} }
  }

  componentDidUpdate(prevProps) {

    if (this.props.data !== prevProps.data) {
      this.setState({data: {...this.props.data}})
    }
  }

  onChange(e) {

    let { data } = this.state

    console.log(data)

    const id = e.target.id
    let val = e.target.value
    //const checked = e.target.checked

    

    // if (val == "")
    //   val = 0

    // val = parseInt(val)

    // put some limits

    switch (id) {
      case 'numberOfPoints':

        if (val > 10000)
          val = 10000

        break;

      case 'maxLinksPerPoint':

        // if (val > data.numberOfPoints)
        //   val = data.numberOfPoints

        break
    }

    data[id] = val

    this.setState({data})
  }

  go() {

    const { data } = this.state

    if (this.props.onGenerate)
      this.props.onGenerate(data)
  }

  render() {

    const { data } = this.state
   
    return (

      <div className='left-panel'>

        <div className='col'>

          <h3>Network</h3>

          <Field id='numberOfPoints' label='number of points' value={data.numberOfPoints} onChange={this.onChange.bind(this)} />
          <Field id='maxLinksPerPoint' label='max links per point' value={data.maxLinksPerPoint} onChange={this.onChange.bind(this)} />

          <button className='btn' onClick={this.go.bind(this)}>Go</button>

        </div>

      </div>
    )
  }
}
