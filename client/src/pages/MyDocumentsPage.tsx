import React, { useEffect, useState, useCallback } from 'react'; 
import { Link } from 'react-router-dom';
import { getUserDocumentsList, deleteDocument, type UserDocumentListItem } from '../services/docService';
// import styles from './MyDocumentsPage.module.css'; 

const MyDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<UserDocumentListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Slug do doc sendo deletado

  const fetchDocuments = useCallback(async () => { // Envolvemos em useCallback
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
  }, []); // useCallback não tem dependências aqui pois não usa props/state que mudam

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]); // fetchDocuments é agora uma dependência estável

  const handleDeleteDocument = async (slugToDelete: string) => {
    if (!window.confirm(`Tem certeza que deseja deletar o documento "${slugToDelete}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setIsDeleting(slugToDelete);
    setError(null);
    try {
      await deleteDocument(slugToDelete);
      // Atualiza a lista de documentos removendo o deletado
      setDocuments(prevDocs => prevDocs.filter(doc => doc.slug !== slugToDelete));
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

  // Estilos inline (mova para CSS Module/global depois, conforme discutimos)
  const pageStyle: React.CSSProperties = {
    padding: '20px 30px',
    color: '#c9d1d9',
    flexGrow: 1,
  };

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
  };

  const listItemStyle: React.CSSProperties = {
    marginBottom: '12px',
    padding: '12px 15px',
    backgroundColor: '#161b22',
    borderRadius: '6px',
    border: '1px solid #30363d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const linkStyle: React.CSSProperties = {
    color: '#58a6ff',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1em',
  };

  const dateStyle: React.CSSProperties = {
    fontSize: '0.8em',
    color: '#8b949e',
    display: 'block',
    marginTop: '6px',
  };

  const headingStyle: React.CSSProperties = {
    borderBottom: '1px solid #30363d',
    paddingBottom: '10px',
    marginBottom: '20px',
    color: '#c9d1d9',
  };
  
  const deleteButtonStyle: React.CSSProperties = {
    marginLeft: '10px',
    padding: '5px 10px', // Aumentei um pouco o padding
    fontSize: '0.9em',  // Aumentei um pouco a fonte
    backgroundColor: '#da3633', // Vermelho mais forte do GitHub para delete
    color: 'white',
    border: '1px solid rgba(240, 246, 252, 0.1)', // Borda sutil como nos botões do GitHub
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  };

  const disabledDeleteButtonStyle: React.CSSProperties = {
    ...deleteButtonStyle,
    backgroundColor: '#6e7681', // Cor para botão desabilitado
    cursor: 'not-allowed',
    opacity: 0.7,
  };

  if (isLoading) {
    return (
      <div style={pageStyle}>
        <h1 style={headingStyle}>Meus Documentos</h1>
        <p>Carregando seus documentos...</p>
      </div>
    );
  }

  // Não precisamos de um 'else if (error)' separado se o erro for mostrado dentro do layout principal
  // if (error) {
  //   return <div style={{ ...pageStyle, color: '#f85149' }}><h1 style={headingStyle}>Meus Documentos</h1>Erro: {error}</div>;
  // }

  return (
    <div style={pageStyle /* className={styles.myDocumentsPage} */ }>
      <h1 style={headingStyle}>Meus Documentos</h1>
      {error && <p style={{ color: '#f85149', marginBottom: '15px' }}>Erro: {error}</p>}
      {!isLoading && documents.length === 0 && !error && ( // Adicionado !error aqui
        <p>Você ainda não criou nenhum documento. <Link to="/" style={linkStyle}>Crie um agora!</Link></p>
      )}
      {!isLoading && documents.length > 0 && ( // Removido !error daqui, pois já é tratado acima
        <ul style={listStyle}>
          {documents.map(doc => (
            <li 
              key={doc.slug} 
              style={listItemStyle}
            >
              <div> 
                <Link to={`/doc/${doc.slug}`} style={linkStyle}>
                  {doc.slug}
                </Link>
                <span style={dateStyle}>
                  Última atualização: {new Date(doc.updatedAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button 
                onClick={() => handleDeleteDocument(doc.slug)} 
                disabled={isDeleting === doc.slug}
                style={isDeleting === doc.slug ? disabledDeleteButtonStyle : deleteButtonStyle}
              >
                {isDeleting === doc.slug ? 'Deletando...' : 'Deletar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyDocumentsPage;