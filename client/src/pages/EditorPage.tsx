import { useParams } from 'react-router-dom';

const EditorPage = () => {
  const { slug } = useParams<{ slug: string }>(); 
  return (
    <div>
      <h1>Editor</h1>
      {slug ? <p>Editando documento: {slug}</p> : <p>Nenhum documento selecionado ou criando um novo.</p>}
      <textarea style={{ width: '100%', height: '400px', backgroundColor: 'black', color: 'white', border: '1px solid grey' }}
        defaultValue="Digite aqui..."
      />
    </div>
  );
};
export default EditorPage;