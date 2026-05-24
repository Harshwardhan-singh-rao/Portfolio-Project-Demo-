import {computer} from './computer.js'

class Macbook extends computer {
    constructor(name, company){
        super(name)
        this.company=company
    }
    logIn(){
        console.log("you are logged into a Mackbook" + this.name)
    }
}

const macbook_air = new Macbook('Air','Apple');
macbook_air .logIn()
macbook_air.run()