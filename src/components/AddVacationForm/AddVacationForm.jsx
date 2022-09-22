import axios from 'axios'
import React, { Component } from 'react'
import { API_URL } from '../../constants'

const ALLOWED_TYPES= ['repos', 'maladie', 'urgent', 'longDuration']
const vacationAllowed = 30
export default class addVacationForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: 'repos',
      cause: '',
      startDate: null,
      endDate: null,
      error: null
    }
  }
  isValidSubmission() {
    const [type, cause, startDate, endDate] = this.state
    if (endDate - startDate < 1) {
      return false
    }
    if (!ALLOWED_TYPES.includes(type)) {
      return false
    }
    if (!type === 'repos' && !cause) {
      return false
    }
    if (type === 'repos' && endDate - startDate > vacationAllowed) {
      return false
    }
    return true

  }
  handleSubmit() {
    const [type, cause, startDate, endDate] = this.state
    const userId = this.props.match.params
    if (this.isValidSubmission()){
      const json = {
        duration: endDate - startDate,
        cause,
        type,
        userId
      }
      return axios.post(`${API_URL}/users/${userId}/vacations`, json).catch((err) => console.log(err))
    }
  }
  render() {
    return (
      <div>
        <h1>Poser un congé</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='startDate' >Date de début</label>
          <input required type='date' name='startDate' id='startDate' onChange={(e) => this.setState({startDate: new Date(e.target.value)})}/>
          <label htmlFor='endDate'>Date de fin</label>
          <input required type='date' name='endDate' id='endDate' onChange={(e) => this.setState({endDate: new Date(e.target.value)})}/>
          <label htmlFor='type'>Type</label>
          <select defaultValue={this.state.type} onChange={(e) => this.setState({type: e.target.value})}>
            <option value='repos'>Repos</option>
            <option value='maladie'>Maladie</option>
            <option value='urgent'>Urgent</option>
            <option value='longDuration'>Longue Durée</option>
          </select>
          <label htmlFor='cause'>Raison</label>
          <textarea required={this.state.type !== 'repos'} onChange={(e) => this.setState({cause: e.target.value})} />
          <button type='submit'>Poser sa demande</button>
        </form>
        {this.state.error && <div>Veuillez vérifier votre saisie</div>}
      </div>
    )
  }
}
