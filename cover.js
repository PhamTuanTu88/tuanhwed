for (const element of document.querySelectorAll("[data-field]")) {
  element.textContent = wedding[element.dataset.field] || "";
}
document.title = `Thiệp cưới | ${wedding.groom} & ${wedding.bride}`;
