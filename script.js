function Init() {
    const queue = []
    const display = document.getElementById('display')
    const allclear = document.getElementById('all-clear')
    const clear = document.getElementById('clear')
    const buttons = document.getElementsByClassName("number")
    const histories = document.getElementsByClassName('history-calculation')
    const submit = document.getElementById('submit')
    

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', () => {
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

    submit.addEventListener('click', () => {
        if (!IsValidInfix() || display.value.length === 0) {
            display.value = 'Invalid Expression'
            return
        }

        const input = display.value.trim()
        const postfix = ConvertPostFix(input)
        const result = EvaluatePostfix(postfix)
        display.value = result

        if(result === 'Invalid Expression') {
            return 
        }
        if (queue.length >= 6) {
            queue.shift()
        }

        queue.push(input + " = " + result)
        for(let i = 0; i < queue.length; i++) {
            histories[i].textContent = queue[i]
        }
        //9×9-(8×(8×9)-100)+(100+9(4+7+2))
    })
}

function IsValidInfix() {
    const inputTag = document.getElementById('display')
    const input = inputTag.value
    let containNum = false;
    const st = []
    for(let i = 0; i < input.length; i++) {
        const c = input.charAt(i)
        if (c != '(' && c != ')') {
            containNum = true
            continue;
        }

        if (c == '(') {
            st.push(c)
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
    const tingkat = [1,1,0,0]

    const st = []
    let postfix = ""
    let minus = false
    st.push('(')
    input += ')'
    for(let i = 0; i < input.length; i++) {
        const c = input.charAt(i)
        let idx = operators.indexOf(c)
        const isOp = idx >= 0

        if (!isOp) {
            if (c == '(') {st.push(c); continue; }
            if (c == ')') {
                while(st[st.length-1] != '(') {
                    postfix += st.pop() + ","
                }
                st.pop()
                continue
            }
            let value = c
            while(isNumeric(input.charAt(i + 1))) value += input.charAt(++i)
            
            postfix += value + ","
            continue
        }

        if ((c === "-" && i === 0)||(c === "-" && input.charAt(i-1) === "(")) {
            let value = c;
            while(isNumeric(input.charAt(i + 1))) value += input.charAt(++i)
            postfix += value + ","
            continue
        }

        if (c === "+" && i === 0 ) {
            continue
        }

        if (c === "+" && input.charAt(i-1) === "(") {
            continue
        }

        const opIndex = operators.indexOf(st[st.length-1])

        if (opIndex < 0) {
            st.push(c)
            continue
        }

        const top = tingkat[opIndex]
        const scn = tingkat[idx]

        if (top >= scn) {
            postfix += st.pop() + ","
        }

        st.push(c)
    }

    return postfix
}

function EvaluatePostfix(input) {
    input += ")"
    const operators = "×÷-+"
    const qs = input.split(",")
    console.log(qs)
    const st = []

    for(const s of qs) {
        const isOp = operators.indexOf(s) >= 0

        if (!isOp) {
            if (st.length !== 0 && st[st.length-1] === ')') continue 

            st.push(s)
            continue
        }

        const num1 = parseInt(st.pop())
        const num2 = parseInt(st.pop())

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

        st.push(hasil.toString())
    }

    st.pop()
    return st.pop()
}

function isNumeric(str) {
    if (typeof str != "string") return false 
    return !isNaN(str) && !isNaN(parseFloat(str)) 
}

Init()