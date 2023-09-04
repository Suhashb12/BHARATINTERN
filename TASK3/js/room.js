let messagesContainer = document.getElementById('messages');
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById('members__container');
const memberButton = document.getElementById('members__button');

const chatContainer = document.getElementById('messages__container');
const chatButton = document.getElementById('chat__button');

let activeMemberContainer = false;

memberButton.addEventListener('click', () => {
  if (activeMemberContainer) {
    memberContainer.style.display = 'none';
  } else {
    memberContainer.style.display = 'block';
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener('click', () => {
  if (activeChatContainer) {
    chatContainer.style.display = 'none';
  } else {
    chatContainer.style.display = 'block';
  }

  activeChatContainer = !activeChatContainer;
});
///////////////////Click event scripts/////
let mainDisplayFrame = document.getElementById('stream_box')
let videoFrames = document.getElementsByClassName('video_container')
let userIdInDisplayFrame = null;
//takes care of expanding video stream on which user clicks
let expandVideoFrame = (e)=>{
  mainDisplayFrame.style.display='block'
  //if currently there is another user in main frame remove it and place it in bottom container
  let child =mainDisplayFrame.children[0]
  if(child){
    document.getElementById('streams_container').appendChild(child)
  }
  mainDisplayFrame.appendChild(e.currentTarget)
  userIdInDisplayFrame = e.currentTarget.id
  
  for(let i=0;i<videoFrames.length;i++){
    if(videoFrames[i].id!=userIdInDisplayFrame)
    {videoFrames[i].style.height='100px'
    videoFrames[i].style.width='100px'}
  }
}

for(let i=0;i<videoFrames.length;i++){
  videoFrames[i].addEventListener('click',expandVideoFrame)
}
// Removing expanded display frame when clicked
let hideMainDisplayFrame = ()=>{

  userIdInDisplayFrame = null
  mainDisplayFrame.style.display = null

  let child = mainDisplayFrame.children[0]
  document.getElementById('streams_container').append(child)

  // let videoFrames = document.getElementsByClassName('video_container')
  for(let i=0;i<videoFrames.length;i++){
    videoFrames[i].style.height='300px'
    videoFrames[i].style.width='300px'
  }
}
mainDisplayFrame.addEventListener('click',hideMainDisplayFrame)
