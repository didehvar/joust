/**
 * Database schema for participants.
 * 
 * author: Geraint Spackman
 * version: 0.0.1
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Schema for a participant.
 * 
 * @field is_team Flag that dictates if this participant is a team.
 * @field users Users that are part of this team. (If this is not a team then there should be only one user.)
 */
var participant_schema = mongoose.Schema({
	is_team: Boolean,
	users: [{ type: ObjectId, ref: 'User' }]
});

module.exports('Participant', participant_schema);