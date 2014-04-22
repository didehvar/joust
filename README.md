# Instructions

Install [MongoDB](https://www.mongodb.org/), you can set the environment variable `MONGOHQ_URL` to
your connection string. The deafult will use the `joust` collection.

Run `npm install` and `bower install` to install required packages and modules before running
`export PATH="./node_modules/.bin:$PATH"` to add the newly created directory to your PATH.

With the modules added to your path, you can build the Ember application using `ember build`.

Start the app using `npm start` or `DEBUG=joust npm start`.

Rename `config.js.conf` to `config.js` and configure as necessary. With the default configuration,
the app will run at [localhost](http://localhost:8111) on port 8111.
