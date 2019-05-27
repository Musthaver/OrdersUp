exports.up = function(knex, Promise) {
  return knex.schema.table('orders', function(t) {
    t.dropColumn('datLe');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('orders', function(t) {
    t.dropColumn('date');
  });
}
