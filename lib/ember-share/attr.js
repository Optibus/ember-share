const sillyFunction = function (value) {
  return value;
};

export default function (sdbProps) {
  return function () {
    let options;
    let type;
    options = {};
    type = null;
    _.forEach(arguments, function (arg) {
      if (_.isPlainObject(arg)) {
        return (options = arg);
      }
      if (_.isString(arg)) {
        return (type = arg.charAt(0).toUpperCase() + arg.slice(1));
      }
    });
    if (type != null && window[type] != null) {
      var transfromToType = function (value) {
        const newValue = new window[type](value);
        if (type == "Date") return newValue;
        return newValue.valueOf();
      };
    } else {
      var transfromToType = sillyFunction;
    }

    return Ember.computed({
      get(k) {
        this.get(sdbProps, true).addObject(k);
        const isSpecielKey = _.includes(
          [
            "_isSDB",
            "_sdbProps",
            "_subProps",
            "doc",
            "_prefix",
            "content",
            "_idx",
            "_root",
          ],
          k
        );

        if (isSpecielKey || this._fullPath == null)
          return transfromToType(this._get(k, true));
        return transfromToType(this._get(this._fullPath(k)));
      },
      set(k, v, isFromServer) {
        const path =
          k == null
            ? this.get("_prefix")
            : k == "_idx" || !this._fullPath
            ? k
            : this._fullPath(k);
        return this._set(path, v);
      },
    });
  };
}
