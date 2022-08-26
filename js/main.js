"use stict";

// timer

let aktualDate = new Date();

const clockParagraph = document.querySelector(".time");

const setTwoCharacters = (number) => {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
};

const setTime = () => {
  aktualDate = new Date();
  clockParagraph.textContent = `${setTwoCharacters(
    aktualDate.getHours()
  )}:${setTwoCharacters(aktualDate.getMinutes())}:${setTwoCharacters(
    aktualDate.getSeconds()
  )}`;
};

const timer = setInterval(setTime, 1000);

// ------------------------------------------------------------------------

const cardsAll = document.querySelectorAll(".card");
const cardsDownAll = document.querySelectorAll(".card__down");
const cardsUpAll = document.querySelectorAll(".card__up");
let isPairCounter = 0; // ezzel számoljuk, hogy ? pár van már meg
let imageSource = []; // a kiindulási kártyasorrend
let randomSource = []; // a megkevert kártyasorrend
let aktualIndex; // az aktuálisan kiválasztott kártya indexe
let firstIndex; // az először kiválasztott kártya indexe
let isFirst = true; //az először felfordított kártya felfordítva marad
let stepCounter = 0; //ezzel számoljuk, hogy az első, vagy a második kártyát fordítottuk föl
let isFirstGame = true; // ezzel figyeljük, hogy első játék-e, mert akkor rá kell
// adni a kártyákra az eseményfigyelőt, egyébként nem

//console.log(cardsUpAll[0].src);

// berakjuk egy tömbbe a képek elérési útvonalait, hogy majd keverni lehessen
const fillImageSource = () => {
  for (i = 0; i < cardsUpAll.length; i++) {
    imageSource[i] = cardsUpAll[i].src;
  }
};

//randomize
const randomizeArray = (arr) => {
  return arr.sort(() => Math.random() - 0.5);
};

/* console.log(imageSource); */

/* akkor keverjük meg a lapokat! */
const randomizeCards = () => {
  randomSource = randomizeArray(imageSource);
  imageSource.forEach(
    (element, index) => (cardsUpAll[index].src = randomSource[index])
  );
  /* console.log(imageSource); */
};

/* a felfordítás és visszafordulás a hide class rá- és levételével megy */
const changeClasslistHide = (removeList, addList) => {
  removeList.classList.remove("hide");
  addList.classList.add("hide");
};

/* felfordításnál mit csinálunk:
    rá kell adni az eseményfigyelőket a kártyákra
    a callback fgv-t muszály elnevezni, hogy majd az eseményfigyelőt le tudjuk szedni
    kattintásra a hide class csere + felfordítás animáció
    elágazás:
      lépésszám és pár-e vizsgálat
      ha nem, akkor visszafordítás
      ha igen, akkor marad felfordítva és a találatszám növelése    
*/

const turnUpFunction = (i) => {
  console.log("turnUpFunction starts");
  changeClasslistHide(cardsUpAll[i], cardsDownAll[i]);
  cardsUpAll[i].classList.add("flashUp");

  aktualIndex = i;
  stepCounter++;
  console.log("stepCounter: ", stepCounter);

  if ((stepCounter == 2) & !checkPair(firstIndex, aktualIndex)) {
    turnDown(aktualIndex);
    turnDown(firstIndex);
    stepCounter = 0;
  } else if ((stepCounter == 2) & checkPair(firstIndex, aktualIndex)) {
    stepCounter = 0;
    isPairCounter++;
  }

  //console.log(firstIndex, aktualIndex);
  firstIndex = aktualIndex;

  /* if (isPairCounter == 5) {
            endGame();
        } */
};

const turnUp = () => {
  cardsDownAll.forEach((element, index) => {
    element.addEventListener("click", turnUpFunction.bind(null, index));
    // így lehet a callback fgv-nek argumentuma anélkül, hogy lefutna az eseménytől függetlenül
    //console.log(element, index);
  });
  /*for (let i = 0; i < cardsAll.length; i++) {
    cardsDownAll[i].addEventListener("click", turnUpFunction(i));
  }*/
};

/* kártya visszafordítása */
const turnDown = (index) => {
  setTimeout(() => {
    changeClasslistHide(cardsDownAll[index], cardsUpAll[index]);
  }, 500);
  cardsUpAll[index].classList.remove("flashUp");
};

/* új játéknál nem lehet késlelteve, animációval visszafordítani, mert
  addigra újrakeverjük a kártyákat és egy pillanatra látszik az új sorrend */
const turnDownAll = (index) => {
  changeClasslistHide(cardsDownAll[index], cardsUpAll[index]);
  cardsUpAll[index].classList.remove("flashUp");
};

/* új játéknál lenullázzuk a változókat */
const setDefaultValues = () => {
  aktualIndex = 0;
  firstIndex = 0;
  isPairCounter = 0;
  isFirst = true;
  stepCounter = 0;
};

/* új játéknál minden kártyát le kell fordítani,
    az előző eseménykezelőt leszedni a kártyákról, lenullázni a változókat és indulhat */
const newGame = () => {
  document.querySelector(".button__newGame").addEventListener("click", () => {
    cardsUpAll.forEach((element, index) => turnDownAll(index));
    //cardsAll.forEach((element) => element.replaceWith(element.cloneNode(true)));
    // ez a cloneNode leklónozza a Node-ot, így leszedi róla az eseményfigyelőt
    //cardsAll.forEach((element) => element.removeEventListener("click", funct));
    setDefaultValues();
    startGame();
    isFirstGame = false;
  });
};

/* pár vizsgálat */
const checkPair = (index1, index2) => {
  if (imageSource[index1] == imageSource[index2]) {
    return true;
  } else {
    return false;
  }
};

/* hajrá */
const startGame = () => {
  fillImageSource();
  randomizeCards();
  fillImageSource();
  isFirstGame ? turnUp() : (isFirstGame = false);
  /* console.log(imageSource); */
};

newGame();
