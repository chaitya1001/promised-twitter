var _ = require('lodash'),
    Promise = require('bluebird');

module.exports.show = function(params) {
  var path = "/statuses/show.json?id=" + params.id;
  return this.get(path, params);
};

module.exports.lookup = function(params) {
  var self = this;
  var ids = _.chunk(params.id, 100);
  delete params.id;

  return Promise.resolve(ids)
  .map(function(ids) {
    var path = "/statuses/lookup.json?id=" + ids;
    return self.get(path, params)
    .then(function(res) {return { data: res };})
    .catch(function(e)  {return { error: e };});
  }).reduce(function(obj, res) {
    if (res.data) {
      obj.data.push(res.data);
    }
    if (res.error) {
      obj.errors.push(res.error);
    }
    return obj;
  }, {data: [], errors: []})
  .then(function(result) {
    result.data = _.flatten(result.data);
    result.errors = _.flatten(result.errors);
    return result;
  });
};
