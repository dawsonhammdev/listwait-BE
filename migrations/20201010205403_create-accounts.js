
exports.up = function(knex, promise) {
  return knex.schema
  .createTable('users', users => {
      users.increments("id");
      users.string('username', 255).notNullable().index();
      users.string('email').notNullable().index();
      users.string('password', 255).notNullable();
      
  } )
};

exports.down = function(knex, promise) {
  return knex.schema.dropTableIfExits('users');
};
