# Minimalist Peer To Peer Screen Sharing Platform
        
Create a minimalist and responsive screen sharing website. The site should use PeerJS for real-time peer-to-peer communication. Include the following features:
* Home Page Interface:
  * A simple UI with options to either **"Start Sharing"** (as host) or **"Join Session"** (as viewer).
  * When a host clicks "Start Sharing":
    * Automatically generate a PeerJS ID.
    * Show the screen-sharing interface.
    * Display the PeerJS link so others can join directly.
    * Start microphone audio sharing by default.
    * Camera should be **off by default**, but can be toggled.
    * Provide a **toggle button for microphone** and **camera**, and show indicator text like:
      * "Mic is ON"
      * "Camera is OFF"
* Screen Sharing:
  * Allow the host to share their **screen with optional audio**.
  * Add a toggle to enable screen audio while sharing.
  * When sharing starts, show the shared screen on the viewer's side in real-time.
* Viewer Interface (Join Page):
  * Automatically connect to the peer using the `peerId` from the URL.
  * Display the shared screen in fullscreen mode with an option to toggle fullscreen.
  * Mobile-optimized layout for viewing.
* General UI/UX:
  * Use a modern minimalist design.
  * Keep all buttons easily tappable and visible.
  * Add a responsive layout that works well on both desktop and mobile devices.
* Extra Features:
  * Show simple connection status: “Connected to peer”, “Waiting for connection”, “Disconnected”.
  * Add small status text indicators:
    * "Mic is ON/OFF"
    * "Camera is ON/OFF"
    * "Screen Sharing is ACTIVE"

Built with Floot.

# How to use

1. Import FlootSetup.css to set up the css variables and basic styles.
2. Import the components into your react codebase.
