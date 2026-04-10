import os
dirs = ["C:/Users/majid/Desktop/WorkWave/with_skill_site",
        "C:/Users/majid/Desktop/WorkWave/without_skill_site"]
for d in dirs:
    os.makedirs(d, exist_ok=True)
print("dirs ready")
