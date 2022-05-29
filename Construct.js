function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'twin')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

/*const b = new Barreira(true)
b.setAltura(300)
document.querySelector('[wm-Knucles]').appendChild(b.elemento)
*/

function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura) 
        const alturaInferior = altura - abertura - alturaSuperior 
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}


/*const b = new ParDeBarreiras(700, 400, 800)
document.querySelector('[wm-Knucles]').appendChild(b.elemento)
*/

function Barreiras(altura , largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3 
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2 
            const cruzouMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if(cruzouMeio) notificarPonto()
        })
    }
}

function Knucles(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'knucles')
    this.elemento.src = 'img/PlaneKnucles-removebg-preview.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if ( novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}

function Progresso() {
    this.elemento = novoElemento('span' ,'progress')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

/*
const barreiras = new Barreiras(800, 1100, 500, 400)
const knucles = new Knucles(700)
const areaDoJogo = document.querySelector('[wm-Knucles]')

areaDoJogo.appendChild(knucles.elemento)
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
setInterval(() => {
    barreiras.animar()
    knucles.animar()
}, 20)


const barreiras = new Barreiras(800, 1100, 500, 400)
const knucles = new Knucles(700)
const areaDoJogo = document.querySelector('[wm-Knucles]')
areaDoJogo.appendChild(knucles.elemento)
areaDoJogo.appendChild(new Progresso() .elemento)
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
setInterval (() => {
    barreiras.animar()
    knucles.animar()
}, 20)
*/

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top 
    return horizontal && vertical

}

function colidiu(knucles, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(ParDeBarreiras => {
        if (!colidiu) {
            const superior = ParDeBarreiras.superior.elemento
            const inferior = ParDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(knucles.elemento, superior)
                || estaoSobrepostos(knucles.elemento, inferior)
        }
    })
    return colidiu

}

function KnuclesPlane() {
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-Knucles]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 300, 400, 
        () => progresso.atualizarPontos(++pontos))
        const knucles = new Knucles(altura)

        areaDoJogo.appendChild(progresso.elemento)
        areaDoJogo.appendChild(knucles.elemento)
        barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

        this.start = () => {
            const temporizador = setInterval(() => {
                barreiras.animar()
                knucles.animar()

                if(colidiu(knucles, barreiras)) {
                    clearInterval(temporizador)
                }
            }, 20)
        }
}

new KnuclesPlane().start()

