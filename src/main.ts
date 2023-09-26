import './style.css';
import { servers, init } from 'aeternum-map-realtime';

let previousConnection: ReturnType<typeof init> | null = null;

// @ts-ignore
globalThis.handleSubmit = function (event: FormDataEvent) {
  event.preventDefault();

  if (previousConnection) {
    previousConnection.destroy();
  }

  const serverUrl =
    document.querySelector<HTMLSelectElement>('#serverUrl')!.value;
  const token = document.querySelector<HTMLInputElement>('#token')!.value;

  function appendOutput(message: string) {
    const messageElement = document.createElement('p');
    messageElement.innerText = message;
    const outputElement = document.querySelector<HTMLDivElement>('#output')!;
    outputElement.append(messageElement);
  }

  previousConnection = init({
    serverUrl,
    token,
    onGroup: (group) => appendOutput(JSON.stringify(group)),
    onPlayer: (player) => appendOutput(JSON.stringify(player)),
    onHotkey: (steamId, hotkey) =>
      appendOutput(JSON.stringify({ steamId, hotkey })),
    onConnect: () => appendOutput('Connected'),
  });
};

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `

  <form onsubmit="handleSubmit(event)">
    <select id="serverUrl">
    ${servers
      .map((server) => `<option value="${server.url}">${server.name}</option>`)
      .join('')}
    </select>
    <input id="token" type="text" placeholder="Token"></input>
    <input type="submit" value="Connect"></input>
  </form>
  <div id="output"></div>
`;
