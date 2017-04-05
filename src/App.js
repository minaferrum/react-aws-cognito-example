const React = require('react');
const Component = require('react/Component');
const Signin = require('./Signin.jsx');
const Signup = require('./Signup.jsx');
const GuardedSignup = require('./GuardedSignup.jsx');
const UserStatus = require('UserStatus.jsx');
const UserSettings = require('./UserSettings.js');

class App extends Component {
  constructor (props) {
    super(props)
    this.signinStatusHandler = this.signinStatusHandler.bind(this);
    this.signupStatusHandler = this.signupStatusHandler.bind(this);

    this.state = {
      signinStatus: '',
      signupStatus: '',
    };
  }

  signinStatusHandler(signinStatus) {
    this.setState({signinStatus});
  }

  signupStatusHandler(signupStatus) {
    this.setState({signupStatus});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Ferrum Health Dev Portal</h2>
        </div>
        <Signin statusHandler={this.signinStatusHandler}/>
        {this.state.signinStatus}
        <hr />
        <GuardedSignup statusHandler={this.signupStatusHandler}/>
        {this.state.signupStatus}
        <hr />
        <Signup statusHandler={this.signupStatusHandler}/>
        {this.state.signupStatus}
        <hr />
        <UserStatus />
        <hr />
        <UserSettings />
      </div>
    );
  }
}

export default App;
