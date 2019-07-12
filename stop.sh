sudo kill -9 $(ps aux | grep 'usr/local/bin/node' | awk '{print $2}')
