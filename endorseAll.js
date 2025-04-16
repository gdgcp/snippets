// Click all visible "Endorse" buttons on the page at once

const endorseBtnSelector = 'button.artdeco-button .artdeco-button__text';
const buttons = Array.from(document.querySelectorAll(endorseBtnSelector))
  .filter(btn => btn.innerText === "Endorse");

console.log(`Found ${buttons.length} "Endorse" buttons. Clicking all...`);

buttons.forEach(btn => {
  // Click the parent button, not just the text span
  const parentButton = btn.closest('button.artdeco-button');
  if (parentButton) {
    parentButton.click();
  }
});

console.log("All visible 'Endorse' buttons have been clicked.");
