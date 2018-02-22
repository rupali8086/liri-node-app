

/*exports.twitter = {
  consumer_key: 'eg5PKKTKngcPOQ9MXQC7tlqMf',
  consumer_secret: '5BHKA8rxlyQJDVMBzgRI7sK0kAid6VfyjbOHnSERe1J7nfu5ss',
  access_token_key: '965967599887626240-PXpIj7uaBN9ZhGKo9aXEOyIepJF1cAx',
  access_token_secret:'9ep6NoEk6LXyunuLA8Z74wHclfIzWTA7U7vFx2GHqncvS'

};

exports.spotify = {
  id: '6641e75b9e9941659c928899dd22d109',
  secret: '6691acf379f245a9a26093eab2e3d4a7'
};*/

console.log('this is loaded');

exports.twitter = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
};

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};