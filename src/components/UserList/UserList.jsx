import axios from 'axios'
import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { API_URL } from '../../constants'
import AddUserForm from '../AddUserForm/AddUserForm'
import ErrorAlert from '../ErrorAlert/ErrorAlert'

export default class UserList extends Component {
  constructor() {
    super()
    this.state = {
      userList: [],
      goToVacationForUser: null,
      goToEditPayForUser: null,
      showAddUserFormModal: false,
      showErrorAlert: false,
      showErrorMessage: ''
    }
  }
  componentDidMount() {
    axios.get(`${API_URL}/users`).then((response) => {
      this.setState({userList: response.data})
    })
  }
  deleteUser(userId) {
    const url = `${API_URL}/users/${userId}`
    axios.delete(url).then(() => {
      const updatedUserList = this.state.userList.filter(({id}) => id !== userId)
      this.setState({userList: updatedUserList})
    }).catch((err) => console.error(err))
    
  }
  handleAddVacationClick(userId) {
    this.setState({goToVacationForUser: userId})
  }

  handleEditPayClick(userId) {
    this.setState({goToEditPayForUser: userId})

  }
  toggleModal = () => this.setState({
    showAddUserFormModal: !this.state.showAddUserFormModal
  })
  toggleSuccessAlert = () => this.setState({
    showSuccessAlert: !this.state.showSuccessAlert
  })
  toggleErrorAlert = () => this.setState({
    showErrorAlert: !this.state.showErrorAlert
  })
  onSuccess = () => {
    
    axios.get('https://632c1fbe5568d3cad87d5f35.mockapi.io/api/v1/users').then((response) => {
      this.setState({userList: response.data})
      this.toggleSuccessAlert()
    })
  }
  onError = () => {
    this.setState({showErrorAlert: true, errorMessage: 'Problème lors de la récupération de votre paie, veuillez rééssayez plus tard.'})
  }
 
  render() {
    return (
      <div className={`container ${this.state.showAddUserFormModal ? 'modal-open' :''}`}>
        {this.state.goToVacationForUser && <Navigate to={`user/${this.state.goToVacationForUser}/vacations`} />}
        {this.state.goToEditPayForUser && <Navigate to={`user/${this.state.goToEditPayForUser}/pay`} />}
        {this.state.showSuccessAlert && 
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            Employé(e) ajouté(e).
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={this.toggleSuccessAlert}></button>
          </div>}
        {this.state.showErrorAlert && <ErrorAlert toggle={this.toggleErrorAlert} message={this.state.showErrorMessage} />}  
        <AddUserForm showModal={this.state.showAddUserFormModal} toggle={this.toggleModal} onSuccess={this.onSuccess} onError={this.onError}/>
        <h1>Liste des employé(e)s</h1>
          {this.state.userList.length > 0 ?
            <>

            
            <button className='btn btn-primary' type='button' onClick={this.toggleModal}>Ajouter un(e) employé(e)</button>  
            <table className='table'>
              <thead>
                <tr>
                  <th scope="col">Nom</th>
                  <th scope="col">Prénom</th>
                  <th scope="col">Grade</th>
                  <th scope="col">Modifier la paie</th>
                  <th scope="col">Ajouter des congés</th>
                  <th scope="col">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userList.map(({id, firstName, lastName, grade}) => (
                  <tr key={id}>
                    <td className='fw-bold'>{lastName}</td>
                    <td>{firstName}</td>
                    <td>{grade[0].toLocaleUpperCase() + grade.slice(1)}</td>
                    <td>
                      <button className="btn btn-primary" onClick={() => this.handleEditPayClick(id)}>Modifier</button>
                    </td>
                    <td>
                      <button className="btn btn-success" onClick={() => this.handleAddVacationClick(id)}>Ajouter</button>
                    </td>
                    <td>
                      <button className="btn btn-danger" onClick={() => this.deleteUser(id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </> :
            <div>
              <h2>Aucun employé inscrit</h2>
              <button className='btn btn-primary' type='button' onClick={this.toggleModal}>Ajouter un(e) employé(e)</button>     
            </div>     
        }
        
      </div>
    )
  }
}
