"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        user_name: "johndoe",
        full_name: "John Doe",
        password: "password123",
        confirm_password: "password123",
        email: "example@example.com",
        date_of_birth: "2026-01-01",
        avatar_image_url: "https://example.com/avatar.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
