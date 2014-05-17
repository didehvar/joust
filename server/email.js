// Meteor.methods({
//   'addEmail': function(email) {
//     if (!this.userId) {
//       throw new Meteor.Error('Must be logged in');
//     }
//
//
//   }
// });

Meteor.methods({
  'addEmailToUser': function(email) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Must be logged in');
    }

    if (Meteor.users.find({ 'emails.address': email }).count() > 0) {
      throw new Meteor.Error(500, 'Email is already in use');
    }

    Meteor.users.update(this.userId, {
      $addToSet: {
        "emails": {
          address: email,
          verified: false
        }
      }
    }, {}, function(error, results) {
      if (error) {
        throw new Meteor.Error(error.error || 500, error.reason || 'Unknown error');
      }

      return true;
    });
  }
});
