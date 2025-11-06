# Hold the Z button down to spam CTRL + left click
toggle = 0

F2::
Toggle := !Toggle
While Toggle{
Click
sleep 15
}
return