# node-botvac
A node module for Neato Botvac Connected.
Based on tomrosenbacks [PHP Port](https://github.com/tomrosenback/botvac) and [kanggurus work](https://github.com/kangguru/botvac) on the undocumented Neato API.

## Installation
```npm install node-botvac```

<a name="example"></a>
## Usage Example
```Javascript
var botvac = require('node-botvac');

var client = new botvac.Client();
//authorize
client.authorize('email', 'password', false, function (error) {
    if (error) {
        console.log(error);
        return;
    }
    //get your robots
    client.getRobots(function (error, robots) {
        if (error) {
            console.log(error);
            return;
        }
        if (robots.length) {
            //do something        
            robots[0].getState(function (error, result) {
               console.log(result);
            });
        }
    });
});
```

<a name="client"></a>
## Client API
  * <a href="#authorize"><code>client.<b>authorize()</b></code></a>
  * <a href="#getRobots"><code>client.<b>getRobots()</b></code></a>
 
-------------------------------------------------------
<a name="authorize"></a>
### client.authorize(email, password, force, callback)

Login at the neato api. 

* `email` - your neato email
* `password` - your neato passwort
* `force` - force login if already authorized
* `callback` - `function(error)`
  * `error` null if no error occurred

-------------------------------------------------------
<a name="getRobots"></a>
### client.getRobots(callback)

Returns an array containing your registered <a href="#robot">robots</a>.

* `callback` - `function(error, robots)`
  * `error` null if no error occurred
  * `robots` array - your <a href="#robot">robots</a>


<a name="robot"></a>
## Robot Properties
* ```robot.name``` - nickname of this robot (cannot be changed)

These properties will be updated every time <a href="#getState"><code>robot.<b>getState()</b></code></a> is called:
* ```robot.isBinFull``` boolean
* ```robot.isCharging``` boolean
* ```robot.isDocked``` boolean
* ```robot.isScheduleEnabled``` boolean
* ```robot.dockHasBeenSeen``` boolean
* ```robot.charge``` number - charge in percent
* ```robot.canStart``` boolean - robot is ready to <a href="#api">start cleaning</a>
* ```robot.canStop``` boolean - cleaning can be <a href="#api">stopped</a>
* ```robot.canPause``` boolean - cleaning can be <a href="#api">paused</a>
* ```robot.canResume``` boolean - cleaning can be <a href="#api">resumed</a>
* ```robot.canGoToBase``` boolean - robot can be <a href="#api">sent to base</a>
* ```robot.eco``` boolean - set to true to clean in eco mode
* ```robot.noGoLines``` boolean - set to true to enable noGoLines
* ```robot.navigationMode``` number - 1: normal, 2: extra care (new models only)
* ```robot.spotWidth``` number - width for spot cleaning in cm
* ```robot.spotHeight``` number - height for spot cleaning in cm
* ```robot.spotRepeat``` boolean - set to true to clean spot two times

<a name="api"></a>
## Robot API
  * <a href="#getState"><code>robot.<b>getState()</b></code></a>
  * <a href="#getSchedule"><code>robot.<b>getSchedule()</b></code></a>
  * <a href="#enableSchedule"><code>robot.<b>enableSchedule()</b></code></a>
  * <a href="#disableSchedule"><code>robot.<b>disableSchedule()</b></code></a>
  * <a href="#startCleaning"><code>robot.<b>startCleaning()</b></code></a>  
  * <a href="#startSpotCleaning"><code>robot.<b>startSpotCleaning()</b></code></a>  
  * <a href="#stopCleaning"><code>robot.<b>stopCleaning()</b></code></a>  
  * <a href="#pauseCleaning"><code>robot.<b>pauseCleaning()</b></code></a>  
  * <a href="#resumeCleaning"><code>robot.<b>resumeCleaning()</b></code></a>  
  * <a href="#getPersistentMaps"><code>robot.<b>getPersistentMaps()</b></code></a>  
  * <a href="#getMapBoundaries"><code>robot.<b>getMapBoundaries()</b></code></a>  
  * <a href="#setMapBoundaries"><code>robot.<b>setMapBoundaries()</b></code></a>  
  * <a href="#startCleaningBoundary"><code>robot.<b>startCleaningBoundary()</b></code></a>  
  * <a href="#sendToBase"><code>robot.<b>sendToBase()</b></code></a>  
  * <a href="#findMe"><code>robot.<b>findMe()</b></code></a>  
  
-------------------------------------------------------
<a name="getState"></a>
### robot.getState([callback])

Returns the state object of the robot. Also updates all robot properties.

* `callback` - `function(error, state)`
  * `error` ```null``` if no error occurred
  * `state` ```object```
    * example:
 ```Javascript
var state = {
    version: 1,
    reqId: '1',
    result: 'ok',
    error: 'ui_alert_invalid',
    data: {},
    state: 1,
    action: 0,
    cleaning: {category: 2, mode: 1, modifier: 1, spotWidth: 0, spotHeight: 0},
    details: {
        isCharging: false,
        isDocked: true,
        isScheduleEnabled: false,
        dockHasBeenSeen: false,
        charge: 98
    },
    availableCommands: {
        start: true,
        stop: false,
        pause: false,
        resume: false,
        goToBase: false
    },
    availableServices: {
        houseCleaning: 'basic-1',
        spotCleaning: 'basic-1',
        manualCleaning: 'basic-1',
        easyConnect: 'basic-1',
        schedule: 'basic-1'
    },
    meta: {modelName: 'BotVacConnected', firmware: '2.0.0'}};
```

-------------------------------------------------------
<a name="getSchedule"></a>
### robot.getSchedule([callback])

Returns the scheduling state of the robot.

* `callback` - `function(error, schedule)`
  * `error` null if no error occurred
  * `schedule` boolean - true if scheduling is enabled

-------------------------------------------------------
<a name="enableSchedule"></a>
### robot.enableSchedule([callback])

Enables scheduling.

* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if scheduling got enabled

-------------------------------------------------------
<a name="disableSchedule"></a>
### robot.disableSchedule([callback])

Disables scheduling.

* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if scheduling got disabled

-------------------------------------------------------
<a name="startCleaning"></a>
### robot.startCleaning([eco], [navigationMode], [noGoLines], [callback])

Start cleaning.

* `eco` boolean - clean in eco mode
* `navigationMode` number - 1: normal, 2: extra care (new models only)
* `eco` boolean - clean with enabled nogo lines
* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if cleaning could be started 

-------------------------------------------------------
<a name="startSpotCleaning"></a>
### robot.startSpotCleaning([eco], [width], [height], [repeat], [navigationMode], [callback])

Start spot cleaning.

* `eco` boolean - clean in eco mode
* `width` number - spot width in cm (min 100cm)
* `height` number - spot height in cm (min 100cm)
* `repeat` boolean - clean spot two times
* `navigationMode` number - 1: normal, 2: extra care (new models only)
* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if spot cleaning could be started 

-------------------------------------------------------
<a name="stopCleaning"></a>
### robot.stopCleaning([callback])

Stop cleaning.

* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if cleaning could be stopped

-------------------------------------------------------
<a name="pauseCleaning"></a>
### robot.pauseCleaning([callback])

Pause cleaning.

* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if cleaning could be paused

-------------------------------------------------------
<a name="resumeCleaning"></a>
### robot.resumeCleaning([callback])

Resume cleaning.

* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if cleaning could be resumed

-------------------------------------------------------
<a name="getPersistentMaps"></a>
### robot.getPersistentMaps([callback])

Returns the persistent maps of the robot

* `callback` - `function(error, schedule)`
  * `error` null if no error occurred
  * `maps` Maps[] - array of maps

-------------------------------------------------------
<a name="getMapBoundaries"></a>
### robot.getMapBoundaries(mapId, [callback])

Returns the boundaries of a map
* `mapId` string - a Map id for which to get the boundaries
* `callback` - `function(error, schedule)`
  * `error` null if no error occurred
  * `boundaries` Boundary[] - array of boundaries

-------------------------------------------------------
<a name="setMapBoundaries"></a>
### robot.setMapBoundaries(mapId, [callback])

Sets boundaries for a map
* `mapId` string - a Map id for which to get the boundaries
* `boundaries` Boundary[] - array of boundaries
* `callback` - `function(error, schedule)`
  * `error` null if no error occurred
  * `boundaries` Boundary[] - array of boundaries
  
-------------------------------------------------------
<a name="startCleaningBoundary"></a>
### robot.startCleaningBoundary([eco], [extraCare], [boundaryId], [callback])

Start cleaning with boundaries

* `eco` boolean - clean in eco mode
* `extraCare` boolean - clean in extra care (new models only)
* `boundaryId` string - a boundary id (zone) to clean
* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if cleaning could be started 

-------------------------------------------------------
<a name="sendToBase"></a>
### robot.sendToBase([callback])

Send robot to base.

* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if robot could be sent to base

-------------------------------------------------------
<a name="findMe"></a>
### robot.findMe([callback])

Locate the robot by emitting a sound and light

* `callback` - `function(error, result)`
  * `error` null if no error occurred
  * `result` string - 'ok' if robot could be located
  
## Changelog
### 0.4.1
* (jbtibor) update dependencies
### 0.4.0
* (naofireblade) add findMe
### 0.3.0
* (az0uz) add persistent maps and boundaries
### 0.2.0
* (koush) http transport changes and updates
### 0.1.5
* (naofireblade) add support for new parameter navigationMode (newer models)
### 0.1.6
* (naofireblade) add support for new parameter noGoLines (newer models)
* (naofireblade) changed to keep cleaning parameters in sync with neato app
