import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserDocumentsList, type UserDocumentListItem } from '../services/docService';
// import styles from './MyDocumentsPage.module.css'; // Crie este arquivo se quiser estilos específicos

const MyDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<UserDocumentListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const docs = await getUserDocumentsList();
        setDocuments(docs);
      } catch (err: unknown) {
        let errorMessage = 'Falha ao carregar seus documentos.';
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        console.error("Erro ao buscar documentos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);


  const pageStyle: React.CSSProperties = {
    padding: '20px',
    color: '#c9d1d9',
  };

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
  };

  const listItemStyle: React.CSSProperties = {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#161b22',
    borderRadius: '6px',
    border: '1px solid #30363d',
  };

  const linkStyle: React.CSSProperties = {
    color: '#58a6ff',
    textDecoration: 'none',
    fontWeight: 'bold',
  };

  const dateStyle: React.CSSProperties = {
    fontSize: '0.85em',
    color: '#8b949e',
    display: 'block',
    marginTop: '5px',
  };


  if (isLoading) {
    return <div style={pageStyle}>Carregando seus documentos...</div>;
  }

  if (error) {
    return <div style={{ ...pageStyle, color: '#f85149' }}>Erro: {error}</div>;
  }

  return (
    <div style={pageStyle /* className={styles.myDocumentsPage} */ }>
      <h1>Meus Documentos</h1>
      {documents.length === 0 ? (
        <p>Você ainda não criou nenhum documento. <Link to="/" style={linkStyle}>Crie um agora!</Link></p>
      ) : (
        <ul style={listStyle}>
          {documents.map(doc => (
            <li key={doc.slug} style={listItemStyle}>
              <Link to={`/doc/${doc.slug}`} style={linkStyle}>
                {doc.slug}
              </Link>
              <span style={dateStyle}>
                Última atualização: {new Date(doc.updatedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyDocumentsPage;