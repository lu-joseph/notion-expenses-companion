sudo ss -tulpn | grep '127.0.0.1:8000' | awk '{print $7}' | awk -F ',' '{print $2}' | awk -F '=' '{print $2}' | xargs kill -9
sudo ss -tulpn | grep '127.0.0.1:5173' | awk '{print $7}' | awk -F ',' '{print $2}' | awk -F '=' '{print $2}' | xargs kill -9
