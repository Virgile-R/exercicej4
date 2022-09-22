import axios from 'axios'
import React, { Component } from 'react'
import { API_URL, TAX_ON_REVENUE_MAP } from '../../constants'

export default class EditPayForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userGrade: '',
      newSalaryBeforeTax: 0,
      avance: 0,
      currentBrut: 0,
      error:'',
      currentPay: null
    }
  }
  componentDidMount() {
    const userId = window.location.href.split('/')[4]
    axios.get(`${API_URL}/users/${userId}`).then((response) => {
      console.log('response.data', response.data)
      this.setState({userGrade: response.data[0].grade})
    }).catch((err) => {
      if (err.code === 404) {
        this.setState({error: 'userDoesntExist'})
      }
      console.log(err)
    })
    axios.get(`${API_URL}/users/${userId}/pay`).then((response) => {
      console.log('response.data', response.data)
      this.setState({currentPay: response.data[0]})
      }
        ).catch((err) => console.error(err))
    console.log('this.state.currentPay', this.state.currentPay)
  }
  isValidSubmission() {
    if (this.state.avance * 0.35 > this.state.currentPay.brut) {
      return false
    }
    return true
  }
  handleSubmit() {
    const userId = this.props.match.params
    if (this.isValidSubmission()) {
      const brut = this.state.newSalaryBeforeTax
      const tax = TAX_ON_REVENUE_MAP[this.state.userGrade]
      const net = brut - (brut * tax)
      const json = {
        brut,
        tax,
        net,
        avance: this.state.avance
      }
      axios.post(`${API_URL}/users/${userId}/pay`, json).catch((err) => console.log(err))
    }
  }
  render() {
    return (
      <div>
        <h1>Éditez le salaire</h1>
        {this.state.error === 'userDoesntExist' ? <div> Cet utilisateur n'existe pas</div> : (
        <>
          <form>
            <div className='form-group'>
              <label for='newBrut'>Nouveau salaire brut</label>
              <input className="form-control" required name='newBrut' id='newBrut' type='number' />
              <button className='btn btn-primary' type='submit'>Mettre à jour le salaire</button>
            </div>
          </form>
          
            <div>
            {this.state.currentPay &&
              <>
                <h2>Salaire actuel</h2>
                  <table>
                    <thead>
                      <th>Brut</th>
                      <th>Net</th>
                      <th>Taux de taxation</th>
                      <th>Avances</th>
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
        )}

      </div>
    )
  }
}
