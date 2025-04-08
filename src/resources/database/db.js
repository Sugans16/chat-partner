import Dexie from 'dexie';

const db = new Dexie("UserDetails");

db.version(1).stores({
    users: "++id, username, email, phonenumber, password, status" ,
    chatLists: "++id,username, name, date",
    chatMessages: "++id, chatId,username, name, messages"
});

export default db;
