/* 
  content.js is the script executed against the active tab.

  This happens when background.js calls chrome.scripting.executeScript()
  passing this file as the reference.

  TODO: see if we can use function injection from background.js and
  whether that changes the observed behavior of the MSWord specific
  get HTML via <span class="Selected"> stuff below.

*/

import { clipHTML } from "./clip";

(() => {
  // add a listener here for eventual use by some Google Doc and Word plugin
  // which is getting complicated...

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.action == "clip2tana") {
      console.log("Got action message");
      clipHTML(message.selection);
    }
    return true;
  });

  const getSelectedHTML = () => {
    let html = "";
    if (typeof window.getSelection != "undefined") {
      const sel = window.getSelection();
      if (sel.rangeCount) {
        const container = document.createElement("div");
        for (let i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      } else {
        console.log(
          "No apparent selection - attempting MSOffice class selection"
        );

        // TODO: this doesn't actually work unless you do it in the java
        // debug console. Why?
        // See open question https://stackoverflow.com/questions/75378711/how-to-get-selected-text-in-office365-word-document-from-within-a-chrome-extensi
        const selection = document.getElementsByClassName("Selected");
        console.log(selection);
        const container = document.createElement("div");
        for (const node of selection) {
          container.appendChild(node.cloneContents());
        }
        html = container.innerHTML;
      }
    } else if (
      typeof document.selection != "undefined" &&
      document.selection.type == "Text"
    ) {
      html = document.selection.createRange().htmlText;
    }
    return html;
  };

  // actually do the work
  let html = getSelectedHTML();

  clipHTML(html);
})();
