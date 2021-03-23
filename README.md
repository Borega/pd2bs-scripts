# pd2bs-scripts
Scripts for pd2bs- Kolbot

DL the newest Release of PD2BS (https://discord.gg/6K9QZ6kGcj) and copy over the Kolbot from here to the d2bs folder.
Use at your own risk. 

For changes please summit issues and pullrequests.


## Frequently Asked Questions:

### How do I change which GS server to make game in?

In \d2bs\kolbot\libs\OOG.js on line 6 you should see a `gameserver` option. Put your preferred GS there in quotes (Eg. `"gs 1"`).


### What's the skill ID for xxxxxx?

Check skill ID list here: https://github.com/Borega/pd2bs-scripts/blob/main/Skills.txt

### How do I make my bot pick up a specific item?

Read the original Kolbot NIP file guide here: https://github.com/blizzhackers/pickits/blob/master/NipGuide.md

### D2BS keeps crashing! What do I do?

There's a wide variety of reasons D2BS crashes, some of the more common fixes are:
- Make sure your PD2BS is up to date
- Set administrator rights to both `D2Bot.exe` and `game.exe`
- Set Compatibility for `D2Bot.exe` and `game.exe` to Windows 7
- Turn off A/V detection for `D2Bot.exe`, `D2M.dll`, and `D2BS.dll`
- Make sure your profile path is set to the `game.exe` located in your Project D2 folder
- Check to make sure theres no ghost `game.exe` (Diablo II) processes running in the background
- Download a fresh copy of PD2BS.
- Restart your PC and try again.

There might be more solutions that aren't listed here that might be specific to your issue, the ones above are just the most common ones.
