from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root=Path(__file__).resolve().parent
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
atlas=Image.new('L',(1024,2048));draw=ImageDraw.Draw(atlas);header=[];y=2
labels=[
 ('TITLE','Switch Lab',50),('HELP','Touch, motion, mouse and services   B Back',26),
 ('DISABLED','Rumble off',22),('NFC','Scan NFC',27),('TOUCH','Touch screen',34),
 ('TOUCH_HELP','Up to 16 contacts',24),('STATUS','Input services',34),
 ('PAD','Pad',24),('MOTION','Motion',24),('KEY','Keys',24),('MOUSE','Mouse',24),
 ('ACCEL','Acceleration',31),('GYRO','Gyroscope',31),('OPTICAL','Joy-Con 2 mouse',31),
 ('RESULT','NFC scan:',26),('IDLE','idle',26),('BUSY','busy',26),
 ('FOUND','tag detected',26),('NO_TAG','no tag',26),('ERROR','error',26),
 ('UID','UID:',26),('X','X',26),('Y','Y',26),('Z','Z',26)]
labels += [('KEYBOARD','Keyboard W A S D (green = received)',27)]
labels += [(key,key,34) for key in 'WASD']
labels += [('HEX_'+digit,digit,26) for digit in '0123456789ABCDEF']
for name,label,size in labels:
 face=ImageFont.truetype(font,size)
 box=draw.textbbox((0,0),label,font=face)
 w,h=box[2]-box[0],box[3]-box[1]
 draw.text((2-box[0],y-box[1]),label,font=face,fill=255)
 header.append(f'const ivec4 TEXT_{name} = ivec4(2, {y}, {w}, {h});');y+=h+9
(root/'assets/text.bin').write_bytes(atlas.tobytes())
(root/'shaders/text.glsl').write_text('\n'.join(header)+'\n')
im=Image.new('RGBA',(256,256),(13,37,51,255));d=ImageDraw.Draw(im)
d.rounded_rectangle((18,18,238,238),radius=28,outline=(56,211,220),width=7)
for x,y,r,color in [(76,82,25,(57,199,201)),(164,96,18,(241,178,69)),(112,176,31,(225,93,76))]:
 d.ellipse((x-r,y-r,x+r,y+r),fill=color)
d.line((76,82,164,96,112,176,76,82),fill=(220,237,239),width=5,joint='curve')
im.save(root/'assets/icon.png')
