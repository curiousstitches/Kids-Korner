# tools/

Grown-up utility scripts. Kids never need this folder.

- `deploy.bat` — full deploy: starts the local server, opens an ngrok tunnel, and pushes everything to GitHub (which makes the online site at kids-korner.onrender.com rebuild itself). Loads keys from the main folder's `keys.local.bat`.
- `deploy-quick.bat` — same start-up without the GitHub push.

Both scripts find the project folder automatically, so double-clicking them right here just works.
For everyday use you don't need these - `START-BUDDY.bat` in the main folder is all you need.
