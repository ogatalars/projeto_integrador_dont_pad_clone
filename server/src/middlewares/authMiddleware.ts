// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'; // Importar Request explicitamente
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import User, { UserInstance } from '../models/User';

// 1. Definição da Interface Corrigida
export interface AuthenticatedRequest extends Request { // Estender o Request importado
  user?: UserInstance;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;
  const authorizationHeader = req.headers.authorization; // Acessar o header

  // 2. Acesso seguro ao header
  if (authorizationHeader && typeof authorizationHeader === 'string' && authorizationHeader.startsWith('Bearer')) {
    token = authorizationHeader.split(' ')[1];

    if (!token) {
      // Este caso é improvável se authorizationHeader.split(' ')[1] funcionou, mas é uma checagem.
      res.status(401).json({ message: 'Não autorizado, formato de token inválido (token ausente após "Bearer ").' });
      return;
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('Erro crítico: JWT_SECRET não está definido no .env para verificação de token.');
        res.status(500).json({ message: 'Erro de configuração interna do servidor.' });
        return;
      }

      const decoded = jwt.verify(token, secret as Secret) as JwtPayload;

      if (!decoded.id || typeof decoded.id !== 'number') {
        res.status(401).json({ message: 'Não autorizado, token não contém um ID de usuário válido.' });
        return;
      }

      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        res.status(401).json({ message: 'Não autorizado, usuário do token não encontrado.' });
        return;
      }

      req.user = user; // Anexa o usuário à requisição
      next(); // Passa para o próximo middleware ou rota

    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(401).json({ message: 'Não autorizado, token inválido ou expirado.' });
      return;
    }
  } else {
    // Se não houver header Authorization ou não começar com Bearer
    res.status(401).json({ message: 'Não autorizado, nenhum token Bearer fornecido.' });
    return;
  }
};