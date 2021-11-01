F8::
If State=3000
State=Off
else
State=3000
SetTimer SendKey, %State%
Return

SendKey:
Send e
sleep 1500
Send r
Return