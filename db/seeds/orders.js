
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('orders').del()
    .then(function () {
      // Inserts seed entries
      return knex('orders').insert([
        {id: 'pjht78', name: 'Tinker Bell', phone: '15146789087', order: '5 poutines', time: '12:45', date: 'May 26, 2019'},
        {id: '97tt7h', name: 'John Snow', phone: '14387650987', order: '2 Homemade Fries, Fish - 2 pieces', time: '17:58', date: 'May 26, 2019'},
        {id: 'jht90o', name: 'Tiny Time', phone: '15142876789', order: '2 Veggie Burger, 1 Coleslaw', time: '11:01', date: 'May 26, 2019'}
      ]);
    });
};
