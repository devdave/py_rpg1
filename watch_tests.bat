@echo off
set test_script=%1

watchmedo shell-command ^
    --patterns="*.py;*.json" ^
    --recursive ^
    --command %test_script%
