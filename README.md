# **Project Documentation**

## **Overview**
This project is a web application designed to facilitate booking salon and at-home beauty and wellness services. It is built using **Next.js, Sequelize**, and various other modern web technologies. The application allows users to **book services, manage their bookings, and leave reviews** for service providers.

---

## **Project Structure**
The project has the following structure:

```
.env
.eslintrc.json
.gitignore
.next/
.vscode/
components/
lib/
pages/
public/
sequelize/
styles/
tests/
```

### **Key Directories and Files**
- **components/**: Contains React components used throughout the application.
- **lib/**: Contains utility functions and middleware.
- **pages/**: Contains Next.js pages, including API routes.
- **public/**: Contains static assets like images and fonts.
- **sequelize/**: Contains Sequelize models, migrations, and seeders.
- **styles/**: Contains global styles and Tailwind CSS configuration.
- **tests/**: Contains unit and integration tests.

---

## **Key Features**
### **User Authentication**
- Users can sign up, log in, and manage their profiles.
- Authentication is handled using **JWT tokens**.

### **Booking Services**
- Users can browse available services, book appointments, and manage their bookings.
- Service providers can manage their availability and view their bookings.

### **Reviews**
- Users can leave reviews for service providers.
- Reviews are displayed on the provider's profile.

### **Admin Panel**
- Admins can manage users, service providers, and bookings.
- Admins can also view logs of administrative actions.

---

## **Technologies Used**
- **Next.js**: A React framework for building server-side rendered applications.
- **Sequelize**: An ORM for Node.js that supports various SQL databases.
- **Stripe**: Used for handling payments.
- **Jest**: A testing framework for JavaScript.
- **Tailwind CSS**: A utility-first CSS framework.
- **dotenv**: For managing environment variables.

---

## **Getting Started**
### **Prerequisites**
- Node.js
- npm or yarn
- PostgreSQL (or another supported SQL database)

### **Installation**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory and add the necessary environment variables.

4. **Run database migrations and seeders:**
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. **Running the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   - Open **http://localhost:3000** in your browser to see the application.

---

## **Running Tests**
To run tests, execute:

```bash
npm test
# or
yarn test
```

---

## **Deployment**
The easiest way to deploy the application is to use the **Vercel Platform**.

---

## **Learn More**
To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Sequelize Documentation](https://sequelize.org/master/)
- [Stripe Documentation](https://stripe.com/docs)
- [Jest Documentation](https://jestjs.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## **Contributing**
Contributions are welcome! Please open an issue or submit a pull request on **GitHub**.

---

## **License**
This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

This version is **formatted and structured** for easy readability in **Word** or any other document editor. Let me know if you need any modifications! 🚀
