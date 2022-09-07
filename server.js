const http = require("http");
const fs = require("fs");
const path = require('path');
const mock = require('./mock');

const host = 'localhost';
const port = 3000;

const messages = {};

const requestListener = function (req, res) {
    if (req.url === '/') {
        const file = path.join(process.cwd(), 'index.html')
        const html = fs.readFileSync(file);
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end(); 
    } else if(req.url === '/register') {
        const file = path.join(process.cwd(), 'register.html')
        const html = fs.readFileSync(file);
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end(); 
    } else if(req.url === '/login') {
        if (req.method === 'GET') {
            const file = path.join(process.cwd(), 'login.html')
            const html = fs.readFileSync(file);
            res.writeHeader(200, {"Content-Type": "text/html"});  
            res.write(html);  
            res.end(); 
        } else if (req.method === 'POST') {
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                let answer;
                if (checkUserInFile(data)) {
                    answer = 'Exists'
                } else {
                    answer = 'No such user'
                }
                res.end(answer);
            })
        } else {
            res.end(); 
        }
        
    } else if(req.url === '/sidebarLeft.css') {
        const file = path.join(process.cwd(), 'sidebarLeft.css')
        const css = fs.readFileSync(file);
        res.writeHeader(200, {"Content-Type": "text/css"});  
        res.write(css);  
        res.end(); 
    } else if(req.url === '/content.css') {
        const file = path.join(process.cwd(), 'content.css')
        const css = fs.readFileSync(file);
        res.writeHeader(200, {"Content-Type": "text/css"});  
        res.write(css);  
        res.end(); 
    } else if(req.url === '/common.css') {
        const file = path.join(process.cwd(), 'common.css')
        const css = fs.readFileSync(file);
        res.writeHeader(200, {"Content-Type": "text/css"});  
        res.write(css);  
        res.end(); 
    } else if(req.url === '/mock.js') {
        const file = path.join(process.cwd(), 'mock.js')
        const js = fs.readFileSync(file);
        res.writeHeader(200, {"Content-Type": "application/javascript"});  
        res.write(js);  
        res.end(); 
    } else if(req.url === '/script.js') {
        const file = path.join(process.cwd(), 'script.js')
        const js = fs.readFileSync(file);
        res.writeHeader(200, {"Content-Type": "application/javascript"});  
        res.write(js);  
        res.end(); 
    } else if(req.url.includes('imgs')) {
        const mimeType = req.url.split('.')[1];
        const file = path.join(process.cwd(), 'imgs', req.url.slice(6))
        // console.log(file, mimeType);
        const image = fs.readFileSync(file);
        res.writeHeader(200, {"Content-Type": "image/" + mimeType});  
        res.write(image);  
        res.end(); 
    } else if(req.url.includes('/messages')) {
        if (req.method === 'GET') {
            const queriString = req.url.split('?')[1];
            if (!queriString) {
                return res.end('[]');
            }
            let [myPhone, sobesednik] = queriString.split('&');
            myPhone  = myPhone.split('=')[1];
            sobesednik  = sobesednik.split('=')[1];
            
            const msgsByPhone = getMessagesByPhone(myPhone, sobesednik);
            const stringMessages = JSON.stringify(msgsByPhone);
            res.end(stringMessages);
        } else if (req.method === 'POST') {
            let data = '';
            req.on('data', (chunk) => {
                data += chunk;
            });
            req.on('end', () => {
                saveMessageToFile(data);
            })
            res.end();
        } else {
            res.end('[]');
        }
        
    } else if(req.url === '/chats') {
        const usersArray = getUsersFromFile();
        const chats = usersArray.map((user) => {
            return {
                avatar: './imgs/arnold.jpg',
                header: user.nick + ' ' + user.phone,
                previewMessage: 'Here should be description',
                lastTime: '00:00'
            }
        });
        const stringData = JSON.stringify(chats);
        res.end(stringData);
    } else if(req.url === '/reg') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            const user = JSON.parse(data);
            // user -> {
            //     phone: string,
            //     nick: string
            // };
            let answer;
            if (checkUserInFile(user.phone)) {
                answer = {msg: 'User exists', type: 'error'};
            } else {
                addUserToFile(user.nick + ' ' + user.phone);
                answer = {msg: 'User added', type: 'success'};
            }
            res.end(JSON.stringify(answer));            
        })
    } else {
        const file = path.join(process.cwd(), 'error.html')
        const html = fs.readFileSync(file);
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});


// userString -> Sasha 123123
function addUserToFile(userString) {
    const file = path.join(process.cwd(), 'users.txt')
    const usersFromFile = fs.readFileSync(file, "utf8");

    if (!usersFromFile) {
        fs.writeFileSync(file, userString)
    } else {
        fs.writeFileSync(file, usersFromFile + "\n" + userString)
    }
}

function getUsersFromFile() {
    const file = path.join(process.cwd(), 'users.txt')
    const usersFromFile = fs.readFileSync(file, "utf8");

    if (usersFromFile === '') {
        return [];
    }
    
    return usersFromFile.split('\n').map((raw) => {
        const arrayOfUser = raw.split(' ');
        const nick = arrayOfUser[0];
        const phone = arrayOfUser[1];
        return {
            nick,
            phone
        };
    });
}

function checkUserInFile(phone) {
    const usersFromFile = getUsersFromFile();
    return usersFromFile.find((user) => {
        return user.phone === phone;
    });
}

function getAllMessages() {
    const file = path.join(process.cwd(), 'messages.txt')
    const messages = fs.readFileSync(file, "utf8");
    if (!messages) {
        return [];
    }

    return messages.split('\n').map((raw) => {
        return JSON.parse(raw);
    });
}

function getMessagesByPhone(our, his) {
    let msgs = getAllMessages();

    msgs = msgs.filter(({ourNumber, sobesednik}) => {
        const sobesednikPhone = sobesednik.split(' ')[1]; 
        if (our === ourNumber && his === sobesednikPhone) {
            return true;
        }
        if (his === ourNumber && our === sobesednikPhone) {
            return true;
        }
        return false;
    });


    return msgs.map((msg) => {
        const sobesednikPhone = msg.sobesednik.split(' ')[1]; 
        if (our === msg.ourNumber && his === sobesednikPhone) {
            return {
                ...msg,
                type: 'my'
            };
        } else {
            return {
                ...msg,
                type: 'your'
            };
        }
    })
}

function saveMessageToFile(msg) {
    const fileName = path.join(process.cwd(), 'messages.txt')
    const messages = fs.readFileSync(fileName, "utf8");

    if (!messages) {
        fs.writeFileSync(fileName, msg)
    } else {
        fs.writeFileSync(fileName, messages + "\n" + msg)
    }
}