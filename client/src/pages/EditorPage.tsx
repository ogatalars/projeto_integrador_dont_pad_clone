// src/pages/EditorPage.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
    getDocument, 
    updateDocumentContent, 
    createNewDocument, 
    generateEditToken, 
    type DocumentData 
} from '../services/docService';
import styles from './EditorPage.module.css'; // <<< 1. IMPORTE O ARQUIVO CSS MODULE

const EditorPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [content, setContent] = useState<string>('');
  const [currentSlug, setCurrentSlug] = useState<string | null>(slug || null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showShareInfo, setShowShareInfo] = useState<boolean>(false);
  const [currentEditToken, setCurrentEditToken] = useState<string | null>(null);
  const [displayedEditToken, setDisplayedEditToken] = useState<string | null>(null);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

 useEffect(() => {
   const queryParams = new URLSearchParams(location.search);
   const tokenFromQuery = queryParams.get('edit_token');
   if (tokenFromQuery) {
     console.log("Edit token from URL:", tokenFromQuery);
     setCurrentEditToken(tokenFromQuery);
   }
 }, [location.search]);

 const loadDocument = useCallback(async (slugToLoad: string) => {
   console.log("Attempting to load document with slug:", slugToLoad);
   setIsLoading(true);
   setError(null);
   try {
     const data: DocumentData = await getDocument(slugToLoad);
     setContent(data.content);
     setCurrentSlug(slugToLoad);
     setLastSaved(data.updatedAt ? new Date(data.updatedAt) : new Date());
     textAreaRef.current?.focus();
   } catch (err: unknown) { 
     console.error("Erro ao carregar documento:", err);
     let displayMessage = `Documento "${slugToLoad}" não encontrado ou falha ao carregar.`;
     if (err instanceof Error) {
       displayMessage = err.message;
     }
     setError(displayMessage);
     setContent('');
     setCurrentSlug(slugToLoad);
   } finally {
     setIsLoading(false);
   }
 }, []); 

 useEffect(() => {
   if (slug) {
     loadDocument(slug);
   } else {
     setContent('');
     setCurrentSlug(null);
     setLastSaved(null);
     setError(null);
     setIsLoading(false);
     if (isAuthenticated && textAreaRef.current) {
       textAreaRef.current.focus();
     }
   }
 }, [slug, isAuthenticated, loadDocument]);

 const handleSave = useCallback(async () => {
   if (!currentSlug) {
     setError("Crie um novo documento ou abra um existente para salvar.");
     return;
   }
   if (!isAuthenticated && !currentEditToken) {
       setError("Você precisa estar logado ou possuir um token de edição para salvar.");
       return;
   }

   console.log("Saving with content:", content, "slug:", currentSlug, "editToken:", currentEditToken);
   setIsSaving(true);
   setError(null);
   try {
     await updateDocumentContent(currentSlug, content, currentEditToken);
     setLastSaved(new Date());
   } catch (err: unknown) { 
     console.error("Erro ao salvar documento:", err);
     let displayMessage = 'Falha ao salvar o documento.';
     if (err instanceof Error) {
       displayMessage = err.message;
     }
     setError(displayMessage);
   } finally {
     setIsSaving(false);
   }
 }, [currentSlug, content, isAuthenticated, currentEditToken]);

 useEffect(() => {
   const handleKeyDown = (event: KeyboardEvent) => {
     if ((event.ctrlKey || event.metaKey) && event.key === 's') {
       event.preventDefault();
       if (currentSlug) {
           handleSave();
       }
     }
   };
   window.addEventListener('keydown', handleKeyDown);
   return () => {
     window.removeEventListener('keydown', handleKeyDown);
   };
 }, [handleSave, currentSlug]);

 const handleCreateNew = async () => {
   if (!isAuthenticated) {
     setError("Você precisa estar logado para criar um novo documento.");
     navigate('/login', { state: { from: location } });
     return;
   }
   setIsLoading(true);
   setError(null);
   try {
     const response = await createNewDocument();
     navigate(`/doc/${response.slug}`);
   } catch (err: unknown) { 
     console.error("Erro ao criar novo documento:", err);
     let displayMessage = 'Falha ao criar novo documento.';
     if (err instanceof Error) {
       displayMessage = err.message;
     }
     setError(displayMessage);
     setIsLoading(false); 
   }
 };
 
 const handleGenerateEditToken = async () => {
   if (!currentSlug) {
       setError("Nenhum documento aberto para gerar token.");
       return;
   }
   if (!isAuthenticated) {
       setError("Você precisa estar logado como proprietário para gerar um token de edição.");
       return;
   }
   setError(null); 
   try {
       const response = await generateEditToken(currentSlug);
       setDisplayedEditToken(response.editToken);
   } catch (err: unknown) { 
       console.error("Erro ao gerar token de edição:", err);
       let displayMessage = 'Falha ao gerar token de edição. Verifique se você é o proprietário.';
       if (err instanceof Error) {
         displayMessage = err.message;
       }
       setError(displayMessage);
       setDisplayedEditToken(null);
   }
 };

  const placeholderText = currentSlug 
    ? (isLoading ? "Carregando..." : "Digite seu texto aqui...") 
    : "Bem-vindo ao Flashnote! Clique em 'Novo Documento' para começar, ou acesse um link existente.";

  if (isLoading && slug) { 
    return <div className={styles.loadingFullPage}>Carregando documento...</div>;
  }

  return (
    <div className={styles.editorPage}>
      <div className={styles.toolbar}>
        <div>
          <button 
            onClick={handleCreateNew} 
            className={styles.button}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? "Faça login para criar um novo documento" : "Criar um novo documento"}
          >
            Novo Documento
          </button>
          <button 
            onClick={handleSave} 
            className={styles.button}
            disabled={!currentSlug || isSaving || (!isAuthenticated && !currentEditToken)}
            title={!currentSlug ? "Abra ou crie um documento para salvar" : (!isAuthenticated && !currentEditToken ? "Faça login ou use um token de edição para salvar" : "Salvar (Ctrl+S)")}
          >
            {isSaving ? 'Salvando...' : 'Salvar (Ctrl+S)'}
          </button>
        </div>
        {currentSlug && isAuthenticated && (
             <button 
                onClick={() => setShowShareInfo(prev => !prev)} 
                className={styles.button}
                title="Opções de compartilhamento e token de edição"
             >
                Compartilhar
             </button>
        )}
      </div>

      {error && <div className={styles.errorDisplay}>Erro: {error}</div>}

      {showShareInfo && currentSlug && (
        <div className={styles.shareInfo}>
          <p>Link para visualização (qualquer pessoa pode ver):</p>
          <p><code className={styles.code}>{`${window.location.origin}/doc/${currentSlug}`}</code></p>
          <hr />
          <p>Para permitir que outros editem (precisam estar logados e usar o link com token abaixo):</p>
          <button 
             onClick={handleGenerateEditToken} 
             className={styles.button} 
             style={{ marginTop: '5px', marginBottom: '5px'}} 
         >
            {displayedEditToken ? "Regerar/Ver Token de Edição" : "Gerar Token de Edição"}
          </button>
          {displayedEditToken && (
            <>
            <p>Token de Edição: <code className={styles.code}>{displayedEditToken}</code></p>
            <p>Link para Edição (compartilhe com quem vai editar):</p>
            <p><code className={styles.code}>{`${window.location.origin}/doc/${currentSlug}?edit_token=${displayedEditToken}`}</code></p>
            </>
          )}
        </div>
      )}
      
      <textarea
        ref={textAreaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholderText}
        className={styles.textArea}
        spellCheck="false"
        disabled={isLoading || (!slug && !isAuthenticated)} 
      />
      <div className={styles.statusBar}>
        {isSaving ? 'Salvando...' : (lastSaved ? `Salvo: ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : (currentSlug ? 'Alterações não salvas' : 'Nenhum documento ativo'))}
      </div>
    </div>
  );
};

export default EditorPage;