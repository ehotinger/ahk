F1::
If State=25
State=Off
else
State=25
SetTimer SendKey, %State%
Return

SendKey:
Send 5
sleep 25
Send 5
Return