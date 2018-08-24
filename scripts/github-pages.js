const ghPages = require("gh-pages");

ghPages.publish("dist", err => {
  if (err) {
    console.log(err);
  }
  console.log('done!')
});
