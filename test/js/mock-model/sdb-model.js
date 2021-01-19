// import SDB from '../../../dist/main.js';
import SDB from "../../../lib/ember-share.js";
// import SDB from 'dist/main.js';

const { ShareProxy } = SDB;
const { attr } = SDB;

export default ShareProxy.extend({
  // _childLimiations: [
  //   'duties/*/schedule_events'
  // ]
  log: attr(),
  // scheduleSet: belongsTo DS, 'scheduleSet', async: true
  // dataset: belongsTo DS, 'tripsSchedule/dataset', async: true
  vehicles: attr(),
  duties: attr(),
  relief_vehicles: attr(),
  stats: attr(),
  day: attr(),
  createdAt: attr("date"),
  unsaved: attr("boolean"),
  discarded: attr("boolean"),
  trips: attr(),
  events: attr(),
  routes: attr(),
  stops: attr(),
  preferences: attr(),
  order: attr(),
  orderObj: attr(),
  nestedArray: attr(),
  rosters: attr(),
  broken: attr("boolean"),

  // not in use yet
  createdBy: attr(),
  revision: attr(),
  name: attr(),
  updatedAt: attr(),
  updatedBy: attr(),

  limitedObject: attr(),

  _childLimiations: [
    "limitedObject",
    "preferences",
    "duties/b/schedule_events",
    "events/*/*",
  ],
});