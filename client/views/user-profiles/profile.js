Template.userProfile.userExists = function() {
	return this.hasOwnProperty('_id');
}

Template.userProfileHeader.avatar = function() {
	if (!this.services || !this.services.steam || !this.services.steam.avatar ) {
		return false;
	}

	return this.services.steam.avatar.full;
}
