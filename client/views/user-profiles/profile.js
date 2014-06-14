Template.userProfile.userExists = function() {
	return this.hasOwnProperty('_id');
}

Template.userProfileHeader.avatar = function() {
	return this.avatar.large;
}
