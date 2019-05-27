exports.up = function(knex, Promise) {
  return knex.schema.table('orders', function(t) {
    t.dropColumn('SMSsent');
    t.dropColumn('confirm_sent');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('orders', function(t) {
    t.text('SMSsent');
    t.text('confirm_sent')
  });
}
