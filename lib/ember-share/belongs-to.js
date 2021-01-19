export default {
  belongsToShare(DS, modelName) {
    const store = this.ShareStore;

    return Ember.computed({
      get(k) {
        let ref;
        return store.findRecord(modelName, this.get(`doc.data.${k}`));
      },
      set(p, oi, isFromServer) {
        return oi;
      },
    });
  },

  belongsTo(DS, modelName) {
    const store = this.originalStore;
    return Ember.computed({
      get(k) {
        let ref;

        return store.findRecord(modelName, this.get((ref = `doc.data.${k}`)));
      },
      set(p, oi, isFromServer) {
        return oi;
      },
    });
  },
};
