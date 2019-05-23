
exports.seed = function(knex, Promise) {
  return Promise.all([
    knex.raw('ALTER SEQUENCE categories_id_seq RESTART WITH 1'),
    // Deletes ALL existing entries
    knex('categories')
      .del()
      .then(function() {
        // Inserts seed entries
        return knex('categories').insert([
        {name: 'Appetizers'},
        {name: 'Salads'},
        {name: 'Fish & Chips'},
        {name: 'Hamburgers & Sandwiches'}
      ]);
    })
  ]);  
};
