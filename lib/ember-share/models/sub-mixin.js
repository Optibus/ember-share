import Utils from "./utils";
import attrs from "../attr";

const allButLast = function (arr) {
  return arr.slice(0, arr.length - 1);
};

//
//   Sub Mixin
//
//        All subs use this mixin (Object and Array)
//
//

export default Ember.Mixin.create({
  _children: function () {
    return {};
  }.property(),

  _sdbProps: function () {
    return [];
  }.property(),

  _subProps: function () {
    return [];
  }.property(),

  doc: Ember.computed.reads("_root.doc"),

  createInnerAttrs: function () {
    const tempContent = Ember.get(this, "tempContent");
    const self = this;
    const attr = attrs("_subProps");
    const keys = [];

    _.forEach(tempContent, function (value, key) {
      keys.push(key);
      Ember.defineProperty(self, key, attr());
    });

    Ember.get(this, "_subProps").addObjects(keys);
    delete this.tempContent;
  }.on("init"),

  beforeFn: function () {
    return [];
  }.property(),
  afterFn: function () {
    return [];
  }.property(),

  activateListeners: function () {
    const utils = Utils(this);

    const beforeFn = utils.beforeAfterChild("Will");
    const afterFn = utils.beforeAfterChild("Did");

    this.removeListeners();

    this.on("before op", beforeFn);
    this.on("op", afterFn);

    this.get("beforeFn").push(beforeFn);
    this.get("afterFn").push(afterFn);
  }
    .observes("doc")
    .on("init"),

  _fullPath(path) {
    const prefix = Ember.get(this, "_prefix");
    const idx = Ember.get(this, "_idx");

    if (prefix) {
      if (idx != null) {
        return `${prefix}.${idx}.${path}`;
      }
      return `${prefix}.${path}`;
    }
    return path;
  },

  deleteProperty(k) {
    const returnValue = this._super(this._fullPath(k));
    this.removeKey(k);
    return returnValue;
  },

  replaceContent(content, noSet) {
    this.notifyWillProperties(this.get("_subProps").toArray());
    const prefix = this.get("_prefix");
    const idx = this.get("_idx");
    const path = idx == null ? prefix : `${prefix}.${idx}`;

    if (!noSet) this._set(path, content);

    const self = this;
    const utils = Utils(this);

    utils.removeChildren(path);

    if (_.isEmpty(Object.keys(this))) {
      Ember.setProperties(this, { tempContent: content });
      this.createInnerAttrs();

      var notifyFather = function (prefixArr, keys) {
        if (_.isEmpty(prefixArr))
          self.get("_root").notifyPropertyChange(keys.join("."));
        else {
          const child = self.get._children[prefixArr.join(".")];
          if (child != null)
            child.notifyPropertyChange(
              `${prefixArr.join(".")}.${keys.join(".")}`
            );
          else keys.push(prefixArr.pop());
          notifyFather(prefixArr, keys);
        }
      };
      const prefixArr = prefix.split(".");
      const key = prefixArr.pop();

      notifyFather(prefixArr, [key]);
    } else {
      if (_.isPlainObject(content))
        var toDelete = _.difference(Object.keys(this), Object.keys(content));
      else var toDelete = Object.keys(this);

      _.forEach(toDelete, function (prop) {
        delete self[prop];
      });
      this.get("_subProps").removeObjects(toDelete);
      Ember.setProperties(this, { tempContent: content });
      this.createInnerAttrs();
      this.notifyDidProperties(this.get("_subProps").toArray());
    }

    return this;
  },

  toJson() {
    const idx = Ember.get(this, "_idx");
    const k = Ember.get(this, "_prefix");
    const path = idx == null ? k : `${k}.${idx}`;
    return this.get(`doc.data.${path}`);
  },

  addKey(key) {
    const attr = attrs("_subProps");
    if (!(this.get("_subProps").indexOf(key) > -1))
      Ember.defineProperty(this, key, attr());
    return this;
  },

  removeKey(key) {
    const attr = attrs("_subProps");
    const utils = Utils(this);
    utils.removeChildren(key, true);
    this.get("_subProps").removeObject(key);
    delete this[key];
    return this;
  },

  removeListeners() {
    if (this.has("before op")) {
      this.off("before op", this.get("beforeFn").pop());
    }
    if (this.has("op")) {
      this.off("op", this.get("afterFn").pop());
    }
  },
});
