'use strict';

const {Meta, Shell} = imports.gi;

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;

class Extension {

    getActiveWindow() {
        return global.workspace_manager
        .get_active_workspace()
        .list_windows()
        .find(window => window.has_focus());
    }

    enable() {
        this._settings = ExtensionUtils.getSettings();
        this.bindKey('left-third-shortcut', () => this.move(3, 0));
        this.bindKey('center-third-shortcut', () => this.move(3, 1));
        this.bindKey('right-third-shortcut', () => this.move(3, 2));

        this.bindKey('left-half-shortcut', () => this.move(2, 0));
        this.bindKey('right-half-shortcut', () => this.move(2, 1));

        this.bindKey('left-twothirds-shortcut', () => this.move(3, 0, 2));
        this.bindKey('right-twothirds-shortcut', () => this.move(3, 1, 2));
    }

    disable() {
        this.unbindKey('left-third-shortcut');
        this.unbindKey('center-third-shortcut');
        this.unbindKey('right-third-shortcut');
        this.unbindKey('left-half-shortcut');
        this.unbindKey('right-half-shortcut');
        this.unbindKey('left-twothirds-shortcut');
        this.unbindKey('right-twothirds-shortcut');
    }

    move(division, position, widthMultiplier = 1) {
        if (position > division) {
            return;
        }
        const activeWindow = this.getActiveWindow();
        const monitor = activeWindow.get_monitor();
        const workarea = this.getWorkAreaForMonitor(monitor);
        const width = workarea.width * (widthMultiplier / division);
        const height = workarea.height;
        const x = position * (workarea.width / division);
        const y = workarea.y;

        console.log("x:", x, "width:", width, "pos:", position, "division:", division, "widthMultiplier:", widthMultiplier)
        this.moveWindow(activeWindow, {
            x: x,
            y: y,
            width: width,
            height: height,
        });
    }

    moveWindow(window, area) {
        if (!window)
            return;

        if (window.maximized_horizontally || window.maximized_vertically) {
            window.unmaximize(
                Meta.MaximizeFlags.HORIZONTAL | Meta.MaximizeFlags.VERTICAL
            );
        }
        window.move_resize_frame(true, area.x, area.y, area.width, area.height);
        // In some cases move_resize_frame() will resize but not move the window, so we need to move it again.
        // This usually happens when the window's minimum size is larger than the selected area.
        window.move_frame(true, area.x, area.y);
    }

    getWorkAreaForMonitor(monitor) {
        return global.workspace_manager
      .get_active_workspace()
      .get_work_area_for_monitor(monitor);
    }

    bindKey(key, callback) {
        Main.wm.addKeybinding(
            key,
            this._settings,
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
            Shell.ActionMode.NORMAL,
            callback
        );
    }

    unbindKey(key) {
        Main.wm.removeKeybinding(key);
    }
}

/**
 *
 */
function init() {
    return new Extension();
}
