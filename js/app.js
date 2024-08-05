$(document).ready(function () {
    catalogo.eventos.init();
})

var catalogo = {};

var MEU_CARRINHO = [];

catalogo.eventos = {

    init: () => {
       catalogo.metodos.obterItensCatalogo();
    }
}

catalogo.metodos = {

    // obtem a lista de itens do cardápio
    obterItensCatalogo: (categoria ='pinturas', vermais = false) => {
        
        var filtro = MENU[categoria];
        console.log(filtro);

        if (!vermais) {
            $("#itemsCatalogo").html('');
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i, e) => {

            let temp = catalogo.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)


            //botao ver mais foi clicado (5 itens)
            if (vermais && i >= 4 && i < 5) {
                $("#itemsCatalogo").append(temp) //adicionando o template
            }

            //paginação inicial (8 itens)
            if (!vermais && i < 4) {
                $("#itemsCatalogo").append(temp)
            }
        })

        // remove o ativo
        $(".container-menu a").removeClass('active');

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active');
    },

    //clique no botão de ver mais
    verMais: () => {

        var ativo = $('.container-menu a.active').attr('id').split('menu-')[1]; //menu-x
        catalogo.metodos.obterItensCatalogo(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },

    //diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1);
        }
    },

    //aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1);
    },


    //adicionar ao carrinho o item do catalogo
    adicionarCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            //obter a categoria ativa
            var categoria = $('.container-menu a.active').attr('id').split('menu-')[1]; 

            //obter a lista de itens
            let filtro = MENU[categoria];

            // obter o item
            let item = $.grep(filtro, (e, i) => { return e.id == id});

            if (item.length > 0) {

                //validar se já existe o item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id});

                // caso exista o item no carrinho, só alterar a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                } else { // caso ainda não exista o item no carrinho, adicionar ele
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]) //aumentar a quantidade do carrinho sem duplicar o presente
                }

                $("#qntd-" + id).text(0);
            }
        }

    }
}

catalogo.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" width="50rem" height="220rem" alt="Placa de madeira pintada">
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${name}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${price}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="catalogo.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="catalogo.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="catalogo.metodos.adicionarCarrinho('\${id}')"><i class="fas fa-shopping-basket"></i></span>
                </div>
            </div>
        </div>
    `
}