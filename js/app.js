$(document).ready(function () {
    catalogo.eventos.init();
})

var catalogo = {};

var MEU_CARRINHO = [];

var MEU_ENDERECO = null;

var VALOR_CARRINHO = 0;

var CELULAR_BYSEUAMOR = '5582996842296';

catalogo.eventos = {

    init: () => {
       catalogo.metodos.obterItensCatalogo();
       catalogo.metodos.carregarBtnWhatsapp();
       catalogo.metodos.carregarBtnLigar();
       catalogo.metodos.carregarBtnReserva();
    }
}

catalogo.metodos = {

    // obtem a lista de itens do cardápio
    obterItensCatalogo: (categoria ='pinturas', vermais = false) => {
        
        var filtro = MENU[categoria];

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

                catalogo.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0);

                catalogo.metodos.atualizarBadgeTotal();
            }
        }

    },

    //atualiza o badge totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        } else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);
    },

    //abrir a modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            catalogo.metodos.carregarCarrinho();
        } else {
            $("#modalCarrinho").addClass('hidden');
        }

    },

    //para fechar o modal do carrinho
    iniciarEventos: () => {
    
        $("#btnFecharModalCarrinho").click(function(e) {
            e.preventDefault(); // Impede o comportamento padrão do botão
            catalogo.metodos.abrirCarrinho(false); // Fecha o modal sem recarregar a página
        });
    },

    //altera os textos e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu presente:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoPresente").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        } 
        
        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoPresente").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        } 
        
        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoPresente").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }
    },

    //botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        catalogo.metodos.carregarEtapa(etapa - 1);
    },

    //carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        catalogo.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {

                let temp = catalogo.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp); 

                //ultimo item 
                if ((i + 1) == MEU_CARRINHO.length) {
                    catalogo.metodos.carregarValores();
                }
    
            })
        } else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fas fa-gift"></i> Seu carrinho está vazio.</p>');
            catalogo.metodos.carregarValores();
        }
    },

    // diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id) => {
        
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            catalogo.metodos.atualizarCarrinho(id, qntdAtual - 1);
        } else {
            catalogo.metodos.removerItenCarrinho(id)
        }
    },

    // aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        catalogo.metodos.atualizarCarrinho(id, qntdAtual + 1);
    },

    //remover item do carrinho
    removerItenCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id});
        catalogo.metodos.carregarCarrinho();

        //atualiza o botão carrinho com a quantidade atualizada
        catalogo.metodos.atualizarBadgeTotal();
    },

    //atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza o botão carrinho com a quantidade atualizada
        catalogo.metodos.atualizarBadgeTotal();

        //atualiza os valores (R$) totais do carrinho
        catalogo.metodos.carregarValores();
    },

    //carrega os valores de subtotal, entrega e total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $("#lblSubtotal").text('R$ 0,00');
        $("#lblValorEntrega").text('A combinar');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {
            
            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if ((i + 1) == MEU_CARRINHO.length) {
                $("#lblSubtotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $("#lblValorTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
            }
        })
    },

    //carregar a etapa enderecos
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            catalogo.metodos.mensagem('Seu carrinho está vazio.')
            return;
        }

        catalogo.metodos.carregarEtapa(2);
    },

    //API ViaCep
    buscarCep: () => {

        //cria a variavel com o valor do cep
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        //verifica se o CEP possui valor informado
        if (cep != "") {

            //expressão regular para validar o CEP
            var validaCep = /^[0-9]{8}$/;

            if(validaCep.test(cep)) {

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                    
                    if (!("erro" in dados)) {

                        //atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUF").val(dados.uf);
                        $("#txtNumero").focus();

                    } else {
                        catalogo.metodos.mensagem('CEP não encontrado. Preencha as informações manualmente.');
                        $("#txtEndereco").focus();
                    }
                })

            } else {
                catalogo.metodos.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }

        } else {

            catalogo.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
        }
    },

    //validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUF").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if (cep.length <= 0) {
            catalogo.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }

        if (endereco.length <= 0) {
            catalogo.metodos.mensagem('Informe o endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            catalogo.metodos.mensagem('Informe o bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            catalogo.metodos.mensagem('Informe a cidade, por favor.');
            $("#txtCidade").focus();
            return;
        }

        if (uf == "-1") {
            catalogo.metodos.mensagem('Informe a UF, por favor.');
            $("#ddlUF").focus();
            return;
        }

        if (numero.length <= 0) {
            catalogo.metodos.mensagem('Informe o número, por favor.');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }
        
        catalogo.metodos.carregarEtapa(3);
        catalogo.metodos.carregarResumo();
    },

    //carrega a etapa de resumo do pedido
    carregarResumo: () => {

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {

            let temp = catalogo.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);

        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`);

        catalogo.metodos.finalizarPedido();
    },

    //atualiza o link do botão do WhatsApp
    finalizarPedido: () => {

        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO != null) {

            var texto = 'Olá! Gostaria de fazer um pedido:';
            texto += `\n*Itens do pedido:*\n\n\${itens}`;
            texto += '\n*Endereço de entrega:*';
            texto += `\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (entrega a combinar): R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) => {

                itens += `*${e.qntd}x* ${e.name} ...... R$ ${e.price.toFixed(2).replace('.', ',')} \n`;

                //ultimo item
                if ((i + 1) == MEU_CARRINHO.length) {
                    
                    texto = texto.replace(/\${itens}/g, itens);

                    // convertendo a URL
                    let encode = encodeURI(texto);
                    let URL = `https://wa.me/${CELULAR_BYSEUAMOR}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);
                }
            })
        }
    },

    //carrega o link do btn reserva
    carregarBtnReserva: () => {

        var texto = 'Olá! gostaria de fazer uma *reserva*.';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_BYSEUAMOR}?text=${encode}`;

        $("#btnReserva").attr('href', URL);
    },

    //carregar o btn de ligar
    carregarBtnLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_BYSEUAMOR}`);
    },

    //carregar bnt whatsapp
    carregarBtnWhatsapp: () => {
        var texto = 'Olá! Gostaria de encomendar um presente.';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_BYSEUAMOR}?text=${encode}`;

        $("#btnWpp").attr('href', URL);
        $("#btnWpp2").attr('href', URL);
    },

    //metodo para abrir o depoimento
    abrirFeedback: (feedback) => {

        $("#feedback-1").addClass('hidden');
        $("#feedback-2").addClass('hidden');
        $("#feedback-3").addClass('hidden');

        $("#btnFeedback-1").removeClass('active');
        $("#btnFeedback-2").removeClass('active');
        $("#btnFeedback-3").removeClass('active');

        $("#feedback-" + feedback).removeClass('hidden');
        $("#btnFeedback-" + feedback).addClass('active')
    },

    //mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)
    }, 
}

catalogo.templates = {

    item: `
        <div class="col-3 mb-5 animated fadeInUp delay-02s">
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
    `,

    itemCarrinho: `
        <div class="col-12 item-presente">
            <div class="img-produto">
                <img class="img" src="\${img}">
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${name}</b></p>
                <p class="price-produto"><b>R$ \${price}</b></p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="catalogo.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="catalogo.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="catalogo.metodos.removerItenCarrinho('\${id}')"><i class="fas fa-times"></i></span>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 item-presente resumo">
            <div class="img-produto-resumo">
                <img src="\${img}">
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${name}</b>
                </p>
                <p class="price-produto-resumo">
                    <b>R$ \${price}</b>
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>
    `
}