import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service(),
  firebaseApp: Ember.inject.service(),

  passwordVisibility: false,
  isWorking: false,

  showError(message) {
    this.set('errorMsg', message);
    setTimeout(() => { this.set('errorMsg', null) }, 5000) // 1000 == 1 segundo
  },

  actions: {
    togglePasswordVisibility() {
      this.toggleProperty('passwordVisibility'); // Pone el valor inverso cada que se ejecuta
    },

    signup() {
      this.set('isWorking', true);
      // Obtener las variables del registro
      // email
      // password
      // passwordConfirmation
      let email = this.get('email');
      let password = this.get('password');
      let confirmation = this.get('passwordConfirmation');
      let nombre = this.get('nombre');
      // Otra forma de hacer lo anterior
      // let {email, password, confirmation} = this.getProperties('email', 'password', 'passwordConfirmation');

      if (password == confirmation) {
        // Enviar las variables de email y password a Firebase
        let registrationPromise = this.get('firebaseApp').auth().createUserWithEmailAndPassword(
          email,
          password
        );

        // Dentro de este .then ya se registró correctamente
        registrationPromise.then((response) => {
          // Agregamos un modelo llamado User, para guardar datos adicionales
          // El ID de ese modelo es el mismo a UID que nos regresa Firebase
          return this.store.createRecord('user', { nombre: nombre, id: response.uid }).save().then(() => {
            this.set('isWorking', false);
            window.swal({
              title: 'Yuhu!',
              text: 'Te registraste correctamente',
              confirmButtonText: 'Comencemos',
            }).then(() => {
              return this.transitionToRoute('lista-eventos');
            });
          });
        });

        // Dentro de este .catch es cuando hay errores en el registro
        registrationPromise.catch((response) => {
          this.set('isWorking', false);
          this.showError(response.message);
        });
      } else {
        this.set('isWorking', false);
        this.showError("Password and confirmation don't match");
      }
    },

    signupWithProvider(provider) {
      let promise;
      switch (provider) {
        case 'facebook':
          promise = this.get('session').open('firebase', { provider: 'facebook' });
          break;
          // case 'github':
          //   let promise = this.get('session').open('firebase', {provider: 'github', settings: {}});
          //   break;
      }

      promise.then((payload) => {
        return this.store.createRecord('user', {
          nombre: payload.currentUser.displayName,
          id: payload.uid
        }).save();
      }).then(()=>{ return this.transitionToRoute('lista-eventos') });

      promise.catch((payload) => {
        return this.store.createRecord('user', {
          nombre: payload.currentUser.displayName,
          id: payload.uid
        }).save().then(()=>{ return this.transitionToRoute('lista-eventos') });
      });
    }
  }
});
