function removeValueSelection(elementId, idxDropdown, value) {
    const elem = document.getElementById(elementId)
    elem.value = value
    const dropdownElement = document.getElementsByClassName('dropdown-menu inner selectpicker')
    const btnDropdown = document.getElementsByClassName('btn dropdown-toggle selectpicker btn-default')
    btnDropdown[idxDropdown].setAttribute('title', value)
    btnDropdown[idxDropdown].children[0].innerText = value
    if (dropdownElement[idxDropdown]?.children.length > 0) {
        for (let i = 0; i < dropdownElement[idxDropdown].children.length; i++) {
            if (i === 0) {
                dropdownElement[idxDropdown].children[0].setAttribute('class', 'selected active')
            } else {
                dropdownElement[idxDropdown].children[i].removeAttribute('class')
            }
        }
    }
}

function updateValueSelection(elementId, idxDropdown, value) {
    const elem = document.getElementById(elementId)
    elem.value = value
    const dropdownElement = document.getElementsByClassName('dropdown-menu inner selectpicker')
    const btnDropdown = document.getElementsByClassName('btn dropdown-toggle selectpicker btn-default')
    btnDropdown[idxDropdown].setAttribute('title', value)
    btnDropdown[idxDropdown].children[0].innerText = value
    if (dropdownElement[idxDropdown]?.children.length > 0) {
        for (let i = 0; i < dropdownElement[idxDropdown].children.length; i++) {
            const filterValue = dropdownElement[idxDropdown].children[i].children[0].innerText
            if (filterValue == value) {
                dropdownElement[idxDropdown].children[i].setAttribute('class', 'selected active')
            } else {
                dropdownElement[idxDropdown].children[i].removeAttribute('class')
            }
        }
    }
}