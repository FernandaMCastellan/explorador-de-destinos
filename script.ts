type Favorito = {
    id: number;
    title: string;
    image: string;
};

type Post = {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
   };

let favoritos:Favorito[] = JSON.parse(localStorage.getItem('Favoritos') ?? '[]'); 

async function pegarTitulo():Promise<void> {
   const response:Response = await fetch('https://jsonplaceholder.typicode.com/albums/1/photos');

   const posts: Post[] = await response.json();

   const postsExibidos: Post[] = posts.slice(0, 20);

   criarCard(postsExibidos);
}

function criarCard(postsExibidos: Post[] ):void{
    const sectionSugestoes: HTMLElement | null = 
    document.getElementById('sugestoes');

    if(!sectionSugestoes){
        return;
    }

    sectionSugestoes.innerHTML = "";

    postsExibidos.forEach((post: Post) =>{
      
        const card:HTMLDivElement = document.createElement('div');

        card.classList.add('card-destino');

        const botao:HTMLButtonElement = document.createElement('button');

        botao.classList.add('btn-favorito');

        if(estaFavorito(post.id)){

            botao.classList.add('ativo');
            
        }

        botao.innerHTML = `
            <i class = "fa-solid fa-heart"></i>
        `

        botao.addEventListener('click', ()=> favoritar(post, botao));

        card.innerHTML = `
        <img src="https://picsum.photos/seed/${post.id}/80" alt="${post.title}">
        <p class="title">${post.title}</p>
        `;

        card.prepend(botao);
        sectionSugestoes.appendChild(card);


    }  );

    function estaFavorito(id: number): boolean {
        return favoritos.some((fav:Favorito) => fav.id === id);
    }

    function favoritar(post: Post, botao: HTMLButtonElement): void {
        const index:number = favoritos.findIndex((fav:Favorito) => fav.id === post.id);

        if(index === -1) {
            favoritos.push({
                id: post.id,
                title: post.title,
                image: `https://picsum.photos/seed/${post.id}/80`
            })

            botao.classList.add('ativo')
        }else{
            favoritos.splice(index, 1)
            botao.classList.remove('ativo');
        }

        localStorage.setItem('Favoritos', JSON.stringify(favoritos));
        renderizarFavoritos();        

    }

    function renderizarFavoritos():void{
        const ul = document.getElementById('lista-favoritos') as HTMLUListElement | null

        if(!ul){
            return
        }

        ul.innerHTML = "";

        favoritos.forEach((fav:Favorito) => {
            const li = document.createElement('li') as HTMLLIElement | null

            if (!li){
                return
            }

            li.innerHTML = `
                <img src="${fav.image}">
                <span>${fav.title}</span>
            `
            ul.appendChild(li)

        })
    };

}

function inicializarLocalizacao(): void {

const btnLocalizacao = document.getElementById('btnLocalizacao') as HTMLButtonElement | null

const localizacao = document.getElementById('localizacao') as HTMLElement | null

if(!btnLocalizacao){
    return;
}

if (!localizacao){
    return
}



btnLocalizacao.addEventListener('click',()=> {

    if(!navigator.geolocation){
        localizacao.innerHTML = "Localização indisponível."
        return
    }

    navigator.geolocation.getCurrentPosition((posicao:GeolocationPosition)=>{
        const lat = posicao.coords.latitude
        const lon = posicao.coords.longitude

        localizacao.innerText = `Ponto de partida: Latitude: ${lat} | Longitude: ${lon}`;
    })

})}

inicializarLocalizacao();