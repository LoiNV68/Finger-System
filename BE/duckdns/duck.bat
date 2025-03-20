@echo off
for /f %%i in ('curl -s http://api.ipify.org') do set IP=%%i
curl -s -k "https://www.duckdns.org/update?domains=finger-system&token=aa531e6a-5f4c-47bd-88f6-cfa9d4f9f4e7&ip=%IP%" -o "D:\Project\attendance-management\BE\duckdns\duck.log"