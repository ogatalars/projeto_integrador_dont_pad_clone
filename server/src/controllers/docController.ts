import { Response } from "express";
import { nanoid } from "nanoid";
import Document, { DocumentInstance } from "../models/Document";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

/**
 * @desc    Criar um novo documento
 * @route   POST /api/docs
 * @access  Private (usuário logado)
 */
export const createDocument = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Não autorizado, usuário não encontrado na requisição.",
      });
      return;
    }

    const content = req.body.content || "";

    const newDocument = await Document.create({
      ownerId: req.user.id,
      content: content,
    });

    res.status(201).json({
      message: "Documento criado com sucesso!",
      slug: newDocument.slug,
      document: newDocument,
    });
  } catch (error: any) {
    console.error("Erro ao criar documento:", error);
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e: any) => e.message);
      res.status(400).json({ message: "Erro de validação", errors: messages });
      return;
    }
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao criar documento." });
  }
};

/**
 * @desc    Obter um documento pelo seu slug
 * @route   GET /api/docs/:slug
 * @access  Public (qualquer um pode ler, como no DontPad)
 */
export const getDocumentBySlug = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;
    const document = await Document.findOne({ where: { slug } });

    if (!document) {
      res.status(404).json({ message: "Documento não encontrado." });
      return;
    }

    res.status(200).json({
      slug: document.slug,
      content: document.content,
      updatedAt: document.updatedAt,
    });
  } catch (error) {
    console.error("Erro ao buscar documento:", error);
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao buscar documento." });
  }
};

/**
 * @desc    Atualizar um documento
 * @route   PUT /api/docs/:slug
 * @access  Private (proprietário ou com editToken válido)
 */
export const updateDocument = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { content } = req.body;
    const editTokenProvided = req.headers["x-edit-token"] as string | undefined;

    if (typeof content === "undefined") {
      res
        .status(400)
        .json({ message: 'O campo "content" é obrigatório para atualização.' });
      return;
    }

    const document = await Document.findOne({ where: { slug } });

    if (!document) {
      res.status(404).json({ message: "Documento não encontrado." });
      return;
    }

    const isOwner = req.user && req.user.id === document.ownerId;
    const hasValidEditToken =
      document.editToken &&
      editTokenProvided &&
      document.editToken === editTokenProvided;

    if (!isOwner && !hasValidEditToken) {
      res.status(403).json({
        message: "Você não tem permissão para editar este documento.",
      });
      return;
    }

    document.content = content;
    await document.save();

    res.status(200).json({
      message: "Documento atualizado com sucesso!",
      slug: document.slug,
      updatedAt: document.updatedAt,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar documento:", error);
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e: any) => e.message);
      res.status(400).json({ message: "Erro de validação", errors: messages });
      return;
    }
    res
      .status(500)
      .json({ message: "Erro interno do servidor ao atualizar documento." });
  }
};

/**
 * @desc    Listar documentos do usuário logado
 * @route   GET /api/docs
 * @access  Private
 */
export const getUserDocuments = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Não autorizado." });
      return;
    }

    const documents = await Document.findAll({
      where: { ownerId: req.user.id },
      attributes: ["slug", "updatedAt"],
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error("Erro ao listar documentos do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/**
 * @desc    Gerar ou obter o token de edição para um documento
 * @route   POST /api/docs/:slug/edit-token
 * @access  Private (proprietário do documento)
 */
export const generateOrGetEditToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!req.user) {
      res.status(401).json({ message: "Não autorizado." });
      return;
    }

    const document = await Document.findOne({ where: { slug } });

    if (!document) {
      res.status(404).json({ message: "Documento não encontrado." });
      return;
    }

    if (document.ownerId !== req.user.id) {
      res.status(403).json({
        message:
          "Você não tem permissão para gerar um token de edição para este documento.",
      });
      return;
    }

    let tokenToReturn = document.editToken;

    if (!tokenToReturn) {
      tokenToReturn = nanoid(12);
      document.editToken = tokenToReturn;
      await document.save();
    }

    res.status(200).json({
      message: "Token de edição recuperado/gerado com sucesso.",
      slug: document.slug,
      editToken: tokenToReturn,
    });
  } catch (error) {
    console.error("Erro ao gerar/obter token de edição:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/**
 * @desc    Deletar um documento pelo seu slug
 * @route   DELETE /api/docs/:slug
 * @access  Private (proprietário do documento)
 */
export const deleteDocumentBySlug = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!req.user) {
      res.status(401).json({ message: "Não autorizado." });
      return;
    }

    const document = await Document.findOne({ where: { slug } });

    if (!document) {
      res.status(404).json({ message: "Documento não encontrado." });
      return;
    }

    if (document.ownerId !== req.user.id) {
      res.status(403).json({
        message: "Você não tem permissão para deletar este documento.",
      });
      return;
    }

    await document.destroy();

    res.status(200).json({ message: "Documento deletado com sucesso." });
  } catch (error: unknown) {
    console.error("Erro ao deletar documento:", error);
    let displayMessage = "Erro interno do servidor ao deletar documento.";
    if (error instanceof Error) {
      displayMessage = error.message;
    }
    res.status(500).json({ message: displayMessage });
  }
};
