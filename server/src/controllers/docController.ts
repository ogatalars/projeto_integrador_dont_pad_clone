
import { Response } from 'express';
import { nanoid } from 'nanoid'; // Usaremos para gerar o editToken também
import Document, { DocumentInstance } from '../models/Document';
import { AuthenticatedRequest } from '../middlewares/authMiddleware'; // Para req.user

/**
 * @desc    Criar um novo documento
 * @route   POST /api/docs
 * @access  Private (usuário logado)
 */
export const createDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      // Middleware 'protect' já deveria ter barrado, mas é uma checagem extra.
      res.status(401).json({ message: 'Não autorizado, usuário não encontrado na requisição.' });
      return;
    }

    // O slug é gerado automaticamente pelo model Document com nanoid.
    // O content pode ser opcionalmente enviado no body, ou começa vazio.
    const content = req.body.content || '';

    const newDocument = await Document.create({
      ownerId: req.user.id,
      content: content,
      // slug é gerado por defaultValue no model
    });

    res.status(201).json({
      message: 'Documento criado com sucesso!',
      slug: newDocument.slug,
      document: newDocument, // Retorna o documento inteiro para referência
    });

  } catch (error: any) {
    console.error('Erro ao criar documento:', error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e: any) => e.message);
      res.status(400).json({ message: 'Erro de validação', errors: messages });
      return;
    }
    res.status(500).json({ message: 'Erro interno do servidor ao criar documento.' });
  }
};

/**
 * @desc    Obter um documento pelo seu slug
 * @route   GET /api/docs/:slug
 * @access  Public (qualquer um pode ler, como no DontPad)
 */
export const getDocumentBySlug = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const document = await Document.findOne({ where: { slug } });

    if (!document) {
      res.status(404).json({ message: 'Documento não encontrado.' });
      return;
    }

    // Para um DontPad, o conteúdo é geralmente público para quem tem o link.
    // Se quiséssemos verificar propriedade para leitura:
    // if (document.ownerId !== req.user?.id) {
    //   res.status(403).json({ message: 'Acesso negado a este documento.' });
    //   return;
    // }

    res.status(200).json({
      slug: document.slug,
      content: document.content,
      updatedAt: document.updatedAt,
      // Não retornamos ownerId ou editToken em uma leitura pública por padrão
    });

  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar documento.' });
  }
};

/**
 * @desc    Atualizar um documento
 * @route   PUT /api/docs/:slug
 * @access  Private (proprietário ou com editToken válido)
 */
export const updateDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { content } = req.body;
    const editTokenProvided = req.headers['x-edit-token'] as string | undefined; // Token de edição vindo do header

    if (typeof content === 'undefined') {
      // Permitimos string vazia, mas não 'undefined'
      res.status(400).json({ message: 'O campo "content" é obrigatório para atualização.' });
      return;
    }

    const document = await Document.findOne({ where: { slug } });

    if (!document) {
      res.status(404).json({ message: 'Documento não encontrado.' });
      return;
    }

    // Checagem de Permissão:
    const isOwner = req.user && req.user.id === document.ownerId;
    const hasValidEditToken = document.editToken && editTokenProvided && document.editToken === editTokenProvided;

    if (!isOwner && !hasValidEditToken) {
      res.status(403).json({ message: 'Você não tem permissão para editar este documento.' });
      return;
    }

    document.content = content;
    await document.save();

    res.status(200).json({
      message: 'Documento atualizado com sucesso!',
      slug: document.slug,
      updatedAt: document.updatedAt,
    });

  } catch (error: any) {
    console.error('Erro ao atualizar documento:', error);
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e: any) => e.message);
      res.status(400).json({ message: 'Erro de validação', errors: messages });
      return;
    }
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar documento.' });
  }
};

/**
 * @desc    Listar documentos do usuário logado
 * @route   GET /api/docs
 * @access  Private
 */
export const getUserDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado.' });
      return;
    }

    const documents = await Document.findAll({
      where: { ownerId: req.user.id },
      attributes: ['slug', 'updatedAt'], // Retorna apenas slug e data de atualização para a lista
      order: [['updatedAt', 'DESC']], // Mais recentes primeiro
    });

    res.status(200).json(documents);

  } catch (error) {
    console.error('Erro ao listar documentos do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * @desc    Gerar ou obter o token de edição para um documento
 * @route   POST /api/docs/:slug/edit-token
 * @access  Private (proprietário do documento)
 */
export const generateOrGetEditToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Não autorizado.' });
      return;
    }

    const document = await Document.findOne({ where: { slug } });

    if (!document) {
      res.status(404).json({ message: 'Documento não encontrado.' });
      return;
    }

    // Verifica se o usuário logado é o proprietário do documento
    if (document.ownerId !== req.user.id) {
      res.status(403).json({ message: 'Você não tem permissão para gerar um token de edição para este documento.' });
      return;
    }

    let tokenToReturn = document.editToken;

    if (!tokenToReturn) {
      // Gera um novo token de edição se não existir
      tokenToReturn = nanoid(12); // Gera um token de 12 caracteres
      document.editToken = tokenToReturn;
      await document.save();
    }

    res.status(200).json({
      message: 'Token de edição recuperado/gerado com sucesso.',
      slug: document.slug,
      editToken: tokenToReturn,
    });

  } catch (error) {
    console.error('Erro ao gerar/obter token de edição:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};