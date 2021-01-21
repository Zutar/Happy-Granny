let config = {}
config.db = {}

config.host = '0.0.0.0';
config.port = process.env.PORT || 8080;

config.db.host = 'ec2-54-73-253-140.eu-west-1.compute.amazonaws.com';
config.db.port = 5432;
config.db.user = 'eivuhkljnlzpzh';
config.db.password = '5491b7d407c54b46384ddc421073523c93821052ae2d5cf30399b940df65fe1a';
config.db.dbName = 'd47v9h6k12me7l';

module.exports = config;