const toContentScriptEventName = `ab-yt-channel-name-${Math.random().toString(36).substr(2)}`;
const fromContentScriptEventName = `yt-ab-channel-name-${Math.random().toString(36).substr(2)}`;

// retain the last known channel name and video id
// to be used when the URL is updated, and the ab-channel query string parameter is removed
let gChannelName = '';
let gNextVideoId = '';

const updateURLWithYouTubeChannelName = (sendResponse) => {
  if (gNextVideoId === parseUri.parseSearch(window.location.href).v) {
    window.postMessage({
      eventName: fromContentScriptEventName,
      channelName: String(gChannelName),
    }, '*');
    sendResponse({});
    return;
  }

  // fallback if the video ids don't match, get the channel name from the DOM
  // If YouTube updates the website, then the selector below may no longer work.
  const thisChannelList = document.querySelectorAll('ytd-video-owner-renderer ytd-channel-name');
  if ((thisChannelList.length > 0) && thisChannelList[0].innerText) {
    const tempChannelName = String(thisChannelList[0].innerText.trim());
    if (tempChannelName && (gNextVideoId === parseUri.parseSearch(window.location.href).v)) {
      window.postMessage({
        eventName: fromContentScriptEventName,
        channelName: String(gChannelName),
      }, '*');
      sendResponse({});
    }
  }
};

// listen to messages from the background page
const onMessage = function (request, sender, sendResponse) {
  const { message } = request;

  switch (message) {
    case 'updateURLWithYouTubeChannelName':
      updateURLWithYouTubeChannelName(sendResponse);
      break;
    case 'ping_yt_content_script':
      sendResponse({ status: 'yes' });
      break;
    case 'removeYouTubeChannelName':
      window.postMessage({
        eventName: fromContentScriptEventName,
        removeChannelName: true,
      }, '*');
      sendResponse({});
      break;
    default:
  }
};

const injectScriptIntoTabJS = ({ src, name = '', params = {} }) => {
  const scriptElem = document.createElement('script');
  scriptElem.type = 'module';
  scriptElem.src = browser.runtime.getURL(src);
  scriptElem.dataset.params = JSON.stringify(params);
  scriptElem.dataset.name = name;

  try {
    (document.head || document.documentElement).appendChild(scriptElem);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err);
  }
};

const runOnYT = function () {
  // Inject main script and script on which it depends
  injectScriptIntoTabJS({ src: 'purify.min.js' });
  injectScriptIntoTabJS({
    src: 'adblock-yt-capture-requests.js',
    name: 'capture-requests',
    params: {
      toContentScriptEventName,
      fromContentScriptEventName,
    },
  });

  // process the event messages from the injected script
  window.addEventListener('message', (event) => {
    if (!event && !event.data) {
      return;
    }

    if (event.data.channelName && event.data.eventName === toContentScriptEventName) {
      gChannelName = event.data.channelName;
      if (event.data.videoId) {
        gNextVideoId = event.data.videoId;
      }

      browser.runtime.sendMessage({ command: 'updateYouTubeChannelName', channelName: event.data.channelName });
    }
  });
};

const addScript = async function () {
  try {
    const settings = await browser.runtime.sendMessage({ command: 'getSettings' });

    if (settings.youtube_channel_whitelist) {
      runOnYT();
    }
  } catch (err) {
    /* eslint-disable-next-line no-console */
    console.error(err);
  }
};

const init = async function () {
  browser.runtime.onMessage.addListener(onMessage);
  await addScript();
};

(async () => {
  await init();
})();
