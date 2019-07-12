#!/bin/bash
nodesRunning=$( ps axu | grep '/usr/local/bin/node' | wc -l )
echo $nodesRunning
if [ $nodesRunning = 2 ] 
then
  echo "Alberite program running, everything is fine."
else
  echo "Alberite not running, restarting it..."
  sh /home/pi/alberite/alberite_nodejs/start.sh
fi

