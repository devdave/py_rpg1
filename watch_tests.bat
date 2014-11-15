watchmedo shell-command ^
    --patterns="*.py" ^
    --recursive ^
    --command "nosetests"
