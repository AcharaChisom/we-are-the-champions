import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: `https://champions-5b1c5-default-rtdb.europe-west1.firebasedatabase.app/`
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const convosInDB = ref(database, `convos`)

const publish = document.getElementById('publish');
const fromEl = document.getElementById('from');
const toEl = document.getElementById('to');
const inputEl = document.getElementById('input');
const resultsEl = document.getElementById('results');


onValue(convosInDB, (snapshot) => {
    const data = snapshot.val();
    
    if (data) {
        const convos = Object.entries(data);
        // console.log(convos[0]);

        resultsEl.innerHTML = '';
        for (let i = convos.length - 1; i >= 0; i--) {
            // console.log(convos[i][0], convos[i][1]);
            addToResults(convos[i][0], convos[i][1]);
        }
    } else {
        resultsEl.innerHTML = '<p class="no-convo">No convos yet</p>';
    }
});

publish.addEventListener('click', () => {
    const receipient = toEl.value;
    const sender = fromEl.value;
    const message = inputEl.value;
    let votes = 0;

    if (receipient && sender && message) {
        push(convosInDB, { receipient, sender, message, votes })
            .then(() => {
                fromEl.value = '';
                toEl.value = '';
                inputEl.value = '';
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

const addToResults = (id, convo) => {
    // console.log(id, convo);
    const { receipient, sender, message, votes } = convo;

    const div = document.createElement('div');
    div.className = 'result';
    div.innerHTML = `
        <p class="result-to">to ${receipient}</p>
        <p class="result-text">
            ${message}
        </p>
        <div class="result-lastline">
            <p class="result-from">from ${sender}</p>
            <p class="likes">💜 ${votes}</p>
        </div>
    `;

    const likes = div.querySelector('.likes');
    likes.addEventListener('click', () => {
        const newVotes = votes + 1;
        const convoRef = ref(database, `convos/${id}`);
        update(convoRef, { votes: newVotes });
    });

    resultsEl.appendChild(div);
};