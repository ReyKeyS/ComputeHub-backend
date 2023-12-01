const env = require("../config/env.config")

const User = require("../models/User")

// const readChat = async (req, res) => {
//     const { id_chat } = req.params

//     const user = await User.findOne({username: req.username})
//     const chat = user.friends.find(f => f.id_chat == id_chat)

//     chat.is_read = true

//     await user.save();

//     return res.sendStatus(200);
// }

const addChat = async (req, res) => {
    const { content, email_to } = req.body
    
    const curUser = await User.findOne({email: req.user_email})
    const toUser = await User.findOne({email: email_to});

    let chat1 = toUser.chats.find(f => f.email_sender == curUser.email);
    let chat2 = curUser.chats.find(f => f.email_sender == toUser.email);
    
    if (!chat1 || !chat2) {
        curUser.chats.push({
            email_sender: toUser.email,
            name_sender: toUser.display_name,
            profpict_sender: toUser.profile_picture,
            is_read: true,
            latest_chat: null,
            latest_time: null,
            chatting: []
        })

        toUser.chats.push({
            email_sender: curUser.email,
            name_sender: curUser.display_name,
            profpict_sender: curUser.profile_picture,
            is_read: true,
            latest_chat: null,
            latest_time: null,
            chatting: []
        })

        await curUser.save()
        await toUser.save()
        
        chat1 = toUser.chats.find(f => f.email_sender == curUser.email);
        chat2 = curUser.chats.find(f => f.email_sender == toUser.email);
    }

    chat1.latest_chat = content;
    chat1.latest_time = Date.now();
    if (chat1.email_sender == curUser.email) chat1.is_read = false; else chat1.is_read = true;
    chat1.chatting.push({
        content: content,
        sender: curUser.email,
        time: Date.now(),
    })

    chat2.latest_chat = content;
    chat2.latest_time = Date.now();
    if (chat2.email_sender == curUser.email) chat2.is_read = false; else chat2.is_read = true;
    chat2.chatting.push({
        content: content,
        sender: curUser.email,
        time: Date.now(),
    })

    await curUser.save()
    await toUser.save()

    return res.status(201).json({message: "Chat added successfully"})
}

// const unsendChat = async (req, res) => {
//     const { id_chat, index } = req.params

//     let users = id_chat.split('-');
//     const user1 = await User.findOne({username: users[0]})
//     const user2 = await User.findOne({username: users[1]})
    
//     const chat1 = user1.friends.find(f => f.id_chat == id_chat)
//     const chat2 = user2.friends.find(f => f.id_chat == id_chat)

//     chat1.chats.splice(index, 1)
//     if (chat1.chats.length > 0){
//         chat1.latest_chat = chat1.chats[index-1].isi
//         chat1.latest_waktu = chat1.chats[index-1].waktu
//         chat1.is_read = true
//     } else{
//         chat1.latest_chat = null
//         chat1.latest_waktu = null
//         chat1.is_read = true
//     }

//     chat2.chats.splice(index, 1)
//     if (chat2.chats.length > 0){
//         chat2.latest_chat = chat2.chats[index-1].isi
//         chat2.latest_waktu = chat2.chats[index-1].waktu
//         chat2.is_read = true
//     } else{
//         chat2.latest_chat = null
//         chat2.latest_waktu = null
//         chat2.is_read = true
//     }

//     await user1.save()
//     await user2.save()

//     return res.sendStatus(200);
// }

// const pinChat = async (req, res) => {
//     const { id_chat, index } = req.params

//     let users = id_chat.split('-');
//     const user1 = await User.findOne({username: users[0]})
//     const user2 = await User.findOne({username: users[1]})
    
//     const chat1 = user1.friends.find(f => f.id_chat == id_chat)
//     const chat2 = user2.friends.find(f => f.id_chat == id_chat)

//     if (chat1.chats[index].is_pinned) 
//         chat1.chats[index].is_pinned = false;
//     else 
//         chat1.chats[index].is_pinned = true;

//     if (chat2.chats[index].is_pinned) 
//         chat2.chats[index].is_pinned = false; 
//     else 
//         chat2.chats[index].is_pinned = true;

//     await user1.save();
//     await user2.save();

//     return res.sendStatus(200);
// }

module.exports = {
    // readChat,
    addChat,
    // unsendChat,
    // pinChat,
}