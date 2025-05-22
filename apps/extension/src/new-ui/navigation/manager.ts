/**
 * NavigationManager is a class that manages the navigation of the extension.
 * It provides methods to get the URL of a given path.
 */
export class NavigationManager {
  private static PATHS = {
    home: "home",
    transactions: "transactions",
    translations: "translations",
    settings: "settings"
  };

  public static get paths() {
    return NavigationManager.PATHS;
  }

  private static buildRelativePath(path: keyof typeof NavigationManager.PATHS) {
    return `tabs/${NavigationManager.PATHS[path]}.html`;
  }

  public static getURL(path: keyof typeof NavigationManager.PATHS) {
    return chrome.runtime.getURL(NavigationManager.buildRelativePath(path));
  }
}
