let memberJoinHandler = async (id)=>{
    console.log('new member joined',id)
    addToMemberList(id)
    let members = await channel.getMembers()
    updateTotalMembers(members)

    //joining message by chatbot
    let {name} = await rtmClient.getUserAttributesByKeys(id,['name'])
    addBotMessageToDom(`${name} has entered the room.`)
}

let addToMemberList = async  (memberId)=>{
    let {name} = await rtmClient.getUserAttributesByKeys(memberId,['name'])
    let membersWrapper = document.getElementById('member__list')
    let memberListItem = `<div class="member__wrapper" id="member__${memberId}__wrapper">
                          <span class="green__icon"></span>
                          <p class="member_name">${name}</p>
                          </div>`
    membersWrapper.insertAdjacentHTML('beforeend',memberListItem)
}
//handles for when a member leaves from chat
let updateTotalMembers = async (members)=>{
    let numberOfMembers = document.getElementById('members__count')
    numberOfMembers.innerText = members.length
}
let memberLeftHandler = async (memberId)=>{

    removeMemberFromList(memberId)
    let members = await channel.getMembers()
    updateTotalMembers(members)
}
let removeMemberFromList = async (memberId)=>{
    let memberWrapper = document.getElementById(`member__${memberId}__wrapper`)

    //joining message by chatbot
    let name = memberWrapper.getElementsByClassName('member_name')[0].textContent
    addBotMessageToDom(`${name} has left the room.`)

    memberWrapper.remove()

}
let getMembers = async ()=>{
    let members = await channel.getMembers()
    updateTotalMembers(members)
    for(let i=0 ; i<members.length ; i++){
        addToMemberList(members[i])
    }
}
let handleChannelMessage = async (messageData,memberId)=>{
    console.log('New Message recieved')
    let data = JSON.parse(messageData.text)
    
    if(data.type==='chat'){
        addMessageToDom(data.displayName,data.message)
    }

}
let sendMessage = async (e)=>{

    e.preventDefault()

    let message = e.target.message.value
    channel.sendMessage({text:JSON.stringify({'type':'chat', 'message':message, 'displayName':displayName})})
    addMessageToDom(displayName,message)

    e.target.reset()
}
let addMessageToDom = async (name,message)=>{
    let messageWrapper = document.getElementById('messages')
    let newChannelMessage = `<div class="message__wrapper">
                             <div class="message__body">
                             <strong class="message__author">${name}</strong>
                             <p class="message__text">${message}</p>
                             </div>
                             </div>`
   messageWrapper.insertAdjacentHTML('beforeend',newChannelMessage)
   //always showing the bottom of message list
   let lastMessage = document.querySelector('#messages .message__wrapper:last-child')
   if(lastMessage){
    lastMessage.scrollIntoView()
   }
}

let addBotMessageToDom = async (message)=>{

    let messageWrapper = document.getElementById('messages')
    let newBotMessage = `<div class="message__wrapper">
                             <div class="message__body__bot">
                             <strong class="message__author__bot">🤖 Chat-Bot</strong>
                             <p class="message__text__bot">${message}</p>
                             </div>
                             </div>`
   messageWrapper.insertAdjacentHTML('beforeend',newBotMessage)


   //always showing the bottom of message list
   let lastMessage = document.querySelector('#messages .message__wrapper:last-child')

   if(lastMessage){
    lastMessage.scrollIntoView()
   }
}
//this triggers memberRemoveHandler
let leaveChannel = async ()=>{
    //leaving without closing session eg. switch off pc
    await channel.leave()
    //leaving by logging out
    await rtmClient.logout()
}
let messageForm = document.getElementById('message__form')
messageForm.addEventListener('submit',sendMessage)
window.addEventListener('beforeunload',leaveChannel)

