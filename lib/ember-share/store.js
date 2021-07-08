/* global BCSocket:false, sharedb:false */
import { guid, patchShare } from "./utils";
import inflector from "./inflector/inflector";

let { singularize, pluralize } = inflector;
singularize = singularize.bind(inflector);
pluralize = pluralize.bind(inflector);
const { Promise } = Ember.RSVP;
const socketReadyState = ["CONNECTING", "OPEN", "CLOSING", "CLOSE"];

const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

export default Ember.Object.extend(Ember.Evented, {
  socket: null,
  connection: null,

  // port: 3000,
  // url : 'https://qa-e.optibus.co',
  url: window.location.hostname,
  init() {
    const store = this;

    this.checkSocket = function () {
      return new Promise(function (resolve, reject) {
        if (store.socket == null) {
          store.one("connectionOpen", resolve);
        } else {
          const checkState = function (state, cb) {
            switch (state) {
              case "connected":
                return resolve();
              case "connecting":
                return store.connection.once("connected", resolve);
              default:
                cb(state);
            }
          };
          const checkStateFail = function (state) {
            switch (state) {
              case "closed":
                return reject("connection closed");
              case "disconnected":
                return reject("connection disconnected");
              case "stopped":
                return reject("connection closing");
            }
          };
          let failed = false;
          checkState(store.connection.state, function (state) {
            if (failed) checkStateFail(state);
            else
              Ember.run.next(this, function () {
                failed = true;
                checkState(store.connection.state, checkStateFail);
              });
          });
        }
      });
    };

    this.checkConnection = function () {
      return new Promise(function (resolve, reject) {
        return store
          .checkSocket()
          .then(function () {
            return resolve();
            if (store.authentication != null && store.isAuthenticated != null) {
              if (store.isAuthenticated) return resolve();
              if (store.isAuthenticating)
                return store.one("authenticated", resolve);
              if (!store.isAuthenticated)
                return store.authentication(store.connection.id);
              // if (!store.isAuthenticating) return reject()
              return reject("could not authenticat");
            }
            return resolve();
          })
          .catch(function (err) {
            return reject(err);
          });
      });
    };

    this.cache = {};
    if (!window.sharedb) {
      throw new Error("sharedb client not included");
    }
    if (window.BCSocket === undefined && window.Primus === undefined) {
      throw new Error("No Socket library included");
    }
    if ( this.beforeConnect )
    {
      this.beforeConnect()
      .then(function(authArgs /* { authToken, customer } */){
        if (authArgs?.authToken && authArgs?.customer) store.setProperties(authArgs);
        store.trigger('connect');
      });
    } else {
      store.trigger("connect");
    }
  },
  doConnect: function (options) {
    const store = this;

    if (window.BCSocket) {
      this.setProperties(options);
      this.socket = new BCSocket(this.get("url"), { reconnect: true });
      this.socket.onerror = function (err) {
        store.trigger("connectionError", [err]);
      };
      this.socket.onopen = function () {
        store.trigger("connectionOpen");
      };
      this.socket.onclose = function () {
        store.trigger("connectionEnd");
      };
    } else if (window.Primus) {
      patchShare();
      this.setProperties(options);
      var hostname = this.get('url');
      if (this.get('protocol'))
        hostname = this.get('protocol') + '://' + hostname;
      hostname += ':' + (this.get('port') ?? 80);
      const authToken = this.get('authToken');
      hostname += authToken ? `?authorization=${authToken}&customer=${this.get('customer')}` : '';
      this.socket = new Primus(hostname, options);
      // console.log('connection starting');

      this.socket.on("error", function error(err) {
        store.trigger("connectionError", [err]);
      });
      this.socket.on("open", function () {
        // console.log('connection open');
        store.trigger("connectionOpen");
      });
      this.socket.on("end", function () {
        store.trigger("connectionEnd");
      });
      this.socket.on("close", function () {
        store.trigger("connectionEnd");
      });
    } else {
      throw new Error("No Socket library included");
    }
    const oldHandleMessage = sharedb.Connection.prototype.handleMessage;
    const oldSend = sharedb.Connection.prototype.send;

    store.on("connectionEnd", function () {
      // console.log('ending connection');
      store.isAuthenticated = false;
    });

    sharedb.Connection.prototype.handleMessage = function (message) {
      let athenticating;
      let handleMessageArgs;
      handleMessageArgs = arguments;
      // console.log(message.a);
      const context = this;
      oldHandleMessage.apply(context, handleMessageArgs);
      if (
        message.a === "init" &&
        typeof message.id === "string" &&
        message.protocol === 1 &&
        typeof store.authenticate === "function"
      ) {
        store.isAuthenticating = true;
        return store
          .authenticate(message.id)
          .then(function () {
            console.log("authenticated !");
            store.isAuthenticating = false;
            store.isAuthenticated = true;
            oldHandleMessage.apply(context, handleMessageArgs);
            store.trigger("authenticated");
          })
          .catch(function (err) {
            store.isAuthenticating = false;
            // store.socket.end()
          });
      }
    };

    this.connection = new sharedb.Connection(this.socket);
  }.on("connect"),
  find(type, id) {
    type = pluralize(type);
    const store = this;
    return this.checkConnection().then(function () {
      return store.findQuery(type, { _id: id }).then(
        function (models) {
          return models[0];
        },
        function (err) {
          return err;
        }
      );
    });
  },
  createRecord(type, data) {
    let ref;
    let path;
    path = (ref = this._getPathForType(type)) ? ref : type.pluralize();
    path = this._getPrefix(type) + path;
    type = pluralize(type);
    const store = this;
    return store.checkConnection().then(function () {
      const doc = store.connection.get(
        path,
        data.id == null ? guid() : data.id
      );
      return Promise.all([
        store.whenReady(doc).then(function (doc) {
          return store.create(doc, data);
        }),
        store.subscribe(doc),
      ]).then(function () {
        const model = store._createModel(type, doc);
        store._cacheFor(type).addObject(model);
        return model;
      });
    });
  },
  deleteRecord(type, id) {
    const cache = this._cacheFor(pluralize(type));
    const model = cache.findBy("id", id);
    const doc = model.get("doc");
    return new Promise(function (resolve, reject) {
      doc.del(function (err) {
        if (err != null) reject(err);
        else {
          resolve();
        }
      });
    });
  },
  findAndSubscribeQuery(type, query) {
    type = pluralize(type);
    const store = this;
    const prefix = this._getPrefix(type);
    // store.cache[type] = []

    return this.checkConnection().then(function () {
      return new Promise(function (resolve, reject) {
        let fetchedResult;
        let _query;
        function fetchQueryCallback(err, results, extra) {
          if (err !== null) {
            return reject(err);
          }
          resolve(
            store._resolveModels(type, results).then(function (models) {
              fetchedResult = models;
              return { models, query: _query };
            })
          );
        }
        _query = store.connection.createSubscribeQuery(
          prefix + type,
          query,
          null,
          fetchQueryCallback
        );
        _query.on("insert", function (docs) {
          store._resolveModels(type, docs).then(function (models) {
            return fetchedResult.addObjects(models);
          });
        });
        _query.on("remove", function (docs) {
          store._resolveModels(type, docs).then(function (models) {
            _.forEach(models, function (model) {
              store.unload(type, model);
            });
            return fetchedResult.removeObjects(models);
          });
        });
      });
    });
  },
  findRecord(type, id) {
    const store = this;
    const cache = store.cache[pluralize(type)];
    return ObjectPromiseProxy.create({
      promise: new Promise(function (resolve, reject) {
        try {
          var cachedRecordAvailable =
            cache[0].doc.id == id && cache.length == 1;
        } catch (e) {}
        if (cachedRecordAvailable) {
          resolve(cache[0]);
        } else {
          store
            .findQuery(type, { _id: id })
            .then(function (results) {
              resolve(results[0]);
            })
            .catch(function (err) {
              reject(err);
            });
        }
      }),
    });
    // return new Promise(function (resolve, reject){
    //   try {
    //     var cachedRecordAvailable = cache[0].doc.id == id && cache.length == 1
    //   } catch (e) { }
    //   if (cachedRecordAvailable) {
    //     resolve(cache[0])
    //   } else {
    //     store.findQuery(type, {_id: id})
    //       .then(function(results){
    //         resolve(results[0])
    //       })
    //       .catch(function (err){
    //         reject(err)
    //       });
    //   }
    // })
  },
  findQuery(type, query) {
    // type = pluralize(type)
    let ref;
    let path;
    path = (ref = this._getPathForType(type)) ? ref : pluralize(type);
    path = this._getPrefix(type) + path;
    const store = this;
    // store.cache[pluralize(type)] = []
    return this.checkConnection().then(function () {
      return new Promise(function (resolve, reject) {
        function fetchQueryCallback(err, results, extra) {
          if (err !== null) {
            return reject(err);
          }
          resolve(store._resolveModels(type, results));
        }
        store.connection.createFetchQuery(
          path,
          query,
          null,
          fetchQueryCallback
        );
      });
    });
  },
  findAll(type, query) {
    type = pluralize(type);
    throw new Error("findAll not implemented");
    // TODO this.connection subscribe style query
  },
  _cacheFor(type) {
    type = pluralize(type);
    let cache = this.cache[type];
    if (cache === undefined) {
      this.cache[type] = cache = [];
    }
    return cache;
  },
  _getPathForType(type) {
    const Adapter = Ember.getOwner(this).lookup(`adapter:${singularize(type)}`);
    if (Adapter && Adapter.pathForType) return Adapter.pathForType(type);
  },
  _getPrefix(type) {
    const Adapter = Ember.getOwner(this).lookup(`adapter:${singularize(type)}`);
    let prefix;
    if (Adapter) prefix = Adapter.get("prefix");
    if (!prefix) prefix = "";
    return prefix;
  },
  _factoryFor(type) {
    let ref;
    const modelStr = (ref = this.get("modelStr")) ? ref : "model-sdb";
    return Ember.getOwner(this).factoryFor(`${modelStr}:${singularize(type)}`);
  },
  _createModel(type, doc) {
    const modelClass = this._factoryFor(type);
    if (modelClass) {
      return modelClass.create({
        doc,
        _type: pluralize(type),
        _store: this,
      });
    }
    throw new Error(`Cannot find model for ${type}`);
  },
  _resolveModel(type, doc) {
    const cache = this._cacheFor(pluralize(type));
    const id = Ember.get(doc, "id") || Ember.get(doc, "_id");
    const model = cache.findBy("id", id);
    if (model !== undefined) {
      return Promise.resolve(model);
    }
    const store = this;
    return store.subscribe(doc).then(function (doc) {
      return store._createModel(type, doc);
    });
  },
  _resolveModels(type, docs) {
    // type = pluralize(type)
    const store = this;
    const cache = this._cacheFor(pluralize(type));
    const models = [];
    const promises = [];
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const model = cache.findBy("id", doc.id);
      if (model) {
        models.push(model);
      } else {
        promises.push(this._resolveModel(type, doc));
      }
    }
    return new Promise(function (resolve, reject) {
      if (!Ember.isEmpty(promises)) {
        Promise.all(promises)
          .then(function (resolvedModels) {
            cache.addObjects(resolvedModels);
            resolve(models.concat(resolvedModels));
          })
          .catch(function (err) {
            reject(err);
          });
      } else {
        resolve(models);
      }
    });
    // return Promise.all(cache);
  },
  /* returns Promise for when sharedb doc is ready */
  whenReady(doc) {
    if (doc.state === "ready") {
      return Promise.resolve(doc);
    }
    return new Promise(function (resolve, reject) {
      doc.on("load", function () {
        Ember.run(null, resolve, doc);
      });
    });
  },
  unloadRecord(doc, cb) {
    const cache = this.cache[doc.get("_type")];
    doc.get("doc").destroy(() => {
      cache.removeObject(doc);
      doc.destroy();
      if (typeof cb === "function") return cb();
    });
    return this;
  },
  unload(type, doc) {
    type = pluralize(type);
    const cache = this._cacheFor(type);
    try {
      doc.get("doc").destroy(() => {
        cache.removeObject(doc);
        doc.destroy();
      });
    } catch (e) {}
    doc.destroy();
    cache.removeObject(doc);
  },
  unloadAll(type) {
    return new Promise((resolve, reject) => {
      const cache = this.cache[pluralize(type)] || [];
      const promises = cache.map((doc) => {
        return new Promise((resolve) => {
          doc.get("doc").destroy(() => {
            doc.destroy();
            resolve();
          });
        });
      });
      return Promise.all(promises)
        .then(() => {
          cache.removeObjects(cache);
          resolve();
        })
        .catch(reject);
    });
  },
  peekAll(type) {
    type = pluralize(type);
    return this._cacheFor(type);
  },
  /* returns Promise for when sharedb doc is subscribed */
  subscribe(doc) {
    if (doc.subscribed) {
      return Promise.resolve(doc);
    }
    return new Promise(function (resolve, reject) {
      doc.subscribe(function (err) {
        if (err === undefined) {
          Ember.run(null, resolve, doc);
        } else {
          Ember.run(null, reject, err);
        }
      });
    });
  },
  /* returns Promise for when sharedb json0 type doc is created */
  create(doc, data) {
    return new Promise(function (resolve, reject) {
      doc.create(data, "json0", function (err) {
        if (err === undefined) {
          Ember.run(null, resolve, doc);
        } else {
          Ember.run(null, reject, err);
        }
      });
    });
  },
});
