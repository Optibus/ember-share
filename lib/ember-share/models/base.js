import UseSubsMixin from "./use-subs-mixin";
import SubMixin from "./sub-mixin";
import SDBSubArray from "./sub-array";
import subs from "./subs-handler";
import Utils from "./utils";

const toJson = function (obj) {
  return obj == null ? void 0 : JSON.parse(JSON.stringify(obj));
};

const getPlainObject = function (value) {
  if (
    value != null &&
    !(
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    )
  )
    if (typeof value.toJson === "function") return value.toJson();
    else return toJson(value);

  return value;
};

//
//   ShareDb Base Class
//
//        Root and all subs (currently not arrays) inherit from base.
//
//

const GetterSettersMixin = Ember.Mixin.create({
  _get(k, selfCall) {
    const firstValue = _.head(k.split("."));

    if (k != "_sdbProps" && _.includes(this.get("_sdbProps"), firstValue)) {
      const content = this.get(`doc.data.${k}`);
      return this.useSubs(content, k);
    }
    return this.get(k);
  },

  _set(path, oi) {
    const firstValue = _.first(path.split("."));
    const self = this;

    if (Ember.get(this, "_prefix") == null) this.get(firstValue);

    if (path != "_sdbProps" && _.includes(this.get("_sdbProps"), firstValue)) {
      const od = getPlainObject(this._get(path));
      oi = getPlainObject(oi);
      const p = path.split(".");
      const utils = Utils(this);
      utils.removeChildren(path, true);
      const op = {
        p,
        od,
        oi,
      };

      if (od == null) delete op.od;

      if (op.oi != op.od) {
        this.get("doc").submitOp([op], function (err) {
          self.get("_root", true).trigger("submitted", err);
        });
      }

      return this.useSubs(oi, path);
    }
    return this.set(path, oi, true);
  },
});
let SDBBase = Ember.Object.extend(Ember.Evented, GetterSettersMixin, {
  _isSDB: true,

  notifyProperties: function notifyProperties(props) {
    const self = this;
    _.forEach(props, function (prop) {
      self.notifyPropertyChange(prop);
    });
    return this;
  },

  notifyDidProperties: function notifyDidProperties(props) {
    const self = this;
    _.forEach(props, function (prop) {
      self.propertyDidChange(prop);
    });
    return this;
  },

  notifyWillProperties: function notifyWillProperties(props) {
    const self = this;
    _.forEach(props, function (prop) {
      self.propertyWillChange(prop);
    });
    return this;
  },

  deleteProperty: function deleteProperty(k) {
    const doc = this.get("doc");
    const p = k.split(".");
    const od = getPlainObject(this.get(`_root.${k}`));
    doc.submitOp([
      {
        p,
        od,
      },
    ]);
  },

  setProperties: function setProperties(obj) {
    const sdbProps = this.get("_sdbProps");
    const self = this;
    const SDBpropsFromObj = _.filter(_.keys(obj), function (key) {
      self.get(key);
      return _.includes(sdbProps, key);
    });
    const nonSDB = _.reject(_.keys(obj), function (key) {
      return _.includes(sdbProps, key);
    });
    this._super(_.pick(obj, nonSDB));
    _.forEach(SDBpropsFromObj, function (key) {
      self.set(key, obj[key]);
    });
    return this;
  },
});

SDBBase = SDBBase.extend(UseSubsMixin);
subs.object = SDBBase.extend(SubMixin);
subs.array = SDBSubArray(SubMixin, GetterSettersMixin).extend(UseSubsMixin);

export default SDBBase;
