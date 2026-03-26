# 📁 File Upload API

A flexible file upload API that supports both **local disk storage** and **Cloudinary** — switch with a single `.env` flag.

## ✨ Features
- Single & multiple file uploads
- Local storage (saved to `/uploads` folder, served statically)
- Cloudinary storage (auto-detects when `CLOUDINARY_CLOUD_NAME` is set)
- File type validation (images, PDFs, docs, audio, video)
- 10MB file size limit
- File metadata stored in MongoDB (name, size, mime, URL, folder)
- Delete from both DB and storage (local disk or Cloudinary)
- Filter files by folder and mime type
- JWT-protected routes

## 🛠 Tech Stack
- Node.js, Express.js, MongoDB + Mongoose, Multer, Cloudinary SDK, JWT

## 📁 Project Structure
```
07-file-upload-api/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── file.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── file.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── file.routes.js
│   └── server.js
├── uploads/             ← auto-created for local storage
├── .env.example
├── package.json
└── README.md
```

## 🚀 Setup & Run
```bash
npm install
cp .env.example .env
# For Cloudinary: fill in CLOUDINARY_* vars in .env
# For local storage: leave them blank
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/files/upload` | Upload single file |
| POST | `/api/files/upload-multiple` | Upload up to 10 files |
| GET | `/api/files` | Get my files |
| DELETE | `/api/files/:id` | Delete file |

## 📋 Upload Examples

### Single file (multipart/form-data)
```
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
folder: "avatars"   (optional)
```

### Multiple files
```
POST /api/files/upload-multiple
Authorization: Bearer <token>
Content-Type: multipart/form-data

files: <file1>, <file2>, ...
folder: "documents"
```

## 🔍 Query Parameters (GET /api/files)
```
?folder=avatars      → Filter by folder
?mimeType=image      → Filter by mime type (partial match)
?page=1&limit=20     → Pagination
```
