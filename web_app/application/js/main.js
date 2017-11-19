'use strict';

(function initFirebase() {
  const config = {
    apiKey: "AIzaSyALdJxKE1Rxu03PSicJwplVzAerA_Nq2bY",
    authDomain: "doggos-a0b2e.firebaseapp.com",
    databaseURL: "https://doggos-a0b2e.firebaseio.com",
    projectId: "doggos-a0b2e",
    storageBucket: "doggos-a0b2e.appspot.com",
    messagingSenderId: "383374070496"
  };
  
  firebase.initializeApp(config);
})();

let display = null;

class Inputs {
  constructor() {
    this.name = {
      markup: document.querySelector('a#name'),
      defaultHTML: 'Authenticate'
    };

    this.buttons = {
      login: document.querySelector('#btn-login'),
      signup: document.querySelector('#btn-signup'),
      signout: document.querySelector('#btn-signout')
    };

    this.signupInputs = {
      name:     document.querySelector('input#full_name'),
      email:    document.querySelector('input#email'),
      password: document.querySelector('input#password')
    };

    this.loginInputs = {
      email:    document.querySelector('input#email-login'),
      password: document.querySelector('input#password-login')
    };
  }

  get signupValues() {
    return {
      name: this.signupInputs.name.value,
      email: this.signupInputs.email.value,
      password: this.signupInputs.password.value
    };
  }

  get loginValues() {
    return {
      email: this.loginInputs.email.value,
      password: this.loginInputs.password.value
    };
  }
}

const inputs = new Inputs();

function classify(e) {
  const data = new FormData(document.querySelector('#doggo-image-form'));
  const XHR  = new XMLHttpRequest();

  XHR.open('POST', 'http://127.0.0.1:5000/api/labels', true);
  XHR.setRequestHeader('Access-Control-Allow-Credentials', true);
  XHR.onload = (event) => {
    if (XHR.readyState === 4) {
      // validate input, bla bla, this' a hackathon sunny boy
      
      const response = JSON.parse(XHR.responseText);
      const image_name = response.filename;

      const breed = Object.keys(response.prediction[0])[0]; 
      const uid  = firebase.auth().currentUser.uid;
      
      const name  = document.querySelector('input[name=dog_name]').value;
      const birthplace = document.querySelector('input[name=dog_birthplace]').value;
      const address = document.querySelector('input[name=dog_address]').value;
            
      const dbRef = firebase.database().ref(`dogs`)
      const doggo = {breed, birthplace, address, uid, image_name};

      const ref  = firebase.storage().ref(`images/user_${uid}/${image_name}`)
      const file = document.querySelector('input[type=file]').files[0];

      dbRef.child(name).set(doggo);

      ref.put(file)
        .then(snap => {
          console.log('Doggo\'s image has been uploaded.');
        });
    }
  }
  
  XHR.send(data);

  e.preventDefault();
};

function search(e) {


  e.preventDefault();
}

function signUp(e) {
  const {name, email, password} = inputs.signupValues;

  e.preventDefault();
  display = name;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch((error) => {
      const {code, message} = error;

      display = null;
      Materialize.toast(error, 5000, 'rounded');
    });
}

function login(e) {
  const {email, password} = inputs.loginValues;

  e.preventDefault();
  console.log(inputs.loginValues)
  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
      const {code, message} = error;

      console.log(error);
      Materialize.toast(error, 5000, 'rounded');
    });
}

function uiLogoutLogic(toast) {
  const form = document.querySelector('#auth-form');

  inputs.name.markup.innerHTML = inputs.name.defaultHTML;
  inputs.buttons.signout.classList.add('hidden');
  form.classList.remove('hidden');
  if (toast)
    Materialize.toast('Buh bye bye!', 2000, 'rounded');
}

function signOut(e) {
  e.preventDefault();
  firebase.auth().signOut()
    .then(() => {
      uiLogoutLogic(toast);
    })
    .catch(error =>{
      const {code, message} = error;
      
      uiLogoutLogic(true);
    })
}

firebase.auth().onAuthStateChanged(user => {
  const form = document.querySelector('#auth-form');

  if (user) {
    if (!user.name && display) {
      const {name} = inputs.signupInputs;

      user.updateProfile({
        name: display
      });

      inputs.signupInputs.email.value = null;
      inputs.signupInputs.name.value = null;
      inputs.signupInputs.password.value = null;
    }
    
    inputs.name.markup.innerHTML = `Hello!`;
    inputs.buttons.signout.classList.remove('hidden');
    form.classList.add('hidden');
    Materialize.toast('Logged in!', 2000, 'rounded');
  }
  else {
    uiLogoutLogic(false);
  }
})

inputs.buttons.login.addEventListener('click', login);
inputs.buttons.signout.addEventListener('click', signOut);
inputs.buttons.signup.addEventListener('click', signUp);

document.querySelector('button#btn-submit-doggo').addEventListener('click', classify);