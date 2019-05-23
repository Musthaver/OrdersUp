exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw('drop table if exists cart cascade;'),
    knex.schema.raw('drop table if exists users cascade;'),
    knex.schema.createTable('addresses', function(table) {
      table
        .increments('id')
        .primary()
        .unsigned();
      table.text('street');
      table.integer('street_number');
      table.text('unit');
      table.text('city');
      table.text('postal_code');
    }),

    knex.schema.createTable('users', function(table) {
      table
        .increments('id')
        .primary()
        .unsigned();
      table.integer('name');
      table.text('phone');
      table.text('email');
      table.integer('address_id');
      table
        .foreign('address_id')
        .references('id')
        .on('addresses')
        .onDelete('cascade');
    }),
    knex.schema.createTable('orders', function(table) {
      table
        .increments('id')
        .primary()
        .unsigned();
      table.integer('food_id');
      table.integer('user_id');
      table.integer('address_id');
      table
        .foreign('user_id')
        .references('id')
        .on('users')
        .onDelete('cascade');
      table.integer('quantity');
      table
      .foreign('address_id')
      .references('id')
      .on('addresses')
      .onDelete('cascade');
    }),
    knex.schema.createTable('food_order', function(table) {
      table
        .increments('id')
        .primary()
        .unsigned();
      table.integer('food_id');
      table.integer('order_id');
      table
        .foreign('food_id')
        .references('id')
        .on('foods')
        .onDelete('cascade');
        table
        .foreign('order_id')
        .references('id')
        .on('orders')
        .onDelete('cascade');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.raw('drop table if exists orders cascade;'),
    knex.schema.raw('drop table if exists addresses cascade;'),
    knex.schema.raw('drop table if exists users cascade;')
  ]);
};
