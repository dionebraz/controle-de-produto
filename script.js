const selectionItems = document.querySelector('#items')
const btnToSave = document.getElementById('btnSalvar')
var listOfCollaborators = document.querySelectorAll('.collaborators > li')
let element;
const dataTable = document.querySelector('.dataTable')

// Objeto de registros no localstorage
let colaborador = { nome: null, item: null, data: Date }

// Array que armazena a lista de registros
let listaDeRegistros = []

// Função que recupera lista do localStorage
const getLocalStorage = () => {
    const getListaDeRegistros = JSON.parse(localStorage.getItem('listaDeRegistros'))
    if (getListaDeRegistros === null) {
        return []
    }

    return getListaDeRegistros
}

// Atualizar lista local de acordo com registros do localStorage
listaDeRegistros = getLocalStorage()

const selecionarColaborador = (nome) => {
    colaborador.nome = nome
}

// Função que salvar as propriedades do item selecionado
function salvarDados() {
    colaborador.data = new Date().toLocaleDateString()
    listaDeRegistros.push(colaborador)
    console.log(listaDeRegistros)
    localStorage.setItem('listaDeRegistros', JSON.stringify(listaDeRegistros))
    listaDeRegistros = getLocalStorage('listaDeRegistros')
    colaborador = { nome: null, item: null, data: null };

    printList()

    var mp3 = document.getElementById('play-sound').play()
    mp3.volume = 0.1
}

listOfCollaborators.forEach((item) => {
    item.addEventListener('click', ativarElemento)
})

function ativarElemento(el) {
    listOfCollaborators.forEach((item) => {
        item.style.background = 'none';
        item.style.color = '#000'
    });

    element = el
    selecionarColaborador(element.target.innerHTML)
    element.target.style.background = '#006EB8'
    element.target.style.color = '#fff'
}

btnToSave.addEventListener('click', (event) => {
    if (colaborador.nome != null) {
        const itemSelect = selectionItems.value
        colaborador.item = itemSelect

        clearActive()
        salvarDados()
    } else {
        alert('Selecione antes um colaborador!')
    }
})

function clearActive() {
    listOfCollaborators.forEach((item) => {
        item.style.background = "none";
        item.style.color = "initial";
    });
}

function mostrarHistorico() {
    const Nome = document.querySelector('#name')
    const Item = document.querySelector('#item')
    const Data = document.querySelector('#data')

    Nome.innerHTML = localStorage.colaborador
    Item.innerHTML = localStorage.item
    Data.innerHTML = localStorage.dataAtual

    criarPedidos(Nome, Item, Data)
}

function criarPedidos(Colaborador, Item, Data) {
    return {
        colaborador: Colaborador,
        item: Item,
        data: Data
    }
}

// const adicionarItem = (item) => {
//     colaborador.item = item
// }

function printList() {
    dataTable.innerHTML = ''

    listaDeRegistros.forEach((item, index) => {
        dataTable.innerHTML += `
        <tr id="${index}">
            <td>${item.nome}</td>
            <td>${item.item}</td>
            <td>${item.data}</td>
            <td style="background: rgb(196, 57, 57)"><button type="button" id="btnExcluir" onclick="clearAllRegisters(${index})">EXCLUIR</button></td>
        </tr>
        `
    })
}

printList()

function clearAllRegisters(id) {
    listaDeRegistros = listaDeRegistros.filter((item, index) => index != id)
    console.log(listaDeRegistros)
    localStorage.setItem('listaDeRegistros', JSON.stringify(listaDeRegistros))
    listaDeRegistros = getLocalStorage('listaDeRegistros')

    printList()
}

function cleanTable() {
    listaDeRegistros = []
    localStorage.setItem('listaDeRegistros', JSON.stringify(listaDeRegistros))
    listaDeRegistros = getLocalStorage('listaDeRegistros')

    printList()
}