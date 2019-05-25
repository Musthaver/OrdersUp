exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw('drop table if exists cart cascade;'),
    // knex.schema.raw('drop table if exists users cascade;'),
    knex.schema.createTable('orders', function(table) {
      table
        .text('id')
        .primary()
        .unsigned();
      table.text('name');
      table.text('phone');
      table.text('order');
      table.text('time');
      table.text('date');
    })
  ]);
};
exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.raw('drop table if exists orders cascade;')]);
};

// knex.schema.createTable('food_order', function(table) {
//   table
//     .increments('id')
//     .primary()
//     .unsigned();
//   table.integer('food_id');
//   table.integer('order_id');
//   table
//     .foreign('food_id')
//     .references('id')
//     .on('foods')
//     .onDelete('cascade');
//     table
//     .foreign('order_id')
//     .references('id')
//     .on('orders')
//     .onDelete('cascade');
// }),
