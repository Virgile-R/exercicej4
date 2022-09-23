import axios from 'axios'
import React, { Component } from 'react'
import { API_URL } from '../../constants'
import ErrorAlert from '../ErrorAlert/ErrorAlert'

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
      error: null,
      isLoading: false,
      currentUser: null,
      currentVacations: [],
      showSuccessAlert: false,
      showErrorAlert: false,
      errorMessage: ''
    }
  }
  componentDidMount() {
    const userId = window.location.href.split('/')[4]
    axios.get(`${API_URL}/users/${userId}`).then((response) => {
      console.log('response.data', response.data)
      this.setState({currentUser: response.data})
    }).catch((err) => {
      if (err.code === 404) {
        this.setState({error: 'userDoesntExist'})
      }
      console.log(err)
    })
    axios.get(`${API_URL}/users/${userId}/vacations`).then((response) => {
      console.log('response.data vacations', response.data)
      this.setState({currentVacations: response.data})
      }
        ).catch((err) => console.error(err))
  }
  
  isValidSubmission = () => {
    if (Math.ceil((this.state.endDate -  this.state.startDate) / (1000 * 3600 * 24)) < 1) {
      console.log('first', Math.ceil((this.state.endDate -  this.state.startDate) / (1000 * 3600 * 24)))
      this.setState({showErrorAlert: true, errorMessage: 'Votre date de début de congés doit être avant votre date de fin de congés.' })
      return false
    }
    if (!ALLOWED_TYPES.includes(this.state.type)) {
      console.log('second', ALLOWED_TYPES.includes(this.state.type))
      return false
    }
    if (!this.state.type === 'repos' && !this.state.cause) {
      this.setState({showErrorAlert: true, errorMessage: 'Vous devez entrer un message d\'explication dans le champ cause.' })
      console.log('third', this.state.type, this.state.cause)
      return false
    }
    if (this.state.type === 'repos' && Math.ceil((this.state.endDate -  this.state.startDate) / (1000 * 3600 * 24)) > vacationAllowed) {
      this.setState({showErrorAlert: true, errorMessage: 'Vous n\'avez pas assez de jours de congé.' })
      console.log('vacationAllowed', vacationAllowed)
      return false
    }
    return true

  }
  toggleSuccessAlert = () => this.setState({
    showSuccessAlert: !this.state.showSuccessAlert
  })
  toggleErrorAlert = () => this.setState({
    showErrorAlert: !this.state.showErrorAlert
  })
  handleSubmit = (e) => {
    e.preventDefault()
    const userId = window.location.href.split('/')[4]
    this.setState({isLoading: true})
    if (this.isValidSubmission()){
      const json = {
        startData: this.state.startDate,
        duration: Math.ceil((this.state.endDate -  this.state.startDate)),
        cause: this.state.cause,
        type: this.state.type,
        userId
      }
      return axios.post(`${API_URL}/users/${userId}/vacations`, json).then((response) => {
        const updatedVacationsArray = this.state.currentVacations
        updatedVacationsArray.push(response.data)
        this.setState({currentVacations: updatedVacationsArray})
        }).finally(() => this.setState({isLoading: false, showSuccessAlert: true, showSuccessMessage:'Congés posés.'})).catch((err) => {
          this.setState({showErrorAlert: true, errorMessage: 'Problème lors de la création de votre congé, veuillez rééssayez plus tard.'})
          console.log(err)
        })
    } else {
      this.setState({isLoading: false})
    }
  }
  cancelVacations = (vacationsId) => {
    this.setState({isLoading: true})
    axios.delete(`${API_URL}/users/${this.state.currentUser.id}/vacations/${vacationsId}`).then((response) => {
      console.log('response', response)
      const currentVacationsArray = this.state.currentVacations
      const updatedVacationsArray = currentVacationsArray.filter(({id}) => id !== response.data.id)
      console.log('updatedVacationsArray', updatedVacationsArray)
      this.setState({currentVacations: updatedVacationsArray})
    }).finally(() => this.setState({isLoading: false, showSuccessAlert: true, showSuccessMessage: 'Vos congés ont bien été annulés'})).catch((err) => {
      this.setState({showErrorAlert: true, errorMessage: 'Problème lors de l\'annulation de votre congé, veuillez rééssayez plus tard.'})
      console.log('err', err)})
  }
  render() {
    return (
      <div>
      {this.state.showSuccessAlert && 
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {this.state.showSuccessMessage}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={this.toggleSuccessAlert}></button>
          </div>}
      {this.state.showErrorAlert && <ErrorAlert toggle={this.toggleErrorAlert} message={this.state.errorMessage} />}    
        <h1>Poser un congé pour {this.state.currentUser?.firstName} {this.state.currentUser?.lastName}</h1>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'></div>
          <label htmlFor='startDate' >Date de début</label>
          <input required className="form-control" type='date' name='startDate' id='startDate' onChange={(e) => this.setState({startDate: new Date(e.target.value).getTime()})}/>
          <label htmlFor='endDate'>Date de fin</label>
          <input required className="form-control" type='date' name='endDate' id='endDate' onChange={(e) => this.setState({endDate: new Date(e.target.value).getTime()})}/>
          <label htmlFor='type'>Type</label>
          <select className="form-control" defaultValue={this.state.type} onChange={(e) => this.setState({type: e.target.value})}>
            <option value='repos'>Repos</option>
            <option value='maladie'>Maladie</option>
            <option value='urgent'>Urgent</option>
            <option value='longDuration'>Longue Durée</option>
          </select>
          <label htmlFor='cause'>Raison</label>
          <textarea className="form-control" required={this.state.type !== 'repos'} onChange={(e) => this.setState({cause: e.target.value})} />
          <button className='btn btn-primary mt-2' type='submit'>{this.state.isLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                       
                    ) : 'Poser un congé'}</button>
        </form>
        <div>
            <h2>Vacances posées</h2>
              {this.state.currentVacations.length > 0 ?
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope="col">Commence le</th>
                      <th scope="col">Durée</th>
                      <th scope="col">Type</th>
                      <th scope='col'>Annuler</th>
                    </tr>
                  </thead>
                  {this.state.currentVacations.map((vacation) => (
                    <tbody>
                      <tr>
                        <td>{new Date(vacation.startData).toLocaleString().split(' ')[0]}</td>
                        <td>{parseInt(vacation.duration)/(1000 * 3600 * 24)} jours</td>
                        <td>{vacation.type[0].toUpperCase() + vacation.type.slice(1)}</td>
                        <td> 
                          <button type='button' className='btn btn-danger' onClick={() => this.cancelVacations(vacation.id)}>{this.state.isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>) : 
                            'Annuler'}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table> :
                <h2>Pas de vacances pour l'instant</h2>
              }
                
        </div>
        {this.state.error && <div>Veuillez vérifier votre saisie</div>}
      </div>
    )
  }
}
