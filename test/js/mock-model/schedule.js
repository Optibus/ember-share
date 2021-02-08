import _ from "lodash";
import otJson from "ot-json0";
import model from "./sdb-model";
import defaultData from "./cson";

export default function f(data) {
  if (data != null) {
    data = data();
  } else {
    data = defaultData();
  }

  return model.create({
    doc: {
      id: "abcd",
      listeners: {},

      on(event, fn) {
        if (_.isEmpty(this.listeners[event])) {
          this.listeners[event] = [];
        }
        return this.listeners[event].push(fn);
      },

      opsSent: [],

      submitOp(op) {
        _.forEach(this.listeners["before op"], (fn) => fn(op, true));
        otJson.type.apply(this.data, op);
        this.opsSent.push(op);
        return _.forEach(this.listeners.op, (fn) => fn(op, true));
      },

      data,
    },
  });
}
