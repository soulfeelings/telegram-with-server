const newMesssage = document.querySelector('.Content__newMessageInput');
const sendIcon = document.querySelector('.Content__newMessageRecord');

newMesssage.addEventListener('input', (e) => {
    const message = e.target.value;
    if (message) {
        sendIcon.classList.remove('record');
        sendIcon.classList.add('send');
    } else {
        sendIcon.classList.add('record');
        sendIcon.classList.remove('send');
    }
});


//  Отправка сообщения
const Content__messages = document.querySelector('.Content__messages');
sendIcon.addEventListener('click', () => {
    const hoursMinutes = new Date().getHours() + ':' + new Date().getMinutes();
    const msg = newMesssage.value;

    sendMessageToServer(msg, hoursMinutes);

    // Content__messages.insertAdjacentHTML('beforeend', `
    //     <div class="Content__messageRaw Content__myMessage">
    //         <div class="Content__message Content__message--my">
    //             <span class="Content__messageText">${msg}</span>
    //             <span class="Content__messageTime">${hoursMinutes}</span>
    //         </div>
    //         <svg class="Content__myMessageSvg" width="9" height="20" xmlns="http://www.w3.org/2000/svg"><defs><filter x="-50%" y="-14.7%" width="200%" height="141.2%" filterUnits="objectBoundingBox" id="a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g fill="none" fill-rule="evenodd"><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#000" filter="url(#a)"></path><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#FFF" class="corner"></path></g></svg>
    //     </div>
    // `);

    // Clear input
    newMesssage.value = '';
    // To revert animation for button
    newMesssage.dispatchEvent(new Event('input'));
});

function sendMessageToServer(msgText, hoursMinutes) {
    fetch('./messages', {
        method: 'POST',
        body: JSON.stringify({
            id: +new Date(),
            text: msgText,
            ourNumber: localStorage.getItem('user'),
            sobesednik: document.querySelector('.Content__headerChatInfoText h1').innerHTML,
            time: hoursMinutes
        })
    });
}


//  Рендер чатов
const SidebarLeftBody = document.querySelector('.SidebarLeft__body');

function renderChats(chats) {
    SidebarLeftBody.innerHTML = '';
    if (chats.length === 0) {
        SidebarLeftBody.insertAdjacentHTML('beforeend', `
            <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100%">
                <h4>No Results</h4> 
                <span>There were no results.</span> 
                <p>Try a new search.</p> 
            </div>
        `);
    }
    renderNewChats(chats);
}

function renderNewChats(chats) {
    chats.forEach((chat) => {
        let avatar = chat.avatar;
        
        if (chat.header.split(' ')[1] === localStorage.getItem('user')) {
            avatar = '/imgs/FavoriteChat.png';
        }
        SidebarLeftBody.insertAdjacentHTML('beforeend', `
            <div class="SidebarLeft__chat" onclick="chooseChat(event)">
                <img class="SidebarLeft__chatAvatar" src="${avatar}" />
                <div class="SidebarLeft__chatInfo">
                    <h1>${chat.header}</h1>
                    <span>${chat.previewMessage}</span>
                </div>
                <span class="SidebarLeft__chatLastTime">${chat.lastTime}</span>
            </div>
        `);
    });
}

let msgsId = {};
function chooseChat(event) {
    Content__messages.innerHTML = '';
    const contentHeader = document.querySelector('.Content__header');
    contentHeader.style.display = 'flex';
    const contentBody = document.querySelector('.Content__body');
    contentBody.style.display = 'flex';
    const header = event.currentTarget.querySelector('.SidebarLeft__chatInfo h1');
    const text = header.innerHTML;

    document.querySelector('.Content__headerChatInfoText h1').innerHTML = text;

    const myPhone = localStorage.getItem('user');
    const sobesednikPhone = text.split(' ')[1];

    function getNewMessages(withFilter) {
        fetch(`/messages?myPhone=${myPhone}&sobesednikPhone=${sobesednikPhone}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(messages => {
            if (withFilter) {
                const newMessages = messages.filter((msg) => {
                    if (msgsId[msg.id]) {
                        return false;
                    }
                    return true;
                })
                rendersMessagesArray(newMessages);
            } else {
                rendersMessagesArray(messages);
            }
            messages.forEach((msg) => {
                msgsId[msg.id] = true;
            });
        });
    }

    getNewMessages(false);

    setInterval(() => {
        getNewMessages(true);
    }, 1000)
}

// Seearch chats

const SidebarLeft__searchInput = document.querySelector('.SidebarLeft__searchInput');

SidebarLeft__searchInput.addEventListener('input', (e) => {
    const filteredChats = chats.filter((chat) => chat.header.includes(e.target.value));

    renderChats(filteredChats);
})

function rendersMessagesArray(msgArr) {
    msgArr.forEach((msg) => {
        if (msg.type === 'my') {
            Content__messages.insertAdjacentHTML('beforeend', `
            <div class="Content__messageRaw Content__myMessage">
                <div class="Content__message Content__message--my">
                    <span class="Content__messageText">${msg.text}</span>
                    <span class="Content__messageTime">${msg.time || '...'}</span>
                </div>
                <svg class="Content__myMessageSvg" width="9" height="20" xmlns="http://www.w3.org/2000/svg"><defs><filter x="-50%" y="-14.7%" width="200%" height="141.2%" filterUnits="objectBoundingBox" id="a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g fill="none" fill-rule="evenodd"><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#000" filter="url(#a)"></path><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#FFF" class="corner"></path></g></svg>
            </div>
            `);
        } else {
            Content__messages.insertAdjacentHTML('beforeend', `
            <div class="Content__messageRaw Content__yourMessage">
                <svg class="Content__yourMessageSvg" width="9" height="20" xmlns="http://www.w3.org/2000/svg"><defs><filter x="-50%" y="-14.7%" width="200%" height="141.2%" filterUnits="objectBoundingBox" id="a"><feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feColorMatrix values="0 0 0 0 0.0621962482 0 0 0 0 0.138574144 0 0 0 0 0.185037364 0 0 0 0.15 0" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g fill="none" fill-rule="evenodd"><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#000" filter="url(#a)"></path><path d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z" fill="#FFF" class="corner"></path></g></svg>
                <div class="Content__message Content__message--your">
                    <span class="Content__messageText">${msg.text}</span>
                    <span class="Content__messageTime">${msg.time  || '...'}</span>
                </div>
            </div>
            `);
            
        }
    });
}

// Render mesgs
function renderMessagesFromLS() {
    const msgs = localStorage.getItem('messages');
    if (msgs) {
        const msgsArr = JSON.parse(msgs);
        rendersMessagesArray(msgsArr);
    }
    
}


// Chats

function renderChatsFromServer() {
    fetch('/chats', {
        method: 'GET'
    }).then((response) => {
        response.json().then((data) => {
            renderChats(data);
        })
    })
}

function renderOnlyNewChats() {
    fetch('/chats', {
        method: 'GET'
    }).then((response) => {
        response.json().then((data) => {
            const headersElement = document.querySelectorAll('.SidebarLeft__chatInfo h1');
            const headersText = {};
            for (let i = 0; i < headersElement.length; i++) {
                const element = headersElement[i];
                headersText[element.innerHTML] = true;
            }
            const newChats = data.filter((chat) => {
                const header = chat.header;
                if (headersText[header]) {
                    return false;
                } else {
                    return true;
                }
            });
            renderNewChats(newChats);
        })
    })
}

renderChatsFromServer();
setInterval(() => {
    renderOnlyNewChats();
}, 1000);
