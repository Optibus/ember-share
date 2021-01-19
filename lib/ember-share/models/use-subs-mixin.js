import subs from "./subs-handler";
import Utils from "./utils";

//
//   Use Subs Mixin
//
//        Used by Base and array (all).
//
//

export default Ember.Mixin.create({
  useSubs: function useSubs(content, k, idx) {
    const utils = Utils(this);

    if (utils.matchChildToLimitations(k)) return content;

    if (_.isPlainObject(content)) {
      content = {
        tempContent: content,
      };
      var use = "object";
    } else if (_.isArray(content)) {
      content = {
        content,
      };
      var use = "array";
    }
    if (use) {
      let child;
      let _idx;
      const path = idx == null ? k : `${k}.${idx}`;
      let ownPath = Ember.get(this, "_prefix");
      if ((_idx = Ember.get(this, "_idx")) != null) ownPath += `.${_idx}`;
      if (path == ownPath) {
        return this;
      }

      const children = Ember.get(this, "_children");
      const childrenKeys = Object.keys(children);

      if (_.includes(childrenKeys, path)) return children[path];
      child = {};

      let sub = subs[use].extend({
        _children: Ember.get(this, "_children"),
        _prefix: k,
        _idx: idx,
        _sdbProps: Ember.get(this, "_sdbProps"),
        _root: Ember.get(this, "_root"),
      });

      sub = sub.create(content);

      child[path] = sub;
      _.assign(Ember.get(this, "_children"), child);

      return sub;
    }
    return content;
  },
});
