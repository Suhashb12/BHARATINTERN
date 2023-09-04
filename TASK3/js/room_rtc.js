const APP_ID =""
let uid=sessionStorage.getItem('uid')
if(!uid){
    //creating a uid if not present currectly to identify users
    uid=String(Math.floor(Math.random()*100000))  
    sessionStorage.setItem('uid',uid)
}
let token = null;
let client;
//1f4103807ad54196809758a31bbbf6ea
///messagin feature using rtm sdk
let rtmClient;
let channel;

//obtaining room id from URL to create custom room
const queryString = window.location.search
const urlparams=new URLSearchParams(queryString)
let roomId = urlparams.get('room')
//if no room id set it to main value 
if(!roomId){
    roomId='main'
}
///redirecting to lobby if no displayname
let displayName = sessionStorage.getItem('display_name')
if(!displayName){
    window.location = 'lobby.html'
}
// storing audio and video streams of users loccal track is current users stream and remote is all other users
let LocalTracks = []
//object containing value corresponding to key of different users
let remoteUsers = {}

//screen sharing implementation
let screenShareEnabled = false;
let localScreenShareTracks;

let joinRoomInit = async ()=>{
    
    rtmClient = await AgoraRTM.createInstance(APP_ID)
    await rtmClient.login({uid,token})
    await rtmClient.addOrUpdateLocalUserAttributes({'name': displayName})
    channel = await rtmClient.createChannel(roomId)
    await channel.join()
    channel.on('MemberJoined',memberJoinHandler)
    channel.on('MemberLeft',memberLeftHandler)
    channel.on('ChannelMessage',handleChannelMessage)
    
    getMembers()
    addBotMessageToDom(`Welcome to the room, ${displayName} !`)

    //below code joins user to a room
    client = AgoraRTC.createClient({mode:'rtc',codec:'vp8'})
    await client.join(APP_ID,roomId,token,uid)

    //call handlers for events
    client.on('user-published',userPublishHandler)
    client.on('user-left',userLeaveHandler)
    joinStream()
}
//handling recieving of published tracks it is called when joinroom is executed
let userPublishHandler = async (user,mediaType)=>{
    remoteUsers[user.uid] = user

    await client.subscribe(user,mediaType)
    
    //preventing duplicates so checking before adding
    let player = document.getElementById(`user-container-${user.uid}`)
    if(player===null){
        player = `<div class="video_container" id="user-container-${user.uid}">
                  <div class="video-player" id="user-${user.uid}"></div>
                  </div>`

        document.getElementById('streams_container').insertAdjacentHTML('beforeend',player)
        document.getElementById(`user-container-${user.uid}`).addEventListener('click',expandVideoFrame)
    }
    if(mainDisplayFrame.style.display){
        let vFrame = document.getElementById(`user-container-${user.uid}`)
        vFrame.style.height='100px'
        vFrame.style.width='100px'
    }
    if(mediaType==='video'){
        user.videoTrack.play(`user-${user.uid}`)
    }
    if(mediaType==='audio'){
        user.audioTrack.play()
    }
}
//trigger above function right away 
joinRoomInit()

let joinStream = async ()=>{
    //asking user to grant camera and microphone permission for stream and storing track
    LocalTracks = await AgoraRTC.createMicrophoneAndCameraTracks({},{encoderConfig:{width:{min:640,ideal:1920,max:1920},height:{width:{min:480,ideal:1080,max:1080}}}})

    //adding video container to html page
    let player = `<div class="video_container" id="user-container-${uid}">
                  <div class="video-player" id="user-${uid}"></div>
                  </div>`
                  
    document.getElementById('streams_container').insertAdjacentHTML('beforeend',player)
    document.getElementById(`user-container-${uid}`).addEventListener('click',expandVideoFrame)
    //linking video track to video player with id of html container
    LocalTracks[1].play(`user-${uid}`)

    //publishing local track this triggers the handlepusblish////////////////
    await client.publish([LocalTracks[0],LocalTracks[1]])
}


//handler for deleting users and streams of users who left room
let userLeaveHandler = async (user) =>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
    
    if(userIdInDisplayFrame===`user-container-${user.uid}`){
        mainDisplayFrame.style.display=null;
        let videoFrames =document.getElementsByClassName('video_container')
        for(let i=0;i<videoFrames.length;i++){
            videoFrames[i].style.height='300px'
            videoFrames[i].style.width='300px'
        }
    }
}
///switching from screen share to camera
let switchToCamera = async ()=>{
    let player = `<div class="video_container" id="user-container-${uid}">
                  <div class="video-player" id="user-${uid}"></div>
                  </div>`
    mainDisplayFrame.insertAdjacentHTML('beforeend',player)
    
    await LocalTracks[0].setMuted(true)
    await LocalTracks[1].setMuted(true)
    document.getElementById('camera_button').classList.remove('active')
    document.getElementById('mic_button').classList.remove('active')

    LocalTracks[1].play(`user-${uid}`)
    await client.publish([LocalTracks[1]])
}
///button functioning


let toggleCamera=async(e)=>{
    let button = e.currentTarget
    if(LocalTracks[1].muted){
        await LocalTracks[1].setMuted(false)
        button.classList.add('active')
    }else{
        await LocalTracks[1].setMuted(true)
        button.classList.remove('active')
    }

}
let toggleMicrophone=async(e)=>{
    let button = e.currentTarget
    if(LocalTracks[0].muted){
        await LocalTracks[0].setMuted(false)
        button.classList.add('active')
    }else{
        await LocalTracks[0].setMuted(true)
        button.classList.remove('active')
    }

}
let toggleScreen= async (e)=>{
    let scrnButton = e.currentTarget
    let camButton = document.getElementById('camera_button')
    if(!screenShareEnabled){
        screenShareEnabled = true

        camButton.classList.remove('active')
        camButton.style.display='none'
        scrnButton.classList.add('active')
        
        //screen track 
        localScreenShareTracks = await AgoraRTC.createScreenVideoTrack()

        document.getElementById(`user-container-${uid}`).remove()
        mainDisplayFrame.style.display = 'block'
        let player = `<div class="video_container" id="user-container-${uid}">
                  <div class="video-player" id="user-${uid}"></div>
                  </div>`
        mainDisplayFrame.insertAdjacentHTML('beforeend',player)
        document.getElementById(`user-container-${uid}`).addEventListener('click',expandVideoFrame)

        userIdInDisplayFrame = `user-container-${uid}`
        localScreenShareTracks.play(`user-${uid}`)

        //publishing screen track instead of video tracks
        await client.unpublish([LocalTracks[1]])
        await client.publish([localScreenShareTracks])

        //sizing on screenshare directly
        let videoFrames = document.getElementsByClassName('video_container')
        for(let i=0;i<videoFrames.length;i++){
            if(videoFrames[i].id!=userIdInDisplayFrame)
            {videoFrames[i].style.height='100px'
            videoFrames[i].style.width='100px'}
          }
    }
    else{
        screenShareEnabled = false
        camButton.style.display='block'
        document.getElementById(`user-container-${uid}`).remove()
        await client.unpublish([localScreenShareTracks])
        //switching to camera
        switchToCamera()
       }
   
}
let exitRoom = async (e)=>{
    window.location = 'lobby.html'
}
document.getElementById('camera_button').addEventListener('click',toggleCamera)
document.getElementById('mic_button').addEventListener('click',toggleMicrophone)
document.getElementById('screen_button').addEventListener('click',toggleScreen)
document.getElementById('leave_button').addEventListener('click',exitRoom)

