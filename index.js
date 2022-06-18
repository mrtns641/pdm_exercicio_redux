const redux = require('redux');

const criarContrato = (nome, taxa) => {
    return {
        type: "CRIAR_CONTRATO",
        payload: {
            nome, taxa
        }
    }
}

const cancelarContrato = (nome) => {
    return {
        type: "CANCELAR_CONTRATO",
        payload: {
            nome
        }
    }
}

const solicitarCashback = (nome, valor) => {
    return {
        type: "SOLICITAR_CASHBACK",
        payload: {
            nome, valor
        }
    }
}

const historicoDePedidosDeCashbackReducer = (historicoDePedidosDeCashbackAtual = [], acao) => {
    if (acao.type === "SOLICITAR_CASHBACK") {
        return [
            ...historicoDePedidosDeCashbackAtual,
            acao.payload
        ]
    }
    return historicoDePedidosDeCashbackAtual
}

const caixaReducer = (dinheiroEmCaixa = 0, acao) => {
    if (acao.type === "SOLICITAR_CASHBACK") {
        dinheiroEmCaixa -= acao.payload.valor
    }
    else if (acao.type == "CRIAR_CONTRATO") {
        dinheiroEmCaixa += acao.payload.taxa
    }
    return dinheiroEmCaixa
}

const contratosReducer = (contratos = [], acao) => {
    if (acao.type === "CRIAR_CONTRATO") {
        return [
            ...contratos,
            acao.payload
        ];
    }
    else if (acao.type === "CANCELAR_CONTRATO") {
        return contratos.filter(contrato => contrato.nome !== acao.payload.nome);
    }

    return contratos;
}

const transacao = (store) => {
    const sortearFuncoes = Math.floor(Math.random() * 3);
    const sortearNomes = Math.floor(Math.random() * 4);
    const sortearValor = Math.floor(Math.random() * 21 + 10);
    const nomes = ['Giovanna', 'Gabriel', 'Guilherme', 'Diego'];
    const funcoes = {
        0: () => store.dispatch(criarContrato(nomes[sortearNomes], 100)),
        1: () => store.dispatch(cancelarContrato(nomes[sortearNomes])),
        2: () => store.dispatch(solicitarCashback(nomes[sortearNomes], sortearValor))
    }
    funcoes[sortearFuncoes]();
}


const todosOsReducers = redux.combineReducers({
    historicoDePedidosDeCashbackReducer,
    caixaReducer,
    contratosReducer
});

const store = redux.createStore(todosOsReducers);

setInterval(() => {
    transacao(store)
    console.log(store.getState())
}, 5000);