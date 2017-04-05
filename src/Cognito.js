import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import poolData from '../cognito-pool-data';
import aws from 'aws-sdk';

const userPool = new CognitoUserPool(poolData)

export const createUser = (username, email, password, callback) => {
  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
  ];

  userPool.signUp(username, password, attributeList, null, callback)
}

export const createLimitedUserUser = (username, email, password, callback) => {
  const attributeList = [
    new CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
    new CognitoUserAttribute({
      Name: 'custom:adminApproved',
      Value: false,
    }),
  ];

  userPool.signUp(username, password, attributeList, null, callback)
}

export const emailNewUserSignup = (username, email) => {
  aws.config = {
    "accessKeyId": "AKIAJBYCKEOTT355WQTQ",
    "secretAccessKey": "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", //need secret access key
    "region": "us-west-2"
  };

  const ses = new aws.SES();
  const params = {
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [
        "mina@ferrumhealth.com"
      ]
    },
    Message: {
      Body: {
        // Html: {
        //   Charset: "UTF-8",
        //   Data: username.toString() + " " + email.toString()
        // },
        Text: {
          Charset: "UTF-8",
          Data: username.toString() + " has attempted to sign up."
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New user request"
      }
    },
    // ReplyToAddresses: [],
    // ReturnPath: "",
    // ReturnPathArn: "",
    Source: "mina.han@gmail.com",
    // SourceArn: ""
 };

 ses.sendEmail(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
   /*
   data = {
    MessageId: "EXAMPLE78603177f-7a5433e7-8edb-42ae-af10-f0181f34d6ee-000000"
   }
   */
 });
}

export const verifyUser = (username, verifyCode, callback) => {
  const userData = {
    Username: username,
    Pool: userPool,
  }
  const cognitoUser = new CognitoUser(userData)
  cognitoUser.confirmRegistration(verifyCode, true, callback)
}

export const authenticateUser = (email, password, callback) => {
  const authData = {
    Username: email,
    Password: password,
  }
  const authDetails = new AuthenticationDetails(authData)
  const userData = {
    Username: email,
    Pool: userPool,
  }
  const cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authDetails, {
    onSuccess: result => {
      console.log('access token + ' + result.getAccessToken().getJwtToken());
      callback(null, result);
      window.location.href = '/portal';
    },
    onFailure: err => {
      console.log('failure');
      callback(err);
    },
  })
}

export const setNewPassword = (oldPassword, newPassword) => {
  const currentUser = userPool.getCurrentUser();
  if (currentUser != null) {
    currentUser.getSession(function (err, session) {
      if (err) {
        alert(err);
        return;
      }
    });
  }

  console.log(currentUser);
  currentUser.changePassword(oldPassword, newPassword, function(err, result) {
    if (err) {
      alert(err);
      return;
    }
    console.log('call result: ' + result);
  });
}

export const signOut = () => {
  userPool.getCurrentUser().signOut()
  window.location.reload()
}

export const getCurrentUser = (callback) => {
  const cognitoUser = userPool.getCurrentUser()
  if (!cognitoUser) return false;


  cognitoUser.getSession((err, session) => {
    if (err) {
      console.log(err)
      return
    }

    console.log('Session valid?', session.isValid())
    console.log(session)

    cognitoUser.getUserAttributes((err, attributes) => {
      if (err) return console.log(err);
      callback(attributes)
    })
  })
}
