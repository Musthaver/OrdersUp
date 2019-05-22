exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('foods', function(table) {
      table
        .increments('id')
        .primary()
        .unsigned();
      table.string('name');
      table.string('description');
      table.decimal('price');
      table.text('image');
      table.integer('category_id');
      table.foreign('category_id').references('id').on('categories').onDelete('cascade');
    }),
    knex.schema.createTable('categories', function(table) {
      table
        .increments('id')
        .primary()
        .unsigned();
      table.string('name');
    }),
    knex.schema.createTable('cart', function(table) {
      table
        .increments('id')
        .primary()
        .unsigned(); 
      table.integer('food_id');
      table.foreign('food_id').references('id').on('foods').onDelete('cascade');
      table.integer('quantity');
      table.boolean('is_active');
      table.text('name');
      table.text('phone');
      table.integer('street_number');
      table.text('street');
      table.text('unit');
      table.text('city');
      table.text('postal_code');
    }),
  ])
};


exports.down = function(knex, Promise) {
  return Promise.all([
    // knex.schema.dropTable('foods'),
    // knex.schema.dropTable('categories'),
    knex.schema.dropTable('cart'),
    knex.schema.raw('drop table if exists foods cascade;'),
    knex.schema.raw('drop table if exists categories cascade;'),
  ])
};
