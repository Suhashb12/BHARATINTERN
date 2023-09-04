let form = document.getElementById('lobby__form')

let displayName = sessionStorage.getItem('display_name')
if(displayName){
    form.name.value = displayName
}
//room creation or enter from invitecode
form.addEventListener('submit', (e)=>{
    e.preventDefault()
    
    sessionStorage.setItem('display_name',e.target.name.value)

    let roomInviteCode = e.target.room.value
    if(!roomInviteCode){
        roomInviteCode = String(Math.floor(Math.random()*10000))
    }
    let roomPass = e.target.roompass.value
    if(!roomPass){
        roomPass = String(Math.floor(Math.random()*1000000))
    }
    //redirect to room page 
    window.location = `index.html?room=${roomInviteCode}?roompass=${roomPass}`
})