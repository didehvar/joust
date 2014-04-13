/**
 * Database schema for games.
 * 
 * author: Geraint Spackman
 * version: 0.0.1
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Schema for a game.
 * Currently really basic since there is no requirement for more detail yet.
 * 
 * @field name Name of the game.
 */
var game_schema = mongoose.Schema({
	name: String,
});

module.exports('Game', game_schema);
