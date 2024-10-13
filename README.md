# CS2 Skins Marketplace



**CS2 Skins Marketplace** is an online platform where users can browse, buy, and sell **Counter-Strike 2** skins. We provide a user-friendly experience for fans of the game to find their favorite skins and complete transactions securely.

## Features

- **Skin Browsing**: Search through a wide variety of CS2 weapon skins.
- **User System**: Users can register, log in, and manage their profiles.
- **Shopping Cart**: Users can add skins to their cart and proceed with purchases.
- **Admin Panel**: Admins have control over content and user management.
- **Secure Transactions**: Secure payments through PayPal or Stripe integrations (in development).

## Technologies Used

- **Backend**: Node.js, Express
- **Frontend**: EJS, HTML5, CSS3, JavaScript
- **Database**: MySQL
- **Authentication**: Passport.js
- **Development Environment**: XAMPP

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/cs2-skins-marketplace.git
   ```

2. Navigate to the project directory:

   ```bash
   cd cs2-skins-marketplace
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables (e.g., database credentials) in a `.env` file.

5. Start the server:

   ```bash
   npm start
   ```

6. Open your browser and go to `http://localhost:3000` to view the application.

## Project Structure

```
├── controllers
│   ├── webController.js
│   ├── adminController.js
├── views
│   ├── inicio.ejs
│   ├── register.ejs
│   ├── adminPanel.ejs
├── public
│   ├── css
│   ├── js
├── models
│   ├── User.js
│   └── Skin.js
├── routes
│   ├── webRoutes.js
│   └── adminRoutes.js
├── config
│   └── database.js
├── .env
├── app.js
└── package.json
```

## Contributing

Contributions are welcome. If you’d like to contribute to this project, feel free to open a **pull request** or **issue**.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Feel free to modify this as needed. Let me know if you'd like to add any more details or make adjustments!
