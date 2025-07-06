# Installation

To make adding VSAP components more convenient, we use jsrepo as our installer. It enables you to install self-contained, portable code blocks without needing to bring in a full framework or numerous files.

## jsrepo Setup

1.  Initial jsrepo with VSAP Github provider

    ```bash
    npx jsrepo init https://github.com/lichingchester/vsap/tree/main
    ```

2.  This will start the setup for VSAP

    ```bash

    ┌  jsrepo v2.4.2
    │
    ◇  Please enter a default path to install the blocks
    │  ./components/vsap
    │
    ◇  Which formatter would you like to use?
    │  None
    │
    ●  Initializing https://github.com/lichingchester/vsap/tree/main
    │
    ◇  Would you like to add an auth token?
    │  No
    │
    ◇  Fetched manifest from https://github.com/lichingchester/vsap/tree/main
    │
    ◇  Which category paths would you like to configure?
    │  none
    │
    ◇  Add another repo?
    │  No
    │
    ◇  Wrote config to `jsrepo.json`
    │
    └  All done!

    ```

3.  Once complete jsrepo will generate a configured [jsrepo.json](https://jsrepo.dev/docs/jsrepo-json)
4.  Now that jsrepo has been configured, you may proceed to add the necessary components.

    ```bash
    # Add by listing all available components
    npx jsrepo add

    # Or add by specific component path (check each component document page)
    npx jsrepo add text-animations/split-text
    ```

## Frameworks

For certain modern frameworks, we suggest using `vsap` as the parent folder for installing blocks by default.

### NuxtJS

```
./components/vsap
```

### Laravel

```
./resources/js/components/vsap
```

### Others

```
./{your preferred components path}/vsap
```
