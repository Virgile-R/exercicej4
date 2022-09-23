import React, { Component } from 'react'

export default class ErrorAlert extends Component {

  toggleShowErrorAlert = () => {
    this.props.toggle()
  }
  render() {
    return (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {this.props.message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={this.toggleShowErrorAlert}></button>
      </div>
    )
  }
}
