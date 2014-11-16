@echo off
set test_script=%1

watchmedo shell-command ^
    --patterns="*.py;*.json" ^
    --recursive ^
    --command "nosetests --with-coverage --cover-tests   --cover-html --cover-branches --cover-package=py_rpg"
