#!/bin/bash
nodesRunning=$( ps axu | grep 'node' | wc -l )
echo $nodesRunning
if [ $nodesRunning != 2 ] 
then
  echo "Alberite not running, restarting it..." 
  sh /home/pi/alberite/alberite_nodejs/start.sh
else
  echo "Alberite program running, everything is fine." 
fi

