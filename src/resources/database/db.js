import Dexie from 'dexie';

const db = new Dexie("UserDetails");

db.version(1).stores({
    users: "++id, username, email, phonenumber, password, status" 
});

export default db;
