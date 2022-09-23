import axios from 'axios'
import React, { Component } from 'react'
import { API_URL, TAX_ON_REVENUE_MAP } from '../../constants'
import ErrorAlert from '../ErrorAlert/ErrorAlert'

export default class EditPayForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userGrade: '',
      newSalaryBeforeTax: 0,
      newAvance: 0,
      currentBrut: 0,
      error:'',
      currentPay: null,
      currentUser: null,
      isLoading: false,
      showSuccessAlert: false,
      successMessage: '',
      showErrorAlert: false,
      errorMessage: ''
    }
  }
  componentDidMount() {
    const userId = window.location.href.split('/')[4]
    axios.get(`${API_URL}/users/${userId}`).then((response) => {
      console.log('response.data', response.data)
      this.setState({userGrade: response.data.grade, avance: response.data.avance, currentUser: userId})
    }).catch((err) => {
      if (err.code === 404) {
        this.setState({showErrorAlert: true, errorMessage: 'Employé non trouvé.'})
      }
      console.log(err)
    })
    axios.get(`${API_URL}/users/${userId}/pay`).then((response) => {
      console.log('response.data', response.data)
      this.setState({currentPay: response.data[0]})
      }
        ).catch((err) => {
          this.setState({showErrorAlert: true, errorMessage: 'Problème lors de la récupération de votre paie, veuillez rééssayez plus tard.'})
          console.log(err)
        })
    console.log('this.state.currentPay', this.state.currentPay)
  }
  isValidSubmission() {
    if (!this.state.newSalaryBeforeTax || this.state.newSalaryBeforeTax === 0) {
      this.setState({showErrorAlert: true, errorMessage: 'Veuillez entrer une valeur supérieure à zéro pour le nouveau salaire.' })
      return false
    }
    return true
  }
  isValidAdvanceSubmission() {
    console.log('this.state.currentPay.brut * 0.35', this.state.currentPay.brut * 0.35)
    console.log('(parseInt(this.state.avance) + parseInt(this.state.newAvance))', (parseInt(this.state.avance) + parseInt(this.state.newAvance)))
    if ((parseInt(this.state.currentPay.avance) + parseInt(this.state.newAvance)) > this.state.currentPay.brut * 0.35) {
      this.setState({showErrorAlert: true, errorMessage: 'Vous ne pouvez pas demander plus de 35% de votre salaire brut en avance.' })
      console.log('vaidation failed')
      return false
    }
    return true
  }


  handleEditSalary(e) {
    e.preventDefault()
    this.setState({isLoading: true})
    const userId = this.state.currentUser
    if (this.isValidSubmission()) {
      const brut = parseInt(this.state.newSalaryBeforeTax)
      const tax = TAX_ON_REVENUE_MAP[this.state.userGrade]
      const net = brut - (brut * tax)
      const json = {
        brut,
        tax,
        net,
        avance: this.state.avance
      }
      axios.put(`${API_URL}/users/${userId}/pay/${this.state.currentPay.id}`, json).then((response) => {
        if (response.status === 200) {
          this.setState({currentPay: response.data, showSuccessAlert: true, successMessage: 'Salaire mis à jour', newSalaryBeforeTax: 0})
          
          
        }
      }).finally(() => this.setState({isLoading: false})).catch((err) => {
        this.setState({showErrorAlert: true, errorMessage: 'Problème lors de l\'édition de votre paie, veuillez rééssayez plus tard.'})
        console.log(err)
      })
    } else {
      this.setState({isLoading: false})
    }
  }
  handleEditAvance(e) {
    e.preventDefault()
    this.setState({isLoading: true})
    const userId = this.state.currentUser
    if (this.isValidAdvanceSubmission()) {
      const json = {
        avance: parseInt(this.state.currentPay.avance) + parseInt(this.state.newAvance)
      }
      axios.put(`${API_URL}/users/${userId}/pay/${this.state.currentPay.id}`, json).then((response) => {
        if (response.status === 200) {
          this.setState({currentPay: response.data, showSuccessAlert: true, successMessage: 'Avance allouée'})
          
          
        }
      }).finally(() => this.setState({isLoading: false})).catch((err) => {
        this.setState({showErrorAlert: true, errorMessage: 'Problème lors de l\'attribution de votre avance, veuillez rééssayez plus tard.'})
        console.log(err)
      })
    } else {
      this.setState({isLoading: false})
    }
  }
  toggleSuccessAlert = () => this.setState({
    showSuccessAlert: !this.state.showSuccessAlert
  })
  toggleErrorAlert = () => this.setState({
    showErrorAlert: !this.state.showErrorAlert
  })
  render() {
    return (
      <div>
        <h1>Éditez le salaire de {this.state.currentUser?.firstName} {this.state.currentUser?.lastName}</h1>
        {this.state.showSuccessAlert && 
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {this.state.successMessage}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={this.toggleSuccessAlert}></button>
          </div>}
          {this.state.showErrorAlert && <ErrorAlert toggle={this.toggleErrorAlert} message={this.state.errorMessage} />}
        <>
            <div className='form-group'>
              <label htmlFor='newBrut'>Nouveau salaire brut</label>
              <div className='input-group'>

                <input className="form-control" required name='newBrut' id='newBrut' type='number' value={this.state.newSalaryBeforeTax} onChange={(e) => this.setState({newSalaryBeforeTax: e.target.value})}/>
                <span class="input-group-text">€</span>
              </div>

              <label htmlFor='newAdvance'>Nouvelle Avance</label>
              <div className='input-group'>
                <input className="form-control" required name='newAdvance' id='newAdvance' type='number' value={this.state.newAvance} onChange={(e) => this.setState({newAvance: e.target.value})}/>
                <span class="input-group-text">€</span>
              </div>
              <button className='btn btn-primary m-2' onClick={(e) => this.handleEditSalary(e)} disabled={this.state.isLoading}>{this.state.isLoading ? (
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                       
                    ) : 'Mettre à jour le salaire'}</button>
              <button className='btn btn-primary m-2' onClick={(e) => this.handleEditAvance(e)} disabled={this.state.isLoading}>{this.state.isLoading ? (
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                       
                    ) : 'Accorder une avance'}</button>
            </div>
          
            <div>
            {this.state.currentPay &&
              <>
                <h2>Salaire actuel</h2>
                  <table className='table'>
                    <thead>
                      <th scope="col">Brut</th>
                      <th scope="col">Net</th>
                      <th scope="col">Taux de taxation</th>
                      <th scope="col">Avances</th>
                    </thead>
                    <tbody>
                      <td>{this.state.currentPay.brut} €</td>
                      <td>{this.state.currentPay.net} €</td>
                      <td>{`${TAX_ON_REVENUE_MAP[this.state.userGrade]*100}%`}</td>
                      <td>{this.state.currentPay.avance} €</td>
                    </tbody>
                  </table>
              </>
            }
            </div>
          </>


      </div>
    )
  }
}
