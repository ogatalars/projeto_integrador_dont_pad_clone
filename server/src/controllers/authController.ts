// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';


const generateToken = (id: number, email: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresInRaw = process.env.JWT_EXPIRES_IN;

  if (!secret) {
    console.error('Erro crítico: JWT_SECRET não está definido no .env');
    throw new Error('Erro de configuração interna do servidor (JWT_SECRET).');
  }
  if (!expiresInRaw) {
    console.error('Erro crítico: JWT_EXPIRES_IN não está definido ou está vazio no .env');
    throw new Error('Erro de configuração interna do servidor (JWT_EXPIRES_IN).');
  }

  const options: SignOptions = {
    // Sua modificação com a asserção
    expiresIn: expiresInRaw as jwt.SignOptions["expiresIn"],
  };

  try {
    return jwt.sign({ id, email }, secret as Secret, options);
  } catch (error) {
    console.error("Erro ao assinar o token JWT:", error);
    throw new Error("Não foi possível gerar o token de autenticação.");
  }
};

/**
 * @desc    Registrar um novo usuário
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => { 
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Por favor, forneça email e senha.' });
    return; 
  }
  if (password.length < 6) {
    res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
    return; 
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Usuário com este email já existe.' });
      return; 
    }

    const newUser = await User.create({ email, password });
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: userResponse,
    });
    

  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e: any) => e.message);
      res.status(400).json({ message: 'Erro de validação', errors: messages });
      return; // <<< ADICIONEI RETURN
    }
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar registrar o usuário.' });
    // Não precisa de return aqui se for a última instrução do catch
  }
};

/**
 * @desc    Autenticar (login) um usuário
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => { // <<< MUDEI AQUI
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Por favor, forneça email e senha.' });
    return; // <<< ADICIONEI RETURN
  }

  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user || !user.password) {
      res.status(401).json({ message: 'Credenciais inválidas (email não encontrado ou problema interno).' });
      return; // <<< ADICIONEI RETURN
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Credenciais inválidas (senha incorreta).' });
      return; // <<< ADICIONEI RETURN
    }

    const token = generateToken(user.id, user.email);
    const userResponse = {
      id: user.id,
      email: user.email,
    };
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user: userResponse,
    });
    // Não precisa de return aqui

  } catch (error: any) {
    if (error.message && error.message.includes('token de autenticação')) {
        res.status(500).json({ message: error.message });
        return; // <<< ADICIONEI RETURN
    }
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao tentar fazer login.' });
    // Não precisa de return aqui
  }
};

/**
 * @desc    Obter dados do usuário logado
 * @route   GET /api/auth/me
 * @access  Private (requer token)
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // Graças ao middleware 'protect', req.user deve estar definido aqui
  // e conterá os dados do usuário (sem a senha).
  const user = req.user; 

  if (!user) {
    // Esta verificação é uma segurança extra, o middleware já deve ter barrado
    res.status(401).json({ message: 'Não autorizado, usuário não encontrado na requisição.' });
    return;
  }

  res.status(200).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt, // Adicionando mais detalhes se disponíveis
    updatedAt: user.updatedAt,
  });
};
