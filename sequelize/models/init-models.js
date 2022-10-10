var DataTypes = require("sequelize").DataTypes;
var _action = require("./action");
var _sequence = require("./sequence");
var _sequence_story = require("./sequence_story");
var _story = require("./story");
var _user = require("./user");

function initModels(sequelize) {
  var action = _action(sequelize, DataTypes);
  var sequence = _sequence(sequelize, DataTypes);
  var sequence_story = _sequence_story(sequelize, DataTypes);
  var story = _story(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  sequence_story.belongsTo(sequence, { as: "id_sequence_sequence", foreignKey: "id_sequence"});
  sequence.hasMany(sequence_story, { as: "sequence_stories", foreignKey: "id_sequence"});
  action.belongsTo(story, { as: "id_story_story", foreignKey: "id_story"});
  story.hasMany(action, { as: "actions", foreignKey: "id_story"});
  sequence_story.belongsTo(story, { as: "id_story_story", foreignKey: "id_story"});
  story.hasMany(sequence_story, { as: "sequence_stories", foreignKey: "id_story"});

  return {
    action,
    sequence,
    sequence_story,
    story,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
