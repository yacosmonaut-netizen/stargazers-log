const list = document.querySelector("#starred");
const status = document.querySelector("#status");

function setStatus(message, type = "") {
  status.textContent = message;
  status.className = type ? `status ${type}` : "status";
}

function renderEvents(events) {
  if (!Array.isArray(events)) {
    throw new Error("Expected events.json to contain an array.");
  }

  list.replaceChildren();

  if (events.length === 0) {
    setStatus("No starred repositories yet.");
    return;
  }

  events.forEach((event) => {
    if (!event?.name || !event?.starred) {
      return;
    }

    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `https://github.com/${event.name}`;
    link.textContent = event.name;
    item.append(`${link} — starred ${event.starred}`);
    list.appendChild(item);
  });

  if (list.children.length === 0) {
    throw new Error("No valid starred repository entries were found.");
  }

  setStatus(`Showing ${list.children.length} starred ${list.children.length === 1 ? "repository" : "repositories"}.`);
}

if (!list || !status) {
  throw new Error("Required page elements are missing.");
}

setStatus("Loading starred repositories…");

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load events.json (${response.status}).`);
    }
    return response.json();
  })
  .then(renderEvents)
  .catch((error) => {
    list.replaceChildren();
    setStatus(error.message || "Unable to load starred repositories.", "error");
  });
