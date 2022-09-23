import axios from 'axios'
import React, { Component } from 'react'
import { API_URL, BASE_PAY_GRADE_MAP, GRADES_ARRAY, TAX_ON_REVENUE_MAP } from '../../constants'

export default class addUserForm extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      firstName: '',
      lastName: '',
      grade: 'ouvrier',
      adress: '',
      age: 20,
      isLoading: false,
      avance: 0,
      invalidInputs: []
    }
  }
  dismissModal = () =>  {
    this.props.toggle()
  }
  displaySuccessAlert = () => {
    this.props.onSuccess()
    this.props.toggle()
  }
  isValidForm = () => {
    const invalidInputs = []
    if (this.state.firstName.length < 3 || !this.state.firstName.match(/[^0-9]+/g) ) {
      console.log('check longueur failed')
      invalidInputs.push('firstName')
      
    }
    if ( this.state.lastName.length < 3 || !this.state.lastName.match(/[^0-9]+/g)) {
      console.log('check matchh failed', this.state.firstName.match(/[^0-9]+/g), this.state.lastName.match(/[^0-9]+/g)  )
      invalidInputs.push('lastName')
      
    }
    if (this.state.adress.length < 20 || !this.state.adress.match(/.+\s.+\s.*/g)) {
      invalidInputs.push('adress')
      console.log('check address failed')
      
    }
    if (this.state.age < 20) {
      invalidInputs.push('age')
      console.log('check age failed')
      
    }
    if (invalidInputs.length > 0) {
      this.setState({invalidInputs})
      return false
    }
    this.setState({invalidInputs})
    return true
  }
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.isValidForm()) {
      this.setState({isLoading: true})
      const json = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        grade: this.state.grade,
        adress: this.state.adress,
        age: this.state.age,
      }
      axios.post(`${API_URL}/users`, json).then((response) => {
        if (response.status === 201) {
          const userId = response.data.id
          const brut = BASE_PAY_GRADE_MAP[response.data.grade]
          const tax = TAX_ON_REVENUE_MAP[response.data.grade]
          const net = brut - (brut * tax)
          const json = {
            brut,
            tax,
            net,
            avance: this.state.avance,
          }
          console.log('json', json)
          axios.post(`${API_URL}/users/${userId}/pay`, json).then(() => this.displaySuccessAlert() ).finally(() => this.setState({isLoading: false})).catch((err) => {
            this.props.onError()  
            console.log(err)
          })
      }} )
      
    }
  }
  render() {
      return (
        <div className={`modal fade ${this.props.showModal ? 'show' : ''}`} style={{
          display: `${this.props.showModal ? 'block' : 'none'}`,
        }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title" id="addUserModalLabel">Ajouter un(e) employé(e)</h1>
                <button type="button" className="btn btn-close" data-dismiss="modal" aria-label="Close" onClick={this.dismissModal}>
                </button>
              </div>
              <div className='modal-body'></div>
                <form onSubmit={(e) => this.handleSubmit(e)} noValidate>
                  <div className='container form-group'>
                    <label htmlFor='firstName'>Prénom</label>
                    <input className='form-control' required type='text' name='firstName' id='firstName' onChange={(e) => this.setState({firstName: e.target.value})}></input>
                    <div className="invalid-feedback" style={{display: this.state.invalidInputs.includes('firstName') ? 'block' : 'none'}}>
                     Votre prénom doit contenir plus de 3 lettres, sans chiffres.
                    </div>

                    <label htmlFor='lastName'>Nom</label>
                    <input className='form-control' required type='text' name='lastName' id='lastName' onChange={(e) => this.setState({lastName: e.target.value})}></input>
                    <div className="invalid-feedback" style={{display: this.state.invalidInputs.includes('lastName') ? 'block' : 'none'}}>
                     Votre nom doit contenir plus de 3 lettres, sans chiffres.
                    </div>
                    <label htmlFor='grade'>Grade</label>
                    <select className='form-control' name='grade' id='grade' onChange={(e) => this.setState({grade: e.target.value})} required >
                      {GRADES_ARRAY.map((grade, index) => (
                        <option value={grade} key={index}>{grade[0].toLocaleUpperCase() + grade.slice(1)}</option>
                      ))}
                    </select>
                    <label htmlFor='adress'>Adresse</label>
                    <input className='form-control' required name='adress' id='adress' type='text' onChange={(e) => this.setState({adress: e.target.value})} />
                    <div className="invalid-feedback" style={{display: this.state.invalidInputs.includes('adress') ? 'block' : 'none'}}>
                     Votre adresse doit faire plus de 20 caractères et contenir au moins deux espaces
                    </div>
                    <label htmlFor='age'>Age</label>
                    <input className='form-control' required name='age' defaultValue={20} id='age' type='number' onChange={(e) => this.setState({age: e.target.value})} />
                    <div className="invalid-feedback" style={{display: this.state.invalidInputs.includes('age') ? 'block' : 'none'}}>
                     Vous devez au moins avoir 20 ans
                    </div>
                    <button type='submit' className='btn btn-primary my-4' disabled={this.state.isLoading} >{this.state.isLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                       
                    ) : 'Ajouter l\'employé(e)'}</button>
                  </div>
                </form>
                </div>
            </div>
          </div>        
        
      )
    
  }
}
