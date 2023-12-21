import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
const COLUMN_KEY = 0;
const COLUMN_MODS = 1;

const KEYBOARD_SHORTCUTS = [
    {id: 'left-third-shortcut', desc: 'Left Third'},
    {id: 'center-third-shortcut', desc: 'Center Third'},
    {id: 'right-third-shortcut', desc: 'Right Third'},
    {id: 'left-half-shortcut', desc: 'Left Half'},
    {id: 'right-half-shortcut', desc: 'Right Half'},
    {id: 'left-twothirds-shortcut', desc: 'Left Two Thirds'},
    {id: 'right-twothirds-shortcut', desc: 'Right Two Thirds'},
];

export default class WrecktanglePreferences extends ExtensionPreferences {

    _settings;

    fillPreferencesWindow(window) {
        this._settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: _('One Third Window'),
        });
        group.add(this.buildPrefsWidget())
        page.add(group);
        window.add(page);
    }

    function

    buildPrefsWidget() {
        const allTreeViews = [];

        const grid = new Gtk.Grid({
            margin_start: 12,
            margin_end: 12,
            margin_top: 12,
            margin_bottom: 12,
            column_spacing: 12,
            row_spacing: 12,
            visible: true,
        });

        const boxers = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 5,
        });

        grid.attach(boxers, 0, 1, 1, 1);

        const keyboardShortcutsLabel = new Gtk.Label({
            label: '<b>Keyboard shortcuts</b>',
            use_markup: true,
            visible: true,
        });
        grid.attach(keyboardShortcutsLabel, 0, 2, 1, 1);

        const keyboardShortcutsWidget = this.buildKeyboardShortcutsWidget(
            allTreeViews
        );
        grid.attach(keyboardShortcutsWidget, 0, 3, 1, 1);

        return grid;
    }

    buildKeyboardShortcutsWidget(allTreeViews) {
        const grid = new Gtk.Grid({
            halign: Gtk.Align.CENTER,
            column_spacing: 12,
            row_spacing: 12,
            visible: true,
        });

        KEYBOARD_SHORTCUTS.forEach((shortcut, index) => {
            const label = new Gtk.Label({
                halign: Gtk.Align.END,
                label: shortcut.desc,
                visible: true,
            });
            grid.attach(label, 0, index, 1, 1);

            const accelerator = this.buildAcceleratorWidget(
                shortcut.id,
                124,
                26,
                allTreeViews
            );
            grid.attach(accelerator, 1, index, 1, 1);
        });

        return grid;
    }

    buildAcceleratorWidget(id, width, height, allTreeViews) {
        // Model
        const model = new Gtk.ListStore();
        model.set_column_types([GObject.TYPE_INT, GObject.TYPE_INT]);
        model.set(
            model.append(),
            [COLUMN_KEY, COLUMN_MODS],
            this.parseAccelerator(id)
        );

        // Renderer
        const renderer = new Gtk.CellRendererAccel({
            accel_mode: Gtk.CellRendererAccelMode.GTK,
            width,
            height,
            editable: true,
        });
        renderer.connect('accel-edited', (renderer, path, key, mods) => {
            const [ok, iter] = model.get_iter_from_string(path);
            if (!ok)
                return;

            model.set(iter, [COLUMN_KEY, COLUMN_MODS], [key, mods]);
            this._settings.set_strv(id, [Gtk.accelerator_name(key, mods)]);
        });
        renderer.connect('accel-cleared', (renderer, path) => {
            const [ok, iter] = model.get_iter_from_string(path);
            if (!ok)
                return;

            model.set(iter, [COLUMN_KEY, COLUMN_MODS], [0, 0]);
            this._settings.set_strv(id, []);
        });

        // Column
        const column = new Gtk.TreeViewColumn();
        column.pack_start(renderer, true);
        column.add_attribute(renderer, 'accel-key', COLUMN_KEY);
        column.add_attribute(renderer, 'accel-mods', COLUMN_MODS);

        // TreeView
        const treeView = new Gtk.TreeView({
            model,
            headers_visible: false,
            visible: true,
        });
        treeView.append_column(column);

        // TreeViews keep their selection when they loose focus
        // This prevents more than one from being selected
        treeView.get_selection().connect('changed', function (selection) {
            if (selection.count_selected_rows() > 0) {
                allTreeViews
                    .filter(it => it !== treeView)
                    .forEach(it => it.get_selection().unselect_all());
            }
        });
        allTreeViews.push(treeView);

        return treeView;
    }

    parseAccelerator(id) {
        const accelerator = this._settings.get_strv(id)[0] || '';
        const [ok, key, mods] = Gtk.accelerator_parse(accelerator);
        // Gtk3 compatibility
        if (typeof ok === 'number')
            return [ok, key];

        return [key, mods];
    }
}