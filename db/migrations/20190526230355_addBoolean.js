exports.up = function(knex, Promise) {
    return knex.schema.table('orders', function(t) {
        t.boolean('SMSsent').notNull().defaultTo(0);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('orders', function(t) {
        t.dropColumn('SMSsent');
    });
};

