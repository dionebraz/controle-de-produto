const selectionItems = document.querySelector('#items')
const btnToSave = document.getElementById('btnSalvar')
var listOfCollaborators = document.querySelectorAll('.ul > li')
let element;
const dataTable = document.querySelector('.dataTable')
const inputCollaborator = document.querySelector('#input-collaborator')
const searchButton = document.querySelector('#search-button')
const dialogModal = document.querySelector('dialog')
const dialogButtonClose = document.querySelector('dialog button')
const inputSearchCollaborator = document.querySelector('#buscar')

inputSearchCollaborator.onkeyup = (event) => {
    filterListCollaborators(event.target)
    printList()
}

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
    localStorage.setItem('listaDeRegistros', JSON.stringify(listaDeRegistros))
    listaDeRegistros = getLocalStorage('listaDeRegistros')
    colaborador = { nome: null, item: null, data: null };
    document.getElementById('save-sound').play()
    document.getElementById('save-sound').volume = 0.5

    printList()
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
        return
    }
})

function clearActive() {
    listOfCollaborators.forEach((item) => {
        item.style.background = "none";
        item.style.color = "initial";
    });
}

function criarPedidos(Colaborador, Item, Data) {
    return {
        colaborador: Colaborador,
        item: Item,
        data: Data
    }
}

function printList() {
    dataTable.innerHTML = ''

    const listFilter = filterListCollaborators(inputSearchCollaborator)

    listFilter.forEach((item, index) => {
        dataTable.innerHTML += `
        <tr id="${index}">
            <td>${item.nome}</td>
            <td>${item.item}</td>
            <td>${item.data}</td>
            <td style="background: rgb(196, 57, 57)" class="no-print"><button type="button" id="btnExcluir" onclick="clearAllRegisters(${index})">EXCLUIR</button></td>
        </tr>
        `
    })
}

printList()

function filterListCollaborators(ev) {
    const elValue = ev.value

    if (elValue.length > 2) {
        return listaDeRegistros.filter((item) => item.nome.toUpperCase().includes(elValue.toUpperCase()))
    } else {
        return listaDeRegistros
    }
}

function clearAllRegisters(id) {
    listaDeRegistros = listaDeRegistros.filter((item, index) => index != id)
    localStorage.setItem('listaDeRegistros', JSON.stringify(listaDeRegistros))
    listaDeRegistros = getLocalStorage('listaDeRegistros')
    document.querySelector('#sound-trash').play()

    printList()
}

function cleanTable() {
    listaDeRegistros = []
    localStorage.setItem('listaDeRegistros', JSON.stringify(listaDeRegistros))
    listaDeRegistros = getLocalStorage('listaDeRegistros')
    document.querySelector('#clear-table-sound').play()
    document.querySelector('#clear-table-sound').volume = 0.5

    printList()
}

// FUNÇÃO IMPRIMIR TABELA
function printTable() {
    window.print()
}

// FUNÇÃO FILTER | BUSCAR DETERMINADO COLABORADOR E INFORMAÇÕES DO MESMO

searchButton.addEventListener('click', buscarColaborador)

function buscarColaborador() {
    const minhaFrase = inputCollaborator.value;
    const fraseFinal = minhaFrase.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());

    const searchContributorName = JSON.parse(localStorage.getItem("listaDeRegistros"))
    const returnedContributorName = searchContributorName.filter((item) => {
        return item.nome == fraseFinal
        console.log(item.nome == fraseFinal)
    })

    document.querySelector('.dialog-title').innerText = minhaFrase.toUpperCase()
    mostrarLista(returnedContributorName)
}

function mostrarLista(item) {
    const ul = document.querySelector('.lista')

    item.forEach((element, index) => {
        const li = document.createElement('li')
        li.innerHTML = `Item: <strong>${item[index].item}</strong> | Data: <strong>${item[index].data}</strong>`
        ul.appendChild(li)

    })

    dialogModal.showModal()
    dialogButtonClose.onclick = () => {
        dialogModal.close()
        ul.innerHTML = ""
    }
}