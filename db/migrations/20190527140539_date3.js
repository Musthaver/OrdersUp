exports.up = function(knex, Promise) {
  return knex.schema.table('orders', function(t) {
    t.datetime('date', options=[false])
    t.text('SMSsent');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('orders', function(t) {
    t.dropColumn('date');
    t.dropColumn('SMSsent');
  });
};
