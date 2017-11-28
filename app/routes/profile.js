import Ember from 'ember';
import Authenticated from '../mixins/authenticated';

export default Ember.Route.extend(Authenticated, {
	session: Ember.inject.service(),

	model(){
		// El modelo de la ruta es el usuario
		let id = this.get('session.uid');
		return this.store.find('user', id);
	}
});
