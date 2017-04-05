import React, { Component } from 'react'
import { getCurrentUser, setNewPassword } from './Cognito'

class UserSettings extends Component {
  constructor (props) {
    super(props);
    this.changeOldPassword = this.changeOldPassword.bind(this);
    this.changeNewPassword = this.changeNewPassword.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

    this.state = {
      oldPassword: '',
      newPassword: '',
      changePasswordError: '',
    }
  }

  componentDidMount () {
    getCurrentUser(attributes => {
      for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].Name === 'email') {
          this.setState({ email: attributes[i].Value })
        }
      }
    })
  }

  changeOldPassword (e) {
    this.setState({ oldPassword: e.target.value })
  }

  changeNewPassword (e) {
    this.setState({ newPassword: e.target.value })
  }

  handlePasswordChange(e) {
    e.preventDefault();
    setNewPassword(
      this.state.oldPassword,
      this.state.newPassword,
      (err, result) => {
        if (err) {
          this.setState({changePasswordError: err});
          return;
        }
        console.log(result);
        window.location.reload();
      }
    );
  }

  render () {
    return (
      <div>
        {this.state.email &&
          <div>
            <h2>User Settings</h2>
            <span>{this.state.email}</span>
            <form onSubmit={this.handlePasswordChange}>
              <div>
                <input
                  value={this.state.oldPassword}
                  placeholder='Old Password'
                  type='password'
                  minLength={6}
                  onChange={this.changeOldPassword} />
              </div>
              <div>
                <input
                  value={this.state.newPassword}
                  placeholder='New Password'
                  type='password'
                  minLength={6}
                  onChange={this.changeNewPassword} />
              </div>
              <div>
                <button type='submit'>Change Password</button>
              </div>
            </form>
          </div>
        }
        {this.state.changePasswordError}
      </div>
    );
  }
}

export default UserSettings
