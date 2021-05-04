+++
title = "Creating a Hyper key on macOS"
date = 2019-06-06
description = "How to remap your caps-lock key on your keyboard for infinite customization."
+++

Take a look at the home row on your keyboard. There's one key on there that's pretty useless. It's functionality duplicated by another, more useful one. Can you spot it?

Hidden to the left of your left pinkie lies the <kbd>Caps Lock</kbd> key. It currently doesn't do much, but it has the potential to supercharge how you use your computer.

Using two applications, [Hammerspoon](https://www.hammerspoon.org) and [Karabiner-Elements](https://github.com/tekezo/Karabiner-Elements), you can turn the ordinary key into a <kbd>Hyper</kbd> key, which you can use to control your mac in a number of ways.

### What's a hyper key?

The Hyper key isn't a new concept. I first learnt about it from Steve Josh's [excellent](http://stevelosh.com/blog/2012/10/a-modern-space-cadet/) blog. People have come and adapted his instructions, first revising it for the [OSX](https://brettterpstra.com/2012/12/08/a-useful-caps-lock-key/), and later for [macOS](https://brettterpstra.com/2017/06/15/a-hyper-key-with-karabiner-elements-full-instructions/).

In essence, a hyper key does two things:

1. If you press it on its own, it acts as an escape key. For programmers with touchbars, this is feature enough. It's much easier to use when working in modal editors, like [vim](https://www.vim.org).
2. If you press it in combination with other keys, you can make it do _whatever you want!_

This can be incredibly powerful. By creating a hyper key, you can define custom shortcuts that do everything from window management to running scripts. And the latter opens the door for controlling every aspect of your mac.

### How does it work?

To rebind the key itself, we use Karabiner Elements to customize our <kbd>Caps Lock</kbd> key. When pressed on it's own, it acts as an <kbd>esc</kbd>. 

If pressed in combination with other keys, it acts as a <kbd>Command</kbd> + <kbd>Control</kbd> + <kbd>Option</kbd> + <kbd>Shift</kbd>. 

Since pressing all those keys at once is a little silly, the engineers at Apple decided that no keyboard shortcuts would use all of them at once. So that means that any shortcuts you create with the hyper key won't be bound to anything else.

To make these shortcuts actually do things, we use Hammerspoon. According to it's website: 

> [Hammerspoon] is a tool for powerful automation of OS X. At its core, it is just a bridge between the operating system and a Lua scripting engine. 

What this means is we can bind our custom key combinations to hammerspoon, and have it run any number of actions. And all of this configuration can be done in lua.

### Installation

#### Homebrew

To setup your own hyperkey, start by installing homebrew from the [website](https://brew.sh). Homebrew is a package manager for macOS that makes it much easier to install packages on your system.

Once installed, begin by running
```bash
brew cask install hammerspoon karabiner-elements
```

Homebrew will set about downloading both applications, and then moving them into your `Applications` folder.

#### Karabiner Elements

Next, open up Karabiner Elements, and allow it to add itself to Login Items so that it starts up every time you log into your mac.

Open up `~/.config/karabiner/karabiner.json` with your text editor of choice. Replace the `complex modifications` json with the following:

```json
"complex_modifications": {
    "parameters": {
        "basic.simultaneous_threshold_milliseconds": 50,
        "basic.to_delayed_action_delay_milliseconds": 500,
        "basic.to_if_alone_timeout_milliseconds": 1000,
        "basic.to_if_held_down_threshold_milliseconds": 500,
        "mouse_motion_to_scroll.speed": 100
    },
    "rules": [
        {
            "description": "CapsLock to Hyper/Escape",
            "manipulators": [
                {
                    "from": {
                        "key_code": "caps_lock",
                        "modifiers": {
                            "optional": [
                                "any"
                            ]
                        }
                    },
                    "to": [
                        {
                            "key_code": "right_shift",
                            "modifiers": [
                                "right_command",
                                "right_control",
                                "right_option"
                            ]
                        }
                    ],
                    "to_if_alone": [
                        {
                            "key_code": "escape"
                        }
                    ],
                    "type": "basic"
                }
            ]
        }
    ]
},
```

Restart Karabiner Elements, and you should see the following under Complex Modifications:
![](https://i.imgur.com/wqfowjW.png)

At this point, the key bindings should already be in place. Give them a try by opening up a Terminal, and typing in `vim`.

From there, you should be able to hit the <kbr>Caps Lock</kbr> key to escape, and then type `:q` to quit. 

Congratulations! You're now ahead of [a million stack-overflowing developers](https://stackoverflow.blog/2017/05/23/stack-overflow-helping-one-million-developers-exit-vim/)

#### Hammerspoon

Now to make the shortcuts actually do something! First off, open up Hammerspoon's settings. By default, it shows up in the dock and the menubar. I prefer a more invisible setup, so I use these settings:
![](https://i.imgur.com/gRii6lg.png)

Next, open up Hammerspoon's config file, `~/.hammerspoon/init.lua`, in your editor of choice.

Begin the file by defining your constants:
```lua
-- CONSTANTS:
hyper = {"cmd", "alt", "ctrl", "shift"}
```

Next, add live reloading. This'll let hammerspoon automatically update every time it detects a change in it's configuration file:

```lua
-- CONFIG RELOADING:
hs.alert.show("Config Loaded")
hs.loadSpoon("ReloadConfiguration")
spoon.ReloadConfiguration:start()
```

From here, you can choose to bind keys however you wish. I work with a fairly minimal configuration. 

First, I bind some letter keys to various applications:

```lua
-- HYPER APPLICATION BINDINGS:
application_bindings = {
    ["S"] = "Safari",
    ["D"] = "Sublime Text",
    ["C"] = "Calendar",
    ["T"] = "Terminal",
    ["B"] = "Bear",
    ["E"] = "Mail",
    ["M"] = "Messenger",
    ["I"] = "iTunes",
    ["R"] = "Transmission",
    ["P"] = "Pages",
}

for k,v in pairs(application_bindings) do
    hs.hotkey.bind(hyper, k, function()
        hs.application.launchOrFocus(v)
    end)
end
```

I also use hammerspoon for some basic window management, so I can quickly tile the active window to the left, right, or maximize. Those settings look like this:

```lua
-- WINDOW MANIPULATION:
hs.window.animationDuration = 0

-- Center
hs.hotkey.bind(hyper, "return", function()
    local win = hs.window.focusedWindow()
    local f = win:frame()
    local max = win:screen():frame()

    f.x, f.y = max.x, max.y
    f.w, f.h = max.w, max.h
    win:setFrame(f)
end)

-- Left
hs.hotkey.bind(hyper, "H", function()
    local win = hs.window.focusedWindow()
    local f = win:frame()
    local max = win:screen():frame()

    f.x, f.y = max.x, max.y
    f.w, f.h = max.w / 2, max.h
    win:setFrame(f)
end)

-- Right
hs.hotkey.bind(hyper, "L", function()
    local win = hs.window.focusedWindow()
    local f = win:frame()
    local max = win:screen():frame()

    f.x, f.y = max.x + (max.w / 2), max.y
    f.w, f.h = max.w / 2, max.h
    win:setFrame(f)
end)
```

#### Conclusion

From here, you can go on to create whatever shortcuts you wish. Hammerspoon provides some [excellent documentation](https://www.hammerspoon.org/docs/), and you can also take a look at my full hyperkey config in [my dotfiles](https://github.com/arya-k/dotfiles/tree/master/hyperkey). 

The only limit now, is your imagination!*

*and your understanding of lua :)