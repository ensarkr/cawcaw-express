import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
const localHost = "http://localhost:5000/api";
const vercelHost = "https://cawcaw-express-ensarkr.vercel.app/api";
const testHost = localHost;
const testUserData = {
    id: 0,
    displayName: "test user",
    username: "testUser",
    password: "strongPassword",
    description: "description",
};
const testPostDatas = [
    {
        text: "Dax El Salvador Gabriel Germany",
        image_url: "imageURL",
    },
    {
        text: "welfare Milly Belarus test unknown Ladonna ashamed scheme potential",
        image_url: "imageURL",
    },
    {
        text: "lane charge Cydney Iyanna council",
        image_url: "imageURL",
    },
    {
        text: "Bambi monthly pain Kylan Norway",
        image_url: "imageURL",
    },
    {
        text: "upset Monaco Ottie Hong Kong technique test resistance education Panama",
        image_url: "imageURL",
    },
    {
        text: "limping soil Hong Kong Evangelina Torrie Denton tragic pitiful Kate DR Congo evidence Zhane",
        image_url: "imageURL",
    },
    {
        text: "source tense plump chairman Moldova Bulgaria harmonious pricey Miguelangel appeal Cheyanne Iraq Lettie Slovenia",
        image_url: "imageURL",
    },
    {
        text: "report aircraft Jeannine occasional test wonderful miserly",
        image_url: "imageURL",
    },
    {
        text: "Susanna Luxembourg Duwayne Octavius Esther French Guiana India Lyla Togo stupendous oil",
        image_url: "imageURL",
    },
    {
        text: "court Lesotho test project firm movement ministry Cabo Verde Maryam",
        image_url: "imageURL",
    },
];
const testUserDatas = [
    {
        displayName: "Cristina Aretha Test Maiya",
        username: "meatylocationstudy",
        password: "`6@`4j.,7",
        description: "desc",
    },
    {
        displayName: "Soloman Male",
        username: "wife",
        password: 'o2";3f9>}',
        description: "desc",
    },
    {
        displayName: "Braulio",
        username: "vacanttimelyrecord",
        password: "E*0\\9!6F1",
        description: "desc",
    },
    {
        displayName: "Colin Zander Test Tommy",
        username: "overcookedconclusion",
        password: "S09Wg7i0f",
        description: "desc",
    },
    {
        displayName: "Gaylen",
        username: "EzekielLindaTorry",
        password: "/2Sd14_;",
        description: "desc",
    },
    {
        displayName: "Illa Alvis Valerie",
        username: "EdieentryAudley",
        password: "W/)q~01*Q6",
        description: "desc",
    },
    {
        displayName: "Nico Shirlene Eden",
        username: "Lenora",
        password: "6533k-94@s",
        description: "desc",
    },
    {
        displayName: "Alec Test Savilla",
        username: "Aiyanabush",
        password: ">Y4/^14Jf",
        description: "desc",
    },
    {
        displayName: "Teri",
        username: "descriptionunselfishStacia",
        password: ",eK3AI98",
        description: "desc",
    },
    {
        displayName: "Estefani Dangelo Sheryl",
        username: "amusingexchange",
        password: "i'O6BT]3",
        description: "desc",
    },
    {
        displayName: "Hertha Test Anjelica",
        username: "Bobbiecrisisadorableluxurious",
        password: "03:I?s).W$/B",
        description: "desc",
    },
    {
        displayName: "Amil Ibrahim",
        username: "offenceKarymegenuinealtruistic",
        password: "qY[RN,IX`k",
        description: "desc",
    },
    {
        displayName: "Chanie",
        username: "compassionateDoreneMichellmusic",
        password: "(/q)aq06J01",
        description: "desc",
    },
    {
        displayName: "Viola test Terra",
        username: "nightcultureCandis",
        password: "&sn0[3B*,1",
        description: "desc",
    },
    {
        displayName: "Marjorie test Terell",
        username: "radiantMelindaLesaisland",
        password: "+eH/5SN+",
        description: "desc",
    },
];
const testPostData = {
    id: 0,
    text: "post text",
    image_url: "description",
};
const testUserData2 = {
    id: 1,
    displayName: "test user2",
    username: "testUser2",
    password: "strongPassword2",
    description: "description2",
};
async function insertTestUser() {
    await sql `INSERT INTO cawcaw_users (id,username,display_name,hashed_password) 
  VALUES (${testUserData.id},
    ${testUserData.username}, 
    ${testUserData.displayName},
    ${await bcrypt.hash(testUserData.password, 10)}) `;
}
async function deleteTestUser(condition) {
    if (condition === undefined) {
        await sql `DELETE FROM cawcaw_users WHERE id = 0`;
    }
    else {
        await (sql `DELETE FROM cawcaw_users ` + condition);
    }
}
async function getTestUser(useUsername) {
    if (useUsername === undefined || useUsername === false) {
        return (await sql `SELECT * FROM cawcaw_users WHERE id = ${testUserData.id}`)
            .rows[0];
    }
    else {
        return (await sql `SELECT * FROM cawcaw_users WHERE username ${testUserData.username}`).rows[0];
    }
}
async function insertTestUser2() {
    await sql `INSERT INTO cawcaw_users (id,username,display_name,hashed_password) 
  VALUES (${testUserData2.id},
    ${testUserData2.username}, 
    ${testUserData2.displayName},
    ${await bcrypt.hash(testUserData2.password, 10)}) `;
}
async function deleteTestUser2(condition) {
    if (condition === undefined) {
        await sql `DELETE FROM cawcaw_users WHERE id = ${testUserData2.id}`;
    }
    else {
        await (sql `DELETE FROM cawcaw_users ` + condition);
    }
}
async function getTestUser2(useUsername) {
    if (useUsername === undefined || useUsername === false) {
        return (await sql `SELECT * FROM cawcaw_users WHERE id = ${testUserData2.id}`).rows[0];
    }
    else {
        return (await sql `SELECT * FROM cawcaw_users WHERE username = ${testUserData2.username}`).rows[0];
    }
}
async function getAllFollowRelationsByTestUser() {
    return (await sql `SELECT * FROM cawcaw_follow_relation  WHERE user_id = ${testUserData.id}`).rows;
}
async function deleteAddedFollowRelation() {
    await sql `DELETE FROM cawcaw_follow_relation
   WHERE user_id = ${testUserData.id} AND follows_id = ${testUserData2.id}`;
}
async function addFollowRelation() {
    await sql `INSERT INTO cawcaw_follow_relation (user_id,follows_id) VALUES 
  (${testUserData.id} , ${testUserData2.id})`;
}
async function getPostsByTestUser() {
    return (await sql `SELECT * FROM cawcaw_posts WHERE user_id = ${testUserData.id}`).rows;
}
async function deleteAllPostsByTestUser() {
    return (await sql `DELETE FROM cawcaw_posts WHERE user_id = ${testUserData.id}`).rows;
}
async function insertPostByTestUser() {
    await sql `INSERT INTO cawcaw_posts (id, user_id, text)
    VALUES (${testPostData.id}, ${testUserData.id}, ${testPostData.text})`;
}
async function insertPostsByTestUser(postCount) {
    for (let i = 0; i < postCount; i++) {
        await sql `INSERT INTO cawcaw_posts ( user_id, text)
    VALUES ( ${testUserData.id}, ${testPostData.text})`;
    }
}
async function insertPostsByTestUser2(postCount) {
    for (let i = 0; i < postCount; i++) {
        await sql `INSERT INTO cawcaw_posts ( user_id, text)
    VALUES ( ${testUserData2.id}, ${testPostData.text})`;
    }
}
async function insertPrefilledPostsByTestUser() {
    for (let i = 0; i < testPostDatas.length; i++) {
        await sql `INSERT INTO cawcaw_posts ( user_id, text,image_url)
    VALUES ( ${testUserData.id}, ${testPostDatas[i].text},${testPostDatas[i].image_url})`;
    }
}
async function insertPrefilledUsers() {
    for (let i = 0; i < testUserDatas.length; i++) {
        await sql `INSERT INTO cawcaw_users ( display_name,username,hashed_password,description )
    VALUES ( ${testUserDatas[i].displayName}, ${testUserDatas[i].username},${testUserDatas[i].password},${testUserDatas[i].description})`;
    }
}
async function deletePrefilledUsers() {
    for (let i = 0; i < testUserDatas.length; i++) {
        await sql `DELETE FROM cawcaw_users WHERE username = ${testUserDatas[i].username}`;
    }
}
async function getAllPostLikesByTestUser() {
    return (await sql `SELECT * FROM cawcaw_post_likes  WHERE user_id = ${testUserData.id}`).rows;
}
async function addLikeByTestUser() {
    return (await sql `INSERT INTO cawcaw_post_likes (user_id,post_id)
    VALUES (${testUserData.id},${testPostData.id})`).rows;
}
async function getAllCommentsByTestUser() {
    return (await sql `SELECT * FROM cawcaw_post_comments WHERE user_id = ${testUserData.id}`).rows;
}
async function insertCommentsByTestUser(commentCount) {
    for (let i = 0; i < commentCount; i++) {
        await sql `INSERT INTO cawcaw_post_comments ( user_id, post_id, comment )
    VALUES (${testUserData.id} ,${testPostData.id}, ${testPostData.text})`;
    }
}
export { insertTestUser, deleteTestUser, getTestUser, insertTestUser2, deleteTestUser2, getTestUser2, testUserData, testUserData2, getAllFollowRelationsByTestUser, deleteAddedFollowRelation, addFollowRelation, testHost, getPostsByTestUser, deleteAllPostsByTestUser, insertPostByTestUser, testPostData, getAllPostLikesByTestUser, getAllCommentsByTestUser, insertPostsByTestUser, insertPostsByTestUser2, insertPrefilledPostsByTestUser, insertPrefilledUsers, deletePrefilledUsers, insertCommentsByTestUser, addLikeByTestUser, };
