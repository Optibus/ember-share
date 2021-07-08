(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ember-share"] = factory();
	else
		root["ember-share"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/ember-share.js":
/*!****************************!*\
  !*** ./lib/ember-share.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _ember_share_mixins_share_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ember-share/mixins/share-text */ "./lib/ember-share/mixins/share-text.js");
/* harmony import */ var _ember_share_models_model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ember-share/models/model */ "./lib/ember-share/models/model.js");
/* harmony import */ var _ember_share_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ember-share/store */ "./lib/ember-share/store.js");
/* harmony import */ var _ember_share_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ember-share/utils */ "./lib/ember-share/utils.js");
/* harmony import */ var _ember_share_attr__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ember-share/attr */ "./lib/ember-share/attr.js");
/* harmony import */ var _ember_share_belongs_to__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ember-share/belongs-to */ "./lib/ember-share/belongs-to.js");







const { belongsTo } = _ember_share_belongs_to__WEBPACK_IMPORTED_MODULE_5__.default;
const { belongsToShare } = _ember_share_belongs_to__WEBPACK_IMPORTED_MODULE_5__.default;

const attr = (0,_ember_share_attr__WEBPACK_IMPORTED_MODULE_4__.default)("_sdbProps");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  ShareTextMixin: _ember_share_mixins_share_text__WEBPACK_IMPORTED_MODULE_0__.default,
  ShareProxy: _ember_share_models_model__WEBPACK_IMPORTED_MODULE_1__.default,
  belongsTo,
  belongsToShare,
  Store: _ember_share_store__WEBPACK_IMPORTED_MODULE_2__.default,
  Utils: _ember_share_utils__WEBPACK_IMPORTED_MODULE_3__.default,
  attr,
});


/***/ }),

/***/ "./lib/ember-share/attr.js":
/*!*********************************!*\
  !*** ./lib/ember-share/attr.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
const sillyFunction = function (value) {
  return value;
};

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(sdbProps) {
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


/***/ }),

/***/ "./lib/ember-share/belongs-to.js":
/*!***************************************!*\
  !*** ./lib/ember-share/belongs-to.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
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
});


/***/ }),

/***/ "./lib/ember-share/inflector/inflections.js":
/*!**************************************************!*\
  !*** ./lib/ember-share/inflector/inflections.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  plurals: [
    [/$/, "s"],
    [/s$/i, "s"],
    [/^(ax|test)is$/i, "$1es"],
    [/(octop|vir)us$/i, "$1i"],
    [/(octop|vir)i$/i, "$1i"],
    [/(alias|status|bonus)$/i, "$1es"],
    [/(bu)s$/i, "$1ses"],
    [/(buffal|tomat)o$/i, "$1oes"],
    [/([ti])um$/i, "$1a"],
    [/([ti])a$/i, "$1a"],
    [/sis$/i, "ses"],
    [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"],
    [/(hive)$/i, "$1s"],
    [/([^aeiouy]|qu)y$/i, "$1ies"],
    [/(x|ch|ss|sh)$/i, "$1es"],
    [/(matr|vert|ind)(?:ix|ex)$/i, "$1ices"],
    [/^(m|l)ouse$/i, "$1ice"],
    [/^(m|l)ice$/i, "$1ice"],
    [/^(ox)$/i, "$1en"],
    [/^(oxen)$/i, "$1"],
    [/(quiz)$/i, "$1zes"],
  ],

  singular: [
    [/s$/i, ""],
    [/(ss)$/i, "$1"],
    [/(n)ews$/i, "$1ews"],
    [/([ti])a$/i, "$1um"],
    [
      /((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(sis|ses)$/i,
      "$1sis",
    ],
    [/(^analy)(sis|ses)$/i, "$1sis"],
    [/([^f])ves$/i, "$1fe"],
    [/(hive)s$/i, "$1"],
    [/(tive)s$/i, "$1"],
    [/([lr])ves$/i, "$1f"],
    [/([^aeiouy]|qu)ies$/i, "$1y"],
    [/(s)eries$/i, "$1eries"],
    [/(m)ovies$/i, "$1ovie"],
    [/(x|ch|ss|sh)es$/i, "$1"],
    [/^(m|l)ice$/i, "$1ouse"],
    [/(bus)(es)?$/i, "$1"],
    [/(o)es$/i, "$1"],
    [/(shoe)s$/i, "$1"],
    [/(cris|test)(is|es)$/i, "$1is"],
    [/^(a)x[ie]s$/i, "$1xis"],
    [/(octop|vir)(us|i)$/i, "$1us"],
    [/(alias|status|bonus)(es)?$/i, "$1"],
    [/^(ox)en/i, "$1"],
    [/(vert|ind)ices$/i, "$1ex"],
    [/(matr)ices$/i, "$1ix"],
    [/(quiz)zes$/i, "$1"],
    [/(database)s$/i, "$1"],
  ],

  irregularPairs: [
    ["person", "people"],
    ["man", "men"],
    ["child", "children"],
    ["sex", "sexes"],
    ["move", "moves"],
    ["cow", "kine"],
    ["zombie", "zombies"],
  ],

  uncountable: [
    "equipment",
    "information",
    "rice",
    "money",
    "species",
    "series",
    "fish",
    "sheep",
    "jeans",
    "police",
  ],
});


/***/ }),

/***/ "./lib/ember-share/inflector/inflector.js":
/*!************************************************!*\
  !*** ./lib/ember-share/inflector/inflector.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _inflections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./inflections */ "./lib/ember-share/inflector/inflections.js");


const { capitalize } = _;

const BLANK_REGEX = /^\s*$/;
const LAST_WORD_DASHED_REGEX = /([\w/-]+[_/\s-])([a-z\d]+$)/;
const LAST_WORD_CAMELIZED_REGEX = /([\w/\s-]+)([A-Z][a-z\d]*$)/;
const CAMELIZED_REGEX = /[A-Z][a-z\d]*$/;

function loadUncountable(rules, uncountable) {
  for (let i = 0, { length } = uncountable; i < length; i++) {
    rules.uncountable[uncountable[i].toLowerCase()] = true;
  }
}

function loadIrregular(rules, irregularPairs) {
  let pair;

  for (let i = 0, { length } = irregularPairs; i < length; i++) {
    pair = irregularPairs[i];

    // pluralizing
    rules.irregular[pair[0].toLowerCase()] = pair[1];
    rules.irregular[pair[1].toLowerCase()] = pair[1];

    // singularizing
    rules.irregularInverse[pair[1].toLowerCase()] = pair[0];
    rules.irregularInverse[pair[0].toLowerCase()] = pair[0];
  }
}

/**
 Inflector.Ember provides a mechanism for supplying inflection rules for your
 application. Ember includes a default set of inflection rules, and provides an
 API for providing additional rules.

 Examples:

 Creating an inflector with no rules.

 ```js
 var inflector = new Ember.Inflector();
 ```

 Creating an inflector with the default ember ruleset.

 ```js
 var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

 inflector.pluralize('cow'); //=> 'kine'
 inflector.singularize('kine'); //=> 'cow'
 ```

 Creating an inflector and adding rules later.

 ```javascript
 var inflector = Ember.Inflector.inflector;

 inflector.pluralize('advice'); // => 'advices'
 inflector.uncountable('advice');
 inflector.pluralize('advice'); // => 'advice'

 inflector.pluralize('formula'); // => 'formulas'
 inflector.irregular('formula', 'formulae');
 inflector.pluralize('formula'); // => 'formulae'

 // you would not need to add these as they are the default rules
 inflector.plural(/$/, 's');
 inflector.singular(/s$/i, '');
 ```

 Creating an inflector with a nondefault ruleset.

 ```javascript
 var rules = {
    plurals:  [
      [ /$/, 's' ]
    ],
    singular: [
      [ /\s$/, '' ]
    ],
    irregularPairs: [
      [ 'cow', 'kine' ]
    ],
    uncountable: [ 'fish' ]
  };

 var inflector = new Ember.Inflector(rules);
 ```

 @class Inflector
 @namespace Ember
 */
function Inflector(ruleSet) {
  ruleSet = ruleSet || {};
  ruleSet.uncountable = ruleSet.uncountable || makeDictionary();
  ruleSet.irregularPairs = ruleSet.irregularPairs || makeDictionary();

  const rules = (this.rules = {
    plurals: ruleSet.plurals || [],
    singular: ruleSet.singular || [],
    irregular: makeDictionary(),
    irregularInverse: makeDictionary(),
    uncountable: makeDictionary(),
  });

  loadUncountable(rules, ruleSet.uncountable);
  loadIrregular(rules, ruleSet.irregularPairs);

  this.enableCache();
}

if (!Object.create && !Object.create(null).hasOwnProperty) {
  throw new Error(
    "This browser does not support Object.create(null), please polyfil with es5-sham: http://git.io/yBU2rg"
  );
}

function makeDictionary() {
  const cache = Object.create(null);
  cache._dict = null;
  delete cache._dict;
  return cache;
}

Inflector.prototype = {
  /**
     @public

     As inflections can be costly, and commonly the same subset of words are repeatedly
     inflected an optional cache is provided.

     @method enableCache
     */
  enableCache() {
    this.purgeCache();

    this.singularize = function (word) {
      this._cacheUsed = true;
      return (
        this._sCache[word] || (this._sCache[word] = this._singularize(word))
      );
    };

    this.pluralize = function (numberOrWord, word, options = {}) {
      this._cacheUsed = true;
      const cacheKey = [numberOrWord, word, options.withoutCount];
      return (
        this._pCache[cacheKey] ||
        (this._pCache[cacheKey] = this._pluralize(numberOrWord, word, options))
      );
    };
  },

  /**
     @public

     @method purgeCache
     */
  purgeCache() {
    this._cacheUsed = false;
    this._sCache = makeDictionary();
    this._pCache = makeDictionary();
  },

  /**
     @public
     disable caching

     @method disableCache;
     */
  disableCache() {
    this._sCache = null;
    this._pCache = null;
    this.singularize = function (word) {
      return this._singularize(word);
    };

    this.pluralize = function () {
      return this._pluralize(...arguments);
    };
  },

  /**
     @method plural
     @param {RegExp} regex
     @param {String} string
     */
  plural(regex, string) {
    if (this._cacheUsed) {
      this.purgeCache();
    }
    this.rules.plurals.push([regex, string.toLowerCase()]);
  },

  /**
     @method singular
     @param {RegExp} regex
     @param {String} string
     */
  singular(regex, string) {
    if (this._cacheUsed) {
      this.purgeCache();
    }
    this.rules.singular.push([regex, string.toLowerCase()]);
  },

  /**
     @method uncountable
     @param {String} regex
     */
  uncountable(string) {
    if (this._cacheUsed) {
      this.purgeCache();
    }
    loadUncountable(this.rules, [string.toLowerCase()]);
  },

  /**
     @method irregular
     @param {String} singular
     @param {String} plural
     */
  irregular(singular, plural) {
    if (this._cacheUsed) {
      this.purgeCache();
    }
    loadIrregular(this.rules, [[singular, plural]]);
  },

  /**
     @method pluralize
     @param {String} word
     */
  pluralize() {
    return this._pluralize(...arguments);
  },

  _pluralize(wordOrCount, word, options = {}) {
    if (word === undefined) {
      return this.inflect(
        wordOrCount,
        this.rules.plurals,
        this.rules.irregular
      );
    }

    if (parseFloat(wordOrCount) !== 1) {
      word = this.inflect(word, this.rules.plurals, this.rules.irregular);
    }

    return options.withoutCount ? word : `${wordOrCount} ${word}`;
  },

  /**
     @method singularize
     @param {String} word
     */
  singularize(word) {
    return this._singularize(word);
  },

  _singularize(word) {
    return this.inflect(word, this.rules.singular, this.rules.irregularInverse);
  },

  /**
     @protected

     @method inflect
     @param {String} word
     @param {Object} typeRules
     @param {Object} irregular
     */
  inflect(word, typeRules, irregular) {
    let inflection;
    let substitution;
    let result;
    let lowercase;
    let wordSplit;
    let lastWord;
    let isBlank;
    let isCamelized;
    let rule;
    let isUncountable;

    isBlank = !word || BLANK_REGEX.test(word);
    isCamelized = CAMELIZED_REGEX.test(word);

    if (isBlank) {
      return word;
    }

    lowercase = word.toLowerCase();
    wordSplit =
      LAST_WORD_DASHED_REGEX.exec(word) || LAST_WORD_CAMELIZED_REGEX.exec(word);

    if (wordSplit) {
      lastWord = wordSplit[2].toLowerCase();
    }

    isUncountable =
      this.rules.uncountable[lowercase] || this.rules.uncountable[lastWord];

    if (isUncountable) {
      return word;
    }

    for (rule in irregular) {
      if (lowercase.match(`${rule}$`)) {
        substitution = irregular[rule];

        if (isCamelized && irregular[lastWord]) {
          substitution = capitalize(substitution);
          rule = capitalize(rule);
        }

        return word.replace(new RegExp(rule, "i"), substitution);
      }
    }

    for (let i = typeRules.length, min = 0; i > min; i--) {
      inflection = typeRules[i - 1];
      rule = inflection[0];

      if (rule.test(word)) {
        break;
      }
    }

    inflection = inflection || [];

    rule = inflection[0];
    substitution = inflection[1];

    result = word.replace(rule, substitution);

    return result;
  },
};

Inflector.defaultRules = _inflections__WEBPACK_IMPORTED_MODULE_0__.default;
Inflector.inflector = new Inflector(_inflections__WEBPACK_IMPORTED_MODULE_0__.default);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Inflector.inflector);


/***/ }),

/***/ "./lib/ember-share/mixins/share-text.js":
/*!**********************************************!*\
  !*** ./lib/ember-share/mixins/share-text.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./lib/ember-share/utils.js");
/*
 * Share-text mixin, this mixin sends text operations instead of the default
 * behaviour which is to replace the entire string. to utilize the mixin add
 * the text property names to the textKeys array
 */


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ember.Mixin.create({
  textKeys: [],
  triggerEvents: false,
  textEvents: function () {
    const that = this;
    this._textContexts = new Array(this.textKeys.length);

    // to hold the listners and remove them on destory
    this._handlers = new Array(this._textContexts.length * 2);
    for (let i = 0; i < this.textKeys.length; i++) {
      const key = this.textKeys[i];
      const subCtx = this._context.createContextAt([key]);
      this._handlers[key] = new Array(2);

      // server changes -> local
      this._handlers[key].push(
        subCtx.on("insert", Ember.run.bind(this, this.handleInsert, key))
      );
      this._handlers[key].push(
        subCtx.on("delete", Ember.run.bind(this, this.handleDelete, key))
      );
      this._textContexts[key] = subCtx;
    }
  }.on("init"),
  setUnknownProperty(key, value) {
    if (this.textKeys.indexOf(key) >= 0) {
      // local changes -> server
      this.textOp(key, value);
    } else {
      this._super(key, value);
    }
  },
  textOp(key, value) {
    // when the object was removed but has a lingering binding
    // propably an assertion is better
    if (this._context.get() === undefined) {
      return;
    }
    this.propertyWillChange(key);
    const components = _utils__WEBPACK_IMPORTED_MODULE_0__.diff.diff(
      this._cache[key] || "",
      value.replace(/\r\n/g, "\n")
    );
    this._cache[key] = value.replace(/\r\n/g, "\n");
    let changePosition = 0;
    for (let i = 0; i < components.length; i++) {
      if (components[i].added) {
        this._context.insert([key, changePosition], components[i].value);
      } else if (components[i].removed) {
        this._context.remove([key, changePosition], components[i].value.length);
      }
      changePosition += components[i].value.length;
    }
    this.propertyDidChange(key);
  },
  handleInsert(key, position, data) {
    this.propertyWillChange(key);
    if (this._cache[key] === undefined) {
      // force caching
      this.get(key);
    }
    const updatedText =
      this._cache[key].slice(0, position) +
      data +
      this._cache[key].slice(position);
    this._cache[key] = updatedText;
    // use trigger to update the view when in DOM
    if (this.triggerEvents) {
      this.trigger("textInsert", position, data);
    }
    this.propertyDidChange(key);
  },
  handleDelete(key, position, data) {
    if (this._cache[key] === undefined) {
      // force caching
      this.get(key);
    }
    this.propertyWillChange(key);
    const { length } = data;
    const updatedText =
      this._cache[key].slice(0, position) +
      this._cache[key].slice(position + length);
    this._cache[key] = updatedText;
    // use trigger to update the view when in DOM
    if (this.triggerEvents) {
      this.trigger("textDelete", position, data);
    }
    this.propertyDidChange(key);
  },
  willDestroy() {
    // remove the listners
    for (const key in this._textContexts) {
      this._textContexts[key].removeListener(this._handlers[key][0]);
      this._textContexts[key].removeListener(this._handlers[key][1]);
      this._textContexts[key].destroy();
    }
    this._super();
  },
}));


/***/ }),

/***/ "./lib/ember-share/models/base.js":
/*!****************************************!*\
  !*** ./lib/ember-share/models/base.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _use_subs_mixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-subs-mixin */ "./lib/ember-share/models/use-subs-mixin.js");
/* harmony import */ var _sub_mixin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sub-mixin */ "./lib/ember-share/models/sub-mixin.js");
/* harmony import */ var _sub_array__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sub-array */ "./lib/ember-share/models/sub-array.js");
/* harmony import */ var _subs_handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./subs-handler */ "./lib/ember-share/models/subs-handler.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "./lib/ember-share/models/utils.js");






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
      const utils = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.default)(this);
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

SDBBase = SDBBase.extend(_use_subs_mixin__WEBPACK_IMPORTED_MODULE_0__.default);
_subs_handler__WEBPACK_IMPORTED_MODULE_3__.default.object = SDBBase.extend(_sub_mixin__WEBPACK_IMPORTED_MODULE_1__.default);
_subs_handler__WEBPACK_IMPORTED_MODULE_3__.default.array = (0,_sub_array__WEBPACK_IMPORTED_MODULE_2__.default)(_sub_mixin__WEBPACK_IMPORTED_MODULE_1__.default, GetterSettersMixin).extend(_use_subs_mixin__WEBPACK_IMPORTED_MODULE_0__.default);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SDBBase);


/***/ }),

/***/ "./lib/ember-share/models/model.js":
/*!*****************************************!*\
  !*** ./lib/ember-share/models/model.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./lib/ember-share/models/utils.js");
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base */ "./lib/ember-share/models/base.js");



//
//   ShareDb Ember Model Class
//
//        extends Base.
//        this is model has a recursive structure, getting an inner object or array will return
//        a sub object which is conencted to its parent.
//        an over view of the entire structure can be found here:
//        https://www.gliffy.com/go/share/sn1ehtp86ywtwlvhsxid
//
//

const SDBRoot = _base__WEBPACK_IMPORTED_MODULE_1__.default.extend({
  unload() {
    return this.get("_store").unload(this.get("_type"), this);
  },

  id: Ember.computed.reads("doc.id"),

  _childLimiations: function () {
    return [];
  }.property(),

  _root: function () {
    return this;
  }.property(),

  _children: function () {
    return {};
  }.property(),

  _sdbProps: function () {
    return [];
  }.property(),

  setOpsInit: function () {
    const doc = this.get("doc", true);
    const oldDoc = this.get("oldDoc");
    const utils = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.default)(this);
    const self = this;

    if (oldDoc) {
      oldDoc.destroy();
    }

    if (false) {} else {
      doc.on("before component", utils.beforeAfter("Will"));
      doc.on("after component", utils.beforeAfter("Did"));
    }

    this.set("oldDoc", doc);
  }
    .observes("doc")
    .on("init"),

  willDestroy() {
    if (this.get("doc")) {
      this.get("doc").destroy(() => {
        const utils = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.default)(this);
        this._super.apply(this, arguments);
        utils.removeChildren();
      });
    }
  },
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SDBRoot);


/***/ }),

/***/ "./lib/ember-share/models/sub-array.js":
/*!*********************************************!*\
  !*** ./lib/ember-share/models/sub-array.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _sub_mixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sub-mixin */ "./lib/ember-share/models/sub-mixin.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./lib/ember-share/models/utils.js");



const allButLast = function (arr) {
  return arr.slice(0, arr.length - 1);
};

//
//   Sub Array Class
//
//        this is An Ember Array Proxy, uses sub mixin and 'Use Sub Mixin'
//
//

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(SubMixin, GetterSettersMixin) {
  return Ember.ArrayProxy.extend(Ember.Evented, SubMixin, GetterSettersMixin, {
    _isArrayProxy: true,

    arrayContentDidChange(startIdx, removeAmt, addAmt) {
      const _removeAmt = removeAmt == null ? 0 : removeAmt * -1;
      if (_removeAmt + (addAmt == null) ? 0 : addAmt)
        Ember.get(this, "content").propertyDidChange("lastObject");
      return this._super.apply(this, arguments);
    },

    arrayContentWillChange(startIdx, removeAmt, addAmt) {
      const children = Ember.get(this, "_children");
      const childrenKeys = Object.keys(children);
      const prefix = Ember.get(this, "_prefix");
      const self = this;
      const utils = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.default)(this);

      const replaceLastIdx = function (str, idx) {
        const arr = allButLast(str.split("."));
        return `${arr.join(".")}.${idx}`;
      };
      const _removeAmt = removeAmt == null ? 0 : removeAmt * -1;
      addAmt = addAmt == null ? 0 : addAmt;
      if (_removeAmt + addAmt)
        Ember.get(this, "content").propertyWillChange("lastObject");
      const childrenKeysReduced = _.reduce(
        childrenKeys,
        function (result, key) {
          if (allButLast(key.split(".")).join(".") == prefix) result.push(key);
          return result;
        },
        []
      );
      _.forEach(childrenKeysReduced, function (childKey) {
        const idx = +_.last(childKey.split("."));
        if (!isNaN(idx)) {
          const child = children[childKey];
          if (_removeAmt + addAmt == 0) {
            if (idx >= addAmt) {
              utils.removeChildren(childKey, true);
              Ember.get(self, "content").propertyWillChange("lastObject");
            }
          } else if (
            (addAmt && startIdx <= idx) ||
            (removeAmt && startIdx < idx)
          ) {
            const newIdx = idx + _removeAmt + addAmt;
            const newChildKey = replaceLastIdx(childKey, newIdx);
            childrenKeys
              .filter(function (childKeyA) {
                return childKeyA.match(new RegExp(`^${childKey}\\.`));
              })
              .forEach(function (grandChildKey) {
                const grandChild = children[grandChildKey];
                const newGrandChildKey = grandChildKey.replace(
                  new RegExp(`^${childKey}`),
                  newChildKey
                );
                grandChild.set("_prefix", newGrandChildKey);
                delete children[grandChildKey];
                children[newGrandChildKey] = grandChild;
              });
            delete children[childKey];
            const tempChild = {};
            tempChild[replaceLastIdx(childKey, newIdx)] = child;
            _.assign(children, tempChild);
            Ember.set(child, "_idx", newIdx);
          }
        }
      });
      return this._super.apply(this, arguments);
    },

    // useSubs:

    replaceContent(content, noSet) {
      let removeAmt;
      let addAmt;
      const prefix = Ember.get(this, "_prefix");
      const children = Ember.get(this, "_children");
      _.forEach(this.toArray(), function (value, index) {
        const child = children[`${prefix}.${index}`];
        if (child != null)
          if (content[index] != null)
            child.replaceContent(content[index], true);
          else {
            delete children[`${prefix}.${index}`];
            child.destroy();
          }
      });

      if (!noSet) this._set(prefix, content);

      Ember.set(this, "content", content);
      return this;
    },

    _submitOp(p, li, ld) {
      const path = this.get("_prefix").split(".");
      const op = {
        p: path.concat(p),
      };

      if (typeof li !== "undefined") op.li = li;

      if (typeof ld !== "undefined") op.ld = ld;

      if (li != null || ld != null) {
        return this.get("doc").submitOp([op]);
      }
    },

    objectAt(idx) {
      const content = this._super(idx);
      const prefix = this.get("_prefix");
      return this.useSubs(content, prefix, idx);
    },

    toJson() {
      const self = this;
      return _.map(this.toArray(), function (value) {
        if (typeof value === "string" || typeof value === "number")
          return value;
        return value.toJson();
      });
    },

    _replace(start, len, objects) {
      if (!_.isArray(objects)) {
        objects = [objects];
      }
      this.arrayContentWillChange(start, len, objects.length);
      const iterationLength = len > objects.length ? len : objects.length;
      for (let i = 0; i < iterationLength; i++) {
        const newIndex = i + start;
        let obj = objects.objectAt(i);
        if (obj != null) obj = obj.toJson == null ? obj : obj.toJson();
        let oldObj = this.objectAt(newIndex);
        if (oldObj != null)
          oldObj = oldObj.toJson == null ? oldObj : oldObj.toJson();
        this._submitOp(newIndex, obj, len > i ? oldObj : undefined);
      }
      this.arrayContentDidChange(start, len, objects.length);
      const realContent = this.get(`doc.data.${this.get("_prefix")}`);
      if (!_.isEqual(this.get("content"), realContent)) {
        this.onChangeDoc();
      }
      return this;
    },

    onChangeDoc: function () {
      // debugger
      // this.set ('content', this.get('doc.data.' + this.get('_prefix')))
      // Ember.run.next (this, function () P{})
      this.replaceContent(this.get(`doc.data.${this.get("_prefix")}`), true);
    }.observes("doc"),
  });
}


/***/ }),

/***/ "./lib/ember-share/models/sub-mixin.js":
/*!*********************************************!*\
  !*** ./lib/ember-share/models/sub-mixin.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./lib/ember-share/models/utils.js");
/* harmony import */ var _attr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../attr */ "./lib/ember-share/attr.js");



//
//   Sub Mixin
//
//        All subs use this mixin (Object and Array)
//
//

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ember.Mixin.create({
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
    const attr = (0,_attr__WEBPACK_IMPORTED_MODULE_1__.default)("_subProps");
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
    const utils = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.default)(this);

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

    if (!noSet) {
      this._set(path, content);
    }

    const self = this;
    const utils = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.default)(this);

    utils.removeChildren(path);

    if (_.isEmpty(Object.keys(this))) {
      Ember.setProperties(this, { tempContent: content });
      this.createInnerAttrs();

      const notifyFather = function (prefixArr, keys) {
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
      let toDelete;
      if (_.isPlainObject(content)) {
        toDelete = _.difference(Object.keys(this), Object.keys(content));
      } else {
        toDelete = Object.keys(this);
      }

      _.forEach(toDelete, (prop) => {
        delete self[prop];
      });
      this.get("_subProps").removeObjects(toDelete);
      Ember.setProperties(this, { tempContent: content });
      this.createInnerAttrs();
    }
    this.notifyDidProperties(this.get("_subProps").toArray());

    return this;
  },

  toJson() {
    const idx = Ember.get(this, "_idx");
    const k = Ember.get(this, "_prefix");
    const path = idx == null ? k : `${k}.${idx}`;
    return this.get(`doc.data.${path}`);
  },

  addKey(key) {
    const attr = (0,_attr__WEBPACK_IMPORTED_MODULE_1__.default)("_subProps");
    if (!(this.get("_subProps").indexOf(key) > -1))
      Ember.defineProperty(this, key, attr());
    return this;
  },

  removeKey(key) {
    const utils = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.default)(this);
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
}));


/***/ }),

/***/ "./lib/ember-share/models/subs-handler.js":
/*!************************************************!*\
  !*** ./lib/ember-share/models/subs-handler.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
//
//   Subs Handler
//
//        since we have a recursive model structure there is a need for
//        creating the subs in a common place and then reuse it in its own class.
//
//

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  object: {},
  array: {},
});


/***/ }),

/***/ "./lib/ember-share/models/use-subs-mixin.js":
/*!**************************************************!*\
  !*** ./lib/ember-share/models/use-subs-mixin.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _subs_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subs-handler */ "./lib/ember-share/models/subs-handler.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./lib/ember-share/models/utils.js");



//
//   Use Subs Mixin
//
//        Used by Base and array (all).
//
//

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ember.Mixin.create({
  useSubs: function useSubs(content, k, idx) {
    const utils = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.default)(this);

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

      let sub = _subs_handler__WEBPACK_IMPORTED_MODULE_0__.default[use].extend({
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
}));


/***/ }),

/***/ "./lib/ember-share/models/utils.js":
/*!*****************************************!*\
  !*** ./lib/ember-share/models/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ f
/* harmony export */ });
function f(context) {
  return {
    isOpOnArray(op) {
      return op.ld != null || op.lm != null || op.li != null;
    },

    matchingPaths(as, bs) {
      let counter = 0;
      const higherLength = as.length > bs.length ? as.length : bs.length;
      while (
        (as[counter] == "*" || as[counter] == bs[counter]) &&
        counter < higherLength
      ) {
        counter += 1;
      }
      return counter - as.length / 1000;
    },

    matchChildToLimitations(key) {
      const childLimiations = Ember.get(context, "_root._childLimiations");
      let prefix = Ember.get(context, "_prefix");

      if (prefix == null || key.match(prefix)) prefix = key;
      else prefix += `.${key}`;

      prefix = prefix.split(".");
      const self = this;
      return _.some(childLimiations, (_limit) => {
        const limit = _limit.split("/");
        return (
          prefix.length == limit.length &&
          Math.ceil(self.matchingPaths(limit, prefix)) == prefix.length
        );
      });
    },

    prefixToChildLimiations(key) {
      const childLimiations = Ember.get(context, "_root._childLimiations");
      let prefix = Ember.get(context, "_prefix");

      if (prefix == null || key.match(prefix)) prefix = key;
      else prefix += `.${key}`;

      prefix = prefix.split(".");
      const self = this;
      let limiationsArray;

      const relevantLimitIndex = this.findMaxIndex(
        (limiationsArray = _.map(childLimiations, (_limit) => {
          const limit = _limit.split("/");
          const result = Math.ceil(self.matchingPaths(limit, prefix));
          return result < limit.length ? 0 : result;
        }))
      );
      if (relevantLimitIndex >= 0 && limiationsArray[relevantLimitIndex] > 0) {
        const relevantLimit = childLimiations[relevantLimitIndex].split("/");
        let orignalPrefix;
        const result = prefix.slice(
          0,
          Math.ceil(self.matchingPaths(relevantLimit, prefix))
        );
        if ((orignalPrefix = Ember.get(context, "_prefix"))) {
          orignalPrefix = orignalPrefix.split(".");
          return result.slice(orignalPrefix.length).join(".");
        }
        return result.join(".");
      }
      return key;
    },

    removeChildren(path, includeSelf) {
      const children = Ember.get(context, "_children");
      let childrenKeys = Object.keys(children);
      const prefix = context.get("_prefix");
      const utils = this;

      if (prefix != null && path && path.indexOf(prefix) != 0) {
        path = `${prefix}.${path}`;
      }

      if (path) {
        childrenKeys = _.reduce(
          childrenKeys,
          (result, key) => {
            if (key == path) {
              if (includeSelf) result.push(key);
            } else if (key.indexOf(path) == 0) result.push(key);
            return result;
          },
          []
        );
      }

      _.forEach(childrenKeys, (key) => {
        children[key].removeListeners();
        children[key].destroy();
        delete children[key];
      });
    },

    comparePathToPrefix(path, prefix) {
      return Boolean(
        Math.ceil(this.matchingPaths(path.split("."), prefix.split(".")))
      );
    },

    cutLast(path, op) {
      let tempPath;
      if (this.isOpOnArray(op) && !isNaN(+_.last(path))) {
        tempPath = _.clone(path);
        tempPath.pop();
      }
      return tempPath || path;
    },

    comparePathToChildren(path, op) {
      const utils = this;
      const children = Ember.get(context, "_children");
      const childrenKeys = Object.keys(children);
      const hasChildren = _.some(childrenKeys, (childKey) => {
        const pathsCounter = utils.matchingPaths(
          childKey.split("."),
          utils.cutLast(path, op)
        );
        return Math.ceil(pathsCounter) == childKey.split(".").length;
      });
      return !Ember.isEmpty(childrenKeys) && hasChildren;
    },

    triggerChildren(didWill, op, isFromClient) {
      const newP = _.clone(op.p);
      // var children = Ember.get(context, '_children');
      const children = context.get("_children");
      const childrenKeys = Object.keys(children);
      if (Ember.isEmpty(childrenKeys)) return;
      let child;

      const utils = this;
      const counterToChild = _.mapKeys(children, (v, childKey) => {
        if (utils.isOpOnArray(op) && !isNaN(+_.last(childKey.split("."))))
          return 0;
        return utils.matchingPaths(
          utils.cutLast(childKey.split("."), op),
          utils.cutLast(op.p, op)
        );
      });
      const toNumber = function f(strings) {
        return _.map(strings, (s) => +s);
      };
      const chosenChild =
        counterToChild[_.max(toNumber(Object.keys(counterToChild)))];
      if (didWill == "Will")
        chosenChild.trigger("before op", [op], isFromClient);
      if (didWill == "Did") chosenChild.trigger("op", [op], isFromClient);
    },

    beforeAfter(didWill) {
      const utils = this;
      let ex;
      return function f(ops, isFromClient) {
        if (!isFromClient) {
          _.forEach(ops, (op) => {
            if (utils.comparePathToChildren(op.p, op)) {
              utils.triggerChildren(didWill, op, isFromClient);
            } else if (utils.isOpOnArray(op)) {
              ex = utils.extractArrayPath(op);

              context
                .get(ex.p)
                [`arrayContent${didWill}Change`](
                  ex.idx,
                  ex.removeAmt,
                  ex.addAmt
                );
            } else {
              context[`property${didWill}Change`](
                utils.prefixToChildLimiations(op.p.join("."))
              );
            }
          });
        }
      };
    },

    beforeAfterChild(didWill) {
      const utils = this;
      let ex;
      let prefix;
      let _idx;
      return function (ops, isFromClient) {
        if ((_idx = Ember.get(context, "_idx")) != null || !isFromClient) {
          _.forEach(ops, (op) => {
            if (
              op.p.join(".") == (prefix = Ember.get(context, "_prefix")) &&
              didWill == "Did"
            ) {
              if (op.oi != null) {
                const content = context.get(`_root.doc.data.${prefix}`);
                context.replaceContent(content, true);
              } else if (op.od != null) {
                const fatherPrefix = prefix.split(".");
                const key = fatherPrefix.pop();
                var father;
                if (
                  !_.isEmpty(fatherPrefix) &&
                  (father = context.get(`_children.${fatherPrefix.join(".")}`))
                )
                  father.removeKey(key);
                else context.get("_root").propertyDidChange(prefix);
              }
            } else {
              const path =
                _idx == null
                  ? prefix.split(".")
                  : prefix.split(".").concat(String(_idx));
              const newP = _.difference(op.p, path);
              if (utils.comparePathToPrefix(op.p.join("."), prefix)) {
                if (
                  utils.isOpOnArray(op) &&
                  Ember.get(context, "_idx") == null
                ) {
                  var newOp = _.clone(op);
                  newOp.p = newP;
                  ex = utils.extractArrayPath(newOp);

                  if (ex.p == "")
                    context[`arrayContent${didWill}Change`](
                      ex.idx,
                      ex.removeAmt,
                      ex.addAmt
                    );
                  else
                    Ember.get(context, ex.p)[`arrayContent${didWill}Change`](
                      ex.idx,
                      ex.removeAmt,
                      ex.addAmt
                    );
                } else if (newP.join(".") == "") {
                  // delete self from father
                  if (
                    _.isEmpty(newOp) &&
                    op.od &&
                    op.oi == null &&
                    _.isEqual(op.od, context.toJson())
                  ) {
                    const keyToRemove = path.pop();
                    if (_.isEmpty(path)) {
                      utils.removeChildren(keyToRemove, true);
                    } else {
                      var father = context.get("_children")[path.join(".")];
                      father.removeKey(keyToRemove);
                    }
                  } else {
                    // context["property" + didWill + "Change"]('content');
                  }
                } else {
                  if (op.oi && op.od == null) {
                    context.addKey(_.head(newP));
                  }

                  if (op.od && op.oi == null) {
                    context.notifyPropertyChange(
                      utils.prefixToChildLimiations(newP.join("."))
                    );
                    if (newP.length === 1) {
                      context.removeKey(_.head(newP));
                    }
                  } else {
                    context[`property${didWill}Change`](
                      utils.prefixToChildLimiations(newP.join("."))
                    );
                  }
                }
              }
            }
          });
        }
      };
    },

    findMaxIndex(arr) {
      return arr.indexOf(_.max(arr));
    },

    extractArrayPath(op) {
      return {
        idx: +_.last(op.p),
        p: _.slice(op.p, 0, op.p.length - 1).join("."),
        addAmt: typeof op.li !== "undefined" ? 1 : 0,
        removeAmt: typeof op.ld !== "undefined" ? 1 : 0,
      };
    },
  };
}


/***/ }),

/***/ "./lib/ember-share/store.js":
/*!**********************************!*\
  !*** ./lib/ember-share/store.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./lib/ember-share/utils.js");
/* harmony import */ var _inflector_inflector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inflector/inflector */ "./lib/ember-share/inflector/inflector.js");
/* global BCSocket:false, sharedb:false */



let { singularize, pluralize } = _inflector_inflector__WEBPACK_IMPORTED_MODULE_1__.default;
singularize = singularize.bind(_inflector_inflector__WEBPACK_IMPORTED_MODULE_1__.default);
pluralize = pluralize.bind(_inflector_inflector__WEBPACK_IMPORTED_MODULE_1__.default);
const { Promise } = Ember.RSVP;
const socketReadyState = ["CONNECTING", "OPEN", "CLOSING", "CLOSE"];

const ObjectPromiseProxy = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ember.Object.extend(Ember.Evented, {
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
      (0,_utils__WEBPACK_IMPORTED_MODULE_0__.patchShare)();
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
        data.id == null ? (0,_utils__WEBPACK_IMPORTED_MODULE_0__.guid)() : data.id
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
}));


/***/ }),

/***/ "./lib/ember-share/utils.js":
/*!**********************************!*\
  !*** ./lib/ember-share/utils.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "guid": () => /* binding */ guid,
/* harmony export */   "diff": () => /* binding */ diff,
/* harmony export */   "isArray": () => /* binding */ isArray,
/* harmony export */   "patchShare": () => /* binding */ patchShare
/* harmony export */ });
function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 3) | 8;
    return v.toString(16);
  });
}

/*
 * Software License Agreement (BSD License)
 *
 * Copyright (c) 2009-2011, Kevin Decker kpdecker@gmail.com
 *
 * Text diff implementation.
 *
 * This library supports the following APIS:
 * JsDiff.diffChars: Character by character diff
 * JsDiff.diffWords: Word (as defined by \b regex) diff which ignores whitespace
 * JsDiff.diffLines: Line based diff
 *
 * JsDiff.diffCss: Diff targeted at CSS content
 *
 * These methods are based on the implementation proposed in
 * "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).
 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
 * All rights reserved.
 */
function clonePath(path) {
  return { newPos: path.newPos, components: path.components.slice(0) };
}
const fbDiff = function (ignoreWhitespace) {
  this.ignoreWhitespace = ignoreWhitespace;
};
fbDiff.prototype = {
  diff(oldString, newString) {
    // Handle the identity case (this is due to unrolling editLength == 0
    if (newString === oldString) {
      return [{ value: newString }];
    }
    if (!newString) {
      return [{ value: oldString, removed: true }];
    }
    if (!oldString) {
      return [{ value: newString, added: true }];
    }

    newString = this.tokenize(newString);
    oldString = this.tokenize(oldString);

    const newLen = newString.length;
    const oldLen = oldString.length;
    const maxEditLength = newLen + oldLen;
    const bestPath = [{ newPos: -1, components: [] }];

    // Seed editLength = 0
    let oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      return bestPath[0].components;
    }

    for (let editLength = 1; editLength <= maxEditLength; editLength++) {
      for (
        let diagonalPath = -1 * editLength;
        diagonalPath <= editLength;
        diagonalPath += 2
      ) {
        var basePath;
        const addPath = bestPath[diagonalPath - 1];
        const removePath = bestPath[diagonalPath + 1];
        oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        const canAdd = addPath && addPath.newPos + 1 < newLen;
        const canRemove = removePath && oldPos >= 0 && oldPos < oldLen;
        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = undefined;
          continue;
        }

        // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph
        if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
          basePath = clonePath(removePath);
          this.pushComponent(
            basePath.components,
            oldString[oldPos],
            undefined,
            true
          );
        } else {
          basePath = clonePath(addPath);
          basePath.newPos++;
          this.pushComponent(
            basePath.components,
            newString[basePath.newPos],
            true,
            undefined
          );
        }

        oldPos = this.extractCommon(
          basePath,
          newString,
          oldString,
          diagonalPath
        );

        if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
          return basePath.components;
        }
        bestPath[diagonalPath] = basePath;
      }
    }
  },

  pushComponent(components, value, added, removed) {
    const last = components[components.length - 1];
    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = {
        value: this.join(last.value, value),
        added,
        removed,
      };
    } else {
      components.push({ value, added, removed });
    }
  },
  extractCommon(basePath, newString, oldString, diagonalPath) {
    const newLen = newString.length;
    const oldLen = oldString.length;
    let { newPos } = basePath;
    let oldPos = newPos - diagonalPath;
    while (
      newPos + 1 < newLen &&
      oldPos + 1 < oldLen &&
      this.equals(newString[newPos + 1], oldString[oldPos + 1])
    ) {
      newPos++;
      oldPos++;

      this.pushComponent(
        basePath.components,
        newString[newPos],
        undefined,
        undefined
      );
    }
    basePath.newPos = newPos;
    return oldPos;
  },

  equals(left, right) {
    const reWhitespace = /\S/;
    if (
      this.ignoreWhitespace &&
      !reWhitespace.test(left) &&
      !reWhitespace.test(right)
    ) {
      return true;
    }
    return left === right;
  },
  join(left, right) {
    return left + right;
  },
  tokenize(value) {
    return value;
  },
};
// copied from https://github.com/Dignifiedquire/share-primus/blob/master/lib/client/share-primus.js
function patchShare() {
  // Map Primus ready states to ShareJS ready states.
  const STATES = {};
  STATES[window.Primus.CLOSED] = "disconnected";
  STATES[window.Primus.OPENING] = "connecting";
  STATES[window.Primus.OPEN] = "connected";

  // Override Connection's bindToSocket method with an implementation
  // that understands Primus Stream.
  window.sharedb.Connection.prototype.bindToSocket = function (stream) {
    const connection = this;
    this.state =
      stream.readyState === 0 || stream.readyState === 1
        ? "connecting"
        : "disconnected";

    setState(Primus.OPENING);
    setState(stream.readyState);
    this.canSend = this.state === "connected"; // Primus can't send in connecting state.

    // Tiny facade so Connection can still send() messages.
    this.socket = {
      send(msg) {
        stream.write(msg);
      },
    };

    stream.on("data", function (msg) {
      if (msg.a) {
        try {
          connection.handleMessage(msg);
        } catch (e) {
          connection.emit("error", e);
          throw e;
        }
      }
    });

    stream.on("readyStateChange", function () {
      // console.log(stream.readyState);
      setState(stream.readyState);
    });

    stream.on("reconnecting", function () {
      if (connection.state === "disconnected") {
        setState(Primus.OPENING);
        connection.canSend = false;
      }
    });

    function setState(readyState) {
      const shareState = STATES[readyState];
      connection._setState(shareState);
    }
  };
}
const isArray =
  Array.isArray ||
  function (obj) {
    return obj instanceof Array;
  };
const diff = new fbDiff(false);



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./lib/ember-share.js");
/******/ })()
;
});
//# sourceMappingURL=main.js.map