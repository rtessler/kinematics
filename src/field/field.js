import React, { Component } from 'react'

import './field.scss'

export default class Field extends Component {
  
  textField() {
  
    const { id, label, type, value, disabled, autofocus, errorMsg, onChange, placeholder, required, transform } = this.props
  
    let { className } = this.props
  
    if (!className)
      className = ''
  
    if (transform)
      className += ' ' + transform
      
    // type must be text, email, password
  
    let label2 = typeof label === 'string' ? label : null
  
    if (label && typeof label === 'string') {
      const i = label.indexOf('*')
      label2 = (i > -1) ? <span> {label.replace('*','')} <span className='star'>*</span> </span> : label
    }
  
    return (
      <div className={`text-field ${className}`}>
  
        <label htmlFor={id}>
  
          { (label2) ? label2 : <span>&nbsp;</span> }
  
        </label>
  
        <input id={id} 
              required={(required)}
              type={type} 
              disabled={(disabled)} 
              onChange={onChange} 
              value={(value !== null) ? value : ''} 
              aria-label={label} 
              autoFocus={(autofocus)} 
              placeholder={placeholder} />
  
        <div className='form-error' role='alert'>
  
          { errorMsg }
        
        </div>
  
      </div>
    )
  }
  
  render() {
   
    return (
      <div className='field'>

        { this.textField() }

      </div>
    )
  }
}
