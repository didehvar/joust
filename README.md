# Instructions

Install [MongoDB](https://www.mongodb.org/), you can set the environment variable `MONGOHQ_URL` to
your connection string (default: `mongodb://localhost/joust`), and start it up: 
`mongod --dbpath data/` (see [MongoDB docs](http://docs.mongodb.org/manual/tutorial/manage-mongodb-processes/) 
for more information).

Run `npm install` (requires [Python 2.7.3](https://www.python.org/download/releases/2.7.3#download)) 
install required modules before running `export PATH="./node_modules/.bin:$PATH"` so you can run local npm 
modules on the command line.

Use `bower install` to install front-end dependancies, then build the Ember application with `ember build`. 
You can use `ember build -w` for development to auto-compile Ember js files.

Rename `config.js.conf` to `config.js` and configure as necessary. With the default configuration,
the app will run at [localhost](http://localhost:8111) on port 8111.

Start the app using `npm start` or `DEBUG=joust npm start`.
