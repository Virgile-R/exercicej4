import axios from 'axios'
import React, { Component } from 'react'
import { API_URL, GRADES_ARRAY } from '../../constants'

export default class addUserForm extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      firstName: '',
      lastName: '',
      grade: '',
      adress: '',
      age: 0,
      
    }
  }
  dismissModal = () =>  {
    this.props.toggle()
  }
  handleSubmit = () => {
    if (this.isValidForm()) {
      const [firstName, lastName, grade, adress, age] = this.state
      const json = {
        firstName,
        lastName,
        grade,
        adress,
        age,
      }
      axios.post(`${API_URL}/users`, json).then((response) => {if (response.code === 200) this.setState({addedSuccessfully: true, open: false})} )
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
                <form onSubmit={this.handleSubmit}>
                  <div className='container form-group'>
                    <label htmlFor='firstName'>Prénom</label>
                    <input className='form-control' required type='text' name='firstName' id='firstName' onChange={(e) => this.setState({firstName: e.target.value})}></input>
                    <label htmlFor='lastName'>Nom</label>
                    <input className='form-control' required type='text' name='lastName' id='lastName' onChange={(e) => this.setState({firstName: e.target.value})}></input>
                    <label htmlFor='grade'>Grade</label>
                    <select className='form-control' name='grade' id='grade' onChange={(e) => this.setState({grade: e.target.value})} required >
                      {GRADES_ARRAY.map((grade, index) => (
                        <option value={grade} key={index}>{grade[0].toLocaleUpperCase() + grade.slice(1)}</option>
                      ))}
                    </select>
                    <label htmlFor='adress'>Adresse</label>
                    <input className='form-control' required name='adress' id='adress' type='text' onChange={(e) => this.setState({adress: e.target.value})} />
                    <label htmlFor='age'>Age</label>
                    <input className='form-control' required name='age' id='age' type='number' onChange={(e) => this.setState({age: e.target.value})} />
                    <button type='submit' className='btn btn-primary my-4'>Ajouter l'employé(e)</button>
                  </div>
                </form>
                </div>
            </div>
          </div>        
        
      )
    
  }
}
