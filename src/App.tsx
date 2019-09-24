import React, { Component } from 'react'

import './App.scss';
//import PokemonSearch from './components/pokemonSearch'
import LeftPanel from './leftPanel/leftPanel'
import RightPanel from './rightPanel/rightPanel'

import './App.scss';

//const App: React.FC = () => {

class App extends Component<any,any> {

  constructor(props: any) {

    super(props)

    this.state = { numberOfPoints: 120, circleSizes: 4} 
  }

  onGenerate(data: any) {

    console.log('onGenerate: data: ', data)

    this.setState({...data})
  }

  render() {

    const {numberOfPoints, circleSizes} = this.state

    console.log('render numberOfPoints: ', numberOfPoints)

    return (
      <div className="app">
        {/* <PokemonSearch name="John Doe" numberOfPokemons={5} /> */}

        <LeftPanel numberOfPoints={numberOfPoints} circleSizes={circleSizes} onGenerate={this.onGenerate.bind(this)} />
        <RightPanel numberOfPoints={numberOfPoints} circleSizes={circleSizes} /> 

      </div>
    );
  }
}

export default App;
