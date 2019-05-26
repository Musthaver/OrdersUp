
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('orders', function(table){
            table.boolean('confirm_sent');
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('orders', function(table){
            table.dropColumn('confirm_sent');
        })
    ])
};
