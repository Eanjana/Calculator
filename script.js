const topOperand = document.querySelector(".top-operand");
const currentOperand = document.querySelector(".current-operand");

const numberButtons = document.querySelectorAll(".number-btn")


const sin = document.querySelector('.sin-btn');
const cos = document.querySelector('.cos-btn');
const tan = document.querySelector('.tan-btn');
const log = document.querySelector('.log-btn');
const sqrt = document.querySelector('.sqrt-btn');

const allClear = document.querySelector(".ac-btn");
const backSpace = document.getElementById("backspace-btn");


//display

let current = "";  
let previous = "";
let operation = null;

function appendNumber(number){

    if (number === '.' && current.includes('.')) return;
    if(current.length >= 20) return;
    current = current + number;
    currentOperand.textContent = current;
}


//number buttons

numberButtons.forEach( btn => {
    btn.addEventListener('click', () => appendNumber(btn.textContent));
});


//operators

function setOperation(op){

    if(current == "") return;

    previous = current;
    operation = op;
    current = "";

    topOperand.textContent = previous +" "+ op ;
    currentOperand.textContent = "";
}

function calculate(){

    let a = parseFloat(previous);
    let b = parseFloat(current);
    let result;

    switch(operation){
        case '+' : result = a + b; break;
        case '-' : result = a - b; break;
        case '*' : result = a * b; break;
        case '/' : result = a / b; break;
        case '%' : result = a % b; break;
        default  : return;
    }

    topOperand.textContent = previous + " " + operation + " " + current;
    currentOperand.textContent = result;

    current = result.toString();
}


// AC button

allClear.onclick = () => {
    current = "";
    previous = "";
    topOperand.textContent = "";
    currentOperand.textContent = "";
};

//backspace button

backSpace.onclick = () => {
    current = current.slice(0,-1);
    currentOperand.textContent = current;
};


//Scientific operations

function scientific(type){
    let value = parseFloat(currentOperand.textContent);
    if(isNaN(value)) return;

    switch(type){
        case 'sin'  : value = Math.sin(value); break;
        case 'cos'  : value = Math.cos(value); break;
        case 'tan'  : value = Math.tan(value); break;
        case 'sqrt' : value = Math.sqrt(value); break;
        case 'log'  : value = Math.log(value); break;
    }

    
    topOperand.textContent = type + "( " + current + " )";
    current = value.toString();
    currentOperand.textContent = current;
}

sin.onclick  = () => scientific('sin');
cos.onclick  = () => scientific('cos');
tan.onclick  = () => scientific('tan');
sqrt.onclick = () => scientific('sqrt');
log.onclick  = () => scientific('log');


//bracket

document.querySelectorAll(".bracket").forEach(btn => {
    btn.onclick = () => {
        current = current + btn.textContent;
        currentOperand.textContent = current;
    }
});


//dark mode

const calcWrap = document.querySelector(".calculator-wrap");
const btnPrime = document.querySelectorAll(".btn-primary");

const theme = document.getElementById("themeToggle");

theme.addEventListener('click', () => {
    calcWrap.classList.toggle("dark");

    btnPrime.forEach(btn => {
        btn.classList.toggle("dark");
    });
});

