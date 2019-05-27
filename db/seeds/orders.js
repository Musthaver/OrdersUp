exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('orders').del()
    .then(function() {
      // Inserts seed entries
      return knex('orders').insert([{
        id: 'pjht78',
        name: 'Tinker Bell',
        phone: '15146789087',
        order: '5 poutines',
        time: '12:45',
        date: '26/5/2019'
      }, {
        id: '97tt7h',
        name: 'Jon Snow',
        phone: '14387650952',
        order: '2 Homemade Fries, Fish - 2 pieces',
        time: '17:58',
        date: '4/1/1345'
      }, {
        id: 'jht90o',
        name: 'Tiny Time',
        phone: '15142876789',
        order: '2 Veggie Burger, 1 Coleslaw',
        time: '11:01',
        date: '26/5/2019'
      }, {
        id: 'qwr456',
        name: 'Gabe Newell',
        phone: '15146789043',
        order: '5 poutines, 2 Clam Chowder, 7 Homemade Fries, 1 Shrimp Salad, 4 Fried Calamari, 4 Cod Nuggets. 6 Steak Sandwich, 1 HotDog',
        time: '14:02',
        date: '26/5/2019'
      }, {
        id: 'po76lw',
        name: 'John Malkovitch',
        phone: '14387654761',
        order: '2 Homemade Fries, 17 Coleslaw',
        time: '21:48',
        date: '3/9/2004'
      }, {
        id: 's0l33t',
        name: 'Master Chief',
        phone: '15148881234',
        order: '1 Shrimp Salad',
        time: '11:01',
        date: '14/5/2012'
      }]);
    });
};
