const endorseText = 'Endorse';   // Change for your language if needed
const endorsedText = 'Endorsed'; // Change for your language if needed
const scrollDelay = 1200;        // ms to wait after scrolling for new content to load
const clickDelay = 300;          // ms between clicking batches
const endorseCheckTimeout = 8000;// ms max to wait for endorsements to register

function getAllEndorseButtons() {
  // Select all buttons, filter those with visible text "Endorse"
  return Array.from(document.querySelectorAll('button'))
    .filter(btn =>
      btn.innerText.trim() === endorseText &&
      !btn.disabled &&
      btn.offsetParent !== null // visible
    );
}

async function clickAllEndorseButtons() {
  const buttons = getAllEndorseButtons();
  console.log(`Found ${buttons.length} "Endorse" buttons. Clicking all...`);

  for (const btn of buttons) {
    btn.click();
    await new Promise(res => setTimeout(res, clickDelay));
  }
  return buttons;
}

function isButtonEndorsed(btn) {
  // Button is considered "endorsed" if text changed, or button is gone/hidden
  return (
    !document.body.contains(btn) ||
    btn.innerText.trim() === endorsedText ||
    btn.offsetParent === null
  );
}

async function waitForEndorsements(buttons) {
  const start = Date.now();
  while (true) {
    const allEndorsed = buttons.every(isButtonEndorsed);
    if (allEndorsed) break;
    if (Date.now() - start > endorseCheckTimeout) {
      console.warn("Timeout waiting for all endorsements to register.");
      break;
    }
    await new Promise(res => setTimeout(res, 200));
  }
}

async function scrollToBottom() {
  return new Promise(resolve => {
    const distance = 2000;
    const totalHeight = document.body.scrollHeight;
    let scrolled = window.scrollY;

    function scrollStep() {
      if (scrolled + window.innerHeight < totalHeight) {
        window.scrollBy(0, distance);
        scrolled += distance;
        setTimeout(scrollStep, 200);
      } else {
        resolve();
      }
    }
    scrollStep();
  });
}

async function autoEndorseLoop() {
  let prevEndorseCount = 0;
  let round = 1;
  while (true) {
    console.log(`--- Round ${round} ---`);
    const buttons = await clickAllEndorseButtons();
    if (buttons.length === 0 && prevEndorseCount === 0) {
      console.log("No more 'Endorse' buttons found. Done!");
      break;
    }
    prevEndorseCount = buttons.length;

    await waitForEndorsements(buttons);

    const prevScroll = window.scrollY;
    await scrollToBottom();
    await new Promise(res => setTimeout(res, scrollDelay));

    // If page didn't scroll further and no new buttons found, exit
    if (window.scrollY === prevScroll) {
      const newButtons = getAllEndorseButtons();
      if (newButtons.length === 0) {
        console.log("Reached bottom and no new 'Endorse' buttons. Finished!");
        break;
      }
    }
    round++;
  }
}

autoEndorseLoop();
