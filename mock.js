const chats = [
    {
        avatar: './imgs/arnold.jpg',
        header: 'Ched Dolbik',
        previewMessage: 'Hi ched, this is margaret  i love you very much',
        lastTime: '19:50'
    },
    {
        avatar: './imgs/doc.jpg',
        header: 'Ched Dolbik',
        previewMessage: 'Hi ched, this is margaret  i love you very much',
        lastTime: '19:50'
    },
    {
        avatar: './imgs/tor.jpg',
        header: 'Ched Dolbik',
        previewMessage: 'Hi ched, this is margaret  i love you very much',
        lastTime: '19:50'
    },
    // {
    //     avatar: './imgs/tor2.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/arnold.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/doc.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/tor.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/arnold.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/doc.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/tor.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/arnold.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/doc.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/tor.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/arnold.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/doc.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/tor.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/arnold.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/doc.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
    // {
    //     avatar: './imgs/tor.jpg',
    //     header: 'Ched Dolbik',
    //     previewMessage: 'Hi ched, this is margaret  i love you very much',
    //     lastTime: '19:50'
    // },
];

let messages = [
    {
        text: 'aergaetaethsareth',
        time: '19:10'
    },
    {
        text: 'aergaetaethsareth',
        time: '19:10'
    },
    {
        text: 'aergaetaethsareth',
        time: '19:10'
    },
    {
        text: 'aergaetaethsareth',
        time: '19:10'
    },
];

messages = messages.map((message, index) => {
    if (index % 2) {
        message.type = 'my';
    } else {
        message.type = 'your';
    }
    return message;
});

module.exports = {
    messages,
    chats
}