/*global describe, specify, it, chai */
import isolatedContainer from 'test/isolated-container';
import Store from 'ember-share/store';
import ShareProxy from 'ember-share/models/share-proxy';

describe('Store', function() {
	var assert = chai.assert;
	chai.should();
	var store,container,newId,lazyStore;
	it('exists', function(){
		assert(Store);
	});
	it('conntects',function(done){
		container = new isolatedContainer(['model:document']);
		// console.log(container);
		store = Store.create({
			url:'http://localhost:9999',
			container: container
		});
		setTimeout(function() {
			console.log(store.connection.state);
			assert.equal(store.connection.state,'connected');
			done();
		}, 100);
	});
	it('can find undefined documents',function(){
		return store.find('document',1).should.eventually.be.undefined;
	});
	it('can create documents',function(done){
		var Doc = ShareProxy.extend({
			id: null
		});
		container.register('model:document',Doc,{singleton: false});
		store.createRecord('document',{title:'Batman'})
		.then(function(model){
			assert.equal(model.get('title'),'Batman');
			newId = model.get('id');
			done();
		});
	});
	it('can find defined documents',function(){
		return store.find('document',newId).should.eventually.be.defined;
	});
	it('can handle async', function(done){
		lazyStore = Store.create({
			url:'http://localhost:9999',
			container: container,
			beforeConnect : function(){
				return new Ember.RSVP.Promise(function(resolve,reject){
					setTimeout(function() {
						resolve();
					}, 40);
				});
			}
		});
		setTimeout(function() {
			console.log(lazyStore.connection.state);
			assert.equal(lazyStore.connection.state,'connected');
			done();
		}, 100);
	});
});
