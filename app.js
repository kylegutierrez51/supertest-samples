const express = require('express');
const app = express();

const adminRoute = require('./routes/admin');
const { router: authRoute } = require('./routes/auth');
const profileRoute = require('./routes/profile');
const postsRoute = require('./routes/posts');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoute);
app.use('/profile', profileRoute)
app.use('/posts', postsRoute);
app.use('/admin', adminRoute);

// if stmt is needed for supertest to work properly
// use the below line to ignore the below block of code so it doesn't appear in jest --coverage.
/* istanbul ignore next */ //
if (require.main === module) {
  app.listen(3000, (err) => {
    if (err) throw err;
    console.log('server listening on port 3000');
  });
}

module.exports = app;