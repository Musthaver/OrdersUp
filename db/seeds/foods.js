
exports.seed = function(knex, Promise) {
  return Promise.all([
     // Deletes ALL existing entries
    knex.raw('ALTER SEQUENCE foods_id_seq RESTART WITH 1'),
    knex('foods')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('foods').insert([
        {name: 'Clam Chowder', description: '', price: '4.75', image: 'img/102900.jpg', category_id: '1'},
        {name: 'Poutine', description: 'Vegetarian sauce', price: '8.50', image: 'img/102912.jpg', category_id: '1'},
        {name: 'Homemade Fries', description: '', price: '3.95', image: 'img/102918.jpg', category_id: '1'},
        {name: 'Green Salad', description: '', price: '5.50', image: 'img/102922.jpg', category_id: '2'},
        {name: 'House Salad', description: 'Served with lemon, coleslaw and choice of homemade sauce', price: '15.95', image: 'img/102923.jpg', category_id: '2'},
        {name: 'Shrimp Salad', description: 'Matane shrimp with dill, celery and shallot mayonnaise served over a green salad with tomato vinaigrette with olive oil and lemon', price: '12.95', image: 'img/104492.jpg', category_id: '2'},
        {name: 'Coleslaw', description: '', price: '4.50', image: 'img/102921.jpg', category_id: '2'},
        {name: 'Fried Calamari', description: 'Served with lemon and your choice of sauce', price: '6.95', image: 'img/102917.jpg', category_id: '3'},
        {name: 'Fish - 2 pieces', description: '2 cod pieces served with lemon, coleslaw and your choice of sauce', price: '10.95', image: 'img/102951.jpg', category_id: '3'},
        {name: 'Cod Nuggets', description: '4 Pieces, served with coleslaw and your choice of sauce', price: '10.95', image: 'img/102957.jpg', category_id: '3'},
        {name: 'Cod Burger', description: 'Choice of crispy or grilled cod, served with lettuce, tomato and tartare sauce', price: '7.50', image: 'img/102973.jpg', category_id: '3'},
        {name: 'Shrimp Roll', description: 'Matane shrimp with dill, celery and shallot mayonnaise', price: '7.00', image: 'img/102962.jpg', category_id: '3'},
        {name: 'Veggie Burger', description: 'Homemade without animal products', price: '7.50', image: 'img/102974.jpg', category_id: '4'},
        {name: 'Steak Sandwich', description: 'Cheese, cooked red peppers, mushrooms and fried onions', price: '10.95', image: 'img/102975.jpg', category_id: '4'},
        {name: 'Hot dog', description: '', price: '4.00', image: 'img/102976.jpg', category_id: '4'},
      ]);
    })
  ]);
};
