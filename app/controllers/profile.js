import Ember from 'ember';

export default Ember.Controller.extend({
	actions:{
		changePicUrl(url){
			// Aqui voy a guardar en mi usuario la url de la foto de perfil
			this.set('model.picURL', url);
		},

		save(){
			this.get('model').save();
		}
	}
});
