kill -9 $(ps aux | grep 'node' | awk '{print $2}')
