import { $, $$, getItemLocalStorage, setItemLocalStorage } from "./utils.mjs";

const buttons = $$('.sec');
const reloadBtn = $('#reload');
const turns = $('.turn');
const redPoints = $('#red-points');
const bluePoints = $('#blue-points');
const deletePoints = $('#deletePoints');

const DEFAULT_TURNS = {
    O: {
        VALUE: "⭕",
        COLOR: "red",
        POINTS: 0
    },
    X: {
        VALUE: "✖️",
        COLOR: "blue",
        POINTS: 0
    }
};

class Triqui {
    
    constructor() {
        this.map = Array(9).fill("");
        this.POS_TURN = false;
        this.NAME_VAR_STORAGE = "TURNS_TRIQUI";
        this.TURNS = this.getPoints();
        this.reloadPoints()
        this.WINNER = false;
        this.wins = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],

            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],

            [0, 4, 8],
            [2, 4, 6]
        ];
    }

    static isWin(map, wins, value) {
        for (let win of wins) {
            if (win.every(pos => map[pos] === value)) {
                return true;
            }
        }
        return false;
    }

    static savePoints(TURNS, value) {
        TURNS[value].POINTS++;
    }

    getPoints(){

        let itemLocalStorage = getItemLocalStorage("TURNS_TRIQUI")
        
        if(!itemLocalStorage) setItemLocalStorage(this.NAME_VAR_STORAGE, DEFAULT_TURNS)
        itemLocalStorage = getItemLocalStorage("TURNS_TRIQUI")
                
        return itemLocalStorage
    }

    master(id) {

        if (this.map[id] !== "" || this.WINNER) return;

        const TURN_GAME = (!this.POS_TURN) ? this.TURNS.O : this.TURNS.X;

        this.map[id] = TURN_GAME.VALUE;
        this.reloadMap();
        this.applyColorBtn(id, TURN_GAME);
        
        
        let isWin = Triqui.isWin(this.map, this.wins, TURN_GAME.VALUE)
        let positionWin = this.wins.find(win => win.every(pos => this.map[pos] === TURN_GAME.VALUE));

        if(!isWin) this.changeTurn();
        else {
            this.savePoints(TURN_GAME);
            this.viewWin(positionWin, TURN_GAME);
        }
    }

    reloadMap() {
        buttons.forEach((btn, index) => {
            btn.innerText = this.map[index];
        });
    }

    reloadPoints() {
        redPoints.innerText = this.TURNS.O.POINTS;
        bluePoints.innerText = this.TURNS.X.POINTS;
    }

    reinitializePoints() {
        localStorage.removeItem(this.NAME_VAR_STORAGE);
        this.TURNS = JSON.parse(JSON.stringify(DEFAULT_TURNS));
        this.reloadPoints();
    }

    applyColorBtn(btn, TURN_GAME) {
        buttons[btn].classList.add(`pic-${TURN_GAME.COLOR}`);
    }

    savePoints = (TURN_GAME) => {
        TURN_GAME.POINTS = TURN_GAME.POINTS + 1
        this.reloadPoints()
        setItemLocalStorage(this.NAME_VAR_STORAGE, this.TURNS)
    }

    changeTurn() {
        let TURN = this.POS_TURN
        turns.classList.toggle('turn-red', TURN);
        turns.classList.toggle('turn-blue', !TURN);
        reloadBtn.classList.toggle('pic-blue', !TURN);
        reloadBtn.classList.toggle('pic-red', TURN);
        deletePoints.classList.toggle('btn-blue', !TURN)
        deletePoints.classList.toggle('btn-red', TURN)
        this.POS_TURN = !this.POS_TURN;
    }

    viewWin(positionWin, TURN_GAME) {
        this.WINNER = true;
        for (let btn of buttons) {
            btn.setAttribute('style', `opacity: 0; pointer-events: none;`);
        }
        positionWin.forEach(pos => {
            buttons[pos].setAttribute('style', `background-color: var(--${TURN_GAME.COLOR});`);
        });
        reloadBtn.classList.add("center-btn");
    }

    restartMap() {
        this.map.fill("");
        buttons.forEach(btn => {
            btn.classList.remove("pic-red");
            btn.classList.remove("pic-blue");
            btn.setAttribute('style', `background-color: transparent;`)
        });
        reloadBtn.classList.remove("center-btn");
        this.WINNER = false;
        this.reloadMap();
    }
}

const game = new Triqui();

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        game.master(btn.id);
    });
});

reloadBtn.addEventListener('click', () => {
    game.restartMap();
});

deletePoints.addEventListener('click', () => {
    game.reinitializePoints();
});


