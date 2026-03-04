const loadLevel = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all";
    fetch(url)
    .then(res => res.json())
    .then(json => displayLessons(json.data))
}
loadLevel()

const displayLessons = (lessons) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';
    lessons.forEach(lesson => {
        const div = document.createElement('div');
        div.innerHTML = `
        <button id = "lesson-btn-${lesson.level_no}" onclick= "loadLevelWord(${lesson.level_no})" href="" class="lesson-btn btn btn-outline btn-primary"
            ><i class="fa-solid fa-book-open"></i> Lesson ${lesson.level_no}</button
          >
        `;
    levelContainer.appendChild(div)
})
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
    if(status == true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }else{
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

const activeRemove = () => {
    const lessonBtn = document.querySelectorAll(".lesson-btn");
    lessonBtn.forEach(btn => btn.classList.remove("active"))
}

const loadLevelWord = (id) => {
    manageSpinner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(json => {
        activeRemove()
        const clickBtn = document.getElementById(`lesson-btn-${id}`);
        clickBtn.classList.add("active")
        displayLevelWord(json.data)
    })
}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';

    if(words.length == 0){
        wordContainer.innerHTML = `
        <div class="col-span-3 text-center space-y-4">
            <img src = "./assets/alert-error.png"/ class = "mx-auto">
            <p class="font-bangla text-[#79716B] text-[14px]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bangla text-[#292524] text-2xl md:text-[34px]">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        manageSpinner(false);
        return;
    }

    words.forEach((word) => {
        const card = document.createElement('div')
        card.innerHTML = `
        <div class="bg-white p-2.5 md:p-[56px] text-center space-y-3 rounded-xl shadow-sm h-full">
            <h2 class="font-bold md:text-[32px]">${word.word ? word.word : "শব্দটি পাওয়া যায়নি"}</h2>
            <p class="font-medium text-[10px] md:text-[20px]">Meaning /Pronounciation</p>
            <div class="font-bangla text-[12px] font-semibold md:text-[32px]">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</div>
            <div class="flex justify-between  mt-auto">
                <button onclick = "loadWordDetail(${word.id})" class="btn btn-soft bg-[#1a91ff1a] rounded-md hover:bg-[#1a91ff80]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick = "pronounceWord('${word.word}')" class="btn btn-soft bg-[#1a91ff1a] rounded-md hover:bg-[#1a91ff80]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `;
        wordContainer.appendChild(card)
        manageSpinner(false);
    })
}

const loadWordDetail = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(detail => displayWordDetails(detail.data))
}

const displayWordDetails = (word) => {
    const detailBox = document.getElementById("detail-container");
    detailBox.innerHTML = `
        <div>
            <h2 class="font-bold text-2xl md:text-4xl">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
        </div>
        <div>
            <h2 class="font-semibold text-[20px] md:text-2xl">Meaning</h2>
            <p class="font-medium text-[20px] md:text-2xl">${word.meaning}</p>
        </div>
        <div>
            <h2 class="font-semibold text-[20px] md:text-2xl">Example</h2>
            <p class="font-medium text-[20px] md:text-2xl">${word.sentence}</p>
        </div>
        <div>
            <p class="font-medium text-[20px] md:text-2xl">সমার্থক শব্দ গুলো</p>
            <div class="flex gap-[18px] mt-2.5">
                ${createElements(word.synonyms)}
            </div>
        </div>
    `;
    document.getElementById("my_modal").showModal();
}

const createElements = (array) => {
    const synonyms = array.map((el) => 
      `<button class="btn btn-soft bg-[#1a91ff1a] rounded-md">
        ${el}
      </button>`
    );
    return synonyms.join(" ");
}

document.getElementById("btn-search").addEventListener('click', () => {
    activeRemove();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();

    console.log(searchValue);

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        const filterWords = allWords.filter((word) =>
          word.word.toLowerCase().includes(searchValue)
        )
        displayLevelWord(filterWords);
    })
});