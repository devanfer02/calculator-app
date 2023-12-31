    function Init() {
    const queue = []
    const display = document.getElementById('display')
    const allclear = document.getElementById('all-clear')
    const clear = document.getElementById('clear')
    const buttons = document.getElementsByClassName("number")
    const histories = document.getElementsByClassName('history-calculation')
    const submit = document.getElementById('submit')
    const allowed = '0123456789x/-+.×÷()'
    
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', () => {
            if (display.value === 'Invalid Expression') {
                display.value = ''
            }
            if (buttons[i].textContent === '0' && display.value.length != 0 && display.value.charAt(0) === '0') {
                return
            }
            if(display.value.charAt(0) === '0') {
                display.value = ''
            }
            display.value += buttons[i].textContent
        })
    }

    clear.addEventListener('click', () => {
        if (display.value.length === 0) {
            return 
        }

        display.value = display.value.substring(0, display.value.length-1)
    })

    allclear.addEventListener('click', () => {
        display.value = ''
    })

    display.addEventListener('input', (event) => {
        let val = event.target.value 
        if(val.includes('Invalid Expression')) {
            val = val.charAt(val.length-1)
        }

        if (val.charAt(0) === '0' && val.length >= 2) {
            val = val.charAt(1)
        }
        
        let sanitized = ''

        for (let i = 0; i < val.length; i++) {
            let char = val.charAt(i);
            if (allowed.includes(char)) {
                if (char === 'x') char = '×'
                if (char === '/') char = '÷'
                
                sanitized += char;
            }
        }
        display.value = sanitized
    })

    display.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            SubmitExpression(queue, display, histories)
        }
    })

    submit.addEventListener('click', () => {
        SubmitExpression(queue, display, histories)
    })
}

function SubmitExpression(queue, display, histories) {
    if (!IsValidInfix() || display.value.length === 0) {
        display.value = 'Invalid Expression'
        return
    }

    if (display.value.includes("n")) {
        return 
    }

    const input = display.value.trim()
    const postfix = ConvertPostFix(input)
    const result = EvaluatePostfix(postfix)
    display.value = result

    if(result.includes('Invalid Expression')) {
        return 
    }   
    if (queue.length >= 5) {
        queue.shift()
    }

    queue.push(input + " = " + result)
    for(let i = 0; i < queue.length; i++) {
        histories[i].textContent = queue[queue.length-i-1]
    }
}

function IsValidInfix() {
    const inputTag = document.getElementById('display')
    const input = inputTag.value
    let containNum = false;
    const st = []
    for(let i = 0; i < input.length; i++) {
        const c = input.charAt(i)
        if (c !== '(' && c !== ')' && c !== '.') {
            containNum = true
            continue;
        }
        if (c === '(') {
            st.push(c)
            continue 
        }

        if (c === '.') {
            continue
        }

        if (st.length === 0) {
            return false;
        }

        st.pop()
    }
    
    return st.length === 0 && containNum
}

function ConvertPostFix(input) {
    const operators = "×÷-+"

    const st = []
    let postfix = ""
    st.push('(')
    input += ')'
    for(let i = 0; i < input.length; i++) {
        const c = input.charAt(i)
        let idx = operators.indexOf(c)
        const isOp = idx >= 0

        if (!isOp) {
            if (c == '(') { 
                if (i != 0 && isNumeric(input.charAt(i-1))) {
                    postfix = ConvertOp(st, postfix, "×")  
                }

                st.push(c); continue; 
            }
            if (c == ')') {
                while(st[st.length-1] != '(') {
                    postfix += st.pop() + ","
                }
                st.pop()
                continue
            }
            let value = c
            while(isNumeric(input.charAt(i + 1)) || input.charAt(i + 1) === '.') value += input.charAt(++i)
            
            postfix += value + ","
            continue
        }

        if ((c === "-" && i === 0)||(c === "-" && input.charAt(i-1) === "(")) {
            let value = c;
            while(isNumeric(input.charAt(i + 1)) || input.charAt(i + 1) === '.') value += input.charAt(++i)
            postfix += value + ","
            continue
        }

        if (c === "+" && i === 0 ) {
            continue
        }

        if (c === "+" && input.charAt(i-1) === "(") {
            continue
        }

        postfix = ConvertOp(st, postfix, c)
    }
    return postfix
}

function EvaluatePostfix(input) {
    input += ")"
    const operators = "×÷-+"
    const qs = input.split(",")
    const st = []

    for(const s of qs) {
        const isOp = operators.indexOf(s) >= 0

        if (!isOp) {
            if (st.length !== 0 && st[st.length-1] === ')') continue 

            st.push(s)
            continue
        }

        const num1 = parseFloat(st.pop())
        const num2 = parseFloat(st.pop())

        if (isNaN(num1) || isNaN(num2)) {
            return 'Invalid Expression'
        }

        let hasil = 0
        switch (s) {
            case "×" :
                hasil = num2 * num1 
                break
            case "÷" :
                hasil = num2 / num1
                break 
            case "-" :
                hasil = num2 - num1
                break 
            case "+" :
                hasil = num2 + num1 
                break  
        }

        st.push(parseFloat(hasil.toFixed(8)).toString())
    }

    st.pop()
    return st.pop()
}

function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) && !isNaN(parseFloat(str)) 
}

function ConvertOp(st, postfix, op) {  
    const operators = "×÷-+"
    const tingkat = [1,1,0,0]

    const opIndex = operators.indexOf(st[st.length-1])

    if (opIndex >= 0) {
        const top = tingkat[opIndex]

        if (top >= 1) {
            postfix += st.pop() + ","       
        }
    } 
    st.push(op)

    return postfix
}

Init()