//Original code was made by de google app scripts(gs)


function doGet() {
  //função irá ser puxada toda vez que alguém entrar pelo seu link
  return HtmlService.createHtmlOutputFromFile('Index')//aqui está dizendo que irá procurar o arquivo index.html para rederizar
    .setTitle('Momentos Espontâneos')//setar titulo
    .addMetaTag('viewport', 'width=device-width, initial-scale=1') //linha essencial para  reajustar para mobile
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    //O Google, por padrão, bloqueia que os Web Apps criados no Apps Script sejam colocados dentro de iframes para proteger você e seus usuários. Porém,
    //iframes são usados por hackers para esconder partes do código que permitiria o hacker acessar algo que o usuário provavelmente não concordaria
    //funciona basicamente como um botão escondido
}



// Função para salvar a imagem enviada pelo celular
function salvarFoto(dataUrl) {
  try {
    // 1. Defina onde as fotos serão salvas
    var pastaId = "pasta_id"; 
    var pasta = DriveApp.getFolderById(pastaId);//Aqui o script usa o serviço DriveApp para localizar e abrir a pasta onde as fotos serão guardadas.
    
    // 2. Transforma os dados da câmera (Base64) em um arquivo de imagem real
    var bytes = Utilities.base64Decode(dataUrl.split(",")[1]);//lê o grande texto que vem do dataUrl,transforma em lista e pega o segundo elemento
    //ele faz isso pois o a estrutura do array é [rotulo,conteudo],sendo necessário pegarmos apenas o conteudo

    var imagemBlob = Utilities.newBlob(bytes, "image/jpeg", "foto_" + new Date().getTime() + ".jpg");
    
    //cria um arquivo para guardar no google drive
    var arquivo = pasta.createFile(imagemBlob);
    
    //Registra a data e o link da foto na sua Planilha Google
    var planilha = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    planilha.appendRow([new Date(), arquivo.getUrl()]);
    
    return "Sucesso! Sua foto espontânea foi salva.";
  } catch (e) {
    return "Erro no servidor: " + e.toString();
  }
}