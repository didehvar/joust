/**
 * Database schema for tournaments.
 * 
 * author: Geraint Spackman
 * version: 0.0.1
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Schema for a tournament.
 * 
 * @field name The name of the tournament.
 * @field game The game that will be used in the tournament. 
 * @field season The season of the tournament. (Minimum Value: 1)
 * @field participant_list The collection of participant(s) that are in the tournament.
 * 		  @see participant_list
 */
var tournament_schema = mongoose.Schema({
	name: String,
	game: { type: ObjectId, ref: 'game' },
	season: { type: Number, min: 1 },
	participant_list: { type: ObjectId, ref: 'participant_list' }
})
