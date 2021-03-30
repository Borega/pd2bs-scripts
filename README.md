# pd2bs-scripts
Scripts for pd2bs- Kolbot

DL the newest Release of PD2BS (https://discord.gg/6K9QZ6kGcj) and copy over the Kolbot from here to the d2bs folder.
Use at your own risk. 

For changes please summit issues and pullrequests.


## Frequently Asked Questions:

### How do I change which GS server to make game in?

In \d2bs\kolbot\libs\OOG.js on line 6 you should see a `gameserver` option. Put your preferred GS there in quotes (Eg. `"gs 1"`).


### What's the skill ID for xxxxxx?

Check skill ID list here: https://github.com/Borega/pd2bs-scripts/blob/main/kolbot/sdk/skills.txt

### How do I make my bot pick up a specific item?

Read the original Kolbot NIP file guide here: https://github.com/blizzhackers/pickits/blob/master/NipGuide.md

### D2BS keeps crashing! What do I do?

There's a wide variety of reasons D2BS crashes, some of the more common fixes are:
- Make sure your PD2BS is up to date, click `About` in your PD2Bot manager to check for updates
- Set administrator rights to both `D2Bot.exe` and `game.exe`
- Set Compatibility for `D2Bot.exe` and `game.exe` to Windows 7
- Turn off A/V detection for `D2Bot.exe`, `D2M.dll`, and `D2BS.dll`
- Make sure your profile path is set to the `game.exe` located in your Project D2 folder
- Check to make sure theres no ghost `game.exe` (Diablo II) processes running in the background
- Download a fresh copy of PD2BS.
- Restart your PC and try again.

There might be more solutions that aren't listed here that might be specific to your issue, the ones above are just the most common ones.


## Properly Installing PD2BS 
### 1. Install the dependences
PD2BS requires the following Visual C++ Redistributable Packages to run. If you don't already have these in your system, install them before continuing:
- https://www.microsoft.com/en-us/download/details.aspx?id=5555 (Microsoft Visual C++ 2010 Redistributable Package x86)
- https://aka.ms/vs/16/release/vc_redist.x86.exe (Microsoft Visual C++ 2015-2019 Redistributable Package x86)
### 2. Download the latest release of PD2BS
You can find the latest release of P2BS at one of the following links:
- https://shako.org/pd2bs-release.zip
- https://discord.gg/jwkm47kX in the #downloads channel.

These include the main core files for the bot. Make sure to allow them in your A/V so it doesn't delete any files. 
### 3. Download the `kolbot` folder from this repo and replace it with the one that is packaged in Step 2.
<img align="right" width="30%" height="30%" padding="10" src="https://i.imgur.com/X4zJuGy.jpg">
<p align="left">This folder includes up-to-date script fixes and improvements to properly run on PD2, replace the folder located at \d2bs\kolbot. To download files on Github, click the green "Code" button and then click "Download Zip" as shown here:</p>
<br><br><br>

> Note: Scripts are constantly being updated so it's a good idea to update this folder periodically.

## Setting Up Your First Profile
Once you have everything downloaded and installed the next step you want to take is to set up a Profile in the PD2BS bot manager. Each profile you set up will be exclusive to one bot instance. So if you have 2 characters you'd like to run, you'll have to set up a profile for each one. Alternatively, you can also set up a profile for manual playing (if you'd like to take advantage of the QoL features of PD2BS).

So our first step is going to be to click `Add` on the left side of the manager. This will bring up a new window with some profile settings you'll need to fill out. Here's a breakdown of the essential inputs you'll need to get started:

![nxR6sA2 1](https://user-images.githubusercontent.com/80866371/112426372-17da7100-8cf5-11eb-9f0f-bdf3379f0531.jpeg)

<table border="0">
 <tr>
    <td><b style="font-size:30px">Setting</b></td>
    <td><b style="font-size:30px">Description</b></td>
 </tr>
 <tr>
    <td>1. Profile Name</td>
   <td>This is the name of the profile. You can set it to whatever you want as
	   <br>long as there's no special characters or white spaces.</td>
 </tr>
   <tr>
    <td>2. Account</td>
     <td>This will be your in-game PD2 Account name.</td>
 </tr>
   <tr>
    <td>3. Password</td>
     <td>This will be you in-game PD2 Account password.</td>
 </tr>
   <tr>
    <td>4. Character</td>
     <td>The character you'd like the bot to use.</td>
 </tr>
   <tr>
    <td>5. Game Info</td>
     <td>The bot will use this information to create games.
	     <br>ALWAYS use a password to avoid creating public games.</td>
 </tr>
   <tr>
    <td>6. Difficulty</td>
     <td>The game difficulty you'd like your character to create a game in</td>
 </tr>
   <tr>
    <td>7. Game Path</td>
     <td>Set this to the `Game.exe` in your Project D2 folder. Eg. `\ProjectD2\Game.exe`</td>
 </tr>
   <tr>
    <td>8. Entry Script</td>
     <td>The main entry script you'll use is `D2BotLead.dbj`.<br>If you want to play manually, use `D2BotMap.dbj`.</td>
 </tr>
</table>

After filling out all the required information, click `Apply` and then `OK` to close out this window. You should now see your first profile on the list. Click on your profile and hit `Start` on the left hand side. If you did everything correctly, the manager will automatically start open a new Diablo II window and will proceed to log in automatically (If you used D2BotMap.dbj, you'll have to log in yourself).

Once your character is in-game you should see a bunch of warning text on the top of the screen, this is the `Console` area. First time characters need a Character config file, and to generate one for the first time for your character, you'll need to press `Home` on your keyboard, and then `Space`. The game window should close down, if you try to start it again you'll see some more errors regarding your newly created character config file. The most common first time error is due to your character's attacks not being set.

### Basic Config Setup

Let's head over to your new config file and check it out, you'll find it in `\d2bs\kolbot\libs\config\` and it should contain your character's name in the name of the file. So if your character was named BerBot and it was a paladin, it would be `Paladin.BerBot.js`.

Using Notepad++ or any coding-friendly text editor you can edit this javascript file to suit your needs. Using regular Notepad is NOT RECOMMENDED. It maybe seem like alot at first, but everything is commented with explanatory information to help you understand each setting in the file. To find and edit specific settings, `CTRL+F` is your friend.

#### 1. Set UserAddon script to false
The first thing you'll need to do is set `Scripts.UserAddon = false;`

#### 2. Setting Up Attacks.
There's no "perfect" config for all characters, so you'll need to fine tune each one to suit the build you're using. But one error that will affect all characters is not having your attacks set up. Our second step is to set up these attacks by going to the `Config.Attack` section of the file. The bare minimum you will need is to set `Config.AttackSkill[1] // Primary skill to bosses.` and `Config.AttackSkill[3] = -1; // Primary skill to others.`. Not setting these up will result in errors because you're bot won't know what skill to use when attacking. So head on over to our skill list here: https://github.com/Borega/pd2bs-scripts/blob/main/kolbot/sdk/skills.txt and find the skills you want to use for this character.

#### 3. Setting up Inventory Spaces
Next we need to make sure the inventory section for our bot is configured properly, `CTRL+F` and find `Config.Inventory` and make sure it atleast looks like this:
```
    Config.Inventory[0] = [1,1,1,1,1,1,1,1,1,0];
    Config.Inventory[1] = [1,1,1,1,1,1,1,1,1,0];
    Config.Inventory[2] = [1,1,1,1,1,1,1,1,1,0];
    Config.Inventory[3] = [1,1,1,1,1,1,1,1,1,0];
    Config.Inventory[4] = [0,0,0,0,0,0,0,0,0,0];
    Config.Inventory[5] = [0,0,0,0,0,0,0,0,0,0];
    Config.Inventory[6] = [0,0,0,0,0,0,0,0,0,0];
    Config.Inventory[7] = [0,0,0,0,0,0,0,0,0,0];
 ```   

The `1`'s in the matrix above represents inventory slots the bot can manipulated/used for picking up items and storing pots, etc. The `0`'s are for item slots that 
the bot will never touch, useful for charms and the id/tp tomes. Some people will also add a few extra `0`'s and put things like keys & WSS, but the most common is the layout above, which allows you 4 rows on the bottom for storing skillers and tomes/keys/etc. on the right hand column.

##### We should also make sure that your bot's potions are set up
A few lines under the Inventory settings above you'll see `Config.BeltColumn` this section is pretty self explanatory, I recommend at least one column of each type (rv = rejuv, hp/mp are obvious) and depending on your bot's setup the 4th column can be whatever you like. You can see when your bot uses potions with CTRL+F Potion settings, everything is commented very well here so go ham. sorcs with high mp usage may want to set the `Config.MPbuffer` to atleast 4 - keep in mind that the bot will pick up mana pots, but having the bot run out of potions is not ideal.

#### 4. Setting up Pickit options
Next we should setup the pickits - a pickit is the file the bot reads to know which items to pick up and keep pickit files have the extension `.nip` and the base installation should have included several for PD2. It is recommended to use `redix.nip` and to edit it according to your wants/needs - it is fairly strict but still keeps a lot of items that are useful early on. If you want to make use of redix.nip, in your character config file CTRL+F "pickit config" and make it look something like this:

```	// Pickit config. Default folder is kolbot/pickit.
	Config.PickitFiles.push("redix.nip");
	Config.PickRange = 40; // Pick radius
  ```
	
Make sure that `redix.nip` is in your `\d2bs\kolbot\pickit` directory. If for some reason it isn't, you can find it in the discord under the #script-fixes channel

#### 5. Setting Up Areas To Run
In the top section of your character config you'll notice scripts that look like this:
```
	Scripts.Countess = false;
		Config.Countess.KillGhosts = false;
	Scripts.Andariel = false;
	Scripts.Cows = false;
  ```
 This section is pretty self explanatory. By default, boss/area scripts are set to `false`. If you want to run a specific script you must change it to `true`.
 
That is basically the essentials to get you started. Start your bot and watch it to make sure it's properly running scripts, if something isn't right, go back to your character config file and fine tune it to your liking.

Here's some more comprehensive guides from the original Kolbot:

- https://github.com/blizzhackers/documentation/blob/master/d2bot/ManagerSetup.md/#manager-setup (D2BS Manager Setup)
- https://github.com/blizzhackers/documentation/blob/master/kolbot/CharacterConfig.md/#character-configuration (Kolbot Character Config Setup)
- https://github.com/blizzhackers/pickits/blob/master/NipGuide.md (NIP file guide)

Guide Contributors: 
- EZ BER RUNES FOR SALE
- yayza_


