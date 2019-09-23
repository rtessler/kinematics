import React, { Component } from 'react'

import './App.scss';
//import PokemonSearch from './components/pokemonSearch'
import LeftPanel from './leftPanel/leftPanel'
import RightPanel from './rightPanel/rightPanel'

import './App.scss';

//const App: React.FC = () => {

class App extends Component {

  onGenerate() {

    // console.log('onGenerate ', newData)

    // // make a new copy

    // const { data } = this.state

    // //if (data.numberOfPoints !== newData.numberOfPoints || data.maxLinksPerPoint !== newData.maxLinksPerPoint) {

    //   // something changed

    //   this.setState({data: {...newData}})
    // //}
  }

  render() {

    const data = {}

    return (
      <div className="app">
        {/* <PokemonSearch name="John Doe" numberOfPokemons={5} /> */}

        <LeftPanel onGenerate={this.onGenerate.bind(this)} />
        <RightPanel /> 

      </div>
    );
  }
}

export default App;
