// Load the Lesson Levels
const loadLesson = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((dt) => {
      const datas = dt.data;
      const container = document.getElementById("Lesson-container");
      for (data of datas) {
        const li = document.createElement("li");
        li.innerHTML = `<li>
            <button id="LessonBtn-${data.level_no}" onClick="LoadLessonLevel(${data.level_no})" class="lev-btn font-bold btn btn-outline btn-primary">
              <i class="fa-solid fa-book-open"></i> Lesson-${data.level_no}
            </button>
          </li>`;
        container.appendChild(li);
      }
    });
};
loadLesson();
// Words By level
const LoadLessonLevel = async (id) => {
  LoadSpinner(true);
  const btns = document.getElementsByClassName("lev-btn");
  for (btn of btns) {
    btn.classList.add("btn-outline");
  }
  document.getElementById(`LessonBtn-${id}`).classList.remove("btn-outline");
  const container = document.getElementById("cards-list");
  const headingContainer = document.getElementById("lesson-heading-Container");
  container.innerHTML = "";
  headingContainer.innerHTML = "";
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  const res = await fetch(url);
  const dt = await res.json();
  if (dt.data.length === 0) {
    headingContainer.innerHTML = `
    <img id="errormsg" class="pt-10 w-[100px] mx-auto" src="./assets/alert-error.png" alt="Error PNG">      
    <p id="noSelect" class="pt-4 bangla text-[#79716B] text-sm mb-4">
            এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </p>
          <h1 id="plzSelect" class="pb-10 bangla text-4xl">
            নেক্সট Lesson এ যান।
          </h1>`;
    LoadSpinner(false);
    return;
  }
  for (data of dt.data) {
    const li = document.createElement("li");
    li.innerHTML = `<li
            class="border-1 border-gray-400 rounded-xl md:flex justify-center items-center flex-wrap gap-4 my-2"
          >
            <div class="p-5">
              <h2 class="Poppins font-bold text-xl mb-5">${
                data.word ? data.word : `<span class="text-red-400">No word found</span>`
              }</h2>
              <p class="Poppins font-semibold text-lg mb-5">
                Meaning/Pronunciation
              </p>
              <h1 class="bangla font-bold text-xl text-[#18181B]">
                "${data.meaning ? data.meaning : `<span class="text-red-400">No meaning found</span>`} / ${
      data.pronunciation ? data.pronunciation : `<span class="text-red-400">No Pronunciation Found</span>`
    }"
              </h1>
              <div class="flex justify-between text-[#374957]">
                <button
                class="bg-[#1A91FF10] hover:bg-slate-300 p-2"
                  onclick="showWords(${data.id})"
                  type="button"
                  aria-label="More info about Eager"
                  title="Info"
                >
                  <i class="fa-solid fa-circle-info"></i>
                </button>
                <button
                onclick="pronounceWord('${data.word}')"
                class="bg-[#1A91FF10] hover:bg-slate-300 p-2"
                  type="button"
                  aria-label="Play pronunciation for Eager"
                  title="Play"
                >
                  <i class="fa-solid fa-volume-high"></i>
                </button>
              </div>
            </div>
          </li>`;
    container.appendChild(li);
    LoadSpinner(false);
  }
};
// Load Spinner
const LoadSpinner = (flag) => {
  if (flag) {
    document.getElementById("Spinner").classList.remove("hidden");
    document.getElementById("LessonSECid").classList.add("hidden");
  } else {
    document.getElementById("Spinner").classList.add("hidden");
    document.getElementById("LessonSECid").classList.remove("hidden");
  }
};
// Load Words Details
const showWords = async (id) => {
  const con = document.getElementById("detailcontainer");
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const r = await fetch(url);
  const dt = await r.json();
  const data = dt.data;
  con.innerHTML = `<h1 class="poppins font-semibold md:text-4xl text-3xl">
            ${data.word}(<i onclick="pronounceWord('${
    data.word
  }')" class="fa-solid fa-microphone-lines hover:bg-slate-200 py-2"></i>:
            <span class="bangla">${data.pronunciation}</span> )
          </h1>
          <div class="my-6 md:my-8">
            <h2 class="font-semibold text-xl md:text-2xl poppins mb-3">
              Meaning
            </h2>
            <p class="bangla font-medium text-xl md:text-2xl">${
              data.meaning ? data.meaning : `<span class="text-red-400">No meaning found</span>`
            }</p>
          </div>
          <div class="mb-8">
            <h2 class="font-semibold text-xl md:text-2xl poppins mb-3">
              Example
            </h2>
            <p class="font-normal text-base md:text-lg poppins">
              ${data.sentence}
            </p>
          </div>
          <div class="">
            <h1 class="bangla text-xl md:text-2xl font-semibold mb-4">
              সমার্থক শব্দ গুলো
            </h1>
            <div class="gap-3 grid grid-cols-2 md:grid-cols-3">
            ${
              data.synonyms.length > 0
                ? data.synonyms
                    .map(
                      (x) =>
                        `<p class="bg-[#D7E4EF] px-3 py-1 rounded-md border-1 border-gray-300 poppins text-center overflow-auto">
            ${x}
          </p>`
                    )
                    .join("")
                : `<p class="bg-[#f89090] w-[300px] px-8 py-1 rounded-md border-1 border-gray-300 poppins text-center">No Synonyms Found</p>`
            }
            </div>
          </div>`;
  document.getElementById("Word_info").showModal();
};
// document.getElementById("Word_info").showModal();
const hideElementByID = (id) => {
  document.getElementById(id).style.display = "none";
};
// Pronounce Words
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US"; // better code than en-EN

  // pick a specific voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    utterance.voice = voices.find((v) => v.lang.startsWith("en")) || voices[0];
  }

  window.speechSynthesis.speak(utterance);
}
// Scroll to FAQ section
const ScrollTotheSection = (id) => {
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",
  });
};
// Prevent Button's default behavior
document.getElementById("GetstartedBtn").addEventListener("click", (e) => {
  e.preventDefault();
});
