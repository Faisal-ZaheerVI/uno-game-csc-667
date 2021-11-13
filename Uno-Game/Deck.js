const COLORS = [
    'red',
    'yellow',
    'blue',
    'green',
    'black'
]

const VALUES = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '+4',
    '+2',
    'Skip',
    'reverse'
]

class Card {
    constructor(color, value){
        this.color = color
        this.value = value
    }
}

export class Deck{
    constructor(cards = freshDeck()){
        this.cards = cards
    }

    get numberofCards(){
        return this.cards.length
    }

    shuffle(){
        for(let i = this.cards.length - 1; i > 0; i--){
            const newIndex = Math.floor(Math.random() * (i+1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue 
        }
    }

    pop(){
        return this.cards.shift()
    }

    push(card){
        this.cards.push(card)
    }
}