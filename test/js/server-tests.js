import { assert } from "chai";
import _ from "lodash";
import modelData from "./mock-model/cson";
import SDB from "../../lib/ember-share";
import sdbModel from "./mock-model/sdb-model";

const test = () => {
  describe("Server", function () {
    let App = null;
    let ShareStore = null;
    let schedule = null;

    const postJson = function (url, data, delay) {
      let ajaxCall;
      return (ajaxCall = new Promise((resolve, reject) =>
        $.ajax({
          type: "POST",
          url: `http://localhost:3333/${url}`,
          data,
          success(response) {
            return setTimeout(() => resolve(response), delay);
          },
          error: reject,
          dataType: "json",
        })
      ));
    };

    const createDoc = function () {
      const json = _.assign({}, modelData(), {
        id: `test-${new Date().getTime()}`,
      });
      return ShareStore.createRecord("schedules", json).then(function (
        scheduleCreated
      ) {
        schedule = scheduleCreated;
      });
    };

    const deleteDoc = () =>
      ShareStore.deleteRecord("schedules", Ember.get(schedule, "id"));

    before(function (done) {
      this.timeout(5000);
      Ember.Application.initializer({
        name: "api-adapter",
        initialize(app) {
          SDB.Store.reopen({
            url: "localhost",
            port: 3333,
            protocol: "http",
            modelStr: "model",
          });
          app.register("ShareStore:main", SDB.Store);
          app.inject("controller", "ShareStore", "ShareStore:main");
          app.inject("route", "ShareStore", "ShareStore:main");
        },
      });

      App = Ember.Application.create();
      App.Schedule = sdbModel;
      App.ApplicationController = Ember.Controller.extend({
        initShareStore: function () {
          ({ ShareStore } = this);
          return this.ShareStore.checkConnection().then(done).catch(done);
        }.on("init"),
      });
    });

    beforeEach(createDoc);

    afterEach(deleteDoc);

    const createDataOp = (op) => ({
      id: schedule.get("id"),
      collection: "schedules",
      op,
    });

    it("set", function () {
      const Obj = Ember.Object.extend({
        schedule,
        cost: Ember.computed.oneWay("schedule.duties.a.stats.cost"),
      });
      const obj = Obj.create();

      const cost = obj.get("cost");

      const dutyA = schedule.get("duties.a");

      assert.equal(cost, 2234);

      const op = { p: ["duties", "a", "stats", "cost"], oi: 666, od: 2234 };

      return postJson("op/", createDataOp(op), 0).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        const newCost = obj.get("cost");
        assert.equal(newCost, 666);
      });
    });

    it("Proxy a new duty", function () {
      const oldDuty = schedule.get("duties.a").toJson();

      const newDuty = {
        stats: {
          cost: "1111",
          penalty: "222",
        },
        schedule_events: ["a"],
      };

      const proxiedDuty = Ember.ObjectProxy.create({
        content: schedule.get("duties.a"),
      });

      const op = { p: ["duties", "a"], oi: newDuty, od: oldDuty };

      return postJson("op/", createDataOp(op), 0).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        const changedDuty = proxiedDuty.get("content").toJson();
        assert.deepEqual(newDuty, changedDuty);
      });
    });

    it("Proxy inner properties - array", function () {
      const secondEvent = {
        type: "pull in",
        startTime: "11:00",
        endTime: "14:00",
      };

      const vord = Ember.ObjectProxy.extend({
        events: Ember.computed.map("schedule_events", (event) => event),
      });

      const proxiedDuty = vord.create({
        content: schedule.get("duties.a"),
      });

      const eventLengthBefore = proxiedDuty.get("events.length");

      const op = {
        p: ["duties", "a", "schedule_events", "1"],
        ld: secondEvent,
      };

      return postJson("op/", createDataOp(op), 100).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        const eventLengthAfter = proxiedDuty.get("events.length");
        assert.notEqual(eventLengthBefore, eventLengthAfter);
      });
    });

    it("two arrays", function () {
      const log = schedule.get("log");

      const op = { p: ["log", 0], li: 0 };

      return postJson("op/", createDataOp(op), 0).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        assert.equal(4, log.get("content.length"));
      });
    });

    it("many logs", function () {
      this.timeout(5000);
      const logNumber = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
      ];
      const promises = [];
      const invoke = (arr) => _.map(arr, (fn) => fn());

      let obj = Ember.Object.extend({
        _log: function () {
          const log = this.get("job.log");
          if (this.get("job.log.content.length") === 3) {
            return "start";
          }
          return log.get("content.lastObject");
        }.property("job.log.[]"),
      });

      obj = obj.create({ job: schedule });

      _.forEach(logNumber, function (n) {
        const tempObj = { number: n, test: n * 4 };
        return promises.push(() =>
          postJson("op/", createDataOp({ p: ["log", n + 3], li: tempObj }), 100)
        );
      });

      const start = promises.slice(0, 4);
      const middle = promises.slice(4, 10);
      const end = promises.slice(10, 20);
      let startLog = null;
      let endLog = null;
      let middleLog = null;

      return Promise.all(invoke(start))

        .then(function (msgs) {
          assert.isTrue(_.every(msgs, (msgObj) => msgObj.msg === "Success"));
          startLog = obj.get("_log");
          return Promise.all(invoke(middle));
        })
        .then(function (msgs) {
          assert.isTrue(_.every(msgs, (msgObj) => msgObj.msg === "Success"));
          middleLog = obj.get("_log");
          assert.notDeepEqual(startLog, middleLog);
          return Promise.all(invoke(end));
        })
        .then(function (msgs) {
          assert.isTrue(_.every(msgs, (msgObj) => msgObj.msg === "Success"));
          endLog = obj.get("_log");
          assert.notDeepEqual(middleLog, endLog);
        });
    });

    it("get inner id", function () {
      const Vord = Ember.Object.extend({
        id: function () {
          return this.get("b.id");
        }.property("b.id"),
      });

      const proxiedDuty = Vord.create({
        b: schedule.get("duties.d"),
      });

      const idBefore = proxiedDuty.get("id");

      const op = {
        p: ["duties", "d", "id"],
        od: "d",
        oi: "e",
      };

      return postJson("op/", createDataOp(op), 0).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        assert.equal(response != null ? response.msg : undefined, "Success");
        const idAfter = proxiedDuty.get("id");
        assert.notEqual(idAfter, idBefore);
      });
    });

    it("Proxy inner properties - array - object", function () {
      const serviceEvent = {
        startTime: 1,
        endTime: 2,
      };

      const vord = Ember.ObjectProxy.extend({
        events: Ember.computed.map("schedule_events", (event) => event),
      });

      const proxiedDuty = vord.create({
        content: schedule.get("duties.d"),
      });

      const innerEvent = proxiedDuty.get("events.0");

      const op = {
        p: ["duties", "d", "schedule_events", "0", "service_trip"],
        od: serviceEvent,
      };

      return postJson("op/", createDataOp(op), 0).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        assert.deepEqual(innerEvent.toJson(), { index: 1 });
      });
    });

    it("Proxy replace array 1", function () {
      this.timeout(5000);
      const startScheduleEvents = [
        {
          type: "service",
          startTime: "11:00",
          endTime: "13:00",
        },
        {
          type: "pull in",
          startTime: "11:00",
          endTime: "14:00",
        },
      ];

      const endScheduleEvents = ["a", "b", "c"];

      const op = {
        p: ["duties", "b", "schedule_events"],
        od: startScheduleEvents,
        oi: endScheduleEvents,
      };

      let eventsWasCalledCounter = 0;
      const Obj = Ember.Object.extend({
        events: function () {
          eventsWasCalledCounter++;
          return this.get("duty.schedule_events");
        }.property("duty.schedule_events.[]"),
      });

      const obj = Obj.create({ duty: schedule.get("duties.b") });
      obj.get("events");

      return postJson("op/", createDataOp(op), 200).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        const a = obj.get("events").toArray();
        assert.deepEqual(endScheduleEvents, a);
        assert.equal(eventsWasCalledCounter, 2);
      });
    });

    it("Add property", function () {
      const newDuty = {
        id: "f",
        stats: "s",
      };

      const op = { p: ["duties", "f"], oi: newDuty };

      const duties = schedule.get("duties");

      return postJson("op/", createDataOp(op), 100).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        const dutyF = duties.get("f");
        assert.deepEqual(dutyF.toJson(), newDuty);
      });
    });

    it("Remove property", function () {
      const dutyA = schedule.get("duties.a");

      const op = { p: ["duties", "a"], od: dutyA.toJson() };

      const duties = schedule.get("duties");

      return postJson("op/", createDataOp(op), 100).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        assert.isUndefined(duties.get("a"));
      });
    });

    it("Child Limiations (Object)", function () {
      const Obj = Ember.Object.extend({
        limitedObject: function () {
          console.log("should happen twice");
          return this.get("schedule.limitedObject.some.data");
        }.property("schedule.limitedObject"),
      });

      const obj = Obj.create({ schedule });
      obj.get("limitedObject");

      const op = { p: ["limitedObject", "some", "data"], oi: 2, od: 1 };

      return postJson("op/", createDataOp(op), 100).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        assert.equal(obj.get("limitedObject"), 2);
      });
    });

    it("Child Limiations (unscheduled)", function () {
      this.timeout(5000);

      const Obj = Ember.Object.extend({
        scheduled: function () {
          console.log("should happen twice");
          return this.get("schedule.duties.b.unscheduled");
        }.property("schedule.duties.b.unscheduled"),
      });

      const obj = Obj.create({ schedule });
      obj.get("scheduled");

      const op = { p: ["duties", "b", "unscheduled"], oi: true };

      return postJson("op/", createDataOp(op), 100).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        assert.equal(obj.get("scheduled"), "true");
      });
    });

    it.skip("op came from an a property that is is not an attribute", function () {
      const op = { p: ["arr", 1], li: 2 };
      //      op = p: [ 'str' ], oi: 'is', od: "as"
      return postJson("op/", createDataOp(op), 100).then(function (response) {
        assert.equal(response != null ? response.msg : undefined, "Success");
        console.log(schedule);
      });
    });

    it("test nestedArray replace", function () {
      let newValue;
      this.timeout(4000);
      const nestedArray = schedule.get("nestedArray");
      nestedArray.get("arr");
      // nestedArray.

      const op1 = {
        p: ["nestedArray", "arr", 3],
        li: "d",
      };

      const op2 = {
        p: ["nestedArray", "arr"],
        oi: (newValue = ["z", "x", "2", "4"]),
        od: schedule.get("nestedArray.arr").toJson(),
      };

      const op3 = {
        p: ["nestedArray", "arr", 4],
        li: "p",
      };

      return postJson("op/", createDataOp(op1), 100)
        .then(function (response) {
          assert.equal(response != null ? response.msg : undefined, "Success");
          assert.equal(nestedArray.get("arr").toJson()[3], "d");
          return postJson("op/", createDataOp(op2), 100);
        })
        .then(function (response) {
          assert.equal(response != null ? response.msg : undefined, "Success");
          assert.deepEqual(nestedArray.get("arr").toJson(), newValue);
          return postJson("op/", createDataOp(op3), 100);
        })
        .then(function (response) {
          assert.equal(response != null ? response.msg : undefined, "Success");
          assert.equal(nestedArray.get("arr").toJson()[4], "p");
        });
    });

    it("event stand by", () => {
      schedule.get("events.service_trip.id_1");

      const op = {
        p: ["events", "stand_by", "id_1"],
        od: { name: 1 },
      };

      return postJson("op/", createDataOp(op), 10).then((response) => {
        assert.equal(response != null ? response.msg : undefined, "Success");
        assert.isUndefined(schedule.doc.data.events.stand_by.id_1);
        assert.isDefined(schedule.doc.data.events.stand_by.id_2);
        assert.isDefined(schedule.get("events.stand_by.id_2"));
        assert.isUndefined(schedule.get("events.stand_by.id_1"));
      });
    });

    it("subprops insertion are notified properly if the object was previously empty", () => {
      schedule.get("events.service_trip.id_1");
      schedule.get("events.stand_by.id_1");
      const op = {
        p: ["events"],
        od: {
          service_trip: {
            id_1: {
              name: "3",
            },
          },
          stand_by: {
            id_1: {
              name: "1",
            },
            id_2: {
              name: "2",
            },
          },
        },
        oi: 1,
      };
      return postJson("op/", createDataOp(op), 10).then((response) => {
        assert.equal(response.msg, "Success");
        assert.deepEqual(schedule.doc.data.events, {});
        assert.equal(schedule.get("events.service_trip"), undefined);
        op.oi = op.od;
        op.od = 1;
        return postJson("op/", createDataOp(op), 10).then((response) => {
          assert.equal(response.msg, "Success");
          assert.deepEqual(
            schedule.doc.data.events.service_trip,
            op.oi.service_trip
          );
          assert.isDefined(schedule.get("events.service_trip"));
          assert.isDefined(schedule.get("events.stand_by"));
        });
      });
    });
  });
};

export default test;
// it 'Child Limiations (Array)', () ->
//   Obj = Ember.Object.extend
//     allowDeadHeads: (->
//       console.log 'get perform'
//       @get 'schedule.preferences.0.pref1.allowDeadHeads'
//     ).property 'schedule.limitedObject'
//   obj = Obj.create {schedule}
//   console.log obj.get 'allowDeadHeads'
//   op =  p:[ 'preferences', 0, 'pref1', 'allowDeadHeads'], oi: false, od: true
//
//   postJson 'op/', createDataOp(op), 100
//     .then (response) ->
//       assert.equal response?.msg, 'Success'
//       console.log obj.get 'allowDeadHeads'
//       assert.isFalse obj.get('allowDeadHeads')
//       done()
//     .catch done
