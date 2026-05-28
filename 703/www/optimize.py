from PIL import Image
import os

# 要壓縮的資料夾
folders = ["b", "g", "22"]

# 最大尺寸
MAX_SIZE = (1200, 1200)

# JPG品質
QUALITY = 75

supported = [".jpg", ".jpeg", ".png", ".webp"]

for folder in folders:

    if not os.path.exists(folder):
        continue

    for file in os.listdir(folder):

        ext = os.path.splitext(file)[1].lower()

        if ext not in supported:
            continue

        path = os.path.join(folder, file)

        try:

            img = Image.open(path)

            # RGB轉換
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            # 自動縮圖
            img.thumbnail(MAX_SIZE)

            # 存回原檔
            img.save(path, optimize=True, quality=QUALITY)

            old_size = os.path.getsize(path) / 1024

            print(f"✅ 已最佳化: {file} ({old_size:.1f} KB)")

        except Exception as e:
            print(f"❌ 失敗: {file}")
            print(e)

print("\n🎉 全部完成")