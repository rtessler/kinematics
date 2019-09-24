import React, { Component } from 'react'
import User from '../interfaces/user.interface'

interface SearchState {
  error: boolean,
  pokemon: Pokemon
}

interface Pokemon {
  name: string,
  numberOfAbilities: number,
  baseExperience: number,
  imageUrl: string
}

export class PokemonSearch extends Component<User, SearchState> {

  pokemonRef: React.RefObject<HTMLInputElement>;

  constructor(props: User) {
      super(props)

      this.state = {
        error: false,
        pokemon: null
      }
      this.pokemonRef = React.createRef();
  }


  onSearchClick = () => {

    const inputValue = this.pokemonRef.current.value;

    let url = `https://pokeapi.co/api/v2/pokemon/${inputValue}`

    fetch(url)
    .then(res => {

      if (res.status !== 200) {
        this.setState({error: true})
        return
      }

      res.json().then(data => {
        this.setState({error: false, 
          pokemon: {
          name: data.name, 
          numberOfAbilities: data.abilities.length,
          baseExperience: data.base_experience,
          imageUrl: data.sprites.front_default
        }
      })
      })
    })
  }

  addNumbers = (a: number, b: number): number => {
    return a + b
  }

  render() {

    const { name: userName, numberOfPokemons } = this.props
    const {error, pokemon} = this.state

    let resultMarkup

    if (error) {
      resultMarkup = <p>Pokemon not found please try again</p>
    }
    else if (pokemon) {
      resultMarkup = <div>
          
            <img src={pokemon.imageUrl} alt='' className='pokemon-image' />
            <p>{pokemon.name} has {pokemon.numberOfAbilities} abilites and {pokemon.baseExperience} base experience</p>
        </div>
    }

    return (
      <div>

        <p>
          User {userName}{' '} {numberOfPokemons && <span>{numberOfPokemons} pokemons</span>} 
        </p>
    
        <input type='text' ref={this.pokemonRef} />

        <button
          onClick={this.onSearchClick}
          className='my-button'>Search</button>

          {resultMarkup}

      </div>
    )
  }
}

export default PokemonSearch
