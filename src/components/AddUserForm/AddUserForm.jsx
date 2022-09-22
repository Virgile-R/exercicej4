import axios from 'axios'
import React, { Component } from 'react'
import { API_URL, GRADES_ARRAY } from '../../constants'

export default class addUserForm extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      firstName: '',
      lastName: '',
      grade: 'ouvrier',
      adress: '',
      age: 20,
      
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

    if (this.state.firstName.length < 3 || this.state.lastName.length < 3) {
      console.log('check longueur failed')
      return false
    }
    if (!this.state.firstName.match(/[^0-9]+/g) || !this.state.lastName.match(/[^0-9]+/g)) {
      console.log('check matchh failed', this.state.firstName.match(/[^0-9]+/g), this.state.lastName.match(/[^0-9]+/g)  )
      return false
    }
    if (this.state.adress.length < 20 || !this.state.adress.match(/.+\s.+\s.*/g)) {
      console.log('check address failed')
      return false
    }
    if (this.state.age < 20) {
      console.log('check age failed')
      return false
    }
    return true
  }
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.isValidForm()) {
     
      const json = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        grade: this.state.grade,
        adress: this.state.adress,
        age: this.state.age,
      }
      axios.post(`${API_URL}/users`, json).then((response) => {
        if (response.status === 201) {
        
        this.displaySuccessAlert()
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
                <form onSubmit={(e) => this.handleSubmit(e)}>
                  <div className='container form-group'>
                    <label htmlFor='firstName'>Prénom</label>
                    <input className='form-control' required type='text' name='firstName' id='firstName' onChange={(e) => this.setState({firstName: e.target.value})}></input>
                    <label htmlFor='lastName'>Nom</label>
                    <input className='form-control' required type='text' name='lastName' id='lastName' onChange={(e) => this.setState({lastName: e.target.value})}></input>
                    <label htmlFor='grade'>Grade</label>
                    <select className='form-control' name='grade' id='grade' onChange={(e) => this.setState({grade: e.target.value})} required >
                      {GRADES_ARRAY.map((grade, index) => (
                        <option value={grade} key={index}>{grade[0].toLocaleUpperCase() + grade.slice(1)}</option>
                      ))}
                    </select>
                    <label htmlFor='adress'>Adresse</label>
                    <input className='form-control' required name='adress' id='adress' type='text' onChange={(e) => this.setState({adress: e.target.value})} />
                    <label htmlFor='age'>Age</label>
                    <input className='form-control' required name='age' defaultValue={20} id='age' type='number' onChange={(e) => this.setState({age: e.target.value})} />
                    <button type='submit' className='btn btn-primary my-4'>Ajouter l'employé(e)</button>
                  </div>
                </form>
                </div>
            </div>
          </div>        
        
      )
    
  }
}
