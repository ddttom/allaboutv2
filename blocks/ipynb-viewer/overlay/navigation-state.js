/**

* Navigation State Manager
* Manages view switching, history, and state preservation
 */

export class NavigationState {
  constructor({ config, maxHistoryEntries = 25 }) {
    this.config = config;
    this.maxHistoryEntries = maxHistoryEntries;

    // Current view state
    this.currentView = 'notebook'; // 'notebook' | 'markdown' | 'help'
    this.currentData = {
      pageIndex: 0,
      cellIndex: null,
      markdownUrl: null,
      markdownTitle: null,
      scrollPosition: 0,
    };

    // View state preservation
    this.viewStates = {
      notebook: { pageIndex: 0, scrollPosition: 0 },
      markdown: {},
      help: {},
    };

    // Navigation history
    this.history = [];

    // Callbacks
    this.onViewChange = null;
    this.onHistoryChange = null;
  }

  switchView(viewType, data) {
    this.saveCurrentViewState();
    this.addToHistory({ type: this.currentView, data: { ...this.currentData }, timestamp: Date.now() });
    this.currentView = viewType;
    this.currentData = { ...data };

    if (this.viewStates[viewType]) {
      this.currentData = { ...this.viewStates[viewType], ...data };
    }

    if (this.onViewChange) this.onViewChange(viewType, this.currentData);
  }

  saveCurrentViewState() {
    if (this.currentView === 'notebook') {
      this.viewStates.notebook = {
        pageIndex: this.currentData.pageIndex,
        scrollPosition: this.currentData.scrollPosition,
      };
    } else if (this.currentView === 'markdown') {
      this.viewStates.markdown[this.currentData.markdownUrl] = {
        scrollPosition: this.currentData.scrollPosition,
        markdownUrl: this.currentData.markdownUrl,
        markdownTitle: this.currentData.markdownTitle,
      };
    }
  }

  addToHistory(entry) {
    if (this.history.length > 0) {
      const lastEntry = this.history[this.history.length - 1];
      if (lastEntry.type === entry.type && JSON.stringify(lastEntry.data) === JSON.stringify(entry.data)) {
        return;
      }
    }

    this.history.push(entry);
    if (this.history.length > this.maxHistoryEntries) this.history.shift();
    if (this.onHistoryChange) this.onHistoryChange();
  }

  getHistory() {
    return this.history.map((entry) => {
      let title = 'Unknown';
      let icon = '📄';

      if (entry.type === 'notebook') {
        title = `Page ${entry.data.pageIndex + 1}`;
        icon = '📓';
      } else if (entry.type === 'markdown') {
        title = entry.data.markdownTitle || 'Markdown';
        icon = '📝';
      } else if (entry.type === 'help') {
        title = 'Help';
        icon = '❓';
      }

      return { ...entry, title, icon };
    });
  }

  updateCurrentData(updates) {
    this.currentData = { ...this.currentData, ...updates };
  }

  getCurrentView() {
    return { type: this.currentView, data: this.currentData };
  }
}
