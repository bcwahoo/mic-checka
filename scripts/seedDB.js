require('dotenv').config();
const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');

const db = require("../models");

// This file empties the Book and User collections and inserts the seeds below

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const demoUserSeed = [
    {
        role: "user",
        firstName: "Blessing",
        lastName: "Nwaohuocha",
        email: "bcwahoo@email.com",
        username: 'bcwahoo'
    },
    {
        role: "user",
        firstName: "Demo",
        lastName: "One",
        email: "demo1@email.com",
        username: 'demo1'
    },
    {
        role: "user",
        firstName: "Demo",
        lastName: "Two",
        email: "demo2@email.com",
        username: 'demo2'
    }
]


const albumSeed = [
    {
        album: "Wu-Tang Forever",
        artist: "Wu-Tang Clan",
        cover: "https://genius.com/album_cover_arts/3733",
        released: "1997",
        summary:
            "Wu - Tang Forever is the second studio album of American hip- hop group Wu - Tang Clan, released June 3, 1997 on Loud / RCA Records in the United States.Pressed as a double album, it was released after a long run of successful solo projects from various members of the group, and serves as the follow - up to their debut album Enter the Wu - Tang(36 Chambers).Forever features several guest appearances from Wu - Tang affiliates Cappadonna, Streetlife, 4th Disciple, True Master, and Tekitha, as well as an extensive embodiment of lesser - known members of the group(U - God, Masta Killa and Inspectah Deck)The first single released for the album, \“Triumph\” was great but an unusual single choice, as it ran nearly six minutes in length with 9 verses and no chorus.All the long string of solo albums paid off in a dedicated fan - base and powerful reputation, as the album debuted at #1 on the Billboard 200, selling over 612, 000 in its first week.It has been certified 4x Platinum and stands as the group’s best selling album to date.",
        date: new Date(Date.now())
    },
    {
        title: "Lord of the Flies",
        author: "William Golding",
        synopsis:
            "The tale of a party of shipwrecked schoolboys, marooned on a coral island, who at first enjoy the freedom of the situation but soon divide into fearsome gangs which turn the paradise island into a nightmare of panic and death.",
        date: new Date(Date.now())
    }
];

async function seed() {
    try {
        // clear DB
        await db.Album.remove({});
        await db.User.remove({});

        // add demo users
        const saltRounds = parseInt(process.env.PASSWORD_SALT_ROUNDS, 10);
        const password = process.env.SEED_USER_PASSWORD;
        await Promise.all(demoUserSeed.map(async (it) => {
            it.passwordHash = await bcrypt.hash(password, saltRounds);
            return;
        }));

        const userSeedOp = await db.User.collection.insertMany(demoUserSeed);

        // put demoUser's ID on each album
        albumSeed.forEach((it, idx) => it.user = userSeedOp.insertedIds[idx % 2]);

        // add album to DB
        const albumSeedOp = await db.Album.collection.insertMany(albumSeed);
        console.log(`Inserted ${albumSeedOp.result.n} albumss.`);

        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seed();
