let favoritos = JSON.parse(localStorage.getItem('Favoritos')) || [];

async function pegarTitulo() {
  const response = await fetch('https://jsonplaceholder.typicode.com/albums/1/photos');
  const posts = await response.json();

  const postsExibidos = posts.slice(0, 20); 
  criarCard(postsExibidos);
}

function criarCard(postsExibidos) {
  const sectionSugestoes = document.getElementById('sugestoes');
  sectionSugestoes.innerHTML = "";

  postsExibidos.forEach(post => {
    const card = document.createElement('div');
    card.classList.add('card-destino');

    const botao = document.createElement('button');
    botao.classList.add('btn-favorito');

    if(estaFavorito(post.id)){
      botao.classList.add('ativo');
    }

    botao.innerHTML = '<i class="fa-solid fa-heart"></i>';

    botao.addEventListener('click', () => favoritar(post, botao));

    card.innerHTML = `
      <img src="https://picsum.photos/seed/${post.id}/80" alt="${post.title}">
      <p class="title">${post.title}</p>
    `;

    card.prepend(botao);
    sectionSugestoes.appendChild(card);
  });
}

function favoritar(post,botao) {
  const index = favoritos.findIndex(fav => fav.id === post.id);

  if (index === -1) {
    favoritos.push({
      id: post.id,
      title: post.title,
      image: `https://picsum.photos/seed/${post.id}/80`
    });

    botao.classList.add('ativo');
  }else{
    favoritos.splice(index, 1);
    botao.classList.remove('ativo');
  }

    localStorage.setItem('Favoritos', JSON.stringify(favoritos));
    renderizarFavoritos();
  }

  function renderizarFavoritos(){
    const ul = document.getElementById('lista-favoritos');
    ul.innerHTML = "";

    favoritos.forEach(fav => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${fav.image}">
        <span>${fav.title}</span>
      `;

      ul.appendChild(li)
    })
  }
  
  function estaFavorito(id){
    return favoritos.some(fav => fav.id === id);
  }


pegarTitulo();
renderizarFavoritos();


const btnLocalizacao = document.getElementById('btnLocalizacao');
const localizacao = document.getElementById('localizacao');

btnLocalizacao.addEventListener('click', ()=>{

  if(!navigator.geolocation){
    localizacao.innerText = "Localização bloqueada pelo navegador.";
    return;
  }

  navigator.geolocation.getCurrentPosition((posicao)=>{
    const lat = posicao.coords.latitude;
    const lon = posicao.coords.longitude;

    localizacao.innerText = `Ponto de partida: Latitude: ${lat} | Longitude: ${lon}`;
    })
})