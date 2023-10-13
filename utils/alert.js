const wrapAlert = document.getElementById('wrapAlert')

function createAlert(errMsg){
    let div = document.createElement('div')
    div.setAttribute('class', 'alert alert-danger alert-dismissible fade in')
    let button = document.createElement('button')
    button.setAttribute('id', 'closeAlert')
    button.setAttribute('type', 'button')
    button.setAttribute('class', 'close')
    button.setAttribute('data-dismiss', 'alert')
    button.setAttribute('aria-label', 'Close')
    let span = document.createElement('span')
    span.setAttribute('aria-hidden', 'true')
    span.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    let p = document.createElement('p')
    p.setAttribute('class', 'msg-alert')
    p.innerText = errMsg
    
    // gabungkan element
    button.append(span)
    div.appendChild(button)
    div.appendChild(p)
    if(wrapAlert.children.length === 0){
        removeAlert()
        wrapAlert.appendChild(div)
        setTimeout(() => {
            const btnCloseAlert = document.getElementById('closeAlert')
            if(btnCloseAlert){
                btnCloseAlert.click()
            }
        }, 5000);
    }
}

function removeAlert(){
    while(wrapAlert.hasChildNodes()){
        wrapAlert.removeChild(wrapAlert.firstChild)
    }
}