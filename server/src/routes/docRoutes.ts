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
import { protect } from '../middlewares/authMiddleware'; 

const router = express.Router();


router.post('/', protect, createDocument);


router.get('/', protect, getUserDocuments);


router.get('/:slug', getDocumentBySlug);


router.put('/:slug', protect, updateDocument);


router.post('/:slug/edit-token', protect, generateOrGetEditToken);

router.delete('/:slug', protect, deleteDocumentBySlug);

export default router;