const API_KEY = `f1f0ed4ab64dfa44aa85635c900b3884`; // Fill this in with your own API key from https://scripture.api.bible/
/**
 * Fills in list on page with books from selected version of the Bible (version specified in query params).
 * @returns {object} containing list of books of the Bible
 */
function loadBooks() {
  const bibleBookList = document.querySelector(`#book-list`);
  const bibleVersionID = "de4e12af7f28f599-02";
  let bookHTML = ``;

  if (!bibleVersionID) {
    window.location.href = `./index.html`;
  }

  return getBooks(bibleVersionID).then((bookList) => {
    for (let book of bookList) {
      bookHTML += `<li><a href="chapter.html?version=${bibleVersionID}&book=${book.id}"> ${book.name} </a></li>`;
    }
    bibleBookList.innerHTML = bookHTML;
    return bookList;
  });
}

/**
 * Gets books of the Bible from API.Bible
 * @param {string} bibleVersionID to get books from
 * @returns {Promise} containing list of books of the Bible
 */
function getBooks(bibleVersionID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function () {
      if (this.readyState === this.DONE) {
        const response = JSON.parse(this.responseText);
        books = response.data.map(({ name, id }) => {
          return { name, id };
        });

        resolve(books);
      }
    });

    xhr.open(
      `GET`,
      `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/books`
    );
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}

/**
 * Fills in list on page with chapters from selected book of the Bible (version and book specified in query params).
 * @returns {object} containing list of chapters from selected book
 */
function loadChapters() {
  let bibleChapterList = document.querySelector(`#chapter-list`);
  const bibleVersionID = getParameterByName(`version`);
  const bibleBookID = getParameterByName(`book`);
  let chapterHTML = ``;

  if (!bibleVersionID || !bibleBookID) {
    window.location.href = `./index.html`;
  }

  return getChapters(bibleVersionID, bibleBookID).then((chapterList) => {
    for (let chapter of chapterList) {
      chapterHTML += `<li><a href="chapter-view.html?version=${bibleVersionID}&chapter=${chapter.id}"> Chapter ${chapter.number} </a></li>`;
    }
    bibleChapterList.innerHTML = chapterHTML;
    return chapterList;
  });
}

/**
 * Gets chapters from API.Bible
 * @param {string} bibleVersionID to get chapters from
 * @param {string} bibleBookID to get chapters from
 * @returns {Promise} containing list of chapters from selected book
 */
function getChapters(bibleVersionID, bibleBookID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function () {
      if (this.readyState === this.DONE) {
        const response = JSON.parse(this.responseText);
        chapters = response.data.map(({ number, id }) => {
          return { number, id };
        });

        resolve(chapters);
      }
    });

    xhr.open(
      `GET`,
      `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/books/${bibleBookID}/chapters`
    );
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}

/**
 * Trying to use getSelectedVerse to print whole chapters
 */
function loadSelectedChapter() {
  let bibleChapterList = document.querySelector(`#current-chapter`);
  const bibleVersionID = getParameterByName(`version`);
  const bibleChapterID = getParameterByName(`chapter`);

  if (!bibleVersionID || !bibleChapterID) {
    window.location.href = `./index.html`;
  }

  return getSelectedChapter(bibleVersionID, bibleChapterID).then(
    ({ bibleId, bookId, content }) => {
      getBookNameFromID(bibleId, bookId).then((book) => {
        bibleChapterList.innerHTML = `<span><i>${book} ${bibleChapterID.slice(
          4
        )}</i></span> ${content}`;
      });
      return content;
    }
  );
}

function getSelectedChapter(bibleVersionID, bibleChapterID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function () {
      if (this.readyState === this.DONE) {
        const { content, bookId, bibleId } = JSON.parse(this.responseText).data;
        const verse = { content, bookId, bibleId };

        resolve(verse);
      }
    });

    xhr.open(
      `GET`,
      `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/chapters/${bibleChapterID}?include-chapter-numbers=true&include-verse-spans=true`
    );
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}

/**
 * Fills in list on page with verses from selected chapter (version and chapter specified in query params).
 * @returns {object} containing list of verses from selected book
 */
// function loadVerses() {
//   const bibleVerseList = document.querySelector(`#verse-list`);
//   const bibleVersionID = getParameterByName(`version`);
//   const bibleChapterID = getParameterByName(`chapter`);
//   let verseHTML = ``;

//   if (!bibleVersionID || !bibleChapterID) {
//     window.location.href = `./index.html`;
//   }

//   return getVerses(bibleVersionID, bibleChapterID).then((verseList) => {
//     for (let verse of verseList) {
//       verseHTML += `<li><a href="verse-selected.html?version=${bibleVersionID}&verse=${verse.id}"> ${verse.id} </a></li>`;
//     }
//     bibleVerseList.innerHTML = verseHTML;
//     return verseList;
//   });
// }

/**
 * Gets verses from API.Bible
 * @param {string} bibleVersionID to get verses from
 * @param {string} bibleChapterID to get verses from
 * @returns {Promise} containing list of verses from selected book
 */
// function getVerses(bibleVersionID, bibleChapterID) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.withCredentials = false;

//     xhr.addEventListener(`readystatechange`, function () {
//       if (this.readyState === this.DONE) {
//         const response = JSON.parse(this.responseText);
//         verses = response.data.map(({ id }) => {
//           return { id };
//         });

//         resolve(verses);
//       }
//     });

//     xhr.open(
//       `GET`,
//       `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/chapters/${bibleChapterID}/verses`
//     );
//     xhr.setRequestHeader(`api-key`, API_KEY);

//     xhr.onerror = () => reject(xhr.statusText);

//     xhr.send();
//   });
// }

/**
 * Fills in the selected verse (version and verse specified in query params).
 * @returns {Object} containing selected verse
 */
// function loadSelectedVerse() {
//   let bibleVerseList = document.querySelector(`#verse`);
//   const bibleVersionID = getParameterByName(`version`);
//   const bibleVerseID = getParameterByName(`verse`);

//   if (!bibleVersionID || !bibleVerseID) {
//     window.location.href = `./index.html`;
//   }

//   return getSelectedVerse(bibleVersionID, bibleVerseID).then(
//     ({ bibleId, bookId, content }) => {
//       getBookNameFromID(bibleId, bookId).then((book) => {
//         bibleVerseList.innerHTML = `<span><i>${book} ${bibleVerseID.slice(
//           4
//         )}</i></span> ${content}`;
//       });
//       return content;
//     }
//   );
// }

/**
 * Gets selected verse from API.Bible
 * @param {string} bibleVersionID to get verse from
 * @param {string} bibleVerseID of selected verse
 * @returns {Promise} containing selected verse
 */
// function getSelectedVerse(bibleVersionID, bibleVerseID) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.withCredentials = false;

//     xhr.addEventListener(`readystatechange`, function () {
//       if (this.readyState === this.DONE) {
//         const { content, bookId, bibleId } = JSON.parse(this.responseText).data;
//         const verse = { content, bookId, bibleId };

//         resolve(verse);
//       }
//     });

//     xhr.open(
//       `GET`,
//       `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/verses/${bibleVerseID}?include-chapter-numbers=false&include-verse-numbers=false`
//     );
//     xhr.setRequestHeader(`api-key`, API_KEY);

//     xhr.onerror = () => reject(xhr.statusText);

//     xhr.send();
//   });
// }

function getBookNameFromID(bibleVersionID, bibleBookID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function () {
      if (this.readyState === this.DONE) {
        const { name } = JSON.parse(this.responseText).data;
        resolve(name);
      }
    });

    xhr.open(
      `GET`,
      `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/books/${bibleBookID}`
    );
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}

/**
 * Gets query parameter from URL based on name
 * @param {string} name of query parameter
 * @returns {string} value of query parameter
 */
function getParameterByName(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, `\\$&`);
  const regex = new RegExp(`[?&]` + name + `(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return ``;
  return decodeURIComponent(results[2].replace(/\+/g, ` `));
}

function loadLessons() {
  // use python to load mysql in webpage
}

var infobox, map;
function GetMap() {
  map = new Microsoft.Maps.Map("#myMap", {
    credentials:
      "AqoDTfGAoEJlx1R_J5UK1Q-uigiRfDIpgTBOkck0eQBCpVwtKXPP06lrzhqOIuAv"
  });

  //Create an infobox at the center of the map but don't show it.
  infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
    visible: false
  });

  //Assign the infobox to a map instance.
  infobox.setMap(map);

  //Load the directions module.
  Microsoft.Maps.loadModule("Microsoft.Maps.Directions", function () {
    //Create an instance of the directions manager.
    directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

    //Specify the where to display the input panel
    directionsManager.showInputPanel("directionsPanel");

    //Specify where to display the route instructions.
    directionsManager.setRenderOptions({
      itineraryContainer: "#directionsItinerary"
    });

    navigator.geolocation.getCurrentPosition(function (position) {
      var loc = new Microsoft.Maps.Location(
        position.coords.latitude,
        position.coords.longitude
      );
      var you_are_here = new Microsoft.Maps.Location(
        position.coords.latitude,
        position.coords.longitude
      );

      var curr = new Microsoft.Maps.Directions.Waypoint({
        address: "You Are Here",
        location: you_are_here
      });

      var ex = new Microsoft.Maps.Directions.Waypoint({
        // address: "Portland, OR"
        address: "Closest Congregation",
        location: findClosestChurch(you_are_here)
      });
      directionsManager.addWaypoint(curr);
      directionsManager.addWaypoint(ex);
    });
    //Calculate directions.
    directionsManager.calculateDirections();
  });

  var peoria = new Microsoft.Maps.Location(40.699075, -89.58083);
  var detroit = new Microsoft.Maps.Location(42.41088, -83.11216);
  var milwaukee = new Microsoft.Maps.Location(43.054649, -87.960159);
  var chicago = new Microsoft.Maps.Location(41.75898, -87.56324);
  var dc = new Microsoft.Maps.Location(38.947259, -76.93771);
  var oakland = new Microsoft.Maps.Location(37.732315, -122.200064);
  var raleigh = new Microsoft.Maps.Location(35.855731, -78.823739);
  var las_vegas = new Microsoft.Maps.Location(36.1883306, -115.15384);
  var toronto = new Microsoft.Maps.Location(43.690208, -79.623605);
  var new_york = new Microsoft.Maps.Location(40.66753001, -73.794864);
  var jacksonville = new Microsoft.Maps.Location(30.2484882, -81.6008182);
  var cinncinnati = new Microsoft.Maps.Location(39.11095498, -84.52813498);
  var philly = new Microsoft.Maps.Location(39.8651711912265, -75.3178700630582);
  var atlanta = new Microsoft.Maps.Location(33.617073, -84.449819);
  var indianapolis = new Microsoft.Maps.Location(39.8024302, -86.0456019);
  var los_angeles = new Microsoft.Maps.Location(33.7383755, -118.308643);
  var gary = new Microsoft.Maps.Location(41.573492241668, -87.4240377176051);
  var atl_iog = new Microsoft.Maps.Location(33.75905302, -84.19029);
  var baltimore = new Microsoft.Maps.Location(39.3406363, -76.75667);
  var baton_rouge = new Microsoft.Maps.Location(30.4657749, -91.111968);
  var birmingham = new Microsoft.Maps.Location(33.647357, -86.678301);
  var buffalo = new Microsoft.Maps.Location(42.9082798, -78.8255322);
  var dallas = new Microsoft.Maps.Location(32.7201437, -96.6740652);
  var houston = new Microsoft.Maps.Location(29.862495, -95.3004556);
  var jackson = new Microsoft.Maps.Location(32.3734994, -90.15120938);
  var kalamazoo = new Microsoft.Maps.Location(42.3294085, -85.59147897);
  var memphis = new Microsoft.Maps.Location(35.026483, -90.02529828);
  var minneapolis = new Microsoft.Maps.Location(44.94960576, -93.24751892);
  var montgomery = new Microsoft.Maps.Location(32.3670947, -86.2562915);
  var orlando = new Microsoft.Maps.Location(28.5525201, -81.4323945);
  var stlouis = new Microsoft.Maps.Location(38.6836757, -90.332019163);
  var zimbabwe = new Microsoft.Maps.Location(-17.8572199, 31.37913);
  var alaska = new Microsoft.Maps.Location(61.18050202, -149.82867199);
  var auburn_hills = new Microsoft.Maps.Location(42.65896, -83.2418099);
  var uk = new Microsoft.Maps.Location(52.521599993352595, -1.8386199985810663);
  var clevland = new Microsoft.Maps.Location(41.4675062, -81.7302428666667);
  var new_jersey = new Microsoft.Maps.Location(40.56187, -74.3257299);
  var kansas_city = new Microsoft.Maps.Location(39.04576, -94.584932);
  var phoenix = new Microsoft.Maps.Location(33.4836704, -112.197755);
  var la_iog = new Microsoft.Maps.Location(34.114154895, -117.37286377);
  var sikeston = new Microsoft.Maps.Location(36.88706998, -89.54877998);
  var riverdale = new Microsoft.Maps.Location(41.6444597, -87.63381551);
  var zion = new Microsoft.Maps.Location(42.449598, -87.815612);

  //Create custom Pushpin
  var pin0 = new Microsoft.Maps.Pushpin(peoria, {
    color: "rgb(60,0,128)"
  });
  pin0.metadata = {
    place: "Peoria",
    title: "Peoria HOJ: 919 NE Jefferson Ave, Peoria, IL 61603",
    description:
      "Service starts at 1pm CST, call 309-989-2772 for additional details"
  };
  var pin1 = new Microsoft.Maps.Pushpin(detroit, {
    color: "rgb(60, 0, 128)"
  });
  var pin2 = new Microsoft.Maps.Pushpin(chicago, {
    color: "rgb(60, 0, 128)"
  });
  var pin3 = new Microsoft.Maps.Pushpin(milwaukee, {
    color: "rgb(60, 0, 128)"
  });
  var pin4 = new Microsoft.Maps.Pushpin(las_vegas, {
    color: "#076aac"
  });
  var pin5 = new Microsoft.Maps.Pushpin(raleigh, {
    color: "#076aac"
  });
  var pin6 = new Microsoft.Maps.Pushpin(dc, {
    color: "#076aac"
  });
  var pin7 = new Microsoft.Maps.Pushpin(oakland, {
    color: "#076aac"
  });
  var pin8 = new Microsoft.Maps.Pushpin(toronto, {
    color: "#076aac"
  });
  var pin9 = new Microsoft.Maps.Pushpin(new_york, {
    color: "#076aac"
  });
  var pin10 = new Microsoft.Maps.Pushpin(jacksonville, {
    color: "#076aac"
  });
  var pin11 = new Microsoft.Maps.Pushpin(cinncinnati, {
    color: "#076aac"
  });
  var pin12 = new Microsoft.Maps.Pushpin(philly, {
    color: "#076aac"
  });
  var pin13 = new Microsoft.Maps.Pushpin(atlanta, {
    color: "#076aac"
  });
  var pin14 = new Microsoft.Maps.Pushpin(indianapolis, {
    color: "#076aac"
  });
  var pin15 = new Microsoft.Maps.Pushpin(los_angeles, {
    color: "#076aac"
  });
  var pin16 = new Microsoft.Maps.Pushpin(gary, {
    color: "#076aac"
  });
  var pin17 = new Microsoft.Maps.Pushpin(atl_iog, {
    color: "rgb(18, 20, 119)"
  });
  var pin18 = new Microsoft.Maps.Pushpin(baltimore, {
    color: "rgb(18, 20, 119)"
  });
  var pin19 = new Microsoft.Maps.Pushpin(baton_rouge, {
    color: "rgb(18, 20, 119)"
  });
  var pin20 = new Microsoft.Maps.Pushpin(birmingham, {
    color: "rgb(18, 20, 119)"
  });
  var pin21 = new Microsoft.Maps.Pushpin(buffalo, {
    color: "rgb(18, 20, 119)"
  });
  var pin22 = new Microsoft.Maps.Pushpin(dallas, {
    color: "rgb(18, 20, 119)"
  });
  var pin23 = new Microsoft.Maps.Pushpin(houston, {
    color: "rgb(18, 20, 119)"
  });
  var pin24 = new Microsoft.Maps.Pushpin(jackson, {
    color: "rgb(18, 20, 119)"
  });
  var pin25 = new Microsoft.Maps.Pushpin(kalamazoo, {
    color: "rgb(18, 20, 119)"
  });
  var pin26 = new Microsoft.Maps.Pushpin(memphis, {
    color: "rgb(18, 20, 119)"
  });
  var pin27 = new Microsoft.Maps.Pushpin(minneapolis, {
    color: "rgb(18, 20, 119)"
  });
  var pin28 = new Microsoft.Maps.Pushpin(montgomery, {
    color: "rgb(18, 20, 119)"
  });
  var pin29 = new Microsoft.Maps.Pushpin(orlando, {
    color: "rgb(18, 20, 119)"
  });
  var pin30 = new Microsoft.Maps.Pushpin(zimbabwe, {
    color: "rgb(18, 20, 119)"
  });
  var pin31 = new Microsoft.Maps.Pushpin(alaska, {
    color: "rgb(18, 20, 119)"
  });
  var pin32 = new Microsoft.Maps.Pushpin(stlouis, {
    color: "rgb(18, 20, 119)"
  });
  var pin33 = new Microsoft.Maps.Pushpin(auburn_hills, {
    color: "rgb(18, 20, 119)"
  });
  var pin34 = new Microsoft.Maps.Pushpin(uk, {
    color: "rgb(18, 20, 119)"
  });
  var pin35 = new Microsoft.Maps.Pushpin(clevland, {
    color: "rgb(18, 20, 119)"
  });
  var pin36 = new Microsoft.Maps.Pushpin(new_jersey, {
    color: "rgb(18, 20, 119)"
  });
  var pin37 = new Microsoft.Maps.Pushpin(kansas_city, {
    color: "rgb(18, 20, 119)"
  });
  var pin38 = new Microsoft.Maps.Pushpin(phoenix, {
    color: "rgb(18, 20, 119)"
  });
  var pin39 = new Microsoft.Maps.Pushpin(sikeston, {
    color: "rgb(18, 20, 119)"
  });
  var pin40 = new Microsoft.Maps.Pushpin(la_iog, {
    color: "rgb(18, 20, 119)"
  });
  var pin41 = new Microsoft.Maps.Pushpin(riverdale, {
    color: "rgb(18, 20, 119)"
  });
  var pin42 = new Microsoft.Maps.Pushpin(zion, {
    color: "#66CC00"
  });

  //Add click event to pushpins
  Microsoft.Maps.Events.addHandler(pin0, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin1, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin2, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin3, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin4, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin5, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin6, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin7, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin8, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin9, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin10, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin11, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin12, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin13, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin14, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin15, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin16, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin17, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin18, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin19, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin20, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin21, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin22, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin23, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin24, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin25, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin26, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin27, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin28, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin29, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin30, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin31, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin32, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin33, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin34, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin35, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin36, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin37, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin38, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin39, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin40, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin41, "click", pushpinClicked);
  Microsoft.Maps.Events.addHandler(pin42, "click", pushpinClicked);

  //Add the pushpins to the map
  map.entities.push(pin0);
  map.entities.push(pin1);
  map.entities.push(pin2);
  map.entities.push(pin3);
  map.entities.push(pin4);
  map.entities.push(pin5);
  map.entities.push(pin6);
  map.entities.push(pin7);
  map.entities.push(pin8);
  map.entities.push(pin9);
  map.entities.push(pin10);
  map.entities.push(pin11);
  map.entities.push(pin12);
  map.entities.push(pin13);
  map.entities.push(pin14);
  map.entities.push(pin15);
  map.entities.push(pin16);
  map.entities.push(pin17);
  map.entities.push(pin18);
  map.entities.push(pin19);
  map.entities.push(pin20);
  map.entities.push(pin21);
  map.entities.push(pin22);
  map.entities.push(pin23);
  map.entities.push(pin24);
  map.entities.push(pin25);
  map.entities.push(pin26);
  map.entities.push(pin27);
  map.entities.push(pin28);
  map.entities.push(pin29);
  map.entities.push(pin30);
  map.entities.push(pin31);
  map.entities.push(pin32);
  map.entities.push(pin33);
  map.entities.push(pin34);
  map.entities.push(pin35);
  map.entities.push(pin36);
  map.entities.push(pin37);
  map.entities.push(pin38);
  map.entities.push(pin39);
  map.entities.push(pin40);
  map.entities.push(pin41);
  map.entities.push(pin42);
}

function pushpinClicked(e) {
  //Make sure the infobox has metadata to display.
  if (e.target.metadata) {
    //Set the infobox options with the metadata of the pushpin.
    infobox.setOptions({
      location: e.target.getLocation(),
      title: e.target.metadata.title,
      description: e.target.metadata.description,
      visible: true
    });
  }
}

function findClosestChurch(currentLoation) {
  var i = 0,
    entity,
    closestLocation,
    smallestDistance;
  smallestDistance = Number.POSITIVE_INFINITY;
  while (i < map.entities.getLength()) {
    entity = map.entities.get(i);
    var distance = Math.acos(
      Math.sin((Math.PI * [entity.geometry.y]) / 180.0) *
        Math.sin((Math.PI * [currentLoation.latitude]) / 180.0) +
        Math.cos((Math.PI * [entity.geometry.y]) / 180.0) *
          Math.cos((Math.PI * [currentLoation.latitude]) / 180.0) *
          Math.cos(
            (Math.PI * [entity.geometry.x]) / 180.0 -
              (Math.PI * [currentLoation.longitude]) / 180.0
          )
    );
    var units = directionsManager.getRequestOptions().distanceUnit;
    if (units == Microsoft.Maps.Directions.DistanceUnit.km) {
      distance = distance * 6378;
    } else {
      distance = distance * 3963;
    }
    console.log(entity.metadata.place + ": " + distance);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestLocation = entity;
    }
    i += 1;
  }
  return closestLocation;
}
