/**
*	@filename	StonyTomb.js
*	@author		marketfresh
*	@desc		Clear Stony Tombs
*/

function StonyTomb() {
    Town.doChores();
    Pather.useWaypoint(40); // Lut Gholein
    Precast.doPrecast(true);

    if (!(Pather.moveToExit([41, 55], true))) {
        throw new Error("Failed to move to Stony Tombs 1");
    }

    Attack.clearLevel(Config.StonyTomb.ClearType);
    
    if (!(Pather.moveToExit([59], true))) {
        throw new Error("Failed to Move to Stony Tombs 2");
    }

    Attack.clearLevel(Config.StonyTomb.ClearType);

    return true;
}