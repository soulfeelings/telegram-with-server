const http = require("http");
const fs = require("fs");
const mock = require('./mock');

const host = 'localhost';
const port = process.env.PORT || 8000;

const messages = {};

const requestListener = function (req, res) {
    if (req.url === '/') {
        const html = fs.readFileSync('./index.html');
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end(); 
    } else if(req.url === '/register') {
        const html = fs.readFileSync('./register.html');
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end(); 
    } else if(req.url === '/login') {
        if (req.method === 'GET') {
            const html = fs.readFileSync('./login.html');
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
        const css = fs.readFileSync('./sidebarLeft.css');
        res.writeHeader(200, {"Content-Type": "text/css"});  
        res.write(css);  
        res.end(); 
    } else if(req.url === '/content.css') {
        const css = fs.readFileSync('./content.css');
        res.writeHeader(200, {"Content-Type": "text/css"});  
        res.write(css);  
        res.end(); 
    } else if(req.url === '/common.css') {
        const css = fs.readFileSync('./common.css');
        res.writeHeader(200, {"Content-Type": "text/css"});  
        res.write(css);  
        res.end(); 
    } else if(req.url === '/mock.js') {
        const js = fs.readFileSync('./mock.js');
        res.writeHeader(200, {"Content-Type": "application/javascript"});  
        res.write(js);  
        res.end(); 
    } else if(req.url === '/script.js') {
        const js = fs.readFileSync('./script.js');
        res.writeHeader(200, {"Content-Type": "application/javascript"});  
        res.write(js);  
        res.end(); 
    } else if(req.url.includes('imgs')) {
        const mimeType = req.url.split('.')[1];
        const image = fs.readFileSync('.' + req.url);
        res.writeHeader(200, {"Content-Type": mimeType});  
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
        const html = fs.readFileSync('./error.html');
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
    const usersFromFile = fs.readFileSync("./users.txt", "utf8");

    if (!usersFromFile) {
        fs.writeFileSync("./users.txt", userString)
    } else {
        fs.writeFileSync("./users.txt", usersFromFile + "\n" + userString)
    }
}

function getUsersFromFile() {
    const usersFromFile = fs.readFileSync("./users.txt", "utf8");

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
    const messages = fs.readFileSync("./messages.txt", "utf8");
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
    const fileName = "./messages.txt";
    const messages = fs.readFileSync(fileName, "utf8");

    if (!messages) {
        fs.writeFileSync(fileName, msg)
    } else {
        fs.writeFileSync(fileName, messages + "\n" + msg)
    }
}