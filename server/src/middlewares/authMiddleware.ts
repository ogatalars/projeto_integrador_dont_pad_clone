// src/middlewares/authMiddleware.ts
import { Response, NextFunction } from 'express'; // Request base do Express
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import User, { UserInstance } from '../models/User';

// Estendendo a interface Request do Express para incluir a propriedade 'user'
// É uma boa prática definir isso em um arquivo de tipos separado (ex: types/express.d.ts)
// ou mantê-lo aqui se for usado apenas por este middleware e seus consumers.
export interface AuthenticatedRequest extends Express.Request {
  headers: any; // Usar Express.Request como base
  user?: UserInstance; // Ou um tipo mais simples como { id: number; email: string; }
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => { // <<< TIPO DE RETORNO AJUSTADO
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Não autorizado, formato de token inválido (token ausente após "Bearer ").' });
      return; // <<< ADICIONADO RETURN
    }

    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('Erro crítico: JWT_SECRET não está definido no .env para verificação de token.');
        res.status(500).json({ message: 'Erro de configuração interna do servidor.' });
        return; // <<< ADICIONADO RETURN
      }

      const decoded = jwt.verify(token, secret as Secret) as JwtPayload;

      // Verifica se o payload decodificado tem o ID do usuário
      if (!decoded.id || typeof decoded.id !== 'number') { // Adicionada checagem de tipo para decoded.id
          res.status(401).json({ message: 'Não autorizado, token não contém um ID de usuário válido.' });
          return; // <<< ADICIONADO RETURN
      }
      
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        res.status(401).json({ message: 'Não autorizado, usuário do token não encontrado.' });
        return; // <<< ADICIONADO RETURN
      }

      req.user = user; // Anexa o usuário à requisição
      next(); // Passa para o próximo middleware ou rota (retorna void implicitamente)

    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(401).json({ message: 'Não autorizado, token inválido ou expirado.' });
      return; // <<< ADICIONADO RETURN
    }
  } else {
    // Se não houver header Authorization ou não começar com Bearer
    res.status(401).json({ message: 'Não autorizado, nenhum token Bearer fornecido.' });
    return; // <<< ADICIONADO RETURN
  }
};