# Instructions

Install [MongoDB](https://www.mongodb.org/), you can set the environment variable `MONGOHQ_URL` to
your connection string (default: `mongodb://localhost/joust`), and start it up: 
`mongod --dbpath data/` (see [MongoDB docs](http://docs.mongodb.org/manual/tutorial/manage-mongodb-processes/) 
for more information).

Run `npm install`.

Rename `config.js.conf` to `config.js` and configure as necessary. With the default configuration,
the app will run at [localhost](http://localhost:8111) on port 8111.

Start the app using `npm start` or `DEBUG=joust npm start`.

# Coding Standards

Use (Google's JavaScript Style Guide)[http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml].
