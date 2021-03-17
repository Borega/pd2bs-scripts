/**
*	@filename	MaggotLair.js
*	@author		marketfresh
*	@desc		Clear Maggot Lair level 2 and 3
*/

function MaggotLair() {
    var i;

    Town.doChores();
    Pather.useWaypoint(43);
    Precast.doPrecast(true);

    if (!(Pather.moveToExit([62, 63], true))) {
        throw new Error("Failed to move to Maggot Lair 2");
    }

    Attack.clearLevel(Config.MaggotLair.ClearType);

    if (!(Pather.moveToExit([64], true))) {
        throw new Error("Failed to Move to Maggot Lair 3");
    }

    Attack.clearLevel(Config.MaggotLair.ClearType);

    return true;
}