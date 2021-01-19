/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { assert } from "chai";
import cson from "./mock-model/cson";
import scheduleCreator from "./mock-model/schedule";

const test = () => {
  describe("Model", function () {
    let schedule = null;

    const toJson = (obj) => JSON.parse(JSON.stringify(obj));

    beforeEach(() => (schedule = scheduleCreator()));

    afterEach(() => (schedule = null));

    it("ember object", function () {
      const MyObj = Ember.Object.extend({
        someJson: {
          events: {
            idle_trip: {
              id: {
                a: 1,
                b: 2,
                c: 3,
              },
            },
          },
        },

        deleteMyProp() {
          this.notifyPropertyChange("myProp");
          return delete this.myProp;
        },
      });

      let counter = 0;
      const myObj = MyObj.create();

      const fn = function () {
        return Ember.computed({
          get() {
            counter++;
            return this.get("someJson.events.idle_trip");
          },
          set(k, v) {
            return v;
          },
        });
      };

      Ember.defineProperty(myObj, "myProp", fn());
      console.log(myObj.get("myProp"));
      myObj.deleteMyProp();
      myObj.set("someJson", "3");
      console.log(myObj.get("myProp"));
      Ember.defineProperty(myObj, "myProp", fn());
      console.log(myObj.get("myProp"));
      return assert.equal(counter, 2);
    });

    it("reorder rosters #1", function () {
      const oldIndex = 1;
      const newIndex = 2;
      const rosters = schedule.get("rosters");
      const roster = rosters.objectAt(oldIndex);
      const rosterJson = roster.toJson();
      rosterJson.modified = true;
      rosters.removeAt(oldIndex);
      rosters.insertAt(newIndex, rosterJson);
      assert.equal(rosters.objectAt(0).get("id"), "1");
      assert.deepEqual(rosters.objectAt(0).get("task_ids").toArray(), [
        "1",
        "2",
        "3",
      ]);
      assert.equal(rosters.objectAt(1).get("id"), "3");
      assert.deepEqual(rosters.objectAt(1).get("task_ids").toArray(), [
        "7",
        "8",
        "9",
      ]);
      assert.equal(rosters.objectAt(2).get("id"), "2");
      return assert.deepEqual(rosters.objectAt(2).get("task_ids").toArray(), [
        "4",
        "5",
        "6",
      ]);
    });

    it("reorder rosters #2", function () {
      const oldIndex = 1;
      const newIndex = 2;
      const Roster = Ember.ObjectProxy.extend({
        events: function () {
          return this.get("task_ids");
        }.property("task_ids.[]"),
      });
      const Calendar = Ember.Object.extend({
        rosters: Ember.computed.map("schedule.rosters", (roster) =>
          Roster.create({ content: roster })
        ),
      });
      const calendar = Calendar.create({ schedule });
      calendar.get("rosters").mapBy("events");
      const rosters = calendar.get("schedule.rosters");
      const roster = rosters.objectAt(oldIndex);
      const rosterJson = roster.toJson();
      rosterJson.modified = true;
      rosters.removeAt(oldIndex);
      rosters.insertAt(newIndex, rosterJson);
      calendar.get("rosters");
      // assertion:
      assert.equal(rosters.objectAt(0).get("id"), "1");
      assert.deepEqual(rosters.objectAt(0).get("task_ids").toArray(), [
        "1",
        "2",
        "3",
      ]);
      assert.equal(rosters.objectAt(1).get("id"), "3");
      assert.deepEqual(rosters.objectAt(1).get("task_ids").toArray(), [
        "7",
        "8",
        "9",
      ]);
      assert.equal(rosters.objectAt(2).get("id"), "2");
      return assert.deepEqual(rosters.objectAt(2).get("task_ids").toArray(), [
        "4",
        "5",
        "6",
      ]);
    });

    it("reorder rosters #3", function () {
      const rostersJson = cson().rosters;
      const startIndex = rostersJson.length;
      _.times(30, function (i) {
        const lastRoster = _.last(rostersJson);
        return rostersJson.push({
          id: String(startIndex + i + 1),
          task_ids: [
            String(+lastRoster.task_ids[0] + 3),
            String(+lastRoster.task_ids[1] + 3),
            String(+lastRoster.task_ids[2] + 3),
          ],
        });
      });
      schedule = scheduleCreator(() => ({
        rosters: rostersJson,
      }));
      // console.log(rostersJson);
      const oldIndex = 1;
      const newIndex = 2;
      const rosters = schedule.get("rosters");
      const roster = rosters.objectAt(oldIndex);
      const rosterJson = roster.toJson();
      rosterJson.modified = true;
      rosters.mapBy("task_ids");
      rosters.removeAt(oldIndex);
      rosters.insertAt(newIndex, rosterJson);
      assert.equal(rosters.objectAt(0).get("id"), "1");
      assert.deepEqual(rosters.objectAt(0).get("task_ids").toArray(), [
        "1",
        "2",
        "3",
      ]);
      assert.equal(rosters.objectAt(1).get("id"), "3");
      assert.deepEqual(rosters.objectAt(1).get("task_ids").toArray(), [
        "7",
        "8",
        "9",
      ]);
      assert.equal(rosters.objectAt(2).get("id"), "2");
      return assert.deepEqual(rosters.objectAt(2).get("task_ids").toArray(), [
        "4",
        "5",
        "6",
      ]);
    });

    it("test type of attribute Date", function () {
      const date = schedule.get("createdAt");
      return assert.typeOf(date.getDate, "function");
    });

    it("test type of attribute Boolean", function () {
      const broken = schedule.get("broken");
      assert.isBoolean(broken);
      return assert.equal(broken, false);
    });

    it("Get name", function () {
      const name = schedule.get("name");
      return assert.equal(name, "my mocked schedule");
    });

    it("Get id", () => assert.equal("abcd", schedule.get("id")));

    it("Set name", function () {
      schedule.set("name", "new Name");
      const newName = schedule.get("name");
      assert.equal(newName, "new Name");
      const opShouldBeSent = [
        { p: ["name"], oi: "new Name", od: "my mocked schedule" },
      ];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("SetProperties", function () {
      const newProps = { name: "tests", revision: 2, mock: "mock" };
      schedule.setProperties(newProps);
      const newName = schedule.get("name");
      assert.equal(newName, "tests");
      const newRevision = schedule.get("revision");
      assert.equal(newRevision, 2);
      const newMock = schedule.get("mock");
      assert.equal(newMock, "mock");
      let opShouldBeSent = [
        { p: ["name"], oi: "tests", od: "my mocked schedule" },
      ];
      assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
      opShouldBeSent = [{ p: ["revision"], oi: 2, od: 1 }];
      assert.deepEqual(schedule.get("doc.opsSent")[1], opShouldBeSent);
      return assert.isUndefined(schedule.get("doc.opsSent")[2]);
    });

    it("New schedule", () =>
      // this tests the before each, that we actually got a new schedule when started the test
      assert.equal(schedule.get("name"), "my mocked schedule"));

    it("Get nested", function () {
      const cost = schedule.get("duties.a.stats.cost");
      return assert.equal(cost, 2234);
    });

    it("Set nested", function () {
      schedule.set("duties.a.stats.cost", 666);
      const cost = schedule.get("duties.a.stats.cost");
      assert.equal(cost, 666);
      const opShouldBeSent = [
        { p: ["duties", "a", "stats", "cost"], oi: 666, od: 2234 },
      ];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Nested get", function () {
      const duty = schedule.get("duties.a");
      const cost = duty.get("stats.cost");
      assert.equal(cost, 2234);
      return assert.isUndefined(schedule.get("doc.opsSent")[0]);
    });

    it("Nested set", function () {
      const duty = schedule.get("duties.a");
      duty.set("stats.cost", 666);
      const cost = schedule.get("duties.a.stats.cost");
      assert.equal(cost, 666);
      const opShouldBeSent = [
        { p: ["duties", "a", "stats", "cost"], oi: 666, od: 2234 },
      ];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Object Proxy (inner) get", function () {
      const duty = schedule.get("duties.a");
      const proxiedDuty = Ember.ObjectProxy.create({ content: duty });
      const cost = proxiedDuty.get("stats.cost");
      assert.equal(cost, 2234);
      return assert.isUndefined(schedule.get("doc.opsSent")[0]);
    });

    it("Object Proxy (inner) nested set", function () {
      const duty = schedule.get("duties.a");
      const proxiedDuty = Ember.ObjectProxy.create({ content: duty });
      proxiedDuty.set("stats.cost", 666);
      const cost = schedule.get("duties.a.stats.cost");
      assert.equal(cost, 666);
      const opShouldBeSent = [
        { p: ["duties", "a", "stats", "cost"], oi: 666, od: 2234 },
      ];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Object Proxy (inner with content) set", function () {
      const duty = schedule.get("duties.a");
      const proxiedDuty = Ember.ObjectProxy.create({ content: duty });
      proxiedDuty.set("content.id", "z");
      const newId = schedule.get("duties.a.id");
      assert.equal(newId, "z");
      const opShouldBeSent = [{ p: ["duties", "a", "id"], oi: "z", od: "a" }];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Object Proxy (inner with content) nested set", function () {
      const duty = schedule.get("duties.a");
      const proxiedDuty = Ember.ObjectProxy.create({ content: duty });
      proxiedDuty.set("content.stats.cost", 666);
      const cost = schedule.get("duties.a.stats.cost");
      assert.equal(cost, 666);
      const opShouldBeSent = [
        { p: ["duties", "a", "stats", "cost"], oi: 666, od: 2234 },
      ];
      assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
      return assert.isUndefined(schedule.get("doc.opsSent")[1]);
    });

    it("Object Proxy replace content", function () {
      let duty;
      let oldDuty = (duty = schedule.get("duties.a"));
      oldDuty = oldDuty.toJson();
      const proxiedDuty = Ember.ObjectProxy.create({ content: duty });

      const newDuty = {
        stats: {
          cost: 1111,
          penalty: 222,
        },
        schedule_events: [],
      };
      proxiedDuty.get("stats");
      proxiedDuty.get("schedule_events");
      const content = proxiedDuty.get("content");
      content.replaceContent(newDuty);
      const a = proxiedDuty.get("content").toJson();
      assert.deepEqual(newDuty, a);
      const opShouldBeSent = [{ p: ["duties", "a"], oi: newDuty, od: oldDuty }];
      assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
      return assert.isUndefined(schedule.get("doc.opsSent")[1]);
    });

    it("Model as Proxy get", function () {
      const proxiedSchedule = Ember.ObjectProxy.create({ content: schedule });
      const cost = proxiedSchedule.get("duties.a.stats.cost");
      return assert.equal(cost, 2234);
    });

    it("Model as Proxy set", function () {
      const proxiedSchedule = Ember.ObjectProxy.create({ content: schedule });
      proxiedSchedule.set("duties.a.stats.cost", 666);
      const cost = proxiedSchedule.get("duties.a.stats.cost");
      assert.equal(cost, 666);
      const opShouldBeSent = [
        { p: ["duties", "a", "stats", "cost"], oi: 666, od: 2234 },
      ];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Model as Proxy set random prop", function () {
      const proxiedSchedule = Ember.ObjectProxy.create({ content: schedule });
      proxiedSchedule.set("randomProp", 666);
      return assert.isUndefined(schedule.get("doc.opsSent")[0]);
    });

    it("Array addObject (same)", function () {
      const order = schedule.get("order");
      order.addObject("c");
      const newOrder = schedule.get("order");
      assert.isUndefined(schedule.get("doc.opsSent")[0]);
      return assert.deepEqual(["a", "b", "c"], toJson(newOrder.get("content")));
    });

    it("Array pushObject", function () {
      const order = schedule.get("orderObj");
      order.addKey("vehicles");
      schedule.set("orderObj.vehicles", ["c"]);
      // order.get('vehicles').addObject 'd'
      const vehicles = schedule.get("orderObj.vehicles");
      vehicles.pushObject("d");
      const newOrder = schedule.get("orderObj.vehicles");
      return assert.deepEqual(["c", "d"], toJson(newOrder.get("content")));
    });
    // opShouldBeSent = [ p:['order', 3], li: 'd']
    // assert.deepEqual schedule.get('doc.opsSent')[0], opShouldBeSent

    it("Array addObject (new)", function () {
      const order = schedule.get("orderObj");
      order.addKey("vehicles");
      schedule.set("orderObj.vehicles", []);
      // order.get('vehicles').addObject 'd'
      const vehicles = schedule.get("orderObj.vehicles");
      vehicles.addObject("d");
      const newOrder = schedule.get("orderObj.vehicles");
      return assert.deepEqual(["d"], toJson(newOrder.get("content")));
    });
    // opShouldBeSent = [ p:['order', 3], li: 'd']
    // assert.deepEqual schedule.get('doc.opsSent')[0], opShouldBeSent

    it("Array addObject (new)", function () {
      const order = schedule.get("order");
      order.addObject("d");
      const newOrder = schedule.get("order");
      assert.deepEqual(["a", "b", "c", "d"], toJson(newOrder.get("content")));
      const opShouldBeSent = [{ p: ["order", 3], li: "d" }];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Array addObjects", function () {
      const order = schedule.get("order");
      order.addObjects(["d", "e"]);
      const newOrder = schedule.get("order");
      assert.deepEqual(
        ["a", "b", "c", "d", "e"],
        toJson(newOrder.get("content"))
      );
      let opShouldBeSent = [{ p: ["order", 3], li: "d" }];
      assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
      opShouldBeSent = [{ p: ["order", 4], li: "e" }];
      return assert.deepEqual(schedule.get("doc.opsSent")[1], opShouldBeSent);
    });

    it("Array shiftObject", function () {
      const order = schedule.get("order");
      order.shiftObject();
      const newOrder = schedule.get("order");
      assert.deepEqual(["b", "c"], toJson(newOrder.get("content")));
      const opShouldBeSent = [{ p: ["order", 0], ld: "a" }];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Nested Array addObject (new)", function () {
      const events = schedule.get("duties.a.schedule_events");
      const newEvent = { type: "custom" };
      events.addObject(newEvent);
      const newEvents = schedule.get("duties.a.schedule_events");
      assert.equal(3, toJson(newEvents.get("content")).length);
      const opShouldBeSent = [
        { p: ["duties", "a", "schedule_events", 2], li: newEvent },
      ];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Nested Array get", function () {
      const events = schedule.get("duties.a.schedule_events");
      const serviceTrip = events.objectAt(0);
      return assert.equal("service", serviceTrip.get("type"));
    });

    it("Nested Array set", function () {
      const events = schedule.get("duties.a.schedule_events");
      const serviceTrip = events.objectAt(0);
      serviceTrip.set("type", "idle");
      assert.equal("idle", serviceTrip.get("type"));
      const opShouldBeSent = [
        {
          p: ["duties", "a", "schedule_events", "0", "type"],
          od: "service",
          oi: "idle",
        },
      ];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Nested Array changed index after insert", function () {
      const events = schedule.get("duties.a.schedule_events");
      const serviceTrip = events.objectAt(0);
      const newEvent = { type: "custom" };
      events.unshiftObject(newEvent);
      let opShouldBeSent = [
        { p: ["duties", "a", "schedule_events", 0], li: newEvent },
      ];
      assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
      serviceTrip.set("type", "idle");
      assert.equal("idle", serviceTrip.get("type"));
      opShouldBeSent = [
        {
          p: ["duties", "a", "schedule_events", "1", "type"],
          od: "service",
          oi: "idle",
        },
      ];
      return assert.deepEqual(schedule.get("doc.opsSent")[1], opShouldBeSent);
    });

    it("Replace Array Simple Array", function () {
      const order = schedule.get("order");
      order.replaceContent(["f"]);
      assert.equal(1, order.get("content.length"));

      const opShouldBeSent = [{ p: ["order"], od: ["a", "b", "c"], oi: ["f"] }];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });

    it("Replace Array Objects", function () {
      const oldEvents = [
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
      const newEvents = [{ a: "a" }];
      const events = schedule.get("duties.a.schedule_events");
      const service = events.objectAt(0);
      const idleTrip = events.objectAt(1);
      events.replaceContent(newEvents);
      assert.equal(1, events.get("content.length"));

      const opShouldBeSent = [
        { p: ["duties", "a", "schedule_events"], od: oldEvents, oi: newEvents },
      ];
      const a = toJson(schedule.get("doc.opsSent")[0]);
      const b = toJson(opShouldBeSent);
      assert.deepEqual(a, b);
      return assert.equal("a", service.get("a"));
    });

    return it("Add property", function () {
      const newDuty = {
        id: "f",
        stats: "s",
        schedule_events: [],
      };

      const duties = schedule.get("duties");
      duties.addKey("f");
      schedule.set("duties.f", newDuty);
      const opShouldBeSent = [{ p: ["duties", "f"], oi: newDuty }];
      return assert.deepEqual(schedule.get("doc.opsSent")[0], opShouldBeSent);
    });
  });
};

export default test;
