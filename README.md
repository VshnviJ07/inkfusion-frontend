# InkFusion
<img src="Screenshot (222).png" alt="InkFusion1" width="600"> <img src="Screenshot (223).png" alt="InkFusion2" width="600"> <img src="Screenshot (224).png" alt="InkFusion3" width="600"> <img src="Screenshot (225).png" alt="InkFusion4" width="600">

InkFusion is a **MERN-based notepad application** with authentication, allowing users to create, edit, and manage notes efficiently. It is fully responsive and secure.

---

## 🚀 Features
- User Signup/Login with JWT authentication
- Create, Read, Update, Delete (CRUD) notes
- Responsive design for mobile and desktop
- Secure password hashing with bcrypt

---

## 💻 Tech Stack
- **Frontend:** React.js, HTML, CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Atlas)  
- **Authentication:** JWT, bcrypt

---

## ⚡ Installation

1. **Clone the repository**
```bash
git clone https://github.com/Vshnvi07/inkfusion.git
Install dependencies

cd inkfusion
npm install


Create a .env file in the backend folder with the following content:

PORT=5000
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here


Replace your_mongodb_uri_here with your MongoDB Atlas URI
Replace your_jwt_secret_here with any random string

Run the backend

npm run server


Run the frontend

npm start


Open http://localhost:3000
 to view the app in your browser.

📂 API Endpoints

Authentication

POST /api/auth/createuser - Register a new user

POST /api/auth/login - Login a user

POST /api/auth/getuser - Get logged-in user info

Notes

GET /api/notes/fetchallnotes - Fetch all notes of the logged-in user

POST /api/notes/addnote - Add a new note

PUT /api/notes/updatenote/:id - Update a note

DELETE /api/notes/deletenote/:id - Delete a note



👩‍💻 Author

Vaishnavi Jaiswal
## 👩‍💻 Author
**Vaishnavi Jaiswal**  
[LinkedIn](https://www.linkedin.com/in/vaishnavijaiswal0710) | [GitHub](https://github.com/Vshnvi07)
backend repositiory:- https://github.com/VshnviJ07/inkfusion-backend
