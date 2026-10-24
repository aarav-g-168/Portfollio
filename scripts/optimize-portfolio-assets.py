"""Optional asset regeneration. Requires Pillow; committed outputs work without Python."""
from pathlib import Path
import sys
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
output = root / 'public' / 'preview'
if '--social-only' not in sys.argv:
    sources = {'contest-manager':'image1.png','ios-fusion':'image2.png','hackgrid':'HackGrid.png'}
    for slug, name in sources.items():
        image = Image.open(root / 'public' / 'images' / name).convert('RGB')
        for width in [480,960,1440]:
            target = image.resize((width,round(image.height*width/image.width)),Image.Resampling.LANCZOS)
            target.save(output / f'{slug}-{width}.webp',quality=83,method=6)
    portrait = Image.open(root / 'public' / 'images' / 'aarav.jpeg').convert('RGB')
    portrait.thumbnail((640,760),Image.Resampling.LANCZOS)
    portrait.save(output / 'aarav-640.webp',quality=85,method=6)

# Local social card; no external image generation or third-party photos.
card = Image.new('RGB',(1200,630),'#f4f1e9')
draw = ImageDraw.Draw(card)
fonts = Path('C:/Windows/Fonts')
bold = lambda size: ImageFont.truetype(str(fonts/'segoeuib.ttf'),size)
regular = lambda size: ImageFont.truetype(str(fonts/'segoeui.ttf'),size)
draw.text((65,40),'ag',font=bold(55),fill='#23251f')
draw.text((155,58),'AARAV GUPTA / FULL STACK DEVELOPER',font=regular(18),fill='#62645c')
draw.line((65,120,1135,120),fill='#d6d5ca',width=2)
draw.text((60,165),'AARAV',font=bold(98),fill='#23251f')
draw.text((60,275),'GUPTA.',font=bold(98),fill='#d84617')
draw.text((65,420),'Full Stack Developer',font=regular(34),fill='#62645c')
draw.ellipse((810,192,1090,472),fill='#d84617')
draw.text((845,265),'</>',font=bold(82),fill='#ffe0c4')
draw.text((65,555),'React · Next.js · Projects · Experience',font=regular(23),fill='#62645c')
draw.text((1000,555),'aarav.site',font=regular(23),fill='#23251f')
card.save(output/'portfolio-social.png',optimize=True)
print('1200x630 social card generated.' if '--social-only' in sys.argv else 'Responsive project images, portrait and 1200x630 social card generated.')
