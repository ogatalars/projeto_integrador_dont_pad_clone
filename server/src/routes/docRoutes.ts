// src/routes/docRoutes.ts
import express from 'express';
import {
  createDocument,
  getDocumentBySlug,
  updateDocument,
  getUserDocuments,
  generateOrGetEditToken,
  deleteDocumentBySlug,
} from '../controllers/docController';
import { protect } from '../middlewares/authMiddleware'; // Nosso middleware de autenticação

const router = express.Router();

// Rotas para /api/docs

// POST /api/docs -> Criar um novo documento
// Protegida: Somente usuários logados podem criar documentos.
router.post('/', protect, createDocument);

// GET /api/docs -> Listar todos os documentos do usuário logado
// Protegida: Somente o usuário logado pode ver sua lista de documentos.
router.get('/', protect, getUserDocuments);

// GET /api/docs/:slug -> Obter um documento específico pelo slug
// Pública: Qualquer pessoa com o link/slug pode ler o documento.
router.get('/:slug', getDocumentBySlug);

// PUT /api/docs/:slug -> Atualizar um documento específico
// Protegida: A lógica de permissão (dono ou editToken) está no controller,
// mas a rota base requer autenticação para identificar o usuário (req.user).
// Se a edição por token anônimo fosse permitida sem login, 'protect' poderia ser opcional aqui,
// mas como o editToken é para compartilhar com *outros usuários* ou mesmo para o dono em outro dispositivo,
// manter 'protect' pode ser útil para loggar a ação ou se o editToken for uma camada extra SOBRE a autenticação.
// Para o nosso caso, onde o updateDocument verifica req.user, 'protect' é necessário.
router.put('/:slug', protect, updateDocument);

// POST /api/docs/:slug/edit-token -> Gerar/obter um token de edição para um documento
// Protegida: Somente o proprietário do documento (logado) pode gerar este token.
router.post('/:slug/edit-token', protect, generateOrGetEditToken);

router.delete('/:slug', protect, deleteDocumentBySlug);

export default router;