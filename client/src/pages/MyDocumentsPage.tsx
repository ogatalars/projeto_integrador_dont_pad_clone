import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  getUserDocumentsList,
  deleteDocument,
  type UserDocumentListItem,
} from "../services/docService";
import styles from "./MyDocumentsPage.module.css";

const MyDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<UserDocumentListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const docs = await getUserDocumentsList();
      setDocuments(docs);
    } catch (err: unknown) {
      let errorMessage = "Falha ao carregar seus documentos.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Erro ao buscar documentos:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDeleteDocument = async (slugToDelete: string) => {
    if (
      !window.confirm(
        `Tem certeza que deseja deletar o documento "${slugToDelete}"? Esta ação não pode ser desfeita.`
      )
    ) {
      return;
    }
    setIsDeleting(slugToDelete);
    setError(null);
    try {
      await deleteDocument(slugToDelete);
      setDocuments((prevDocs) =>
        prevDocs.filter((doc) => doc.slug !== slugToDelete)
      );
    } catch (err: unknown) {
      let errorMessage = `Falha ao deletar o documento "${slugToDelete}".`;
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      console.error("Erro ao deletar documento:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Meus Documentos</h1>
        <p className={styles.loadingMessage}>Carregando seus documentos...</p>
      </div>
    );
  }


  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Meus Documentos</h1>
      {error && <p className={styles.errorMessage}>Erro: {error}</p>}
      {!isLoading && documents.length === 0 && !error && (
        <p className={styles.noDocumentsMessage}>
          Você ainda não criou nenhum documento.{" "}
          <Link to="/" className={styles.noDocumentsLink}>
            Crie um agora!
          </Link>
        </p>
      )}
      {!isLoading && documents.length > 0 && (
        <ul className={styles.list}>
          {documents.map((doc) => (
            <li key={doc.slug} className={styles.listItem}>
              <div>
                <Link to={`/doc/${doc.slug}`} className={styles.docInfoLink}>
                  {doc.slug}
                </Link>
                <span className={styles.date}>
                  Última atualização:{" "}
                  {new Date(doc.updatedAt).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <button
                onClick={() => handleDeleteDocument(doc.slug)}
                disabled={isDeleting === doc.slug}
                className={styles.deleteButton} 
              >
                {isDeleting === doc.slug ? "Deletando..." : "Deletar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyDocumentsPage;
