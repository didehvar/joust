# Instructions

Install [MongoDB](https://www.mongodb.org/), you can set the environment variable `MONGOHQ_URL` to
your connection string. The deafult will use the `joust` collection.

Setup values in .env.fake as environment variables in production. Defaults should work in local,
the app will run at [localhost](http://localhost:8111) on port 8111.

Run `npm install` and `bower install` to install required packages and modules.

Start the app using `npm start` or `DEBUG=joust npm start`.
