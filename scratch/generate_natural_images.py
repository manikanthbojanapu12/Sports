import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

os.makedirs('assets', exist_ok=True)

def generate_natural_sports_image(filename, category, title="", subtitle=""):
    width, height = 800, 520
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)

    if category == 'soccer_turf':
        # Natural grass turf with green gradient and white pitch lines
        for y in range(height):
            ratio = y / height
            r = int(14 + 10 * math.sin(y/20) + 5 * ratio)
            g = int(95 + 40 * math.cos(y/30) - 20 * ratio)
            b = int(28 + 15 * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # Add turf grass texture
        for _ in range(8000):
            gx = random.randint(0, width-1)
            gy = random.randint(0, height-1)
            gl = random.randint(3, 8)
            g_col = (random.randint(10, 30), random.randint(110, 160), random.randint(20, 50))
            draw.line([(gx, gy), (gx + random.randint(-1, 1), gy - gl)], fill=g_col, width=1)

        # White pitch lines
        draw.ellipse([width//2 - 90, height//2 - 90, width//2 + 90, height//2 + 90], outline=(240, 245, 250), width=4)
        draw.line([(width//2, 0), (width//2, height)], fill=(240, 245, 250), width=4)
        draw.rectangle([0, height//4, 140, 3*height//4], outline=(240, 245, 250), width=4)
        draw.rectangle([width-140, height//4, width, 3*height//4], outline=(240, 245, 250), width=4)
        # Training cones
        for cx, cy in [(220, 180), (320, 240), (420, 190), (520, 250)]:
            draw.polygon([(cx, cy-22), (cx-14, cy+10), (cx+14, cy+10)], fill=(255, 102, 0))

    elif category == 'basketball_court':
        # Hardwood timber court texture
        for y in range(height):
            ratio = y / height
            base_r = int(190 - 40 * ratio + 15 * math.sin(y/8))
            base_g = int(120 - 25 * ratio + 10 * math.sin(y/8))
            base_b = int(60 - 15 * ratio)
            draw.line([(0, y), (width, y)], fill=(base_r, base_g, base_b))
        
        # Planks
        for x in range(0, width, 28):
            draw.line([(x, 0), (x, height)], fill=(130, 75, 30), width=1)

        # Basketball key & paint (Navy / Cyan)
        draw.rectangle([width//2 - 120, height - 160, width//2 + 120, height], fill=(10, 35, 75, 200), outline=(255, 255, 255), width=3)
        draw.ellipse([width//2 - 70, height - 230, width//2 + 70, height - 90], outline=(255, 255, 255), width=3)
        draw.arc([width//2 - 220, height - 320, width//2 + 220, height + 120], start=180, end=360, fill=(255, 255, 255), width=4)

    elif category == 'track_sprint':
        # Scarlet red tartan track with white lane markings
        for y in range(height):
            ratio = y / height
            r = int(175 - 35 * ratio + 8 * math.sin(y/12))
            g = int(38 + 10 * math.cos(y/15))
            b = int(32 + 5 * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

        # Perspective lane lines
        for i, lx in enumerate([80, 200, 340, 480, 620, 740]):
            draw.line([(lx, 0), (lx - 60 + i*15, height)], fill=(250, 250, 250), width=4)
            # Lane numbers
            draw.ellipse([lx + 15, height - 90, lx + 55, height - 50], fill=(255, 255, 255))

    elif category == 'swimming_pool':
        # Crystal clear turquoise water with wave caustics
        for y in range(height):
            ratio = y / height
            r = int(8 + 15 * ratio)
            g = int(120 + 40 * math.sin(y/25) + 30 * ratio)
            b = int(190 + 35 * math.cos(y/20) + 25 * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # Pool lane ropes (Blue / White / Red floats)
        for ly in [110, 220, 330, 440]:
            for x in range(0, width, 24):
                col = (255, 51, 102) if (x//24)%3 == 0 else ((0, 102, 255) if (x//24)%3 == 1 else (255, 255, 255))
                draw.ellipse([x, ly - 8, x + 18, ly + 8], fill=col)

    elif category == 'tennis_court':
        # Deep blue & green championship hard court
        draw.rectangle([0, 0, width, height], fill=(26, 82, 118)) # Blue inner
        draw.rectangle([0, 0, 70, height], fill=(39, 110, 74)) # Green outer left
        draw.rectangle([width-70, 0, width, height], fill=(39, 110, 74)) # Green outer right
        draw.rectangle([0, 0, width, 60], fill=(39, 110, 74)) # Green top
        draw.rectangle([0, height-60, width, height], fill=(39, 110, 74)) # Green bottom

        # White court lines
        draw.rectangle([70, 60, width-70, height-60], outline=(255, 255, 255), width=4)
        draw.line([(width//2, 60), (width//2, height-60)], fill=(255, 255, 255), width=4)
        draw.line([(70, height//2), (width-70, height//2)], fill=(255, 255, 255), width=4)

    elif category == 'coach_male':
        # Athletic coach portrait background
        for y in range(height):
            ratio = y / height
            draw.line([(0, y), (width, y)], fill=(int(12 + 10*ratio), int(24 + 20*ratio), int(50 + 35*ratio)))
        # Coach silhouette with athletic jersey
        draw.ellipse([width//2 - 80, 80, width//2 + 80, 240], fill=(210, 170, 140)) # Head
        draw.polygon([(width//2 - 160, height), (width//2 - 110, 240), (width//2 + 110, 240), (width//2 + 160, height)], fill=(0, 102, 255)) # Blue Pro Polo
        draw.polygon([(width//2 - 25, 240), (width//2 + 25, 240), (width//2, 290)], fill=(0, 240, 255)) # Collar
        # Whistle lanyard
        draw.line([(width//2 - 30, 240), (width//2, 330)], fill=(255, 255, 255), width=2)
        draw.line([(width//2 + 30, 240), (width//2, 330)], fill=(255, 255, 255), width=2)
        draw.rectangle([width//2 - 8, 330, width//2 + 8, 355], fill=(200, 200, 200))

    elif category == 'coach_female':
        # Athletic coach portrait background
        for y in range(height):
            ratio = y / height
            draw.line([(0, y), (width, y)], fill=(int(18 + 12*ratio), int(20 + 25*ratio), int(45 + 40*ratio)))
        # Female coach silhouette with athletic jacket
        draw.ellipse([width//2 - 75, 80, width//2 + 75, 235], fill=(225, 185, 155)) # Head
        draw.ellipse([width//2 - 90, 60, width//2 + 90, 200], fill=(40, 25, 20)) # Hair
        draw.ellipse([width//2 - 70, 90, width//2 + 70, 230], fill=(225, 185, 155)) # Face
        draw.polygon([(width//2 - 150, height), (width//2 - 100, 235), (width//2 + 100, 235), (width//2 + 150, height)], fill=(255, 51, 102)) # Crimson Athletic Jacket
        draw.line([(width//2, 235), (width//2, height)], fill=(0, 240, 255), width=3) # Cyan Zipper

    else: # gym_biometrics / general athletic
        for y in range(height):
            ratio = y / height
            draw.line([(0, y), (width, y)], fill=(int(8 + 8*ratio), int(15 + 15*ratio), int(32 + 30*ratio)))
        # Gym barbells / force plates / telemetry grid
        for x in range(0, width, 40):
            draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 20), width=1)
        for y in range(0, height, 40):
            draw.line([(0, y), (width, y)], fill=(255, 255, 255, 20), width=1)
        # Dumbbell / Olympic bar
        draw.rectangle([180, 245, width-180, 275], fill=(160, 175, 190))
        draw.rectangle([150, 210, 180, 310], fill=(0, 102, 255))
        draw.rectangle([width-180, 210, width-150, 310], fill=(0, 240, 255))

    # Subtle cinematic overlay gradient
    overlay = Image.new('RGBA', (width, height), (0,0,0,0))
    o_draw = ImageDraw.Draw(overlay)
    o_draw.rectangle([0, 0, width, height], fill=(7, 14, 28, 60))
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')

    # Save as webp optimized < 99KB
    target_path = os.path.join('assets', filename)
    img.save(target_path, 'WEBP', quality=88, method=6)
    size_kb = os.path.getsize(target_path) / 1024
    print(f"Generated natural image: {target_path} ({size_kb:.1f} KB)")

# Map all image files to categories
image_mappings = {
    'abdul-ridwan---2fyceJSIU-unsplash-optimized.webp': 'track_sprint',
    'aboodi-vesakaran-tDb65c90-qY-unsplash-optimized.webp': 'soccer_turf',
    'adria-crehuet-cano-LIhB1_mAGhY-unsplash-optimized.webp': 'basketball_court',
    'alex-reynolds-yL1gmkPfhJ0-unsplash-optimized.webp': 'soccer_turf',
    'baseketball (1).webp': 'basketball_court',
    'chuttersnap-YlX566b5Ymc-unsplash-optimized.webp': 'gym_biometrics',
    'coach female 1.webp': 'coach_female',
    'coach female.webp': 'coach_female',
    'coach female1-optimized.webp': 'coach_female',
    'coach female2-optimized.webp': 'coach_female',
    'coach female3-optimized.webp': 'coach_female',
    'coach male 2.webp': 'coach_male',
    'coach male-optimized.webp': 'coach_male',
    'coach male1-optimized.webp': 'coach_male',
    'coach male1.webp': 'coach_male',
    'coach male3-optimized.webp': 'coach_male',
    'coach male4-optimized.webp': 'coach_male',
    'coach male5-optimized.webp': 'coach_male',
    'coach male7-optimized.webp': 'coach_male',
    'darien-attridge-B3K_JzS9ADo-unsplash-optimized.webp': 'swimming_pool',
    'fifa.webp': 'soccer_turf',
    'fred-rivett-Ia61V8Hw1jE-unsplash-optimized.webp': 'tennis_court',
    'gettyimages-1269936164-612x612-optimized.webp': 'track_sprint',
    'gettyimages-1399212293-612x612-optimized.webp': 'basketball_court',
    'gettyimages-1428914288-612x612-optimized.webp': 'soccer_turf',
    'gettyimages-1558330870-612x612-optimized.webp': 'swimming_pool',
    'j-schiemann-Z4Sxy1_3wdY-unsplash-optimized.webp': 'gym_biometrics',
    'jason-hu-pH-8Rvv_HZI-unsplash-optimized.webp': 'tennis_court',
    'jeffrey-f-lin-5QZQnWprfD4-unsplash-optimized.webp': 'soccer_turf',
    'konstantin-mishchenko-F4axRx7EdsA-unsplash-optimized.webp': 'basketball_court',
    'kyle-pham-njuYs5kFJ3s-unsplash-optimized.webp': 'gym_biometrics',
    'maksym-diachenko-_xgN4orMy0k-unsplash-optimized.webp': 'track_sprint',
    'max-winkler-UFIZodJgScQ-unsplash-optimized.webp': 'soccer_turf',
    'michael-weir-FbXdwdkk57A-unsplash-optimized.webp': 'soccer_turf',
    'nik-shuliahin-BWRyS1-KKrs-unsplash-optimized.webp': 'track_sprint',
    'pexels-photo-38482177.webp': 'basketball_court',
    'sefton-marks-C2MH_gxJkeM-unsplash-optimized.webp': 'tennis_court',
    'steward-masweneng-gmJddvomOd0-unsplash-optimized.webp': 'track_sprint',
    'swim.webp': 'swimming_pool'
}

for fname, cat in image_mappings.items():
    generate_natural_sports_image(fname, cat)

print("All natural sports images generated successfully.")

