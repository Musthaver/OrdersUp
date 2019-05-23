
exports.seed = function(knex, Promise) {
  return Promise.all([
     // Deletes ALL existing entries
    knex.raw('ALTER SEQUENCE categories_id_seq RESTART WITH 1'),
    knex('foods')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('foods').insert([
        {name: 'Clam Chowder', description: '', price: '4.75', image: '', category_id: ''},
        {name: 'Poutine', description: '', price: '8.50', image: '', category_id: ''},
        {name: 'Homemade Fries', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
        {name: 'Clam Chowder', description: '', price: '', image: '', category_id: ''},
      ]);
    })
  ]);
};
