# Wrecktangle Window Gnome extension

Position window like [Rectangle](https://rectangleapp.com/) in Gnome!

## Important note on Gnome versions
As Gnome 45 introduced breaking changes to extensions, this extension will only support Gnome 45 going forward. Code for Gnome 44 and below can be found on the gnome-44 branch of this repo.

## Installation

Clone this repository with git and do a `make install` to install it 
in your `~/.local/share/gnome-shell/extensions` directory.

Then reload Gnome 
* X11: `Alt` + `F2` then type `r` and hit `Enter`
* Wayland: Logout and back in

## Settings

Shortcuts can be modified in the preferences. By default, they use the default Rectangle shortcuts

## Acknowledgement

Most of that code comes from the [One Third Window](https://github.com/chmouel/one-third-window-gnome-extension)
extension but adds more options for how the windows are positioned and sized.
