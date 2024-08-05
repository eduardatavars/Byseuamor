$(document).ready(function () {
    catalogo.eventos.init();
})

var catalogo = {};

catalogo.eventos = {

    init: () => {
       catalogo.metodos.obterItensCatalogo();
    }
}

catalogo.metodos = {

    // obtem a lista de itens do cardápio
    obterItensCatalogo: (categoria ='pinturas') => {
        
        var filtro = MENU [categoria];
        console.log(filtro);

        $("#itemsCatalogo").html('');

        $.each(filtro, (i, e) => {

            let temp = catalogo.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','));
            $("#itemsCatalogo").append(temp) //adicionando o template

        })

        // remove o ativo
        $(".container-menu a").removeClass('active');

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active');
    },
}

catalogo.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item">
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
                    <span class="btn-menos"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens">0</span>
                    <span class="btn-mais"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fas fa-shopping-basket"></i></span>
                </div>
            </div>
        </div>
    `
}