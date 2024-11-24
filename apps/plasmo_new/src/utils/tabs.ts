export function openBrowserTab(url: string): void {
  chrome.tabs.create(
    {
      url,
      active: true,
      // Use selected for Manifest V3
      ...(chrome.tabs.hasOwnProperty("selected") && { selected: true }),
    },
    (tab: chrome.tabs.Tab) => {
      // Use chrome.tabs.update selected for Manifest V2
      if (!chrome.tabs.hasOwnProperty("selected") && tab.id) {
        chrome.tabs.update(tab.id, { selected: true });
      }
    }
  );
}
