#version 450
#extension GL_GOOGLE_include_directive : require
layout(location=0) out vec4 outColor;
#define STATE_ACCESS readonly
#define HB_READONLY
#include "abi.glsl"
#include "hb.glsl"
#include "text.glsl"
#include "draw.glsl"

float meter(vec2 p,vec2 origin,float value,float width){
 vec2 center=origin+vec2(width*.5,0.0);
 float rail=fill(box(p,center,vec2(width*.5,9),5));
 float amount=clamp(value,-1.0,1.0)*width*.5;
 float bar=fill(box(p,center+vec2(amount*.5,0),vec2(abs(amount)*.5,7),4));
 return rail*.18+bar*.82;
}
ivec4 hexGlyph(uint digit){
 ivec4 glyphs[16]=ivec4[16](TEXT_HEX_0,TEXT_HEX_1,TEXT_HEX_2,TEXT_HEX_3,
  TEXT_HEX_4,TEXT_HEX_5,TEXT_HEX_6,TEXT_HEX_7,TEXT_HEX_8,TEXT_HEX_9,
  TEXT_HEX_A,TEXT_HEX_B,TEXT_HEX_C,TEXT_HEX_D,TEXT_HEX_E,TEXT_HEX_F);
 return glyphs[digit&15u];
}
void main(){
 vec2 p=gl_FragCoord.xy;
 vec3 color=vec3(.035,.08,.13);
 color=mix(color,vec3(.07,.16,.23),fill(box(p,vec2(960,56),vec2(950,48),14)));
 color=mix(color,vec3(.16,.72,.78),text(p,vec2(44,26),TEXT_TITLE));
 color=mix(color,vec3(.68,.8,.85),text(p,vec2(390,38),TEXT_HELP));
 float rumble=fill(box(p,vec2(1465,56),vec2(120,39),11));
 float nfc=fill(box(p,vec2(1720,56),vec2(120,39),11));
 color=mix(color,vec3(.23,.29,.34),rumble);
 color=mix(color,vec3(.22,.36,.55),nfc);
 color=mix(color,vec3(.63,.69,.71),text(p,vec2(1381,40),TEXT_DISABLED));
 color=mix(color,vec3(1),text(p,vec2(1677,37),TEXT_NFC));

 color=mix(color,vec3(.075,.16,.22),fill(box(p,vec2(530,600),vec2(480,430),20)));
 color=mix(color,vec3(.075,.16,.22),fill(box(p,vec2(1450,600),vec2(440,430),20)));
 color=mix(color,vec3(.87,.95,.97),text(p,vec2(82,145),TEXT_TOUCH));
 color=mix(color,vec3(.6,.76,.82),text(p,vec2(460,150),TEXT_TOUCH_HELP));
 float touchScreen=fill(box(p,vec2(530,527),vec2(460,260),8));
 color=mix(color,vec3(.92,.97,.98),touchScreen);
 for(uint i=0u;i<hbTouchCount();i++){
  vec2 q=vec2(70,268)+hbTouch(i)*.71875;
  float ring=line(length(p-q),22.0);
  float dot=fill(length(p-q)-10.0);
  color=mix(color,vec3(.11,.61,.69),ring*.8);
  color=mix(color,vec3(.91,.32,.24),dot);
 }
 color=mix(color,vec3(.9,.95,.97),text(p,vec2(82,840),TEXT_KEYBOARD));
 for(uint i=0u;i<4u;i++){
  float x=196.0+float(i)*192.0;
  bool seen=(c.game.y&(1u<<i))!=0u,held=(c.game.z&(1u<<i))!=0u;
  float tile=fill(box(p,vec2(x,932),vec2(77,55),10));
  color=mix(color,held?vec3(.96,.7,.25):seen?vec3(.24,.8,.57):vec3(.24,.31,.37),tile);
  ivec4 key=i==0u?TEXT_W:i==1u?TEXT_A:i==2u?TEXT_S:TEXT_D;
  color=mix(color,vec3(1),text(p,vec2(x-12,913),key));
 }

 color=mix(color,vec3(.9,.95,.97),text(p,vec2(1080,145),TEXT_STATUS));
 vec3 on=vec3(.24,.8,.57),off=vec3(.45,.53,.59);
 for(int i=0;i<4;i++){
  bool live=(c.stats.x&(1u<<uint(i)))!=0u;
  float dot=fill(length(p-vec2(1110+190*i,220))-11.0);
  color=mix(color,live?on:off,dot);
 }
 color=mix(color,vec3(.74,.85,.9),text(p,vec2(1132,205),TEXT_PAD));
 color=mix(color,vec3(.74,.85,.9),text(p,vec2(1322,205),TEXT_MOTION));
 color=mix(color,vec3(.74,.85,.9),text(p,vec2(1512,205),TEXT_KEY));
 color=mix(color,vec3(.74,.85,.9),text(p,vec2(1702,205),TEXT_MOUSE));
 color=mix(color,vec3(.9,.95,.97),text(p,vec2(1080,280),TEXT_ACCEL));
 color=mix(color,vec3(.9,.95,.97),text(p,vec2(1080,505),TEXT_GYRO));
 for(int i=0;i<3;i++){
  float y=360.0+float(i)*55.0;
  float v=i==0?c.flow.x:i==1?c.flow.y:c.flow.z;
  color=mix(color,vec3(.16,.71,.78),meter(p,vec2(1150,y),v*.5,610.0));
  color=mix(color,vec3(.8,.88,.91),text(p,vec2(1090,y-18),i==0?TEXT_X:i==1?TEXT_Y:TEXT_Z));
 }
 for(int i=0;i<3;i++){
  float y=585.0+float(i)*55.0;
  float v=i==0?c.transition.y:i==1?c.transition.z:c.transition.w;
  color=mix(color,vec3(.88,.54,.27),meter(p,vec2(1150,y),v*.5,610.0));
  color=mix(color,vec3(.8,.88,.91),text(p,vec2(1090,y-18),i==0?TEXT_X:i==1?TEXT_Y:TEXT_Z));
 }
 color=mix(color,vec3(.9,.95,.97),text(p,vec2(1080,765),TEXT_OPTICAL));
 float optical=fill(length(p-c.motion.yz)-12.0);
 color=mix(color,vec3(.96,.68,.25),optical);
 color=mix(color,vec3(.65,.78,.82),text(p,vec2(1080,990),TEXT_RESULT));
 vec3 status=c.game.x==0u?off:c.game.x==1u?vec3(.97,.7,.2):c.game.x==2u?on:c.game.x==3u?vec3(.65,.78,.82):vec3(.93,.37,.32);
 color=mix(color,status,fill(length(p-vec2(1835,1000))-12.0));
 ivec4 label=c.game.x==0u?TEXT_IDLE:c.game.x==1u?TEXT_BUSY:c.game.x==2u?TEXT_FOUND:c.game.x==3u?TEXT_NO_TAG:TEXT_ERROR;
 color=mix(color,status,text(p,vec2(1230,990),label));
 if(c.game.x==2u){
  color=mix(color,vec3(.65,.78,.82),text(p,vec2(1080,1032),TEXT_UID));
  uint uidLength=min(hbResponseByte(26u),10u);
  for(uint i=0u;i<uidLength;i++){
   uint value=hbResponseByte(16u+i);
   vec2 origin=vec2(1170.0+float(i)*49.0,1032.0);
   color=mix(color,on,text(p,origin,hexGlyph(value>>4u)));
   color=mix(color,on,text(p,origin+vec2(22,0),hexGlyph(value)));
  }
 }
 outColor=vec4(color*(1.0-c.transition.x),1.0);
}
