const ghpages = require('gh-pages');

ghpages.publish(
  'dist',
  {
    message: `Update ${new Date().toISOString()}`,
  },
  err => {
    if (err) {
      console.error(err);
    } else {
      console.log('🚚  Deployed to gh-pages');
    }
  }
);
