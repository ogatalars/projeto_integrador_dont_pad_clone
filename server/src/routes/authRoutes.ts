// src/routes/authRoutes.ts
import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";
// Futuramente, importaremos o middleware de proteção e a função getMe aqui
// import { protect } from '../middlewares/authMiddleware';
// import { getMe } from '../controllers/authController';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registra um novo usuário
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Autentica um usuário e retorna um token
// @access  Public
router.post("/login", loginUser);

// Exemplo de como uma rota protegida seria (implementaremos depois):
// @route   GET /api/auth/me
// @desc    Retorna dados do usuário logado
// @access  Private
// router.get('/me', protect, getMe);

router.get('/me', protect, getMe);

export default router;
