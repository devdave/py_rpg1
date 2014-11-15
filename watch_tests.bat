watchmedo shell-command ^
    --patterns="*.py;*.json" ^
    --recursive ^
    --command "nosetests"
