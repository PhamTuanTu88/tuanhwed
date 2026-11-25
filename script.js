const fieldElements = document.querySelectorAll("[data-field]");
for (const element of fieldElements) {
  element.textContent = wedding[element.dataset.field] || "";
}
document.title = `Thiệp cưới | ${wedding.groom} & ${wedding.bride}`;

const countdown = document.querySelector("#countdown");
const weddingDate = new Date(wedding.dateTime);
const countdownDate = new Date(wedding.countdownDateTime || wedding.dateTime);
const hasValidWeddingDate = Number.isFinite(weddingDate.getTime());
const hasValidCountdownDate = Number.isFinite(countdownDate.getTime());
const hasEventTime = hasValidWeddingDate && /T\d{2}:\d{2}/.test(wedding.dateTime);
const eventDateOptions = hasEventTime
  ? { dateStyle: "full", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }
  : { dateStyle: "full", timeZone: "Asia/Ho_Chi_Minh" };
const fallbackEventDate = hasValidWeddingDate
  ? new Intl.DateTimeFormat("vi-VN", eventDateOptions).format(weddingDate)
  : "";
const displayedEventDate = wedding.eventDateText || fallbackEventDate;
document.querySelector("#interior-hero-date").textContent = displayedEventDate;
document.querySelector("#story-date").textContent = displayedEventDate;
document.querySelector("#ceremony-weekday").textContent = wedding.displayWeekday || "";
const displayMonthNumber = wedding.displayMonth?.match(/\d{1,2}/)?.[0];
document.querySelector("#ceremony-date").textContent =
  wedding.displayDay && displayMonthNumber
    ? `${wedding.displayDay}.${displayMonthNumber}`
    : displayedEventDate;
document.querySelector("#schedule-time").textContent = wedding.scheduleTime || "";
document.querySelector("#schedule-weekday").textContent = wedding.scheduleWeekday || "";
document.querySelector("#schedule-date").textContent = wedding.scheduleDate || "";
document.querySelector("#schedule-lunar").textContent =
  wedding.scheduleLunarDate ? `(${wedding.scheduleLunarDate})` : "";

const familyAddresses = String(wedding.address || "").split(/\r?\n/);
document.querySelector("#groom-family-address").textContent =
  familyAddresses[0]?.replace(/^Nhà Trai\s*:\s*/i, "").trim() || "";
document.querySelector("#bride-family-address").textContent =
  familyAddresses[1]?.replace(/^Nhà Gái\s*:\s*/i, "").trim() || "";
document.querySelector("#schedule-address").textContent =
  familyAddresses[0]?.replace(/^Nhà Trai\s*:\s*/i, "").trim() || "";

countdown.hidden = !hasValidCountdownDate;
if (hasValidCountdownDate) {
  const countdownParts = Object.fromEntries(
    [...countdown.querySelectorAll("[data-countdown-part]")].map((element) => [
      element.dataset.countdownPart,
      element,
    ])
  );
  let countdownTimer;
  function updateCountdown() {
    const secondsLeft = Math.max(0, Math.floor((countdownDate.getTime() - Date.now()) / 1000));
    const parts = {
      days: Math.floor(secondsLeft / 86400),
      hours: Math.floor((secondsLeft % 86400) / 3600),
      minutes: Math.floor((secondsLeft % 3600) / 60),
      seconds: secondsLeft % 60,
    };
    for (const [part, value] of Object.entries(parts)) {
      countdownParts[part].textContent = part === "days" ? String(value) : String(value).padStart(2, "0");
    }
    if (secondsLeft === 0 && countdownTimer) clearInterval(countdownTimer);
  }
  updateCountdown();
  if (countdownDate.getTime() > Date.now()) {
    countdownTimer = setInterval(updateCountdown, 1000);
  }
}

function loadPhoto(image, path, onLoad) {
  if (!path) {
    image.hidden = true;
    image.parentElement.querySelector("figcaption").hidden = true;
    return;
  }
  image.hidden = true;
  image.addEventListener("load", () => {
    image.hidden = false;
    image.parentElement.querySelector("figcaption").hidden = true;
    onLoad?.();
  }, { once: true });
  image.src = path;
}
loadPhoto(document.querySelector("#couple-hero-image"), wedding.coupleHeroPhoto);
for (const image of document.querySelectorAll("[data-person-image]")) {
  const path = wedding[image.dataset.personImage];
  if (path) image.src = path;
}
loadPhoto(document.querySelector("#interior-cover-image"), wedding.cover);
loadPhoto(document.querySelector("#story-image"), wedding.storyPhoto);

const gallery = document.querySelector("#gallery");
const viewer = document.querySelector("#viewer");
const largeImage = document.querySelector("#large-image");
 wedding.gallery.forEach((path, index) => {
  const figure = document.createElement("figure");
  figure.className = "photo";
  const image = document.createElement("img");
  image.alt = `Ảnh cưới ${index + 1}`;
  const caption = document.createElement("figcaption");
  caption.textContent = image.alt;
  figure.append(image, caption);
  gallery.append(figure);

  loadPhoto(image, path, () => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Phóng to ${image.alt.toLowerCase()}`);
    button.addEventListener("click", () => {
      largeImage.src = path;
      largeImage.alt = image.alt;
      viewer.showModal();
    });
    figure.append(button);
  });
});
document.querySelector("#close-viewer").addEventListener("click", () => viewer.close());

for (const button of document.querySelectorAll("[data-qr-field]")) {
  const path = wedding[button.dataset.qrField];
  if (!path) {
    button.hidden = true;
    continue;
  }
  button.addEventListener("click", () => {
    largeImage.src = path;
    largeImage.alt = button.dataset.qrLabel;
    viewer.showModal();
  });
}

const rsvpForm = document.querySelector("#rsvp-form");
const rsvpResponses = document.querySelector("#rsvp-responses");
rsvpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(rsvpForm);
  const nameInput = rsvpForm.elements.namedItem("name");
  const name = String(formData.get("name") || "").trim();
  const attendance = formData.get("attendance");
  const wish = String(formData.get("wish") || "").trim();
  if (!name) {
    nameInput.value = "";
    nameInput.reportValidity();
    return;
  }
  if (attendance !== "yes" && attendance !== "no") {
    rsvpForm.reportValidity();
    return;
  }

  const response = document.createElement("article");
  response.className = "rsvp-response";
  const guestName = document.createElement("h3");
  guestName.textContent = name;
  const participation = document.createElement("p");
  participation.className = "rsvp-response-attendance";
  participation.textContent = attendance === "yes"
    ? "Sẽ tham dự"
    : "Không thể tham dự";
  response.append(guestName, participation);
  if (wish) {
    const greeting = document.createElement("p");
    greeting.className = "rsvp-response-wish";
    greeting.textContent = wish;
    response.append(greeting);
  }
  rsvpResponses.prepend(response);
  observeRevealTargets([response]);
  rsvpForm.reset();
});

const music = document.querySelector("#music");
const musicToggle = document.querySelector("#music-toggle");
const musicStatus = document.querySelector("#music-status");
musicToggle.hidden = !wedding.music;
const openedFromFile = window.location.protocol === "file:";
if (wedding.music && !openedFromFile) music.src = wedding.music;
music.volume = 0.55;
music.addEventListener("play", () => musicToggle.setAttribute("aria-pressed", "true"));
music.addEventListener("pause", () => musicToggle.setAttribute("aria-pressed", "false"));
if (wedding.music && openedFromFile) {
  musicStatus.textContent = "Hãy mở thiệp bằng Live Server để phát nhạc.";
  musicStatus.hidden = false;
} else if (wedding.music) {
  music.play().catch((error) => {
    musicStatus.textContent = error.name === "NotAllowedError"
      ? "Trình duyệt đã chặn tự phát nhạc. Hãy bấm nút Nhạc cưới để phát."
      : "Trình duyệt không mở được tệp nhạc. Hãy kiểm tra assets/music/le-duong.mp3.";
    musicStatus.hidden = false;
  });
}
musicToggle.addEventListener("click", async () => {
  musicStatus.hidden = true;
  if (openedFromFile) {
    musicStatus.textContent = "Hãy mở thiệp bằng Live Server để phát nhạc.";
    musicStatus.hidden = false;
    return;
  }
  if (!music.paused) {
    music.pause();
    return;
  }
  try {
    await music.play();
  } catch (error) {
    musicStatus.textContent = error.name === "NotAllowedError"
      ? "Trình duyệt chưa cho phát nhạc. Hãy thử bấm lại nút Nhạc cưới."
      : "Trình duyệt không mở được tệp nhạc. Hãy kiểm tra assets/music/le-duong.mp3.";
    musicStatus.hidden = false;
  }
});

let revealIndex = 0;
const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 })
  : null;

function observeRevealTargets(elements) {
  if (!revealObserver) return;
  for (const element of elements) {
    element.classList.add("reveal", revealIndex % 2 === 0 ? "reveal--left" : "reveal--right");
    revealIndex += 1;
    revealObserver.observe(element);
  }
}
observeRevealTargets(document.querySelectorAll(
  "main h1, main h2, main h3, main p, main img, main .countdown-unit, " +
  "main .rsvp-field, main .rsvp-attendance, main .rsvp-form > .button, " +
  "main .gift-box, footer > *"
));
