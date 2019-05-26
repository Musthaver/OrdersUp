
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 6ht78, name: 'Tinker Bell', phone: '15146789087', order: '5 poutines', time: 12:45, date: 'May 26, 2019'},
        {id: m7tt78, name: 'John Snow', phone: '14387650987', order: '2 Homemade Fries, Fish - 2 pieces', time: 17:58, date: 'May 26, 2019'},
        {id: 6ht90o, name: 'Tiny Time', phone: '15142876789', order: '2 Veggie Burger, 1 Coleslaw', time: 11:01, date: 'May 26, 2019'}
      ]);
    });
};
