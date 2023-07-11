export function clipTitle() {
  // this seems to help avoid "DOMException: not focused" errors from time to time
  // ref: Stackoverflow
  window.focus();
  // grab the basic info from the page
  const { title } = document;
  // const url = window.location.href;
  // let description = "";

  // basic format of a tana-paste entry
  return { name: title, children: [] };
}


