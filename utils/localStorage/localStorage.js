const nmStorageFungsional = 'result-data-fs'
const nmStorageTenaga = 'result-data-tenaga'

const defaultValueStgSubmit = 'success'
const SET_ITEM = 'SET_ITEM'
const REMOVE_ITEM = 'REMOVE'

function setLocalStorageForSubmit(actionType, nameStorage, storageValue){
    if(actionType === SET_ITEM){
        localStorage.setItem(nameStorage, storageValue)
    }else if(actionType === REMOVE_ITEM){
        localStorage.removeItem(nameStorage)
    }
}