import ParseDataSelector from "@/components/ParseDataComponents/ParseDataSelector";
const ParseDataPage = () => {
  return (
    <main className="flex-1 flex flex-col items-start justify-center w-full h-full overflow-auto bg-background  pt-6 pb-6 px-4">
      <h1 className="text-2xl font-bold">Analisar Dados</h1>
      <div className="flex flex-col w-full whitespace-pre-wrap break-word">
        <p className="text-muted-foreground pb-4">
          Selecione JSONs de dados de reconhecimento e carregue os arquivos aqui para compilar em CSV
        </p>
      </div>
      <ParseDataSelector />
    </main>
  );
};

export default ParseDataPage;
