// From http://stackoverflow.com/a/12841484
// Used to quickly generate test data

var generate_users = false;
var assign_permissions = false;

module.exports = function() {
  var User = require('./models/user');
  var Permission = require('./models/permission');

  if (generate_users) {
    function createRandomWord(length) {
      var consonants = 'bcdfghjklmnpqrstvwxyz',
          vowels = 'aeiou',
          rand = function(limit) {
              return Math.floor(Math.random()*limit);
          },
          i, word='', length = parseInt(length,10),
          consonants = consonants.split(''),
          vowels = vowels.split('');
      for (i=0;i<length/2;i++) {
          var randConsonant = consonants[rand(consonants.length)],
              randVowel = vowels[rand(vowels.length)];
          word += (i===0) ? randConsonant.toUpperCase() : randConsonant;
          word += i*2<length-1 ? randVowel : '';
      }
      return word;
    }

    // generates user documents
    var numTestDocs = 100; // or however many you want
    for(var i = 0; i < numTestDocs; i++) {
      var someLength = 12; // Alternatively, you could use a random number generator
      var randomWord = createRandomWord(someLength);
      var item = new User ({
        steamid: 123456789,
        display_name: randomWord,
        profile_id: randomWord,
        avatar: '',
        avatar_medium: '',
        avatar_full: '',
        created: Date.now()
      });
      item.save(function(err, doc) {
        // do error handling if you want to
        console.log('Test Record Saved with id: ' + doc._id);
      });
    }
  }

  if (assign_permissions) {
    User.findOne({ profileid: 'elfish' }, function(err, user) {
      if (err || !user) {
        console.log('Error finding elfish: ' + err);
      } else {
        Permission.findOne({ description: 'Remove president' }, function(err, perm) {
          if (err || !perm) {
            console.log('Error finding delete user: ' + err);
          } else {
            user.permissions.addToSet(perm);
            user.save(function(err, user) {
              if (err) {
                console.log('Couldn\'t save user: ' + err);
              } else {
                console.log('Saved user: ' + user);
              }
            });
          }
        });
      }
    });
  }
};
