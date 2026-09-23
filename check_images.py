from PIL import Image

for path, name in [
    ("c:/Users/HP/Local_Seva/client/public/landing_mockup.png", "landing_mockup"),
    ("c:/Users/HP/Local_Seva/client/public/persons_background.jpg", "persons_background")
]:
    try:
        with Image.open(path) as img:
            print(f"{name}: {img.format}, {img.size}, {img.mode}")
    except Exception as e:
        print(f"Error reading {name}: {e}")
